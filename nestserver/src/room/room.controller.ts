import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { RoomService } from "./room.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { CreateRoomDto } from "./dto/create-room.dto";

@Controller("room")
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @UseGuards(JwtAuthGuard)
  @Get("all")
  async getAllRooms() {
    return await this.roomService.getAllRooms();
  }

  @UseGuards(JwtAuthGuard)
  @Get("/:roomId")
  async getRoomById(@Param("roomId") roomId: string) {
    return await this.roomService.getRoomById(roomId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("create")
  async createRoom(
    @Body() dto: CreateRoomDto,
    @CurrentUser() currentUser: { id: string }
  ) {
    return await this.roomService.createRoom(currentUser.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("delete/:roomId")
  async deleteRoom(
    @Body() dto: { roomId: string },
    @CurrentUser() currentUser: { id: string }
  ) {
    return await this.roomService.deleteRoom(currentUser.id, dto.roomId);
  }
}
