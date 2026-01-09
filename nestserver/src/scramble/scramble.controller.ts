import { Controller, Get, Param } from "@nestjs/common";
import { ScrambleService } from "./scramble.service";

@Controller("scramble")
export class ScrambleController {
  constructor(private readonly scrambleService: ScrambleService) {}

  @Get("generate-scramble/:event")
  getScramble(@Param("event") event: string) {
    return this.scrambleService.generateScramble(event);
  }
}
