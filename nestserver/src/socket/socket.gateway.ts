import { JwtService } from "@nestjs/jwt";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

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

  constructor(private jwtService: JwtService) {}

  handleConnection(socket: Socket) {
    const userId = socket.handshake.query.userId as string;

    if (!userId) {
      console.log("User ID not provided");
      socket.disconnect();
      return;
    }

    this.userSocketMap.set(userId, socket.id);
    console.log(`User connected: ${userId} with socket ID ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    const userId = Array.from(this.userSocketMap.entries()).find(
      ([_, sId]) => sId === socket.id
    )?.[0];

    if (userId) {
      this.userSocketMap.delete(userId);
      console.log(`User disconnected: ${userId}`);
    }
  }
}
