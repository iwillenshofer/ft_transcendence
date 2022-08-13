import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/auth/user.model';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogAvatarComponent } from '../../dialogs/components/dialog-avatar/dialog-avatar.component';
import { DialogUsernameComponent } from '../../dialogs/components/dialog-username/dialog-username.component';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  currentUser: User | null = null;
  tfa_enabled: boolean | undefined = false;
  faEdit = faEdit;
  IsDialogOpen = false;
  image: string = "";
  username: string = ""

  constructor(
    private userService: UserService,
    private authService: AuthService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (this.userService.ImageUrl == '')
      this.userService.getImageFromServer().subscribe(
        (result) => { this.image = this.userService.ImageUrl = '/backend/' + result.url })
    else
      this.image = this.userService.ImageUrl;
    if (this.userService.Username == '')
      this.userService.getUsernameFromServer().subscribe(
        (result) => { this.username = this.userService.Username = result.username })
    else
      this.username = this.userService.Username;
  }

  openDialogAvatar() {
    const dialogRef = this.dialog.open(DialogAvatarComponent, {
      data: { title: 'Change your profile picture' }
    });
    dialogRef.afterClosed().subscribe(
      () => this.image = this.userService.ImageUrl
    );
  }

  openDialogUsername() {
    const dialogRef = this.dialog.open(DialogUsernameComponent, {
      data: { title: 'Change your username' }
    });

    dialogRef.afterClosed().subscribe(
      () => this.username = this.userService.Username
    );
  }
}
