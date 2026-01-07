import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ProfileModule } from "./profile/profile.module";
import { WcaIdModule } from './wca-id/wca-id.module';

@Module({
  imports: [AuthModule, ProfileModule, WcaIdModule],
})
export class AppModule {}
