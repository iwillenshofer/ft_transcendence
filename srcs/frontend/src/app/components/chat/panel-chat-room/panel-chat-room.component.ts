import { AfterViewInit, ChangeDetectionStrategy, Component, DoCheck, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { combineLatest, forkJoin, map, Observable, startWith, tap } from 'rxjs';
import { MessagePaginateInterface } from 'src/app/model/message.interface';
import { RoomInterface, RoomType } from 'src/app/model/room.interface';
import { faL, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { MessageInterface } from '../models/message.interface';
import { MemberRole } from 'src/app/model/member.interface';
import { UserInterface } from 'src/app/model/user.interface';
import { MemberInterface } from '../models/member.interface';
import { faGears } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { DialogRoomSettingComponent } from '../../dialogs/dialog-room-setting/dialog-room-setting.component';
import { MatSelectionListChange } from '@angular/material/list';
import { faStar as fasStar, faTableTennisPaddleBall, faAddressCard, faLock, faUnlock } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { FriendsService } from '../../friends/friends.service';
import { ChatService } from '../chat.service';
import { OnlineGameService } from '../../game/game.service';

@Component({
  selector: 'app-panel-chat-room',
  templateUrl: './panel-chat-room.component.html',
  styleUrls: ['./panel-chat-room.component.scss']
})
export class PanelChatRoomComponent implements OnInit, OnChanges {

  @Input()
  chatRoom!: RoomInterface;

  @Input()
  myUser!: UserInterface;

  @Input()
  selectedMember!: MemberInterface;

  @Input()
  myMember!: MemberInterface;


  fasStar = fasStar;
  farStar = farStar;
  faPaddle = faTableTennisPaddleBall;
  faProfile = faAddressCard;
  faLock = faLock;
  faUnlock = faUnlock;

  isBlocked = false;
  isBlocker = false;

  isAdmin = false;
  isOwner = false;
  amIOwner = false;
  amIAdmin = false;

  blockedUsers$ = this.chatService.getBlockedUsers();
  blockedUsers: Number[] = [];

  blockerUsers$ = this.chatService.getBlockerUsers();
  blockerUsers: Number[] = [];

  constructor(private chatService: ChatService,
    private gameService: OnlineGameService,
    private friendService: FriendsService,
    public dialog: MatDialog) {

  }

  ngOnInit(): void {

    if (this.myMember.role == MemberRole.Owner)
      this.amIOwner = true;
    else if (this.myMember.role == MemberRole.Administrator)
      this.amIAdmin = true;

    this.chatService.emitGetBlockedUsers();
    this.chatService.emitGetBlockerUsers();

    this.blockedUsers$.subscribe(blockedUsers => {
      blockedUsers.forEach(user => {
        this.blockedUsers.push(user);
      });
    });

    this.blockerUsers$.subscribe(blockerUsers => {
      blockerUsers.forEach(user => {
        this.blockerUsers.push(user);
      });
    });
  }

  // ngAfterViewInit(): void {

  // }

  ngOnChanges() {
    this.isOwner = this.selectedMember.role == MemberRole.Owner ? true : false;
    this.isAdmin = this.selectedMember.role == MemberRole.Administrator ? true : false;
    this.amIOwner = this.myMember.role == MemberRole.Owner ? true : false;
    this.amIAdmin = this.myMember.role == MemberRole.Administrator ? true : false;
  }



  profile(username: string) {
    this.friendService.loadUser(username);
  }

  challenge(username: string) {
    this.gameService.challenge(username);
  }

  blockUser(userId: number) {
    this.chatService.blockUser(userId);
    this.isBlocked = true;
  }

  unblockUser(userId: number) {
    this.chatService.unblockUser(userId);
    this.isBlocked = false;
  }

  displaySetAsAdmin(member: MemberInterface) {
    if (this.myMember?.role == MemberRole.Owner || this.myMember?.role == MemberRole.Administrator) {
      if (member.role == MemberRole.Administrator || member.role == MemberRole.Owner)
        return (false);
      return (true);
    }
    return (false);
  }

  setAsAdmin(member: MemberInterface) {
    this.chatService.setAsAdmin(member.user.id, this.chatRoom.id);
    this.isAdmin = true;
  }

  unsetAdmin(member: MemberInterface) {
    this.chatService.unsetAdmin(member.user.id, this.chatRoom.id);
  }

  setMute(duration: string) {
    let muteTime = new Date();
    if (this.selectedMember.id) {
      if (duration == "10mn") {
        muteTime.setMinutes(muteTime.getMinutes() + 10);
        this.chatService.setMute(this.selectedMember.id, muteTime);
      }
      else if (duration == "1h") {
        muteTime.setHours(muteTime.getHours() + 1)
        this.chatService.setMute(this.selectedMember.id, muteTime);
      }
      else if (duration == "24h") {
        muteTime.setHours(muteTime.getHours() + 24);
        this.chatService.setMute(this.selectedMember.id, muteTime);
      }
    }
  }

  setBan(duration: string) {
    let banTime = new Date();
    if (this.selectedMember.id) {
      if (duration == "10mn") {
        banTime.setMinutes(banTime.getMinutes() + 10);
        this.chatService.setBan(this.selectedMember.id, banTime);
      }
      else if (duration == "1h") {
        banTime.setHours(banTime.getHours() + 1)
        this.chatService.setBan(this.selectedMember.id, banTime);
      }
      else if (duration == "24h") {
        banTime.setHours(banTime.getHours() + 24);
        this.chatService.setBan(this.selectedMember.id, banTime);
      }
    }
  }

}
