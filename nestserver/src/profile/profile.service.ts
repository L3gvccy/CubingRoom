import { Injectable, NotFoundException } from "@nestjs/common";
import { TimerType } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getUser(userId: string, currentUserId: string) {
    const editable = userId === currentUserId;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("Користувача з таким Id не знайдено");
    }

    return { user, editable };
  }

  async updateName(id: string, newName: string) {
    console.log(newName);
    const user = await this.prisma.user.update({
      where: { id },
      data: { displayName: newName },
    });

    if (!user) {
      throw new NotFoundException("Користувача не знайдено");
    }

    return { user };
  }

  async updateTimerType(id: string, timerType: TimerType) {
    let user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException("Користувач не знайдений");
    }
    user = await this.prisma.user.update({
      where: { id },
      data: { timerType },
    });
    return { user };
  }
}
