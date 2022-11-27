import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { combineLatest, map, Observable, startWith, tap } from 'rxjs';
import { ChatService } from 'src/app/chat/chat.service';
import { MemberRole } from 'src/app/model/member.interface';
import { MessagePaginateInterface } from 'src/app/model/message.interface';
import { RoomInterface, RoomType } from 'src/app/model/room.interface';
import { UserInterface } from 'src/app/model/user.interface';
import { MemberInterface } from '../models/member.interface';
import { faGears } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { DialogRoomSettingComponent } from '../../dialogs/dialog-room-setting/dialog-room-setting.component';
import { MatSelectionListChange } from '@angular/material/list';
import { faStar as fasStar, faTableTennisPaddleBall, faAddressCard, faBan } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { OnlineGameService } from '../../game/online-game.service';
import { FriendsService } from '../../friends/friends.service';


@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit, OnChanges {

  @Input()
  chatRoom!: RoomInterface;

  @Input()
  myUser!: UserInterface;

  @ViewChild('messagesScroller')
  private messagesScroller!: ElementRef;

  selectedRoomNulled: RoomInterface = { id: 0, name: '', type: RoomType.Public }
  faGears = faGears;
  ownerUsername!: string;
  members$: Observable<MemberInterface[]> = this.chatService.getMembersOfRoom();
  members: MemberInterface[] = [];
  myMember!: MemberInterface;
  selectedMember!: MemberInterface | null;
  fasStar = fasStar;
  farStar = farStar;
  faPaddle = faTableTennisPaddleBall;
  faProfile = faAddressCard;
  faBan = faBan;

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

  constructor(private chatService: ChatService,
    private gameService: OnlineGameService,
    private friensService: FriendsService,
    public dialog: MatDialog,) {
  }

  ngOnInit(): void {
    this.members$.subscribe(members => {
      members.forEach(member => {
        if (member.user.id != this.myUser.id) {
          if (!this.members.some(thismember => thismember.id == member.id))
            this.members.push(member);
        }
      });
    });


    this.chatService.getMyMemberOfRoom(this.chatRoom?.id).subscribe((member: MemberInterface) => {
      this.myMember = member;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.selectedMember = null;

    if (this.chatRoom?.id)
      this.chatService.requestMessages(this.chatRoom?.id);
    this.ownerUsername = this.getOwner();
    this.chatService.requestMemberOfRoom(this.chatRoom?.id ?? 0);
    this.members = [];
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

  isOwner(member: MemberInterface) {
    if (member && member.role == MemberRole.Owner)
      return (true);
    return (false);
  }

  isAdmin(member: MemberInterface) {
    if (member && member.role == MemberRole.Administrator)
      return (true);
    return (false);
  }

  getOwner() {
    let owner = this.chatRoom?.members?.find(user => user.role == MemberRole.Owner);
    if (owner)
      return (owner.user.username);
    return ("");
  }

  scrollToBottom(): void {
    this.messagesScroller.nativeElement.scrollTop = this.messagesScroller.nativeElement.scrollHeight;
  }

  canModifiedNameAndDesc(member: MemberInterface) {
    if ((this.isOwner(member) || this.isAdmin(member)) && !this.isConversation(this.chatRoom)) {
      return (true);
    }
    return (false);
  }

  isRoomNulled() {
    return this.chatRoom.id == -1 || this.chatRoom.name == '__NULLED__';
  }

  onChangeTitleAndDesc() {
    const dialogRef = this.dialog.open(DialogRoomSettingComponent, {
      data: { room: this.chatRoom }
    });
  }

  onMemberChange(event: MatSelectionListChange) {
    this.selectedMember = event.source.selectedOptions.selected[0].value;
  }

  challenge(username: string) {
    this.gameService.challenge(username);
  }

  profile(username: string) {
    this.friensService.loadUser(username);
  }

  blockUser(username: string) {

  }

  displaySetAsAdmin(member: MemberInterface) {
    if (this.myMember.role == MemberRole.Owner || this.myMember.role == MemberRole.Administrator) {
      if (member.role == MemberRole.Administrator || member.role == MemberRole.Owner)
        return (false);
      return (true);
    }
    return (false);
  }

}
