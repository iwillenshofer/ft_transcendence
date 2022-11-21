import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { combineLatest, forkJoin, map, Observable, startWith } from 'rxjs';
import { ChatService } from 'src/app/chat/chat.service';
import { MessagePaginateInterface } from 'src/app/model/message.interface';
import { RoomInterface, RoomType } from 'src/app/model/room.interface';
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
  myUsername!: string;


  // messages$: Observable<MessagePaginateInterface> = this.chatService.getMessages();
  // newMessage$: Observable<MessageInterface> = this.chatService.getAddedMessage();
  messagesPaginate$: Observable<MessagePaginateInterface> = combineLatest([this.chatService.getMessages(), this.chatService.getAddedMessage().pipe(startWith(null))]).pipe(
    map(([messagePaginate, message]) => {
      if (message && message.room.id === this.chatRoom?.id) {
        messagePaginate.items.push(message);
      }
      const items = messagePaginate.items.sort((a, b) => new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime());
      messagePaginate.items = items;
      return messagePaginate;
    })
  )


  chatMessage: FormControl = new FormControl(null, [Validators.required]);

  constructor(private chatService: ChatService) {
  }

  ngOnInit(): void {
    // if (this.chatRoom?.id) {
    //   this.chatService.requestMessages(this.chatRoom?.id);
    // }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chatRoom?.id) {
      this.chatService.requestMessages(this.chatRoom?.id);
    }
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

  // getMessages() {

  //   // combineLatest([this.messages$, this.newMessage$]).pipe(
  //   //   map(([messagesPaginate, latestMessage]) => {
  //   //     console.log(messagesPaginate);
  //   //     console.log(latestMessage);
  //   //     return messagesPaginate.items.push(latestMessage);
  //   //   }
  //   //   ));



  //   return combineLatest([this.messages$, this.newMessage$.pipe(startWith(null))]).pipe(
  //     map(([messagePaginate, message]) => {
  //       if (message) {
  //         messagePaginate.items.push(message);
  //       }
  //       const items = messagePaginate.items.sort((a, b) => new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime());
  //       messagePaginate.items = items;
  //       return messagePaginate;
  //     })
  //   )
  // }

}
