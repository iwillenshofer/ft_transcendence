import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatService } from '../chat/chat.service';
import { UserInterface } from '../model/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersOnlineService {

  UsersOnline$!: Observable<UserInterface[]>
  UsersOnlineSubject$ = new BehaviorSubject<UserInterface[]>([]);
  UsersOnline: UserInterface[] = [];

  constructor(private chatService: ChatService) {
    // this.chatService.requestUsersOnline();
    this.UsersOnline$ = this.chatService.getUsersOnline();
    // console.log("there")
    this.UsersOnline$.subscribe((res: UserInterface[]) => {
      res = this.UsersOnline;
      this.UsersOnlineSubject$.next(res);
    });
  }
}
