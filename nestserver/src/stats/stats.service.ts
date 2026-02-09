import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getMedalsCount(userId: string) {
    const medals = {
      gold: 0,
      silver: 0,
      bronze: 0,
    };

    medals["gold"] = await this.prisma.contestResult.count({
      where: { submitted: true, place: 1 },
    });
    medals["silver"] = await this.prisma.contestResult.count({
      where: { submitted: true, place: 2 },
    });
    medals["bronze"] = await this.prisma.contestResult.count({
      where: { submitted: true, place: 3 },
    });

    return { medals };
  }
}
