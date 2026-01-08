import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ProfileModule } from "./profile/profile.module";
import { WcaIdModule } from './wca-id/wca-id.module';
import { ContestModule } from './contest/contest.module';
import { SocketModule } from './socket/socket.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [AuthModule, ProfileModule, WcaIdModule, ContestModule, SocketModule, RoomModule],
})
export class AppModule {}
