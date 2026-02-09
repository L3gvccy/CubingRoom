import { Controller, Get, Param } from "@nestjs/common";
import { StatsService } from "./stats.service";

@Controller("stats")
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get("medals/:userId")
  async getMedals(@Param("userId") userId: string) {
    return await this.statsService.getMedalsCount(userId);
  }

  @Get("user-events/:userId")
  async getUserEvents(@Param("userId") userId: string) {
    return await this.statsService.getUserEvents(userId);
  }
}
