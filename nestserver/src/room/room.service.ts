import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateRoomDto } from "./dto/create-room.dto";
import { RoomUserRole, RoomUserStatus } from "src/generated/prisma/enums";
import { ScrambleService } from "src/scramble/scramble.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class RoomService {
  constructor(
    private prisma: PrismaService,
    private scramble: ScrambleService
  ) {}

  async getAllRooms() {
    const rooms = await this.prisma.room.findMany({ include: { users: true } });
    return { rooms };
  }

  async getRoomById(roomId: string) {
    const id = parseInt(roomId);
    if (isNaN(id)) {
      throw new NotFoundException("Кімната не знайдена");
    }

    const room = await this.prisma.room.findUnique({
      where: { id },
      include: { users: { include: { user: true } } },
    });
    if (!room) {
      throw new NotFoundException("Кімната не знайдена");
    }

    const solves = await this.prisma.roomSolve.findMany({
      where: { roomId: room.id },
      include: {
        results: {
          include: { user: { include: { user: true } }, result: true },
        },
      },
      orderBy: {
        index: "desc",
      },
    });

    return { room, solves };
  }

  async getRoomState(roomId: number) {
    const id = roomId;

    const room = await this.prisma.room.findUnique({
      where: { id },
      include: { users: { include: { user: true } } },
    });
    if (!room) {
      throw new NotFoundException("Кімната не знайдена");
    }

    const solves = await this.prisma.roomSolve.findMany({
      where: { roomId: room.id },
      include: {
        results: {
          include: { user: { include: { user: true } }, result: true },
        },
      },
      orderBy: {
        index: "desc",
      },
    });

    return { room, solves };
  }

  async createRoom(userId: string, dto: CreateRoomDto) {
    let hashed;
    if (dto.password) {
      hashed = await bcrypt.hash(dto.password, 10);
    }

    const room = await this.prisma.room.create({
      data: {
        ownerId: userId,
        event: dto.event,
        name: dto.name,
        private: dto.isPrivate,
        password: dto.isPrivate ? hashed : null,
      },
    });

    const user = await this.prisma.roomUser.create({
      data: {
        role: RoomUserRole.ADMIN,
        status: RoomUserStatus.LEFT,
        roomId: room.id,
        userId: userId,
      },
    });

    const generatedScr = this.scramble.generateScramble(dto.event);

    const firstSolve = await this.prisma.roomSolve.create({
      data: {
        roomId: room.id,
        scramble: generatedScr.scramble,
        index: 1,
      },
    });

    return { room };
  }

  async generateNewScramble(roomId: number) {
    const room = await this.prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException("Кімната не знайдена");
    }

    const generatedScr = this.scramble.generateScramble(room.event);

    const newSolve = await this.prisma.roomSolve.create({
      data: {
        roomId: room.id,
        scramble: generatedScr.scramble,
        index: room.currentSolveIndex + 1,
      },
    });

    await this.prisma.room.update({
      where: { id: roomId },
      data: {
        currentSolveIndex: newSolve.index,
      },
    });
  }

  async updateScramble(roomId: number) {
    const room = await this.prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException("Кімната не знайдена");
    }

    const generatedScr = this.scramble.generateScramble(room.event);

    await this.prisma.roomSolve.updateMany({
      where: { roomId, index: room.currentSolveIndex },
      data: { scramble: generatedScr.scramble },
    });
  }

  async updateEvent(roomId: number, event: string) {
    const room = await this.prisma.room.update({
      where: { id: roomId },
      data: { event: event, currentSolveIndex: 1 },
    });
    if (!room) {
      throw new NotFoundException("Кімната не знайдена");
    }

    await this.prisma.roomSolve.deleteMany({ where: { roomId } });

    const generatedScr = this.scramble.generateScramble(room.event);

    await this.prisma.roomSolve.create({
      data: {
        roomId: room.id,
        scramble: generatedScr.scramble,
        index: 1,
      },
    });

    await this.prisma.roomUser.updateMany({
      where: { roomId, status: RoomUserStatus.WAITING },
      data: { status: RoomUserStatus.SOLVING },
    });
  }

  async joinRoom(userId: string, roomId: number, password?: string) {
    const id = roomId;

    const room = await this.prisma.room.findUnique({
      where: { id },
      include: { users: true },
    });

    if (!room) {
      return false;
    }

    if (room?.users.some((u) => u.userId === userId)) {
      return true;
    }

    if (!room?.private) {
      return true;
    } else if (
      room.private &&
      password &&
      bcrypt.compare(password, room.password)
    ) {
      return true;
    }

    return false;
  }

  async createRoomUser(userId: string, roomId: number) {
    const exists = await this.prisma.roomUser.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });

    if (!exists) {
      await this.prisma.roomUser.create({
        data: {
          role: RoomUserRole.MEMBER,
          status: RoomUserStatus.LEFT,
          roomId: roomId,
          userId: userId,
        },
      });
    }
  }

  async deleteRoom(userId: string, roomId: string) {
    const id = parseInt(roomId);
    if (!isNaN(id)) {
      throw new NotFoundException("Кімната не знайдена");
    }

    const room = await this.prisma.room.findUnique({ where: { id } });
    if (room?.ownerId !== userId) {
      throw new BadRequestException("Видалити кімнату може лише власник");
    }

    await this.prisma.room.delete({ where: { id } });

    return { message: "Кімната була успішно видалена" };
  }
}
