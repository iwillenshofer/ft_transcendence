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
import { MemberRole } from './models/memberRole.model';
import { ChangeSettingRoomDto } from './dto/changeSettingRoom.dto';

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
    let members = await this.chatService.getMembersByUserId(user.id);
    if (members)
      members = await this.chatService.updateSocketIdMember(socket.id, members);

    let connectedUser = await this.connectedUsersService.getByUserId(user.id);
    if (connectedUser == null)
      await this.connectedUsersService.createConnectedUser(socket.id, user);
    else
      await this.connectedUsersService.updateSocketIdConnectedUSer(socket.id, connectedUser);

    const rooms = await this.chatService.getRoomsOfMember(user.id, { page: 1, limit: 3 });
    const allUsers = await this.UsersService.getAllUsers();
    this.server.to(socket.id).emit('rooms', rooms);
    this.server.to(socket.id).emit('all_users', allUsers);
  }

  async handleDisconnect(socket: Socket) {
    await this.connectedUsersService.deleteBySocketId(socket.id);
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
    if (owner) {
      const member = await this.chatService.createMember(owner.toEntity(), socket.id, MemberRole.Owner);

      await this.chatService.createRoom(room.toEntity(), [member]);
      const rooms = await this.chatService.getRoomsOfMember(+socket.handshake.headers.userid, { page: 1, limit: 3 });
      const publicRooms = await this.chatService.getPublicAndProtectedRooms({ page: 1, limit: 3 });

      this.server.to(socket.id).emit('rooms', rooms);

      const connectedUsers = await this.connectedUsersService.getAllConnectedUser();
      connectedUsers.forEach(user => {
        this.server.to(user.socketId).emit('publicRooms', publicRooms);
      })
    }
  }

  @SubscribeMessage('create_direct_room')
  async createDirectRoom(socket: Socket, data: { room: CreateRoomDto, user_id: number }) {

    const room = CreateRoomDto.from(data.room);

    const owner = await this.UsersService.getUser(+socket.handshake.headers.userid);
    const ownerMember = await this.chatService.createMember(owner.toEntity(), socket.id, MemberRole.Member);

    const invited = await this.UsersService.getUser(data.user_id);
    const socketId_invited = (await this.connectedUsersService.getByUserId(invited.id)).socketId;
    const invitedMember = await this.chatService.createMember(invited.toEntity(), socketId_invited, MemberRole.Member);

    await this.chatService.createRoom(room.toEntity(), [ownerMember, invitedMember]);

    const roomOwner = await this.chatService.getRoomsOfMember(owner.id, { page: 1, limit: 3 });
    const roomInvited = await this.chatService.getRoomsOfMember(invited.id, { page: 1, limit: 3 });

    this.server.to(ownerMember.socketId).emit('rooms', roomOwner);
    this.server.to(invitedMember.socketId).emit('rooms', roomInvited);
  }

  @SubscribeMessage('paginate_rooms')
  async paginateRoom(socket: Socket, page: PageInterface) {
    const members = await this.chatService.getMembersByUserId(+socket.handshake.headers.userid);
    const rooms = await this.chatService.getRoomsOfMember(+socket.handshake.headers.userid, this.onPrePaginate(page));
    return this.server.to(socket.id).emit('rooms', rooms);
  }

  @SubscribeMessage('paginate_public_and_protected_rooms')
  async paginatePublicAndProtectedRoom(socket: Socket, page: PageInterface) {
    const publicRooms = await this.chatService.getPublicAndProtectedRooms(this.onPrePaginate(page));
    return this.server.to(socket.id).emit('publicRooms', publicRooms);
  }

  @SubscribeMessage('join_room')
  async onJoinRoom(socket: Socket, joinRoomDto: JoinRoomDto) {
    const user = await this.UsersService.getUser(+socket.handshake.headers.userid);
    const member = await this.chatService.createMember(user.toEntity(), socket.id, MemberRole.Member);
    const room = await this.chatService.getRoomById(joinRoomDto.roomId);
    await this.chatService.addMemberToRoom(room, member);
    const rooms = await this.chatService.getRoomsOfMember(user.id, { page: 1, limit: 3 });
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
    const members = await this.chatService.getMembersByUserId(+socket.handshake.headers.userid);
    const this_room = await this.chatService.getRoomById(roomId);

    let member = members.find(room => { room.id == this_room.id })

    if (await this.chatService.removeMemberFromRoom(this_room, member) != null) {
      let rooms = await this.chatService.getRoomsOfMember(+socket.handshake.headers.userid, { page: 1, limit: 3 });
      this.server.to(socket.id).emit('rooms', rooms);
    }
    else {
      let rooms = await this.chatService.getRoomsOfMember(+socket.handshake.headers.userid, { page: 1, limit: 3 });
      this.server.to(socket.id).emit('rooms', rooms);
      const publicRooms = await this.chatService.getPublicAndProtectedRooms({ page: 1, limit: 3 });
      const connectedUsers = await this.connectedUsersService.getAllConnectedUser();
      connectedUsers.forEach(user => {
        this.server.to(user.socketId).emit('publicRooms', publicRooms);
      })
    }
  }

  @SubscribeMessage("add_message")
  async onAddMessage(socket: Socket, createMessage: CreateMessageDto) {
    const message = CreateMessageDto.from(createMessage);
    const user = await this.UsersService.getUserById(+socket.handshake.headers.userid);
    const membersSender = await this.chatService.getMembersByUserId(user.id);
    const this_room = await this.chatService.getRoomById(createMessage.room.id);
    console.log(membersSender)
    let this_member: MemberEntity;
    for (var member of membersSender) {
      member.rooms.forEach(room => {
        if (room.id == this_room.id) {
          this_member = member;
        }
      })
    }
    const createdMessage = await this.chatService.createMessage(message.toEntity(), member);

    const members = await this.chatService.getMembersByRoom(this_room);
    for (const member of members) {
      this.server.to(member.socketId).emit('message_added', createdMessage);
    }
  }

  @SubscribeMessage("members_room")
  async getMembersOfRoom(socket: Socket, roomId: number) {
    if (roomId) {
      const room = await this.chatService.getRoomById(roomId);
      const members = await this.chatService.getMembersByRoom(room);
      for (const member of members) {
        this.server.to(member.socketId).emit('members_room', members);
      }
    }
  }

  @SubscribeMessage("change_settings_room")
  async changeSettingsRoom(socket: Socket, data: ChangeSettingRoomDto) {
    if (data.roomId) {
      console.log(data.radioPassword)
      const room = await this.chatService.getRoomById(data.roomId);
      if (data.name)
        await this.chatService.updateRoomName(room, data.name);
      if (data.description)
        await this.chatService.updateRoomDescription(room, data.description);
      if (data.radioPassword == "on")
        await this.chatService.updateOrCreateRoomPassword(room, data.password);
      else if (data.radioPassword == "off")
        await this.chatService.removeRoomPassword(room);

      const rooms = await this.chatService.getRoomsOfMember(+socket.handshake.headers.userid, { page: 1, limit: 3 });
      const members = await this.chatService.getMembersByRoom(room);
      for (const member of members) {
        this.server.to(member.socketId).emit('rooms', rooms);
      }
    }
    const publicRooms = await this.chatService.getPublicAndProtectedRooms({ page: 1, limit: 3 });
    const connectedUsers = await this.connectedUsersService.getAllConnectedUser();
    connectedUsers.forEach(user => {
      this.server.to(user.socketId).emit('publicRooms', publicRooms);
    });

  }

  private onPrePaginate(page: PageInterface) {
    page.limit = page.limit > 100 ? 100 : page.limit;
    page.page += 1;
    return (page);
  }

}
