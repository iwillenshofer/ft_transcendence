import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
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
    return this.http.get('/backend/chat/is-room-name-taken/' + roomName);
  }

  async createRoom(room: RoomInterface) {
    this.socket.emit('create_room', room);
  }

  async createDirectRoom(room: RoomInterface, user_id: number) {
    this.socket.emit('create_direct_room', { room: room, user_id: user_id });
  }

  async changeSettingsRoom(roomId: number, data: any) {
    this.socket.emit('change_settings_room', { roomId: roomId, name: data.name, description: data.description, password: data.password, radioPassword: data.radioPassword });
  }

  verifyPassword(room: RoomInterface, password: string): Observable<any> {
    let body = {
      roomId: room.id,
      password: password
    }
    return this.http.post("/backend/chat/verify_password/", body, { withCredentials: true });
  }
}
