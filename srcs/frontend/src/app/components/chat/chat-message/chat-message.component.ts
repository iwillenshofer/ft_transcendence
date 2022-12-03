import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ChatService } from '../chat.service';
import { MessageInterface } from '../models/message.interface';
import { faTableTennisPaddleBall, faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { OnlineGameService } from '../../game/game.service';
import { FriendsService } from '../../friends/friends.service';
import { User } from 'src/app/auth/user.model';
import { UserInterface } from 'src/app/model/user.interface';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit {

  @Input()
  message!: MessageInterface;

  @Input()
  myUser!: UserInterface;

  username!: string;
  avatar!: string;
  created_at!: Date;
  today = new Date();
  status!: string;
  onHover!: boolean;
  isOnHoverIcon: boolean = false;
  isOn!: boolean;
  faPaddle = faTableTennisPaddleBall;
  faProfile = faAddressCard;
  isUserOnline$!: Observable<boolean>;
  isUserOnline: boolean = false;



  constructor(
    private chatService: ChatService,
    private gameService: OnlineGameService,
    private friensService: FriendsService) {
    this.onHover = false;
  }

  ngOnInit(): void {
    this.isUserOnline$ = this.chatService.IsUserOnline(this.message.member.user.id);
    this.username = this.message.member.user.username;
    this.avatar = this.message.member.user.avatar_url;
    this.created_at = this.message.created_at ?? new Date();
    this.isUserOnline$.subscribe(res => {
      this.isUserOnline = res;
      if (this.isUserOnline == true)
        this.isOn = true;
      else
        this.isOn = false;
    });
  }

  isMyUser() {
    if (this.message.member.user.username && this.message.member.user.username === this.myUser.username) {
      return true;
    }
    return false;
  }

  onMouseEnter() {
    this.onHover = true;
    setTimeout(() => {
      if (this.isOnHoverIcon == true)
        this.onMouseEnter();
      else
        this.onMouseOut();
    },
      15000);
  }

  onMouseEnterIcons() {
    this.isOnHoverIcon = true;
    this.onHover = true;
  }

  onMouseOut() {
    this.onHover = false;
    this.isOnHoverIcon = false;
  }

  challenge() {
    this.gameService.challenge(this.username);
  }

  profile() {
    this.friensService.loadUser(this.username);
  }
}
