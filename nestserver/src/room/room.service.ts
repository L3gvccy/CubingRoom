import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateRoomDto } from "./dto/create-room.dto";

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

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
    const room = await this.prisma.room.create({
      data: {
        ownerId: userId,
        event: "333",
        name: dto.name,
        private: dto.isPrivate,
        password: dto.isPrivate ? dto.password : null,
      },
    });

    return { room };
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
