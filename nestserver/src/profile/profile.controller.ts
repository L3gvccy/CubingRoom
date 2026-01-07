import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { UpdateNameDto } from "./dto/update-name.dto";
import { UpdateTimerTypeDto } from "./dto/update-timer-type.dto";

@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get("users/:id")
  async getUser(
    @Param("id") id: string,
    @CurrentUser() currentUser: { id: string }
  ) {
    return await this.profileService.getUser(id, currentUser.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("update-name")
  async updateName(
    @Body() dto: UpdateNameDto,
    @CurrentUser() currentUser: { id: string }
  ) {
    return await this.profileService.updateName(currentUser.id, dto.newName);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("update-timer-type")
  async updateTimerType(
    @Body() dto: UpdateTimerTypeDto,
    @CurrentUser() currentUser: { id: string }
  ) {
    return await this.profileService.updateTimerType(
      currentUser.id,
      dto.timerType
    );
  }
}
