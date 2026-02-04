import { Injectable, NotFoundException } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "src/prisma.service";
import { ScrambleService } from "src/scramble/scramble.service";
import { event_format } from "src/utils/utils";
import { SolveDto } from "./dto/solve.dto";

@Injectable()
export class ContestService {
  constructor(
    private prisma: PrismaService,
    private scrambleService: ScrambleService,
  ) {}

  //@Cron("*/5 * * * *")
  @Cron("0 0 * * 1")
  async CreateContest() {
    try {
      await this.prisma.$transaction(
        async (tx) => {
          await tx.contest.updateMany({
            where: { isActive: true },
            data: { isActive: false },
          });

          const contest = await tx.contest.create({
            data: {
              startDate: new Date(),
              endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
              isActive: true,
            },
          });

          for (const [event, format] of event_format) {
            const contestEvent = await tx.contestEvent.create({
              data: {
                contestId: contest.id,
                event,
                format,
              },
            });
            const numberOfScrambles = Number(format.slice(2));
            for (let i = 0; i < numberOfScrambles; i++) {
              const scramble =
                await this.scrambleService.generateScramble(event);

              await tx.scramble.create({
                data: {
                  contestEventId: contestEvent.id,
                  scramble: scramble.scramble,
                  index: i + 1,
                },
              });
            }
          }
        },
        { timeout: 30000 },
      );

      console.log("\n--- New contest created ---\n");
    } catch (error) {
      console.log(error);
    }
  }

  async getAllContests() {
    const contests = await this.prisma.contest.findMany({
      include: { contests: true },
      orderBy: { startDate: "asc" },
    });
    return { contests };
  }

  async getContestEventById(contestEventId: number) {
    const contestEvent = await this.prisma.contestEvent.findUnique({
      where: { id: contestEventId },
      include: { contest: true },
    });

    if (!contestEvent) {
      throw new NotFoundException("Подію не знайдено");
    }

    const scrambles = await this.prisma.scramble.findMany({
      where: { contestEventId: contestEvent.id },
      orderBy: { index: "asc" },
    });

    const results = await this.prisma.contestResult.findMany({
      where: { contestEventId: contestEvent.id, submitted: true },
      include: { user: true, results: { orderBy: { createdAt: "asc" } } },
    });

    let sortedResults;
    if (contestEvent.format.startsWith("ao")) {
      sortedResults = results.sort((a, b) => {
        if (a.average !== null && b.average !== null) {
          return a.average - b.average;
        }

        if (a.average !== null && b.average === null) return -1;
        if (a.average === null && b.average !== null) return 1;

        if (a.best !== null && b.best !== null) {
          return a.best - b.best;
        }

        if (a.best !== null && b.best === null) return -1;
        if (a.best === null && b.best !== null) return 1;

        return 0;
      });
    } else if (contestEvent.format.startsWith("bo")) {
      sortedResults = results.sort((a, b) => {
        if (a.best !== null && b.best !== null) {
          return a.best - b.best;
        }

        if (a.best !== null && b.best === null) return -1;
        if (a.best === null && b.best !== null) return 1;

        return 0;
      });
    }

    return { contestEvent, scrambles, results: sortedResults };
  }

  async getOrCreateResult(userId: string, contestEventId: number) {
    let contestResult = await this.prisma.contestResult.findFirst({
      where: { contestEventId, userId },
    });

    if (!contestResult) {
      contestResult = await this.prisma.contestResult.create({
        data: {
          contestEventId,
          userId,
        },
      });
    }

    const solves = await this.prisma.solve.findMany({
      where: { contestResultId: contestResult.id },
      orderBy: { createdAt: "asc" },
    });

    return { contestResult, solves };
  }

  async addContestTime(userId: string, contestEventId: number, dto: SolveDto) {
    const contestResult = await this.prisma.contestResult.findFirst({
      where: { contestEventId, userId },
    });
    if (!contestResult) {
      throw new NotFoundException("Результат не знайдено");
    }

    await this.prisma.solve.create({
      data: {
        contestResultId: contestResult.id,
        time: dto.time,
        penalty: dto.penalty,
        finalTime: dto.finalTime,
      },
    });

    const solves = await this.prisma.solve.findMany({
      where: { contestResultId: contestResult.id },
      orderBy: { createdAt: "asc" },
    });

    return { solves };
  }

  async updateContestTime(solveId: number, dto: SolveDto) {
    const updatedSolve = await this.prisma.solve.update({
      where: { id: solveId },
      data: {
        time: dto.time,
        penalty: dto.penalty,
        finalTime: dto.finalTime,
      },
    });

    const solves = await this.prisma.solve.findMany({
      where: { contestResultId: updatedSolve.contestResultId },
      orderBy: { createdAt: "asc" },
    });

    return { solves };
  }

  async submitContestResult(
    userId: string,
    contestEventId: number,
    best: number | null,
    average: number | null,
  ) {
    const contestResult = await this.prisma.contestResult.findFirst({
      where: { contestEventId, userId },
    });

    if (!contestResult) {
      throw new NotFoundException("Результат не знайдено");
    }

    const updatedResult = await this.prisma.contestResult.update({
      where: { id: contestResult.id },
      data: { best, average, submitted: true },
    });

    const updatedResults = await this.prisma.contestResult.findMany({
      where: { contestEventId: updatedResult.contestEventId, submitted: true },
      include: { user: true, results: { orderBy: { createdAt: "asc" } } },
      orderBy: { average: "asc" },
    });

    const sortedResults = updatedResults.sort((a, b) => {
      if (a.average !== null && b.average !== null) {
        return a.average - b.average;
      }

      if (a.average !== null && b.average === null) return -1;
      if (a.average === null && b.average !== null) return 1;

      if (a.best !== null && b.best !== null) {
        return a.best - b.best;
      }

      if (a.best !== null && b.best === null) return -1;
      if (a.best === null && b.best !== null) return 1;

      return 0;
    });

    return { updatedResult, updatedResults: sortedResults };
  }
}
