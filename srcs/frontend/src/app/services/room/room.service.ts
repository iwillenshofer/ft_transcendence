import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) { }

  checkRoomNameNotTaken(roomName: string) {
    return this.http.get('/backend/rooms/is-room-name-taken/' + roomName);
  }
}
