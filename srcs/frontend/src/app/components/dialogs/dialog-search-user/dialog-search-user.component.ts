import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, finalize, map, Observable, startWith, switchMap, tap, throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { RoomInterface, RoomType } from 'src/app/model/room.interface';
import { RoomService } from 'src/app/services/room/room.service';
import { UserService } from 'src/app/services/user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserInterface } from 'src/app/model/user.interface';
import { ChatService } from 'src/app/chat/chat.service';

@Component({
  selector: 'app-dialog-search-user',
  templateUrl: './dialog-search-user.component.html',
  styleUrls: ['./dialog-search-user.component.scss']
})
export class DialogSearchUserComponent implements OnInit {

  myUser!: User;
  users$ = this.chatService.getNonAddedUsers();
  myRooms$ = this.chatService.getMyRoomsRequest();
  myRooms!: RoomInterface[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private roomService: RoomService,
    private snackBar: MatSnackBar,
    protected chatService: ChatService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<DialogSearchUserComponent>,) {

  }

  searchUsersCtrl = new FormControl();
  filteredUsers!: any;
  isLoading = false;
  errorMsg: string = "";

  async ngOnInit() {
    this.authService.getLogoutStatus.subscribe((res) => {
      if (res === true) {
        this.dialogRef.close();
      }
    });

    this.myRooms$.subscribe(rooms => {
      this.myRooms = rooms;
    });

    this.searchUsersCtrl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.errorMsg = "";
          this.filteredUsers = [];
          this.isLoading = true;
        }),
        switchMap(value => this.chatService.getUserList(value)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
          )
        )
      )
      .subscribe(res => {
        if (res == undefined) {
          this.errorMsg = "The user couldn't be found.";
          this.filteredUsers = [];
        }
        else {
          this.errorMsg = "";
          this.filteredUsers = res;
        }
      })
  }

  checkIfAlreadyExist() {
    let user = this.searchUsersCtrl.value;
    if (user) {

      let room = this.myRooms.find(room => room.name == user.username || room.name2 == user.username)
      if (room) {
        this.dialogRef.close({ data: room })
      }
      else
        this.createPrivateChat();
    }
  }

  async createPrivateChat() {
    let username = this.searchUsersCtrl.value;
    const myUser = await this.userService.getMyUser();
    if (username && myUser) {
      let user_username = username.username;
      let myUser_username = myUser.username;
      let user_id = username.id;
      let room: RoomInterface = {
        name: myUser_username,
        name2: user_username,
        description: "Conversation between " + myUser_username + " and " + user_username,
        type: RoomType.Direct
      };
      await this.roomService.createDirectRoom(room, user_id);
      this.snackBar.open(`The chat room has been successfully created.`, 'Close', {
        duration: 5000, horizontalPosition: 'right', verticalPosition: 'top'
      });
      this.dialogRef.close({ data: room });
      return;
    }
    else {
      this.snackBar.open(`An error occurs. Please try again later.`, 'Close', {
        duration: 5000, horizontalPosition: 'right', verticalPosition: 'top'
      });
    }
    this.dialogRef.close();
  }

  getUsername(value: any) {
    if (value)
      return value.username;
  }

}