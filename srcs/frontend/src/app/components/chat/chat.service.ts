import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

@Injectable()
export class ChatService {

  constructor(
    private socket: ChatSocket,
    private snackBar: MatSnackBar,
    private alert: AlertsService,
    private router: Router,
    private http: HttpClient) {
  }

  connect() {
    this.socket.on("double_login", () => {
      this.router.navigate(['doublelogin']);
    });
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  sendMessage(message: string, room: RoomInterface) {
    this.socket.emit('add_message', { message: message, room: room });
  }

  getMessages(): Observable<MessagePaginateInterface> {
    return this.socket.fromEvent<MessagePaginateInterface>('messages');
  }

  getMyRooms(): Observable<RoomPaginateInterface> {
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

  emitPaginateRooms(limit: number, page: number) {
    this.socket.emit('paginate_rooms', { limit, page });
  }

  emitPaginatePublicRooms(limit: number, page: number) {
    this.socket.emit('paginate_public_and_protected_rooms', { limit, page });
  }

  getPublicRooms(): Observable<RoomPaginateInterface> {
    return this.socket.fromEvent<RoomPaginateInterface>('publicRooms');
  }

  leaveRoom(room: RoomInterface) {
    this.socket.emit('leave_room', room.id);
  }

  getAllMyRoomsAsText() {
    return this.http.get<string[]>('/backend/chat/get_all_my_rooms_as_text/', { withCredentials: true });
  }

  requestMessages(roomId: number) {
    this.socket.emit('messages', roomId);
  }

  IsUserOnline(userId: number) {
    return this.http.get('/backend/chat/is_user_online/' + userId, { withCredentials: true });
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
}
