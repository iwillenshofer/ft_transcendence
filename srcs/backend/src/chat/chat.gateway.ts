import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { TfaGuard } from 'src/auth/tfa/tfa.guard';
import { Server, Socket } from 'socket.io';
import { PageInterface } from './models/page.interface';
import { ConnectedUsersService } from 'src/services/connected-user/connected-user.service';
import { EncryptService } from 'src/services/encrypt.service';
import { ChatService } from './chat.service';
import { RoomEntity } from './entities/room.entity';
import { MemberEntity } from './entities/member.entity';
import { UserEntity, UsersService } from 'src/users/users.service';
import { ConnectedUserEntity } from './entities/connected-user.entity';
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

  @SubscribeMessage("members_room")
  async getMembersOfRoom(socket: Socket, roomId: number) {
    if (roomId) {
      const room = await this.chatService.getRoomById(roomId);
      const members = await this.chatService.getMembersByRoom(room);
      this.server.to(socket.id).emit('members_room', members);
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
