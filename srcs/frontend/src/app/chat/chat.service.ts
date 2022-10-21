import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { ChatSocket } from './chat.socket';
import { map } from 'rxjs/operators';
import { UserInterface } from '../model/user.interface';
import { RoomInterface } from '../model/room.interface';
import { getSupportedInputTypes } from '@angular/cdk/platform';
import { RoomPaginateInterface } from '../model/room.interface';


@Injectable()
export class ChatService {

  constructor(private socket: ChatSocket) { }


  sendMessage() {
  }

  getMessage(): Observable<string[]> {
    return this.socket.fromEvent('message');
  }

  getMyRooms(): Observable<RoomPaginateInterface> {
    return this.socket.fromEvent<RoomPaginateInterface>('rooms');
  }

  createRoom() {
    const user1: UserInterface = {
      id: 66498
    };

    const room: RoomInterface = {
      name: 'testRoom',
      users: [user1]
    }

    this.socket.emit('createRoom', room);
  }

  emitPaginateRooms(limit: number, page: number) {
    this.socket.emit('paginateRooms', { limit, page });
  }

}
