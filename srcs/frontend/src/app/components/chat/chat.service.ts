import { Injectable } from '@angular/core';
import { UserInterface } from '../../model/user.interface';
import { RoomInterface } from '../../model/room.interface';
import { RoomPaginateInterface } from '../../model/room.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { MessagePaginateInterface } from '../../model/message.interface';
import { MessageInterface } from './models/message.interface';
import { ChatSocket } from './chat-socket';
import { Router } from '@angular/router';
import { AlertsService } from 'src/app/alerts/alerts.service';
import { BehaviorSubject, firstValueFrom, Observable, of, Subject } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { getSupportedInputTypes } from '@angular/cdk/platform';
import { MemberInterface } from '../../model/member.interface';
import { UsersOnlineService } from 'src/app/services/users-online.service';


@Injectable()
export class ChatService {

  public connectedUsers: BehaviorSubject<any[]>;

  constructor(
    private socket: ChatSocket,
    private snackBar: MatSnackBar,
    private alert: AlertsService,
    private router: Router,
    private http: HttpClient,
    private usersOnlineServices: UsersOnlineService) {
    this.connectedUsers = new BehaviorSubject<any[]>([]);
  }

  isSocket = false;

  connect() {
    this.socket.on("double_login", () => {
      this.router.navigate(['doublelogin']);
    });
    this.socket.connect();
    this.isSocket = true;
  }

  disconnect() {
    this.socket.disconnect();
    this.isSocket = false;
  }

  connectChatSocket() {
    this.socket.connect();
  }

  sendMessage(message: string, room: RoomInterface) {
    this.socket.emit('add_message', { message: message, room: room });
  }

  getMessages(): Observable<MessagePaginateInterface> {
    return this.socket.fromEvent<MessagePaginateInterface>('messages');
  }

  getMyRoomsPaginate(): Observable<RoomPaginateInterface> {
    return this.socket.fromEvent<RoomPaginateInterface>('rooms');
  }

  createRoom(room: RoomInterface) {
    this.socket.emit('create_room', room);
    this.snackBar.open(`Room ${room.name} created successfully`, 'Close', {
      duration: 5000, horizontalPosition: 'right', verticalPosition: 'top'
    });
  }

  joinRoom(room: RoomInterface) {
    this.socket.emit('join_room', { roomId: room.id });
  }

  addUserToRoom(room: RoomInterface, user: UserInterface) {
    this.socket.emit('add_user_to_room', { roomId: room.id, userId: user.id });
  }

  emitPaginateRooms(limit: number, page: number) {
    this.socket.emit('paginate_rooms', { limit, page });
  }

  emitPaginatePublicRooms(limit: number, page: number) {
    this.socket.emit('paginate_public_and_protected_rooms', { limit, page });
  }

  emitGetAllMyRooms() {
    this.socket.emit('get_all_my_rooms');
  }

  emitGetPublicRooms() {
    this.socket.emit('get_all_public_rooms');
  }

  getPublicRooms(): Observable<RoomPaginateInterface> {
    return this.socket.fromEvent<RoomPaginateInterface>('publicRooms');
  }

  leaveRoom(room: RoomInterface) {
    this.socket.emit('leave_room', room.id);
  }

  getAllMyRooms() {
    return this.socket.fromEvent<RoomInterface[]>('all_my_rooms');
  }

  getAllPublicRooms() {
    return this.socket.fromEvent<RoomInterface[]>('all_public_rooms');
  }

  requestMessages(roomId: number) {
    this.socket.emit('messages', roomId);
  }

  IsUserOnline(userId: number) {
    return this.http.get<boolean>('/backend/chat/is_user_online/' + userId, { withCredentials: true });
  }

  getAddedMessage(): Observable<MessageInterface> {
    return this.socket.fromEvent<MessageInterface>('message_added')
  }

  getAllUsers(): Observable<UserInterface[]> {
    return this.socket.fromEvent<UserInterface[]>('all_users');
  }

  getNonAddedUsers(): Observable<UserInterface[]> {
    return this.http.get<UserInterface[]>('/backend/chat/get_non_added_users/', { withCredentials: true });
  }

  getUserList(filter: string): Observable<any> {
    if (filter.length >= 3)
      return this.http.get('/backend/chat/searchusers/' + filter, { withCredentials: true });
    return of([]);
  }

  requestMemberOfRoom(roomId: number) {
    this.socket.emit('members_room', roomId);
  }

  getMembersOfRoom() {
    return this.socket.fromEvent<MemberInterface[]>('members_room');
  }

  getMyMemberOfRoom(roomId: number): Observable<MemberInterface> {
    return this.http.get<MemberInterface>('/backend/chat/get_my_member_of_room/' + roomId, { withCredentials: true });
  }

  getUsersOnline(): Observable<UserInterface[]> {
    return this.socket.fromEvent<UserInterface[]>('users_online');
  }

  requestUsersOnline() {
    this.socket.emit('users_online');
  }

  blockUser(userId: number) {
    console.log("here")
    this.socket.emit('block_user', { blockedUserId: userId });
  }

  unblockUser(userId: number) {
    this.socket.emit('unblock_user', { blockedUserId: userId });
  }

  isBlockedUser(userId: number) {
    return this.http.get<boolean>('/backend/chat/is_blocked/' + userId, { withCredentials: true });
  }

  getBlockedUsers() {
    return this.socket.fromEvent<number[]>('blocked_users');
  }

  getBlockerUsers() {
    return this.socket.fromEvent<number[]>('blocker_users');
  }

  emitGetBlockedUsers() {
    this.socket.emit('blocked_users');
  }

  emitGetBlockerUsers() {
    this.socket.emit('blocker_users');
  }

  setAsAdmin(userId: number, roomId: number) {
    this.socket.emit('set_as_admin', { userId: userId, roomId: roomId });
  }

  unsetAdmin(userId: number, roomId: number) {
    this.socket.emit('unset_as_admin', { userId: userId, roomId: roomId });
  }

  setMute(memberId: number, roomId: number, banTime: Date) {
    this.socket.emit('set_mute', { memberId: memberId, roomId: roomId, banTime: banTime });
  }

  setBan(memberId: number, roomId: number, banTime: Date) {
    this.socket.emit('set_ban', { memberId: memberId, roomId: roomId, banTime: banTime });
  }

}
