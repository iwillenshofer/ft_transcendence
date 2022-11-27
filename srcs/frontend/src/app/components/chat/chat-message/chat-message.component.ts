import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ChatService } from '../chat.service';
import { MessageInterface } from '../models/message.interface';



@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit {

  @Input()
  message!: MessageInterface;

  @Input()
  myUsername!: string;

  username!: string;
  avatar!: string;
  created_at!: Date;
  today = new Date();
  status!: string;

  constructor(private chatService: ChatService) {

  }

  ngOnInit(): void {

    this.username = this.message.member.user.username;
    this.avatar = this.message.member.user.avatar_url;
    this.created_at = this.message.created_at ?? new Date();
    this.chatService.IsUserOnline(this.message.member.user.id).subscribe(result => {
      if (result == true)
        this.status = "circle-green-16.png";
      else
        this.status = "circle-red-16.png";
    })
  }

  isMyUser() {
    if (this.message.member.user.username && this.message.member.user.username === this.myUsername) {
      return true;
    }
    return false;
  }
}
