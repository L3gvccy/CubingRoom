import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { eventOrder } from "src/utils/utils";

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
      where: { userId, submitted: true, place: 1 },
    });
    medals["silver"] = await this.prisma.contestResult.count({
      where: { userId, submitted: true, place: 2 },
    });
    medals["bronze"] = await this.prisma.contestResult.count({
      where: { userId, submitted: true, place: 3 },
    });

    return { medals };
  }

  async getUserEvents(userId: string) {
    const results = await this.prisma.contestResult.findMany({
      where: { userId, submitted: true },
      select: { contestEvent: { select: { event: true } } },
      distinct: ["contestEventId"],
    });

    const userEvents = new Set(results.map((r) => r.contestEvent.event));

    const ordered = eventOrder.filter((event) => userEvents.has(event));

    return { events: ordered };
  }
}
