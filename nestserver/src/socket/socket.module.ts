import { Module } from "@nestjs/common";
import { SocketService } from "./socket.service";
import { SocketGateway } from "./socket.gateway";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "7d" },
    }),
    PassportModule,
  ],
  providers: [SocketService, SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
