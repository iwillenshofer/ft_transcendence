import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { ChatService } from 'src/app/chat/chat.service';

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

  ngOnInit(): void {
    this.http.get('/backend/auth/data', { withCredentials: true }).subscribe((result) => {
      this.data = result;
    });
  }

  async getData() {
    this.http.get('/backend/auth/data', { withCredentials: true }).subscribe((result) => {
      this.data = result;
    });
  }

  async getMessage() {
    this.title = this.chatService.getMessage();
  }

  async sendMessage() {
    this.chatService.sendMessage("message");
  }


}
