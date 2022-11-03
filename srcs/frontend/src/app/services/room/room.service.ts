import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { ChatSocket } from 'src/app/chat/chat.socket';
import { RoomInterface } from 'src/app/model/room.interface';

@Injectable({
  providedIn: 'root'
})
export class RoomService {



  constructor(
    private http: HttpClient,
    private socket: ChatSocket,
    private snackBar: MatSnackBar) {
  }

  checkRoomNameNotTaken(roomName: string) {
    return this.http.get('/backend/rooms/is-room-name-taken/' + roomName);
  }

  createRoom(room: RoomInterface) {
    this.socket.emit('createRoom', room);
    this.snackBar.open(`Room ${room.name} created successfully`, 'Close', {
      duration: 5000, horizontalPosition: 'right', verticalPosition: 'top'
    });
  }
}
