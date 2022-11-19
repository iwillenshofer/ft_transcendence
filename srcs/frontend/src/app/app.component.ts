import { Component, OnDestroy } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { ChatService } from './chat/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';

  constructor() { }

}
