import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/auth/user.model';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogAvatarComponent } from '../../dialogs/components/dialog-avatar/dialog-avatar.component';
import { Time } from '@angular/common';
import { SidebarService } from './sidebar.service';
import { DialogUsernameComponent } from '../../dialogs/components/dialog-username/dialog-username.component';

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
  username: string | undefined = ""

  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    public sidebarService: SidebarService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getUserFromLocalStorage();
    if (this.sidebarService.GetImageUrl() == '')
      this.sidebarService.SetImageUrl(this.currentUser?.avatar_url);
    if (this.sidebarService.GetUsername() == '')
      this.sidebarService.SetUsername(this.currentUser?.username)
    this.image = '/backend/' + this.sidebarService.GetImageUrl();
    this.username = this.sidebarService.GetUsername();
  }

  openDialogAvatar() {
    const dialogRef = this.dialog.open(DialogAvatarComponent, {
      data: { title: 'Change your profile picture' }
    });

    dialogRef.backdropClick

    dialogRef.afterClosed().subscribe(
      result => this.getLinkPicture()
    );
  }

  openDialogUsername() {
    const dialogRef = this.dialog.open(DialogUsernameComponent, {
      data: { title: 'Change your username' }
    });

    dialogRef.backdropClick

    dialogRef.afterClosed().subscribe(
      result => this.getLinkPicture()
    );
  }

  getLinkPicture() {
    this.image = '/backend/' + this.sidebarService.GetImageUrl();
  }
}
