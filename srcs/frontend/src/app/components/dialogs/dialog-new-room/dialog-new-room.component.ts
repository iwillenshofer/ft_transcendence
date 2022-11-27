import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { AlertsService } from 'src/app/alerts/alerts.service';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { RoomService } from 'src/app/services/room/room.service';
import { isRoomNameTaken } from 'src/app/validators/async-room-name.validator';

@Component({
  selector: 'app-dialog-new-room',
  templateUrl: './dialog-new-room.component.html',
  styleUrls: ['./dialog-new-room.component.scss']
})
export class DialogNewRoomComponent implements OnInit {

  hide = true;
  IsProtected: boolean = true;

  form: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern('^[a-z-A-Z-0-9]+$'),], [isRoomNameTaken(this.roomService)]),
    description: new FormControl(null, [Validators.maxLength(50)]),
    type: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required, Validators.minLength(8)])
  });

  constructor(private roomService: RoomService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<DialogNewRoomComponent>) {
  }

  ngOnInit(): void {
    this.form.controls['password'].disable();
    this.authService.getLogoutStatus.subscribe((data) => {
      if (data === true) {
        this.dialogRef.close();
      }
    });
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get description(): FormControl {
    return this.form.get('description') as FormControl;
  }

  get type(): FormControl {
    return this.form.get('type') as FormControl;
  }

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  OnSelectChange(input: string) {

    switch (input) {
      case "3": {
        this.form.controls['password'].enable();
        break;
      }
      default: {
        this.form.controls['password'].disable();
        this.form.controls['password'].reset();
        break;
      }
    }
  }

  createChatroom() {
    if (this.form.valid) {
      this.roomService.createRoom(this.form.getRawValue());
    }
    this.dialogRef.close({ data: this.form.getRawValue() });
  }
}

