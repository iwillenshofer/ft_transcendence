import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
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
import { UserEntity, UsersService } from 'src/users/users.service';
import { ConnectedUserEntity } from './entities/connected-user.entity';
import { MemberRole } from './models/memberRole.model';
import { ChangeSettingRoomDto } from './dto/changeSettingRoom.dto';
import { SetAdminDto } from './dto/setAdmin.dto';
import { MuteMemberDto } from './dto/muteMember.dto';
import { Logger } from '@nestjs/common';
import { RoomType } from './models/typeRoom.model';

@WebSocketGateway({ cors: '*:*', namespace: 'chat', transports: ['websocket', 'polling'] })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  public server: Server;

  constructor(private UsersService: UsersService,
    private chatService: ChatService,
    private connectedUsersService: ConnectedUsersService,
    private readonly encrypt: EncryptService) { }

  async checkSingleConnection(user: UserEntity) {
    let connected_users: ConnectedUserEntity[] = await this.connectedUsersService.getUsersById(user.id);
    for (var item of connected_users) {
      console.log('disconnecting sockets' + JSON.stringify(connected_users));
      this.server.to(item.socketId).emit('double_login');
      this.server.in(item.socketId).disconnectSockets();
    }
  }

  async emitRooms(user_id: number, socket_id: string, page: PageInterface = { page: 1, limit: 3 }) {
    page = this.onPrePaginate(page);
    this.server.to(socket_id).emit('rooms_direct',
      await this.chatService.getRoomsOfMember(user_id, page, RoomType.Direct));
    this.server.to(socket_id).emit('rooms_nondirect',
      await this.chatService.getRoomsOfMember(user_id, page, RoomType.Public));
    this.server.to(socket_id).emit('rooms',
      await this.chatService.getRoomsOfMember(user_id, page));
  }

  @UseGuards(TfaGuard)
  async handleConnection(socket: Socket, ...args: any[]) {
    Logger.warn('handling connection');
    const user = await this.UsersService.getUserById(+socket.handshake.headers.userid);
    if (!user)
      return;
    await this.checkSingleConnection(user);
    let members = await this.chatService.getMembersByUserId(user.id);
    if (members)
      members = await this.chatService.updateSocketIdMember(socket.id, members);

    let connectedUser = await this.connectedUsersService.getByUserId(user.id);
    if (connectedUser == null)
      await this.connectedUsersService.createConnectedUser(socket.id, user);
    else
      await this.connectedUsersService.updateSocketIdConnectedUSer(socket.id, connectedUser);
    this.setStatus(user.username, "online")
    console.log('online')
    let usersOnline = await this.connectedUsersService.getAllUserOnline();
    const connectedUsers = await this.connectedUsersService.getAllConnectedUsers();
    connectedUsers.forEach(user => {
      Logger.warn("emmiting users_online");
      this.server.to(user.socketId).emit('users_online', usersOnline);
    });
    await this.emitRooms(user.id, socket.id);
    const allUsers = await this.UsersService.getAllUsers();
    this.server.to(socket.id).emit('all_users', allUsers);
  }

  async handleDisconnect(socket: Socket) {
    const user = await this.UsersService.getUserById(+socket.handshake.headers.userid);
    await this.connectedUsersService.deleteBySocketId(socket.id);
    if (user) {
      this.setStatus(user.username, "offline")
      let usersOnline = await this.connectedUsersService.getAllUserOnline();
      const connectedUsers = await this.connectedUsersService.getAllConnectedUsers();
      this.server.emit('users_online', usersOnline);
    }
    socket.disconnect();
  }

  @SubscribeMessage('messages')
  async getMessages(socket: any, roomId: number) {
    const room: RoomEntity = await this.chatService.getRoomById(roomId);
    const messages = await this.chatService.findMessagesForRoom(room, { page: 1, limit: 25 }, +socket.handshake.headers.userid);
    this.server.to(socket.id).emit('messages', messages);
  }

  @SubscribeMessage('paginate_rooms')
  async paginateRoom(socket: Socket, page: PageInterface) {
    await this.emitRooms(+socket.handshake.headers.userid, socket.id, page);
  }

  @SubscribeMessage('paginate_public_and_protected_rooms')
  async paginatePublicAndProtectedRoom(socket: Socket, page: PageInterface) {
    const publicRooms = await this.chatService.getPublicAndProtectedRooms(this.onPrePaginate(page));
    return this.server.to(socket.id).emit('publicRooms', publicRooms);
  }

  @SubscribeMessage('join_room')
  async onJoinRoom(socket: Socket, joinRoomDto: JoinRoomDto) {
    const user = await this.UsersService.getUser(+socket.handshake.headers.userid);
    const room = await this.chatService.getRoomById(joinRoomDto.roomId);
    let member = await this.chatService.getMemberByRoomAndUser(room, user.toEntity());
    if (member == null) {
      member = await this.chatService.createMember(user.toEntity(), socket.id, MemberRole.Member);
      await this.chatService.addMemberToRoom(room, member);
    }
    else {
      await this.chatService.rejoinMemberToRoom(member);
      await this.emitRooms(user.id, socket.id);
    }
    const members = await this.chatService.getMembersByRoom(room);
    for (const member of members) {
      this.server.to(member.socketId).emit('members_room', members);
    }
  }

  @SubscribeMessage('add_user_to_room')
  async addUserToRoom(socket: Socket, joinRoomDto: JoinRoomDto) {
    const user = await this.UsersService.getUser(joinRoomDto.userId);
    const connected_user = await this.connectedUsersService.getByUserId(user.id);
    const member = await this.chatService.createMember(user.toEntity(), connected_user.socketId, MemberRole.Member);
    const room = await this.chatService.getRoomById(joinRoomDto.roomId);
    await this.chatService.addMemberToRoom(room, member);
    await this.emitRooms(user.id, socket.id);
  }

  @SubscribeMessage('leave_room')
  async onLeaveRoom(socket: Socket, roomId: number) {
    const members = await this.chatService.getMembersByUserId(+socket.handshake.headers.userid);
    const room = await this.chatService.getRoomById(roomId);

    let member: MemberEntity;
    members.forEach(element => {
      if (element.user.id == +socket.handshake.headers.userid)
        member = element;
    });

    if (await this.chatService.removeMemberFromRoom(room, member) == "delete_room") {
      await this.emitRooms(+socket.handshake.headers.userid, socket.id);
      const publicRooms = await this.chatService.getPublicAndProtectedRooms({ page: 1, limit: 3 });
      const connectedUsers = await this.connectedUsersService.getAllConnectedUsers();
      const allPublicRooms = await this.chatService.getAllPublicRooms();
      connectedUsers.forEach(user => {
        this.server.to(user.socketId).emit('publicRooms', publicRooms);
        this.server.to(user.socketId).emit('all_public_rooms', allPublicRooms);
      });
    }
    else {
      await this.emitRooms(+socket.handshake.headers.userid, socket.id);
      const members = await this.chatService.getMembersByRoom(room);
      for (const member of members) {
        this.server.to(member.socketId).emit('members_room', members);
      }
    }
  }

  @SubscribeMessage("add_message")
  async onAddMessage(socket: Socket, createMessage: CreateMessageDto) {
    const message = CreateMessageDto.from(createMessage);
    const user = await this.UsersService.getUserById(+socket.handshake.headers.userid);
    const membersSender = await this.chatService.getMembersByUserId(user.id);
    const this_room = await this.chatService.getRoomById(createMessage.room.id);
    let this_member: MemberEntity;
    for (var member of membersSender) {
      member.rooms.forEach(room => {
        if (room.id == this_room.id) {
          this_member = member;
        }
      })
    }

    const createdMessage = await this.chatService.createMessage(message.toEntity(), member);

    let blockerUsers: number[] = [];
    (await this.chatService.getBlockerUser(+socket.handshake.headers.userid)).forEach(user => {
      blockerUsers.push(user.userId);
    });

    const members = await this.chatService.getMembersByRoom(this_room);
    for (const member of members) {
      if (!blockerUsers.includes(member.user.id))
        this.server.to(member.socketId).emit('message_added', createdMessage);
    }
  }

  @SubscribeMessage("members_room")
  async getMembersOfRoom(socket: Socket, roomId: number) {
    if (roomId) {
      const room = await this.chatService.getRoomById(roomId);
      const members = await this.chatService.getMembersByRoom(room);
      this.server.to(socket.id).emit('members_room', members);
    }
  }

  // @SubscribeMessage("change_settings_room")
  // async changeSettingsRoom(socket: Socket, data: ChangeSettingRoomDto) {
  //   if (data.roomId) {
  //     const room = await this.chatService.getRoomById(data.roomId);
  //     if (data.name)
  //       await this.chatService.updateRoomName(room, data.name);
  //     if (data.description)
  //       await this.chatService.updateRoomDescription(room, data.description);
  //     if (data.radioPassword == "on")
  //       await this.chatService.updateOrCreateRoomPassword(room, data.password);
  //     else if (data.radioPassword == "off")
  //       await this.chatService.removeRoomPassword(room);

  //     const rooms = await this.chatService.getRoomsOfMember(+socket.handshake.headers.userid, { page: 1, limit: 3 });
  //     const members = await this.chatService.getMembersByRoom(room);
  //     for (const member of members) {
  //       this.server.to(member.socketId).emit('rooms', rooms);
  //     }
  //   }
  //   const publicRooms = await this.chatService.getPublicAndProtectedRooms({ page: 1, limit: 3 });
  //   const connectedUsers = await this.connectedUsersService.getAllConnectedUsers();
  //   connectedUsers.forEach(user => {
  //     this.server.to(user.socketId).emit('publicRooms', publicRooms);
  //   });
  // }

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

  @SubscribeMessage("get_all_my_rooms")
  async getAllMyRooms(socket: Socket) {
    const rooms = await this.chatService.getAllMyRooms(+socket.handshake.headers.userid);
    this.server.to(socket.id).emit('all_my_rooms', rooms);
  }

  @SubscribeMessage("get_all_public_rooms")
  async getAllPublicRooms(socket: Socket) {
    const rooms = await this.chatService.getAllPublicRooms();
    this.server.to(socket.id).emit('all_public_rooms', rooms);
  }

  @SubscribeMessage("blocked_users")
  async getBlockedUsers(socket: Socket) {
    let blockedUserId: number[] = [];
    (await this.chatService.getBlockedUser(+socket.handshake.headers.userid)).forEach(blockedUser => {
      blockedUserId.push(blockedUser.blockedUserId);
    });
    this.server.to(socket.id).emit('blocked_users', blockedUserId);
  }

  @SubscribeMessage("blocker_users")
  async getBlockerUsers(socket: Socket) {
    let blockerUserId: number[] = [];
    (await this.chatService.getBlockerUser(+socket.handshake.headers.userid)).forEach(blockerUser => {
      blockerUserId.push(blockerUser.userId);
    });
    this.server.to(socket.id).emit('blocker_users', blockerUserId);
  }

  @SubscribeMessage("set_as_admin")
  async setAsAdmin(socket: Socket, data: SetAdminDto) {
    const room = await this.chatService.getRoomById(data.roomId);
    const user = await this.UsersService.getUserById(data.userId);
    const member = await this.chatService.getMemberByRoomAndUser(room, user);
    await this.chatService.setAdmin(member);
    const members = await this.chatService.getMembersByRoom(room);
    for (const member of members) {
      this.server.to(member.socketId).emit('members_room', members);
    }
  }

  @SubscribeMessage("unset_as_admin")
  async unsetAdmin(socket: Socket, data: SetAdminDto) {
    const room = await this.chatService.getRoomById(data.roomId);
    const user = await this.UsersService.getUserById(data.userId);
    const member = await this.chatService.getMemberByRoomAndUser(room, user);
    await this.chatService.unsetAdmin(member);
    const members = await this.chatService.getMembersByRoom(room);
    for (const member of members) {
      this.server.to(member.socketId).emit('members_room', members);
    }
  }

  @SubscribeMessage("set_mute")
  async setMute(socket: Socket, data: MuteMemberDto) {
    const member = await this.chatService.getMemberById(data.memberId);
    await this.chatService.setMute(member, data.muteTime);
    const room = await this.chatService.getRoomById(data.roomId);
    const members = await this.chatService.getMembersByRoom(room);
    this.server.to(member?.socketId).emit('members_room', members);
  }

  private onPrePaginate(page: PageInterface) {
    page.limit = page.limit > 100 ? 100 : page.limit;
    page.page += 1;
    return (page);
  }

  usersStatus: {
    username: string,
    status: string
  }[] = [];

  @SubscribeMessage('getStatus')
  async getStatus(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    this.server.emit('chatStatus', this.usersStatus)
  }

  @SubscribeMessage('setStatus')
  async setStatusSocket(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    let username = data[0];
    let status = data[1];
    this.setStatus(username, status)
  }

  setStatus(username: string, status: string) {
    let user = { username: username, status: status };
    let find = 0;
    this.usersStatus.forEach(u => {
      if (u.username == username) {
        u.status = status;
        find = 1;
      }
    });
    if (find == 0) {
      this.usersStatus.push(user)
    }
    this.server.emit('chatStatus', this.usersStatus)
  }
}
