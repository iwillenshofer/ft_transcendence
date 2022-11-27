import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, Observable } from 'rxjs';
import { RoomInterface, RoomPaginateInterface, RoomType } from 'src/app/model/room.interface';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewRoomComponent } from '../dialogs/dialog-new-room/dialog-new-room.component';
import { DialogPasswordComponent } from '../dialogs/dialog-password/dialog-password.component';
import { faKey, faUserGroup, faUsers } from '@fortawesome/free-solid-svg-icons';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogSearchUserComponent } from '../dialogs/dialog-search-user/dialog-search-user.component';
import { UserService } from 'src/app/services/user.service';
import { UserInterface } from 'src/app/model/user.interface';
import { ChatService } from './chat.service';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {


  @ViewChild('roomsAvailable')
  roomsAvailable!: MatSelectionList;

  @ViewChild('list')
  list!: MatSelectionList;

  myRooms$ = this.chatService.getMyRooms();
  allMyRooms$ = this.chatService.getMyRoomsRequest();
  allMyRooms!: RoomInterface[];
  publicRooms$ = this.chatService.getPublicRooms();
  myRoomsNameObsv$ = this.chatService.getAllMyRoomsAsText();

  myUser!: UserInterface;
  myUsername!: string;

  myRoomsName: string[] = []

  selectedRoomNulled: RoomInterface = { id: 0, name: '', type: RoomType.Public }
  selectedRoom: RoomInterface = this.selectedRoomNulled;
  selectedPublicRoom: RoomInterface = this.selectedRoomNulled;

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


    this.myRooms$.subscribe((res) => {
      const tmp = res.items.find(room => room.id == this.selectedRoom.id);
      if (tmp)
        this.selectedRoom = tmp;
    })

    this.myRoomsNameObsv$.subscribe(roomsName => {
      roomsName.forEach(name => {
        this.myRoomsName.push(name);
      });
    });

    this.allMyRooms$.subscribe(rooms => {
      this.allMyRooms = rooms;
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
    const dialogRef = this.dialog.open(DialogNewRoomComponent);

    dialogRef.afterClosed().subscribe(ret => {
      this.allMyRooms$.subscribe(rooms => {
        let selectedRoom: RoomInterface | undefined;
        if (selectedRoom = rooms.find(room => room.name == ret.data.name)) {
          this.selectedRoom = selectedRoom;
        }
      })
    })
  }

  openDialogPassword() {
    const dialogRef = this.dialog.open(DialogPasswordComponent, {
      data: { room: this.selectedPublicRoom }
    });
    this.roomsAvailable.deselectAll();
  }

  async onJoinRoom(selectedPublicRoom: RoomInterface | null) {
    if (selectedPublicRoom != null) {
      let roomName = selectedPublicRoom.name ?? '';
      if (this.myRoomsName.includes(roomName)) {
        this.selectedRoom = this.selectedPublicRoom;
        this.snackBar.open(`You are already a member of this chat room.`, 'Close', {
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
      this.selectedRoom = this.selectedPublicRoom;
      this.selectedPublicRoom = this.selectedRoomNulled;
    }
    this.roomsAvailable.deselectAll();
  }

  onLeaveRoom(selectedRoom: RoomInterface) {
    if (selectedRoom != this.selectedRoomNulled) {
      this.chatService.leaveRoom(selectedRoom);
      let name = selectedRoom.name ?? '';
      const index = this.myRoomsName.indexOf(name, 0);
      if (index > -1) {
        this.myRoomsName.splice(index, 1);
      }
      this.nulledSelectedRoom();
    }
    this.roomsAvailable.deselectAll();
  }

  isProtected(type: RoomType) {
    return type == RoomType.Protected;
  }

  isConversation(room: RoomInterface) {
    return room.type == RoomType.Direct;
  }

  async onSearchUser() {
    const dialogRef = this.dialog.open(DialogSearchUserComponent);

    dialogRef.afterClosed().subscribe(ret => {
      this.allMyRooms$.subscribe(rooms => {
        let selectedRoom: RoomInterface | undefined;
        if (selectedRoom = rooms.find(room => room.id == ret.data.id || room.name == ret.data.name)) {
          this.selectedRoom = selectedRoom;
        }
      })
    })
    this.roomsAvailable.deselectAll();
  }

  nulledSelectedRoom() {
    this.selectedRoom = this.selectedRoomNulled;
    this.selectedPublicRoom = this.selectedRoomNulled;
  }

  isSelectRoomNull() {
    return this.selectedRoom === this.selectedRoomNulled;
  }

  selectPublicRoomNull() {
    return this.selectedPublicRoom === this.selectedRoomNulled;
  }
}