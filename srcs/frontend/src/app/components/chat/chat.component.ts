import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSelectionListChange } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatService } from 'src/app/chat/chat.service';
import { RoomInterface, RoomPaginateInterface, RoomType } from 'src/app/model/room.interface';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewRoomComponent } from '../dialogs/dialog-new-room/dialog-new-room.component';
import { DialogPasswordComponent } from '../dialogs/dialog-password/dialog-password.component';
import { faKey, faUserGroup, faUsers } from '@fortawesome/free-solid-svg-icons';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogSearchUserComponent } from '../dialogs/dialog-search-user/dialog-search-user.component';
import { User } from 'src/app/auth/user.model';
import { UserService } from 'src/app/services/user.service';
import { UserInterface } from 'src/app/model/user.interface';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  myRooms$ = this.chatService.getMyRooms();
  publicRooms$ = this.chatService.getPublicRooms();
  myRoomsNameObsv$ = this.chatService.getAllMyRoomsAsText();

  myUser!: UserInterface;
  myUsername!: string;

  myRoomsName: string[] = []
  selectedRoom = null;
  selectedPublicRoom = null;

  Isrooms: boolean = false;

  faKey = faKey;
  faUserGroup = faUserGroup;
  faUsers = faUsers;

  constructor(
    private chatService: ChatService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private userService: UserService) {
  }

  async ngOnInit() {
    this.myUser = await this.userService.getMyUser();
    this.myUsername = this.myUser.username;
    this.chatService.emitPaginateRooms(3, 0);
    this.chatService.emitPaginatePublicRooms(3, 0);
    // this.myRooms$.subscribe();
    // this.publicRooms$.subscribe();
    this.myRoomsNameObsv$.subscribe(roomsName => {
      roomsName.forEach(name => {
        this.myRoomsName.push(name);
      });
    });
  }

  onSelectRoom(event: MatSelectionListChange) {
    this.selectedRoom = event.source.selectedOptions.selected[0].value;
  }

  onSelectPublicRoom(event: MatSelectionListChange) {
    this.selectedPublicRoom = event.source.selectedOptions.selected[0].value;
  }

  onPaginateRooms(pageEvent: PageEvent) {
    this.chatService.emitPaginateRooms(pageEvent.pageSize, pageEvent.pageIndex);
  }

  onPaginatePublicRooms(pageEvent: PageEvent) {
    this.chatService.emitPaginatePublicRooms(pageEvent.pageSize, pageEvent.pageIndex);
  }

  openDialogNewRoom() {
    this.dialog.open(DialogNewRoomComponent, {
      data: { title: 'Create a new room' }
    });
  }

  openDialogPassword() {
    const dialogRef = this.dialog.open(DialogPasswordComponent, {
      data: { room: this.selectedPublicRoom }
    });
  }

  async onJoinRoom(selectedPublicRoom: RoomInterface | null) {
    if (selectedPublicRoom != null) {
      let roomName = selectedPublicRoom.name ?? '';
      if (this.myRoomsName.includes(roomName)) {
        this.snackBar.open(`You are already a member of the chat room.`, 'Close', {
          duration: 5000, horizontalPosition: 'right', verticalPosition: 'top'
        });
        return;
      }
      if (selectedPublicRoom.type == RoomType.Protected) {
        this.openDialogPassword();
      }
      else {
        this.chatService.joinRoom(selectedPublicRoom);
        this.snackBar.open('You have successfully joined the chat room.', 'Close', {
          duration: 5000, horizontalPosition: 'right', verticalPosition: 'top'
        });
        this.myRoomsName.push(roomName);
      }
    }
  }

  onLeaveRoom(selectedRoom: RoomInterface | null) {
    if (selectedRoom != null) {
      this.chatService.leaveRoom(selectedRoom);
      let name = selectedRoom.name ?? '';
      const index = this.myRoomsName.indexOf(name, 0);
      if (index > -1) {
        this.myRoomsName.splice(index, 1);
      }
      this.selectedRoom = null;
    }
  }

  isProtected(type: RoomType) {
    return type == RoomType.Protected;
  }

  isConversation(room: RoomInterface) {
    return room.type == RoomType.Direct;
  }

  async onSearchUser() {
    const dialogRef = this.dialog.open(DialogSearchUserComponent);
  }
}