import { UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { TfaGuard } from 'src/auth/tfa/tfa.guard';
import { Server, Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { UserInterface } from 'src/user/user.interface';
import { PageInterface } from '../models/page.interface';
import { RoomService } from 'src/room/room.service';
import { RoomInterface } from 'src/room/room.interface';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  private server: Server;

  private messages: string[] = [];

  constructor(private userService: UserService,
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
    console.log("On connecting")
    //const user: UserInterface = await this.userService.getUser2(+socket.handshake.headers.userid);
    const rooms = await this.roomService.getRoomsForUsers(+socket.handshake.headers.userid, { page: 1, limit: 10 });
    rooms.meta.currentPage -= 1;
    //socket.data.user = user;
    return this.server.to(socket.id).emit('rooms', rooms);
  }

  handleDisconnect(client: Socket, ...args: any[]) {
    //client.disconnect();
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: RoomInterface): Promise<RoomInterface> {
    console.log("On create room");
    return this.roomService.createRoom(room, +socket.handshake.headers.userid)
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

  @SubscribeMessage('paginatePublicRooms')
  async onPaginatePublicRoom(socket: Socket, page: PageInterface) {
    page.limit = page.limit > 100 ? 100 : page.limit;
    page.page += 1;
    const publicRooms = await this.roomService.getPublicRooms(page);
    publicRooms.meta.currentPage -= 1;
    return this.server.to(socket.id).emit('publicRooms', publicRooms);
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(socket: Socket, roomId: number) {
    console.log("here")
    const user: UserInterface = await this.userService.getUser(+socket.handshake.headers.userid);
    const room: RoomInterface = await this.roomService.getRoomById(roomId);
    if (await this.roomService.addUserToRoom(room, user)) {
    }

  }

}
