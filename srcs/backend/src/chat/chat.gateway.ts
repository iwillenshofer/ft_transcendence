import { UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { TfaGuard } from 'src/auth/tfa/tfa.guard';
import { Server, Socket } from 'socket.io';
import { PageInterface } from './models/page.interface';
import { ConnectedUsersService } from 'src/services/connected-user/connected-user.service';
import { EncryptService } from 'src/services/encrypt.service';
import { CreateRoomDto } from './dto/createRoom.dto';
import { ChatService } from './chat.service';
import { JoinRoomDto } from './dto/joinRoom.dto';
import { RoomEntity } from './entities/room.entity';
import { CreateMessageDto } from './dto/createMessage.dto';
import { MemberEntity } from './entities/member.entity';
import { CreateMemberDto } from './dto/createMember.dto';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({ cors: '*:*', namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  private server: Server;

  constructor(private UsersService: UsersService,
    private chatService: ChatService,
    private connectedUsersService: ConnectedUsersService,
    private readonly encrypt: EncryptService) { }



  // afterInit(server: Server) {
  // }



  @UseGuards(TfaGuard)
  async handleConnection(socket: Socket, ...args: any[]) {
    const user = await this.UsersService.getUserById(+socket.handshake.headers.userid);
    if (!user)
      return;
    let member = await this.chatService.getMemberByUserId(user.id);
    if (member == null) {
      member = await this.chatService.createMember(user, socket.id);
    }
    else {
      member = await this.chatService.updateSocketIdMember(socket.id, member);
    }

    let connectedUser = await this.connectedUsersService.getByUserId(user.id);
    if (connectedUser == null)
      await this.connectedUsersService.createConnectedUser(socket.id, user);
    else
      await this.connectedUsersService.updateSocketIdConnectedUSer(socket.id, connectedUser);

    let usersOnline = await this.connectedUsersService.getAllUserOnline();
    const connectedUsers = await this.connectedUsersService.getAllConnectedUsers();
    connectedUsers.forEach(user => {
      this.server.to(user.socketId).emit('users_online', usersOnline);
    });

    const rooms = await this.chatService.getRoomsOfMember(member, { page: 1, limit: 3 });
    const allUsers = await this.UsersService.getAllUsers();
    this.server.to(socket.id).emit('rooms', rooms);
    this.server.to(socket.id).emit('all_users', allUsers);
  }

  async handleDisconnect(socket: Socket) {
    const user = await this.UsersService.getUserById(+socket.handshake.headers.userid);
    await this.connectedUsersService.deleteBySocketId(socket.id);
    if (user) {
      let usersOnline = await this.connectedUsersService.getAllUserOnline();
      const connectedUsers = await this.connectedUsersService.getAllConnectedUsers();
      connectedUsers.forEach(user => {
        this.server.to(user.socketId).emit('users_online', usersOnline);
      });
    }
    socket.disconnect();
  }

  @SubscribeMessage('messages')
  async getMessages(socket: any, roomId: number) {
    const room: RoomEntity = await this.chatService.getRoomById(roomId);
    const messages = await this.chatService.findMessagesForRoom(room, { page: 1, limit: 25 });
    this.server.to(socket.id).emit('messages', messages);

  }

  @SubscribeMessage('create_room')
  async createRoom(socket: Socket, createRoomDto: CreateRoomDto) {
    const room = CreateRoomDto.from(createRoomDto);

    if (room.password)
      room.password = this.encrypt.encode(room.password);

    const owner = await this.UsersService.getUser(+socket.handshake.headers.userid);
    const member = await this.chatService.getMemberByUserId(owner.id);

    await this.chatService.createRoom(room.toEntity(), [member]);
    const rooms = await this.chatService.getRoomsOfMember(member, { page: 1, limit: 3 });
    const publicRooms = await this.chatService.getPublicAndProtectedRooms({ page: 1, limit: 3 });

    this.server.to(socket.id).emit('rooms', rooms);

    const connectedUsers = await this.connectedUsersService.getAllConnectedUsers();
    connectedUsers.forEach(user => {
      this.server.to(user.socketId).emit('publicRooms', publicRooms);
    })
  }

  @SubscribeMessage('create_direct_room')
  async createDirectRoom(socket: Socket, data: { room: CreateRoomDto, user_id: number }) {

    const room = CreateRoomDto.from(data.room);

    const owner = await this.UsersService.getUser(+socket.handshake.headers.userid);
    const ownerMember = await this.chatService.getMemberByUserId(owner.id);

    const invited = await this.UsersService.getUser(data.user_id);
    const invitedMember = await this.chatService.getMemberByUserId(invited.id);

    await this.chatService.createRoom(room.toEntity(), [ownerMember, invitedMember]);

    const roomOwner = await this.chatService.getRoomsOfMember(ownerMember, { page: 1, limit: 3 });
    const roomInvited = await this.chatService.getRoomsOfMember(invitedMember, { page: 1, limit: 3 });

    this.server.to(ownerMember.socketId).emit('rooms', roomOwner);
    this.server.to(invitedMember.socketId).emit('rooms', roomInvited);
  }

  @SubscribeMessage('paginate_rooms')
  async paginateRoom(socket: Socket, page: PageInterface) {
    const member = await this.chatService.getMemberByUserId(+socket.handshake.headers.userid);
    const rooms = await this.chatService.getRoomsOfMember(member, this.onPrePaginate(page));
    return this.server.to(socket.id).emit('rooms', rooms);
  }

  @SubscribeMessage('paginate_public_and_protected_rooms')
  async paginatePublicAndProtectedRoom(socket: Socket, page: PageInterface) {
    const publicRooms = await this.chatService.getPublicAndProtectedRooms(this.onPrePaginate(page));
    return this.server.to(socket.id).emit('publicRooms', publicRooms);
  }

  @SubscribeMessage('join_room')
  async onJoinRoom(socket: Socket, joinRoomDto: JoinRoomDto) {
    const member = await this.chatService.getMemberByUserId(+socket.handshake.headers.userid);
    const room = await this.chatService.getRoomById(joinRoomDto.roomId);
    await this.chatService.addMemberToRoom(room, member);
    const rooms = await this.chatService.getRoomsOfMember(member, { page: 1, limit: 3 });
    this.server.to(socket.id).emit('rooms', rooms);
  }


  // @SubscribeMessage('joinRoomUser')
  // async onJoinRoomUser(socket: Socket, joinRoomDto: JoinRoomDto) {

  //   const user: UserDTO = await this.UsersService.getUser(joinRoomDto.userId);
  //   const room: RoomEntity = await this.chatService.getRoomByName(joinRoomDto.roomName);
  //   if (await this.chatService.addUserToRoom(room, user.toEntity())) {
  //     const member = new CreateMemberDto(user.toEntity(), socket.id, room);
  //     await this.chatService.addMemberToRoom(member.toEntity());
  //     const rooms = await this.chatService.getRoomsForUsers(user.id, { page: 1, limit: 3 });
  //     return this.server.to(socket.id).emit('rooms', rooms);
  //   }
  // }

  @SubscribeMessage('leave_room')
  async onLeaveRoom(socket: Socket, roomId: number) {
    const member = await this.chatService.getMemberByUserId(+socket.handshake.headers.userid);
    const room = await this.chatService.getRoomById(roomId);
    if (await this.chatService.removeMemberFromRoom(room, member) != null) {
      let rooms = await this.chatService.getRoomsOfMember(member, { page: 1, limit: 3 });
      this.server.to(socket.id).emit('rooms', rooms);
    }
    else {
      let rooms = await this.chatService.getRoomsOfMember(member, { page: 1, limit: 3 });
      this.server.to(socket.id).emit('rooms', rooms);
      const publicRooms = await this.chatService.getPublicAndProtectedRooms({ page: 1, limit: 3 });
      const connectedUsers = await this.connectedUsersService.getAllConnectedUsers();
      connectedUsers.forEach(user => {
        this.server.to(user.socketId).emit('publicRooms', publicRooms);
      })
    }
  }

  @SubscribeMessage("add_message")
  async onAddMessage(socket: Socket, createMessage: CreateMessageDto) {
    const message = CreateMessageDto.from(createMessage);
    const user = await this.UsersService.getUserById(+socket.handshake.headers.userid);
    const memberSender = await this.chatService.getMemberByUserId(user.id);
    const createdMessage = await this.chatService.createMessage(message.toEntity(), memberSender);
    const room = await this.chatService.getRoomById(createMessage.room.id);
    const members = await this.chatService.getMembersByRoom(room);
    for (const member of members) {
      this.server.to(member.socketId).emit('message_added', createdMessage);
    }
  }

  @SubscribeMessage("users_online")
  async requestUsersOnline(socket: Socket) {
    const user = await this.UsersService.getUserById(+socket.handshake.headers.userid);
    if (user) {
      let usersOnline = await this.connectedUsersService.getAllUserOnline();
      const connectedUsers = await this.connectedUsersService.getAllConnectedUsers();
      connectedUsers.forEach(user => {
        this.server.to(user.socketId).emit('users_online', usersOnline);
      });
    }

  }


  private onPrePaginate(page: PageInterface) {
    page.limit = page.limit > 100 ? 100 : page.limit;
    page.page += 1;
    return (page);
  }

}
