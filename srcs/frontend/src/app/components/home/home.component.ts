import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  tfa_enabled: boolean | undefined = false;
  data: any = null;

  title = this.chatService.getMessage();

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private chatService: ChatService
  ) { }

  ngOnInit(): void {
    this.tfa_enabled = this.authService.userSubject.value?.tfa_enabled;
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

  enableTfa() {
    this.router.navigate(['/enable2fa']);
  }

  disableTfa() {
    this.http.post('/backend/auth/tfa_disable', null, { withCredentials: true }).subscribe((result) => {
      let res = result;
      console.log(res);
    });
  }

  logOut() {
    this.authService.logout();
  }
}
