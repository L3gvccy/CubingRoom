import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";
import type { Request, Response } from "express";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { CurrentUser } from "src/common/decorators/current-user.decorator";

const maxAge = 7 * 24 * 60 * 60 * 1000;

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const { user, token } = await this.authService.login(dto);

    res.cookie("jwt", token, {
      maxAge,
      secure: true,
      sameSite: "none",
    });

    return { user };
  }

  @Post("register")
  async register(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { user, token } = await this.authService.register(dto);

    res.cookie("jwt", token, {
      maxAge,
      secure: true,
      sameSite: "none",
    });

    return { user };
  }

  @UseGuards(JwtAuthGuard)
  @Get("logout")
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie("jwt", "", {
      maxAge: 1,
      secure: true,
      sameSite: "none",
    });

    return { message: "Ви успішно вийшли з акаунту" };
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getMe(@CurrentUser() currentUser: { id: string }) {
    const user = await this.authService.getMe(currentUser.id);

    return user;
  }
}
