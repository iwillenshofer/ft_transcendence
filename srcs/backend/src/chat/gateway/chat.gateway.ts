import { UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { TfaGuard } from 'src/auth/tfa/tfa.guard';
import { Server, Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { UserInterface } from 'src/users/users.interface';
import { RoomService } from '../services/room/room.service';
import { RoomInterface } from '../models/room.interface';
import { PageInterface } from '../models/page.interface';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  private server: Server;

  private messages: string[] = [];

  constructor(private userService: UsersService,
    private roomService: RoomService) { }

  //@UseGuards(TfaGuard)
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    console.log('message : ' + JSON.stringify(payload));
    this.messages.push('Value ' + Math.random().toString());
    this.server.emit('message', this.messages);
  }

  afterInit(server: Server) {
  }

  @UseGuards(TfaGuard)
  async handleConnection(socket: Socket, ...args: any[]) {
    // const user: UserInterface = await this.userService.getUser(+socket.handshake.headers.userid);
    // const rooms = await this.roomService.getRoomsForUsers(user.id, { page: 1, limit: 10 });
    // rooms.meta.currentPage -= 1;
    // socket.data.user = user.username;
    // return this.server.to(socket.id).emit('rooms', rooms);
  }

  handleDisconnect(client: Socket, ...args: any[]) {
    //client.disconnect();
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: RoomInterface): Promise<RoomInterface> {
    return this.roomService.createRoom(room, socket.data.user)
  }

  @SubscribeMessage('paginateRooms')
  async onPaginateRoom(socket: Socket, page: PageInterface) {
    page.limit = page.limit > 100 ? 100 : page.limit;
    page.page += 1;
    const user: UserInterface = await this.userService.getUser(+socket.handshake.headers.userid);
    const rooms = await this.roomService.getRoomsForUsers(user.id, page);
    rooms.meta.currentPage -= 1;
    return this.server.to(socket.id).emit('rooms', rooms);
  }

}
