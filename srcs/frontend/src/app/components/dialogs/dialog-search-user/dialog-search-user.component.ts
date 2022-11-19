import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, Observable, startWith, throwError } from 'rxjs';
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
  usersToBeAdded: UserInterface[] = [];
  users$ = this.chatService.getNonAddedUsers();
  toDisplay: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any[],
    private userService: UserService,
    private roomService: RoomService,
    private dialogRef: MatDialogRef<DialogSearchUserComponent>,
    private snackBar: MatSnackBar,
    private chatService: ChatService) {

  }

  form: FormGroup = new FormGroup({
    username: new FormControl(null, null)
  });

  get username(): FormControl {
    return this.form.get('username') as FormControl;
  }

  filteredOptions!: Observable<any[]>;

  async ngOnInit() {

    this.users$.subscribe(users => {
      users.forEach(user => {
        this.usersToBeAdded.push(user);
        this.toDisplay.push(user.username);
      });
    });
    this.filteredOptions = this.form.controls['username'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value ?? '')),
    );
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.toDisplay.filter(user => user.toLowerCase().includes(filterValue));
  }

  async createPrivateChat() {
    let username = this.form.getRawValue().username;
    if (this.toDisplay.includes(username)) {
      const user = this.usersToBeAdded.find(element => element.username == username);
      const myUser = await this.userService.getMyUser();
      if (!user || !myUser)
        return;
      let user_username = user.username;
      let myUser_username = myUser.username;
      let user_id = user.id;
      let room: RoomInterface = {
        name: myUser_username,
        name2: user_username,
        description: "Conversation between " + myUser_username + " and " + user_username,
        creator: myUser_username,
        type: RoomType.Direct
      };
      await this.roomService.createDirectRoom(room, user_id);
      this.snackBar.open(`The chat room has been successfully created.`, 'Close', {
        duration: 5000, horizontalPosition: 'right', verticalPosition: 'top'
      });
    }
    else {
      this.snackBar.open(`Sorry, this user does not exist.`, 'Close', {
        duration: 5000, horizontalPosition: 'right', verticalPosition: 'top'
      });
    }
    this.dialogRef.close();
  }

}