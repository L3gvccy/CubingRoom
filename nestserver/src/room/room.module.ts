import { Module } from "@nestjs/common";
import { RoomService } from "./room.service";
import { RoomController } from "./room.controller";
import { PrismaService } from "src/prisma.service";
import { ScrambleService } from "src/scramble/scramble.service";

@Module({
  controllers: [RoomController],
  providers: [RoomService, PrismaService, ScrambleService],
})
export class RoomModule {}
