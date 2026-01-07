import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Res,
} from "@nestjs/common";
import { WcaIdService } from "./wca-id.service";
import type { Response } from "express";

const maxAge = 7 * 24 * 60 * 60 * 1000;

@Controller("wca")
export class WcaIdController {
  constructor(private readonly wcaIdService: WcaIdService) {}

  @Get("auth")
  redirectToWcaAuth(@Res() res: Response) {
    const url = this.wcaIdService.getWcaUrl();
    res.redirect(url);
  }

  @Get("callback")
  async wcaCallback(
    @Query("code") code: string,
    @Res({ passthrough: true }) res: Response
  ) {
    if (!code) {
      throw new BadRequestException("Не вдалось отримати код авторизації");
    }

    const { user, token } = await this.wcaIdService.handleWcaIdCallback(code);

    res.cookie("jwt", token, {
      maxAge,
      secure: true,
      sameSite: "none",
    });

    return user;
  }
}
