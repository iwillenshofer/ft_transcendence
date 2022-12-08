import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
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
    if (roomName && roomName.length > 2) {
      return this.http.get('/backend/chat/is-room-name-taken/' + roomName);
    }
    return of(false);
  }

  createRoom(room: RoomInterface): Observable<any> {
    return this.http.post('/backend/chat/create_room/', room, { withCredentials: true });
  }

  createDirectRoom(room: RoomInterface, user_id: number): Observable<any> {
    return this.http.post('/backend/chat/create_direct_room/', { room: room, user_id: user_id }, { withCredentials: true });
  }

  changeSettingsRoom(roomId: number, data: any): Observable<any> {
    return this.http.post('/backend/chat/change_settings_room/', { roomId: roomId, name: data.name, description: data.description, password: data.password, radioPassword: data.radioPassword }, { withCredentials: true });
  }

  verifyPassword(room: RoomInterface, password: string): Observable<any> {
    let body = {
      roomId: room.id,
      password: password
    }
    return this.http.post("/backend/chat/verify_password/", body, { withCredentials: true });
  }
}
