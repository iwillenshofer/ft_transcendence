import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { debounceTime, finalize, switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ChatService } from 'src/app/chat/chat.service';
import { MemberInterface } from 'src/app/model/member.interface';
import { RoomType } from 'src/app/model/room.interface';
import { RoomService } from 'src/app/services/room/room.service';
import { isRoomNameTaken } from 'src/app/validators/async-room-name.validator';


@Component({
  selector: 'app-dialog-room-setting',
  templateUrl: './dialog-room-setting.component.html',
  styleUrls: ['./dialog-room-setting.component.scss']
})
export class DialogRoomSettingComponent {

  hide = true;
  filteredUsers!: any;
  isLoading = false;
  errorMsg: string = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private roomService: RoomService,
    private authService: AuthService,
    private chatService: ChatService,
    private dialogRef: MatDialogRef<DialogRoomSettingComponent>) {

  }

  ngOnInit(): void {
    if (this.data.room.type == RoomType.Direct) {
      this.form.controls['searchUsersCtrl'].disable();
    }
    if (this.data.room.type != RoomType.Protected) {
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
      });

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

      let member = this.data.room.members.find((member: MemberInterface) => member.user.username == user.username)
      if (!member)
        console.log("add")
      else
        console.log("don't add")
    }
  }

  getUsername(value: any) {
    if (value)
      return value.username;
  }

}
