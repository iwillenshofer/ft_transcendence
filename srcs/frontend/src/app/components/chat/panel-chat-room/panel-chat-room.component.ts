import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoomInterface } from 'src/app/model/room.interface';
import { MemberInterface, MemberRole } from 'src/app/model/member.interface';
import { UserInterface } from 'src/app/model/user.interface';
import { MatDialog } from '@angular/material/dialog';
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
export class PanelChatRoomComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  chatRoom!: RoomInterface;

  @Input()
  myUser!: UserInterface;

  @Input()
  selectedMember!: MemberInterface;

  @Input()
  myMember!: MemberInterface;

  amIOwner = false;
  amIAdmin = false;

  blockedUsers$ = this.chatService.getBlockedUsers();

  faLock = faLock;
  faPaddle = faTableTennisPaddleBall;
  faProfile = faAddressCard;
  farStar = farStar;
  fasStar = fasStar;
  faUnlock = faUnlock;

  isAdmin = false;
  isBlocked = false;
  isOwner = false;

  subscription1$!: Subscription;

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

    this.subscription1$ = this.blockedUsers$.subscribe(blockedUsers => {
      blockedUsers.forEach(user => {
        if (user == this.selectedMember.user.id)
          this.isBlocked = true;
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription1$.unsubscribe();
  }

  ngOnChanges() {
    this.isOwner = this.selectedMember.role == MemberRole.Owner ? true : false;
    this.isAdmin = this.selectedMember.role == MemberRole.Administrator ? true : false;
    this.amIOwner = this.myMember.role == MemberRole.Owner ? true : false;
    this.amIAdmin = this.myMember.role == MemberRole.Administrator ? true : false;
  }

  blockUser(userId: number) {
    this.chatService.blockUser(userId);
    this.isBlocked = true;
  }

  challenge(username: string) {
    this.gameService.challenge(username);
  }

  displaySetAsAdmin(member: MemberInterface) {
    if (this.myMember?.role == MemberRole.Owner ||
      this.myMember?.role == MemberRole.Administrator) {
      if (member.role == MemberRole.Administrator || member.role == MemberRole.Owner)
        return (false);
      return (true);
    }
    return (false);
  }

  isMyMember() {
    return (this.myMember.id == this.selectedMember.id);
  }

  profile(username: string) {
    this.friendService.loadUser(username);
  }

  setAsAdmin(member: MemberInterface) {
    this.chatService.setAsAdmin(member.user.id, this.chatRoom.id);
    this.isAdmin = true;
  }

  setBan(duration: string) {
    let banTime = new Date();
    if (this.selectedMember.id) {
      if (duration == "5mn") {
        banTime.setMinutes(banTime.getMinutes() + 5);
        this.chatService.setBan(this.selectedMember.id, this.chatRoom.id, banTime);
      }
      else if (duration == "1h") {
        banTime.setHours(banTime.getHours() + 1)
        this.chatService.setBan(this.selectedMember.id, this.chatRoom.id, banTime);
      }
      else if (duration == "24h") {
        banTime.setHours(banTime.getHours() + 24);
        this.chatService.setBan(this.selectedMember.id, this.chatRoom.id, banTime);
      }
    }
  }

  setMute(duration: string) {
    let muteTime = new Date();
    if (this.selectedMember.id) {
      if (duration == "5mn") {
        muteTime.setMinutes(muteTime.getMinutes() + 5);
        this.chatService.setMute(this.selectedMember.id, this.chatRoom.id, muteTime);
      }
      else if (duration == "1h") {
        muteTime.setHours(muteTime.getHours() + 1)
        this.chatService.setMute(this.selectedMember.id, this.chatRoom.id, muteTime);
      }
      else if (duration == "24h") {
        muteTime.setHours(muteTime.getHours() + 24);
        this.chatService.setMute(this.selectedMember.id, this.chatRoom.id, muteTime);
      }
    }
  }

  unblockUser(userId: number) {
    this.chatService.unblockUser(userId);
    this.isBlocked = false;
  }

  unsetAdmin(member: MemberInterface) {
    this.chatService.unsetAdmin(member.user.id, this.chatRoom.id);
  }
}
