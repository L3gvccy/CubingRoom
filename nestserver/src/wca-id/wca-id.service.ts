import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma.service";
import querystring from "querystring";
import axios from "axios";

@Injectable()
export class WcaIdService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  getWcaUrl() {
    const params = querystring.stringify({
      client_id: process.env.WCA_CLIENT_ID,
      response_type: "code",
      redirect_uri: process.env.WCA_REDIRECT_URI,
    });

    return `https://www.worldcubeassociation.org/oauth/authorize?${params}`;
  }

  async handleWcaIdCallback(code: string) {
    try {
      const tokenRes = await axios.post(
        "https://www.worldcubeassociation.org/oauth/token",
        querystring.stringify({
          grant_type: "authorization_code",
          code,
          client_id: process.env.WCA_CLIENT_ID,
          client_secret: process.env.WCA_CLIENT_SECRET,
          redirect_uri: process.env.WCA_REDIRECT_URI,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const accessToken = tokenRes.data.access_token;

      const meRes = await axios.get(
        "https://www.worldcubeassociation.org/api/v0/me",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const wca = meRes.data.me;

      let user = await this.prisma.user.findUnique({
        where: { wcaId: wca.wca_id },
      });

      if (!user) {
        const displayName = wca.name.split(" ")[0];
        user = await this.prisma.user.create({
          data: {
            displayName,
            wcaId: wca.wca_id,
            wcaName: wca.name,
            image: wca.avatar.id ? wca.avatar.url : null,
            countryCode: wca.country_iso2,
          },
        });
      }

      const token = this.jwtService.sign({ sub: user.id });

      return token;
    } catch (error) {
      console.log(error);
      throw new BadRequestException("Не вдалось отримати токен авторизації");
    }
  }
}
