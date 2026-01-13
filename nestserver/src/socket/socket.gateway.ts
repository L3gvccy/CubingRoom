import { NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Penalty, RoomUserStatus } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma.service";
import { RoomService } from "src/room/room.service";

@WebSocketGateway({
  cors: {
    origin: process.env.ORIGIN,
    credentials: true,
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSocketMap = new Map<string, string>();

  constructor(
    private jwtService: JwtService,
    private roomService: RoomService,
    private prisma: PrismaService
  ) {}

  handleConnection(socket: Socket) {
    const userId = socket.handshake.query.userId as string;

    if (!userId) {
      console.log("User ID not provided");
      socket.disconnect();
      return;
    }

    socket.data.userId = userId;
    this.userSocketMap.set(userId, socket.id);
    console.log(`User connected: ${userId} with socket ID ${socket.id}`);
  }

  @SubscribeMessage("room:join")
  async join(
    @ConnectedSocket() client: Socket,
    @MessageBody() { roomId }: { roomId: number }
  ) {
    const userId = client.data.userId;

    const currentSolve = await this.prisma.roomSolve.findFirst({
      where: { roomId },
      orderBy: { index: "desc" },
      include: { results: true },
    });

    const ru = await this.prisma.roomUser.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });

    const hasResult = currentSolve?.results.some((r) => r.userId === ru?.id);

    await this.prisma.roomUser.update({
      where: { roomId_userId: { roomId, userId } },
      data: {
        status: hasResult ? RoomUserStatus.WAITING : RoomUserStatus.SOLVING,
      },
    });

    client.join(`room:${roomId}`);
    console.log(`${userId} joined room ${roomId}`);

    const state = await this.roomService.getRoomState(roomId);

    this.server.to(`room:${roomId}`).emit("room:state", state);
  }

  @SubscribeMessage("room:leave")
  async leave(
    @ConnectedSocket() client: Socket,
    @MessageBody() { roomId }: { roomId: number }
  ) {
    const userId = client.data.userId;
    await this.prisma.roomUser.update({
      where: { roomId_userId: { roomId, userId } },
      data: {
        status: RoomUserStatus.LEFT,
      },
    });

    client.leave(`room:${roomId}`);
    console.log(`${userId} left room ${roomId}`);

    const stillSolving = await this.prisma.roomUser.count({
      where: { roomId, status: RoomUserStatus.SOLVING },
    });

    const activeUsers = await this.prisma.roomUser.count({
      where: {
        roomId,
        status: { in: [RoomUserStatus.SOLVING, RoomUserStatus.WAITING] },
      },
    });

    if (stillSolving === 0 && activeUsers > 0) {
      await this.roomService.generateNewScramble(roomId);
      await this.prisma.roomUser.updateMany({
        where: { roomId, status: RoomUserStatus.WAITING },
        data: {
          status: RoomUserStatus.SOLVING,
        },
      });
    }

    const state = await this.roomService.getRoomState(roomId);

    this.server.to(`room:${roomId}`).emit("room:state", state);
  }

  @SubscribeMessage("room:submit")
  async submitSolve(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    {
      roomId,
      finalResult,
    }: {
      roomId: number;
      finalResult: { time: number; penalty: Penalty; finalTime: number };
    }
  ) {
    const userId = client.data.userId;

    const currentSolve = await this.prisma.roomSolve.findFirst({
      where: { roomId },
      orderBy: { index: "desc" },
      include: { results: true },
    });

    if (!currentSolve) throw new Error("Current solve not found");

    const solve = await this.prisma.solve.create({
      data: {
        time: finalResult.time,
        penalty: finalResult.penalty,
        finalTime: finalResult.finalTime,
      },
    });

    const roomUser = await this.prisma.roomUser.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });

    if (!roomUser) {
      throw new NotFoundException("Користувача не знайдено");
    }

    await this.prisma.roomSolveResult.create({
      data: {
        roomSolveId: currentSolve.id,
        userId: roomUser.id,
        resultId: solve.id,
      },
    });

    await this.prisma.roomUser.update({
      where: { roomId_userId: { roomId, userId } },
      data: { status: RoomUserStatus.WAITING },
    });

    const stillSolving = await this.prisma.roomUser.count({
      where: { roomId, status: RoomUserStatus.SOLVING },
    });

    const activeUsers = await this.prisma.roomUser.count({
      where: {
        roomId,
        status: { in: [RoomUserStatus.SOLVING, RoomUserStatus.WAITING] },
      },
    });

    if (stillSolving === 0 && activeUsers > 0) {
      await this.roomService.generateNewScramble(roomId);
      await this.prisma.roomUser.updateMany({
        where: { roomId, status: RoomUserStatus.WAITING },
        data: {
          status: RoomUserStatus.SOLVING,
        },
      });
    }

    const state = await this.roomService.getRoomState(roomId);
    this.server.to(`room:${roomId}`).emit("room:state", state);
  }

  @SubscribeMessage("room:update-scramble")
  async updateScr(@MessageBody() { roomId }: { roomId: number }) {
    await this.roomService.updateScramble(roomId);

    const state = await this.roomService.getRoomState(roomId);

    this.server.to(`room:${roomId}`).emit("room:state", state);
  }

  @SubscribeMessage("room:update-event")
  async updateEvent(
    @MessageBody() { roomId, event }: { roomId: number; event: string }
  ) {
    await this.roomService.updateEvent(roomId, event);

    const state = await this.roomService.getRoomState(roomId);

    this.server.to(`room:${roomId}`).emit("room:state", state);
  }

  async handleDisconnect(socket: Socket) {
    const userId = Array.from(this.userSocketMap.entries()).find(
      ([_, sId]) => sId === socket.id
    )?.[0];

    const roomUsers = await this.prisma.roomUser.findMany({
      where: {
        userId,
        status: { in: [RoomUserStatus.SOLVING, RoomUserStatus.WAITING] },
      },
    });

    for (const ru of roomUsers) {
      await this.prisma.roomUser.update({
        where: { id: ru.id },
        data: { status: RoomUserStatus.LEFT },
      });
      const stillSolving = await this.prisma.roomUser.count({
        where: { roomId: ru.roomId, status: RoomUserStatus.SOLVING },
      });
      const activeUsers = await this.prisma.roomUser.count({
        where: {
          roomId: ru.roomId,
          status: { in: [RoomUserStatus.SOLVING, RoomUserStatus.WAITING] },
        },
      });
      if (stillSolving === 0 && activeUsers > 0) {
        await this.roomService.generateNewScramble(ru.roomId);
        await this.prisma.roomUser.updateMany({
          where: { roomId: ru.roomId, status: RoomUserStatus.WAITING },
          data: {
            status: RoomUserStatus.SOLVING,
          },
        });
      }
      const state = await this.roomService.getRoomState(ru.roomId);
      this.server.to(`room:${ru.roomId}`).emit("room:state", state);
    }

    if (userId) {
      this.userSocketMap.delete(userId);
      console.log(`User disconnected: ${userId}`);
    }
  }
}
