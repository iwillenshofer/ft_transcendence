import { Component, OnChanges, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Subject } from 'rxjs';
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
    description: new FormControl(null),
    type: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required, Validators.minLength(8)])
  });

  constructor(private roomService: RoomService,
    private dialogRef: MatDialogRef<DialogNewRoomComponent>) { }

  ngOnInit(): void {
    this.form.controls['password'].disable();
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

    console.log(this.IsProtected)
  }

  createChatroom() {
    if (this.form.valid) {
      this.roomService.createRoom(this.form.getRawValue());
    }
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
