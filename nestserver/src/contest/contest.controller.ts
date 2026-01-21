import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ContestService } from "./contest.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { SolveDto } from "./dto/solve.dto";
import { SubmitResultDto } from "./dto/submit-result.dto";

@Controller("contests")
export class ContestController {
  constructor(private readonly contestService: ContestService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllContests() {
    return await this.contestService.getAllContests();
  }

  @UseGuards(JwtAuthGuard)
  @Get("get/:contestEventId")
  async getContestEventById(
    @Param("contestEventId", ParseIntPipe) contestEventId: number,
  ) {
    return await this.contestService.getContestEventById(contestEventId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("get-result/:contestEventId")
  async getContestResultByEventId(
    @CurrentUser() currentUser: { id: string },
    @Param("contestEventId", ParseIntPipe) contestEventId: number,
  ) {
    return await this.contestService.getOrCreateResult(
      currentUser.id,
      contestEventId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post("add-time/:contestEventId")
  async addContestTime(
    @CurrentUser() currentUser: { id: string },
    @Param("contestEventId", ParseIntPipe) contestEventId: number,
    @Body() dto: SolveDto,
  ) {
    return await this.contestService.addContestTime(
      currentUser.id,
      contestEventId,
      dto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post("edit-time/:solveId")
  async editContestTime(
    @Param("solveId", ParseIntPipe) solveId: number,
    @Body() dto: SolveDto,
  ) {
    return await this.contestService.updateContestTime(solveId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("submit-result/:contestEventId")
  async submitContestResult(
    @CurrentUser() currentUser: { id: string },
    @Param("contestEventId", ParseIntPipe) contestEventId: number,
    @Body() dto: SubmitResultDto,
  ) {
    return await this.contestService.submitContestResult(
      currentUser.id,
      contestEventId,
      dto.best,
      dto.average,
    );
  }
}
