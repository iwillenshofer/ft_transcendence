import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { combineLatest, forkJoin, map, Observable, startWith } from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { ChatService } from 'src/app/chat/chat.service';
import { MemberRole } from 'src/app/model/member.interface';
import { MessagePaginateInterface } from 'src/app/model/message.interface';
import { RoomInterface, RoomType } from 'src/app/model/room.interface';
import { UserInterface } from 'src/app/model/user.interface';
import { MessageInterface } from '../models/message.interface';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit, OnChanges {

  @Input()
  chatRoom!: RoomInterface | null;

  @Input()
  myUser!: UserInterface;

  ownerUsername!: string;
  messagesPaginate$: Observable<MessagePaginateInterface> = combineLatest([this.chatService.getMessages(), this.chatService.getAddedMessage().pipe(startWith(null))]).pipe(
    map(([messagePaginate, message]) => {
      if (message && message.room.id === this.chatRoom?.id && !messagePaginate.items.some(m => m.id === message.id)) {
        messagePaginate.items.push(message);
      }
      const items = messagePaginate.items.sort((a, b) => new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime());
      messagePaginate.items = items;
      return messagePaginate;
    })
  );

  chatMessage: FormControl = new FormControl(null, [Validators.required]);

  constructor(private chatService: ChatService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chatRoom?.id) {
      this.chatService.requestMessages(this.chatRoom?.id);
    }
    this.ownerUsername = this.getOwner();
  }

  sendMessage() {
    if (this.chatRoom) {
      this.chatService.sendMessage(this.chatMessage.value, this.chatRoom);
      this.chatMessage.reset();
    }
  }

  isConversation(room: RoomInterface) {
    return room.type == RoomType.Direct;
  }

  isOwner() {
    let owner = this.chatRoom?.members?.find(user => user.role == MemberRole.Owner);
    if (owner) {
      let user = owner.user;
      if (user)
        return user.id == this.myUser.id;
    }
    return (false);
  }

  getOwner() {
    let owner = this.chatRoom?.members?.find(user => user.role == MemberRole.Owner);
    console.log(this.chatRoom)
    if (owner)
      return (owner.user.username);
    return ("");
  }


}
