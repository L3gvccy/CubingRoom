export class CreateRoomDto {
  event: string;
  name: string;
  isPrivate: boolean;
  password?: string;
}
