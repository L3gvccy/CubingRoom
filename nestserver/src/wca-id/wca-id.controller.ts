import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { WcaIdService } from "./wca-id.service";
import type { Request, Response } from "express";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CurrentUser } from "src/common/decorators/current-user.decorator";

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
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!code) {
      throw new BadRequestException("Не вдалось отримати код авторизації");
    }

    const token = await this.wcaIdService.handleWcaIdCallback(code);

    return res.redirect(`${process.env.ORIGIN}/wca-success?token=${token}`);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/link")
  getWcaUrlLink(@CurrentUser() user: { id: string }, @Res() res: Response) {
    return this.wcaIdService.getWcaUrlLink(user.id, res);
  }

  @Get("/link-callback")
  async wcaIDLinkCallback(
    @Query("code") code: string,
    @Query("state") state: string,
    @Res() res: Response,
  ) {
    return this.wcaIdService.wcaIDLinkCallback(code, state, res);
  }
}
