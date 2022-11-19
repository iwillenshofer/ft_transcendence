import { FriendsService } from './../friends/friends.service';
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
    private http: HttpClient,
    private chatService: ChatService,
    private friendsService: FriendsService
  ) { }

  ngOnInit(): void {
    this.getPlayer();
  }

  status = 'false';
  player = 'login2'
  async getPlayer() {
    // this.friendsService.setStatus(this.player, 'online')
    this.friendsService.getStatus(this.player).subscribe(x => { this.status = x.status })
  }

}
