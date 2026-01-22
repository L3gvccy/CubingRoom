import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma.service";
import querystring from "querystring";
import axios from "axios";
import crypto from "crypto";
import { Request, Response } from "express";

@Injectable()
export class WcaIdService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
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
        },
      );

      const accessToken = tokenRes.data.access_token;

      const meRes = await axios.get(
        "https://www.worldcubeassociation.org/api/v0/me",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const wca = meRes.data.me;

      let user = await this.prisma.user.findUnique({
        where: { wcaId: wca.wca_id },
      });

      if (!user) {
        const arr = wca.name.split(" ");
        const displayName = `${arr[0]} ${arr[1]}`;
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

  getWcaUrlLink(req: Request, res: Response) {
    const state = crypto.randomBytes(16).toString("hex");

    res.cookie("wca_state", state, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 5 * 60 * 1000,
    });

    const params = querystring.stringify({
      client_id: process.env.WCA_CLIENT_ID,
      response_type: "code",
      redirect_uri: process.env.WCA_LINK_REDIRECT_URI,
      state,
    });

    return res.redirect(
      `https://www.worldcubeassociation.org/oauth/authorize?${params}`,
    );
  }

  async wcaIDLinkCallback(
    code: string,
    state: string,
    req: Request,
    res: Response,
  ) {
    if (!code || !state) {
      return res.redirect(
        `${process.env.ORIGIN}/wca-link-success?error=invalid_callback`,
      );
    }

    try {
      if (state !== req.cookies.wca_state) {
        return res.redirect(
          `${process.env.ORIGIN}/wca-link-success?error=invalid_state`,
        );
      }

      const token = req.cookies.jwt;
      if (!token) {
        return res.redirect(
          `${process.env.ORIGIN}/wca-link-success?error=not_authorized`,
        );
      }

      const decoded = this.jwtService.verify(token);
      const userId = decoded.userId;

      const tokenRes = await axios.post(
        "https://www.worldcubeassociation.org/oauth/token",
        {
          grant_type: "authorization_code",
          code,
          client_id: process.env.WCA_CLIENT_ID,
          client_secret: process.env.WCA_CLIENT_SECRET,
          redirect_uri: process.env.WCA_LINK_REDIRECT_URI,
        },
        { headers: { "Content-Type": "application/json" } },
      );

      const accessToken = tokenRes.data.access_token;

      const meRes = await axios.get(
        "https://www.worldcubeassociation.org/api/v0/me",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const wca = meRes.data.me;

      const alreadyLinked = await this.prisma.user.findFirst({
        where: { wcaId: wca.wca_id, NOT: { id: userId } },
      });

      if (alreadyLinked) {
        return res.redirect(
          `${process.env.ORIGIN}/wca-link-success?error=already_linked`,
        );
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          wcaId: wca.wca_id,
          wcaName: wca.name,
          image: wca.avatar.id ? wca.avatar.url : undefined,
          countryCode: wca.country_iso2,
        },
      });

      res.clearCookie("wca_state");

      return res.redirect(`${process.env.ORIGIN}/wca-link-success`);
    } catch (error) {
      console.log(error);
      throw new BadRequestException("Помилка авторизації");
    }
  }
}
