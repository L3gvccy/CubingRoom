import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma.service";
import { AuthDto } from "./dto/auth.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async login(dto: AuthDto) {
    const { email, password } = dto;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException("Користувача з такою поштою не знайдено");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new UnauthorizedException("Невірний пароль");
    }

    const payload = { sub: user.id };
    const token = this.jwtService.sign(payload);

    return { user, token };
  }

  async register(dto: AuthDto) {
    const { email, password } = dto;
    const exists = await this.prisma.user.findUnique({ where: { email } });

    if (exists) {
      throw new BadRequestException("Користувач з такою поштою вже існує");
    }

    const hashed: string = await bcrypt.hash(password, 10);
    const displayName = email.split("@")[0];

    const user = await this.prisma.user.create({
      data: { email, password: hashed, displayName },
    });

    const payload = { sub: user.id };
    const token = this.jwtService.sign(payload);

    return { user, token };
  }

  async getMe(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });

    if (!user) {
      throw new UnauthorizedException("Потрібно увійти до акаунту");
    }

    return { user };
  }
}
