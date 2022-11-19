import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RoomService } from 'src/app/services/room/room.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChatService } from 'src/app/chat/chat.service';

@Component({
  selector: 'app-dialog-password',
  templateUrl: './dialog-password.component.html',
  styleUrls: ['./dialog-password.component.scss']
})
export class DialogPasswordComponent implements OnInit {

  invalidPassword = false;

  form: FormGroup = new FormGroup({
    password: new FormControl(null, [Validators.required])
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogPasswordComponent>,
    private roomService: RoomService,
    private snackBar: MatSnackBar,
    private chatService: ChatService) { }

  ngOnInit(): void {
  }

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  async verifyPassword() {
    this.roomService.verifyPassword(this.data.room, this.form.getRawValue().password).subscribe((event: any) => {
      if (event == false) {
        this.snackBar.open('You have entered an incorrect password. Please try again.', 'Close', {
          duration: 5000, horizontalPosition: 'right', verticalPosition: 'top'
        });
      }
      else {
        this.chatService.joinRoom(this.data.room);
        this.snackBar.open('You have successfully joined the chat room.', 'Close', {
          duration: 5000, horizontalPosition: 'right', verticalPosition: 'top'
        });
        this.dialogRef.close()
      }
    })
  }

}
