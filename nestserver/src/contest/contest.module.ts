import { Module } from "@nestjs/common";
import { ContestService } from "./contest.service";
import { ContestController } from "./contest.controller";
import { PrismaService } from "src/prisma.service";
import { ScrambleService } from "src/scramble/scramble.service";

@Module({
  controllers: [ContestController],
  providers: [ContestService, PrismaService, ScrambleService],
})
export class ContestModule {}
