import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/auth/user.model';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentComponent } from '../../dialog-content/dialog-content.component';
import { Time } from '@angular/common';
import { SidebarService } from './sidebar.service';

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

  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    public sidebarService: SidebarService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getUserFromLocalStorage();
    if (this.sidebarService.GetImageUrl() == '')
      this.sidebarService.SetImageUrl(this.currentUser?.avatar_url);
    this.image = '/backend/' + this.sidebarService.GetImageUrl();
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentComponent, {
      data: { title: 'Hello' }
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
