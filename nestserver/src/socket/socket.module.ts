import { Module } from "@nestjs/common";
import { SocketService } from "./socket.service";
import { SocketGateway } from "./socket.gateway";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { RoomService } from "src/room/room.service";
import { PrismaService } from "src/prisma.service";
import { ScrambleService } from "src/scramble/scramble.service";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "7d" },
    }),
    PassportModule,
  ],
  providers: [
    SocketService,
    SocketGateway,
    RoomService,
    PrismaService,
    ScrambleService,
  ],
  exports: [SocketGateway],
})
export class SocketModule {}
