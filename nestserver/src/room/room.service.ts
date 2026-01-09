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
    if (!isNaN(id)) {
      throw new NotFoundException("Кімната не знайдена");
    }

    const room = await this.prisma.room.findUnique({ where: { id } });
    if (!room) {
      throw new NotFoundException("Кімната не знайдена");
    }

    const solves = await this.prisma.roomSolve.findMany({
      where: { roomId: room.id },
      include: {
        scramble: true,
        results: {
          include: { user: { include: { user: true } }, result: true },
        },
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

    const scramble = await this.prisma.scramble.create({
      data: {
        index: 1,
        scramble: generatedScr.scramble,
      },
    });

    const firstSolve = await this.prisma.roomSolve.create({
      data: {
        roomId: room.id,
        scrambleId: scramble.id,
        index: 1,
      },
    });

    return { room };
  }

  async joinRoom(userId: string, roomId: string, password?: string) {
    const id = parseInt(roomId);
    if (!isNaN(id)) {
      throw new NotFoundException("Кімната не знайдена");
    }

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
    } else if (room.private && bcrypt.compare(password, room.password)) {
      return true;
    }

    return false;
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
