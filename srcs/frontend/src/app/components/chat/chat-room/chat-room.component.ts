import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { combineLatest, map, Observable, startWith, tap } from 'rxjs';
import { ChatService } from 'src/app/chat/chat.service';
import { MemberRole } from 'src/app/model/member.interface';
import { MessagePaginateInterface } from 'src/app/model/message.interface';
import { RoomInterface, RoomType } from 'src/app/model/room.interface';
import { UserInterface } from 'src/app/model/user.interface';
import { MemberInterface } from '../models/member.interface';

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

  @ViewChild('messagesScroller')
  private messagesScroller!: ElementRef;

  ownerUsername!: string;
  members$!: Observable<MemberInterface[]>
  messagesPaginate$: Observable<MessagePaginateInterface> = combineLatest([this.chatService.getMessages(), this.chatService.getAddedMessage().pipe(startWith(null))]).pipe(
    map(([messagePaginate, message]) => {
      if (message && message.room.id === this.chatRoom?.id && !messagePaginate.items.some(m => m.id === message.id)) {
        messagePaginate.items.push(message);
      }
      const items = messagePaginate.items.sort((a, b) => new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime());
      messagePaginate.items = items;
      return messagePaginate;
    }),
    tap(() => this.scrollToBottom())
  );

  chatMessage: FormControl = new FormControl(null, [Validators.required]);

  constructor(private chatService: ChatService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chatRoom?.id)
      this.chatService.requestMessages(this.chatRoom?.id);
    this.ownerUsername = this.getOwner();
    this.chatService.requestMemberOfRoom(this.chatRoom?.id ?? 0);
    this.members$ = this.chatService.getMembersOfRoom();
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

  scrollToBottom(): void {
    this.messagesScroller.nativeElement.scrollTop = this.messagesScroller.nativeElement.scrollHeight;
  }


}
