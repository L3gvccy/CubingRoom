import { Module } from "@nestjs/common";
import { WcaIdService } from "./wca-id.service";
import { WcaIdController } from "./wca-id.controller";
import { JwtModule } from "@nestjs/jwt";
import { PrismaService } from "src/prisma.service";
import { JwtStrategy } from "src/auth/jwt.strategy";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "7d" },
    }),
  ],
  controllers: [WcaIdController],
  providers: [WcaIdService, PrismaService, JwtStrategy],
})
export class WcaIdModule {}
