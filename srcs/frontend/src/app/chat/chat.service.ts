import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { ChatSocket } from './chat.socket';
import { map } from 'rxjs/operators';
import { UserInterface } from '../model/user.interface';
import { RoomInterface } from '../model/room.interface';
import { getSupportedInputTypes } from '@angular/cdk/platform';
import { RoomPaginateInterface } from '../model/room.interface';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable()
export class ChatService {

  rooms: Observable<RoomPaginateInterface> = this.getMyRooms();
  roomsChange: Subject<Observable<RoomPaginateInterface>> = new Subject<Observable<RoomPaginateInterface>>();

  constructor(
    private socket: ChatSocket,
    private snackBar: MatSnackBar) {
    this.roomsChange.subscribe((value) => {
      this.rooms = value
    });
  }

  sendMessage() {
  }

  getMessage(): Observable<string[]> {
    return this.socket.fromEvent('message');
  }

  getMyRooms(): Observable<RoomPaginateInterface> {
    return this.socket.fromEvent<RoomPaginateInterface>('rooms');
  }

  createRoom(room: RoomInterface) {
    this.socket.emit('createRoom', room);
    this.snackBar.open(`Room ${room.name} created successfully`, 'Close', {
      duration: 5000, horizontalPosition: 'right', verticalPosition: 'top'
    });
  }

  joinRoom(room: RoomInterface) {
    this.socket.emit('joinRoom', room.id);
  }

  emitPaginateRooms(limit: number, page: number) {
    this.socket.emit('paginateRooms', { limit, page });
  }

  emitPaginatePublicRooms(limit: number, page: number) {
    this.socket.emit('paginatePublicRooms', { limit, page });
  }

  setrooms(rooms: Observable<RoomPaginateInterface>) {
    this.roomsChange.next(rooms);
  }

  getPublicRooms(): Observable<RoomPaginateInterface> {
    return this.socket.fromEvent<RoomPaginateInterface>('publicRooms');
  }

}
