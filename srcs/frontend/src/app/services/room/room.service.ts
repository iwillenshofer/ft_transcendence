import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AlertsService } from 'src/app/alerts/alerts.service';
import { ChatSocket } from 'src/app/components/chat/chat-socket';
import { RoomInterface } from 'src/app/model/room.interface';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(
    private http: HttpClient,
    private socket: ChatSocket,
    private alertService: AlertsService) {
  }

  checkRoomNameNotTaken(roomName: string) {
    return this.http.get('/backend/chat/is-room-name-taken/' + roomName);
  }

  createRoom(room: RoomInterface): Observable<any> {
    return this.http.post('/backend/chat/create_room/', room, { withCredentials: true });
    //.subscribe(
    //   error => {
    //     if (error) {
    //       this.alertService.danger("The chat room could not be created");
    //       return (false);
    //     }
    //     else {
    //       this.alertService.success("The chat room has been successfully created");
    //       return (true);
    //     }
    //   });
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
