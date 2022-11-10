import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { ChatService } from 'src/app/chat/chat.service';
import io from "socket.io-client";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  currentUser: User | null = null;
  data: any = null;

  title = this.chatService.getMessage();

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private chatService: ChatService
  ) { }

  socket: any;
  ngOnInit(): void {
    this.http.get('/backend/auth/data', { withCredentials: true }).subscribe((result) => {
      this.data = result;
    });
    this.socket = io("http://localhost:3000/game");
    this.getPlayer();
  }

  async getData() {
    this.http.get('/backend/auth/data', { withCredentials: true }).subscribe((result) => {
      this.data = result;
    });
  }

  status = 'false';
  player = 'player6'
  async getPlayer() {
    this.socket.emit("inGame", this.player);
    this.socket.on("friends", (isInGame: any) => {
      this.status = isInGame;
      this.socket.emit("inGame", this.player);
    });
  }

}
