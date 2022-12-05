import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { debounceTime, finalize, switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ChatService } from '../../chat/chat.service';
import { MemberInterface, MemberRole } from 'src/app/model/member.interface';
import { RoomType } from 'src/app/model/room.interface';
import { RoomService } from 'src/app/services/room/room.service';
import { isRoomNameTaken } from 'src/app/validators/async-room-name.validator';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-dialog-room-setting',
  templateUrl: './dialog-room-setting.component.html',
  styleUrls: ['./dialog-room-setting.component.scss']
})
export class DialogRoomSettingComponent {

  hide = true;
  filteredUsers!: any;
  isLoading = false;

  members$ = this.chatService.getMembersOfRoom();
  members: MemberInterface[] = [];

  myMember!: MemberInterface;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private roomService: RoomService,
    private authService: AuthService,
    private chatService: ChatService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DialogRoomSettingComponent>) {

  }

  ngOnInit(): void {
    this.chatService.getMyMemberOfRoom(this.data.room.id).subscribe((member: MemberInterface) => {
      this.myMember = member;
    });

    this.chatService.requestMemberOfRoom(this.data.room.id);

    if (this.data.room.type == RoomType.Direct) {
      this.form.controls['searchUsersCtrl'].disable();
    }
    if (this.data.room.type != RoomType.Protected) {
      this.form.controls['password'].disable();
    }
    if (this.myMember.role != MemberRole.Owner) {
      this.form.controls['password'].disable();
    }

    this.authService.getLogoutStatus.subscribe((data) => {
      if (data === true) {
        this.dialogRef.close();
      }
    });

    this.searchUsersCtrl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
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
          this.filteredUsers = [];
        }
        else {
          this.filteredUsers = res;
        }
      });

    this.members$.subscribe(members => {
      members.forEach(member => {
        this.members.push(member);
      })
    })

  }

  form: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.minLength(3), Validators.maxLength(20), Validators.pattern('^[a-z-A-Z-0-9]+$'),], [isRoomNameTaken(this.roomService)]),
    description: new FormControl(null, [Validators.maxLength(50)]),
    password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
    searchUsersCtrl: new FormControl(null),
    radioPassword: new FormControl(null)
  });

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get description(): FormControl {
    return this.form.get('description') as FormControl;
  }

  get searchUsersCtrl(): FormControl {
    return this.form.get('searchUsersCtrl') as FormControl;
  }

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  SubmitChanges() {
    if (this.form.valid) {
      this.roomService.changeSettingsRoom(this.data.room.id, this.form.getRawValue());
    }
    this.dialogRef.close({ data: this.form.getRawValue() });
  }

  isProtected() {
    return this.data.room.type == RoomType.Protected;
  }

  radioButtonChange(data: MatRadioChange) {
    if (data.value == "on") {
      this.form.controls['password'].enable();
    }
    else {
      this.form.controls['password'].disable();
      this.form.controls['password'].reset();
    }
  }

  checkIfAlreadyAdded() {
    let user = this.searchUsersCtrl.value;
    if (user) {
      let member = this.members.find(member => member.user.username == user.username)
      if (!member) {
        this.chatService.addUserToRoom(this.data.room, user);
        this.snackBar.open(user.username + ` has been successfully added to the chatroom.`, 'Close', {
          duration: 5000, horizontalPosition: 'right', verticalPosition: 'top'
        });
      }
      else
        this.snackBar.open(user.username + ` is already a member of this chat room.`, 'Close', {
          duration: 5000, horizontalPosition: 'right', verticalPosition: 'top'
        });
    }
  }

  getUsername(value: any) {
    if (value)
      return value.username;
  }

  isPrivateRoom() {
    return (this.data.room.type == RoomType.Private);
  }

  isOwner() {
    return (this.myMember.role != MemberRole.Owner)
  }

}
