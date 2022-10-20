import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogUsernameComponent } from '../dialogs/dialog-username/dialog-username.component'
import { UserService } from 'src/app/services/user.service';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { DialogAvatarComponent } from '../dialogs/dialog-avatar/dialog-avatar.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { AlertsService } from 'src/app/alerts/alerts.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  tfa_enabled: boolean | undefined = false;
  username: string = "";
  image: string = "";
  faEdit = faEdit;

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
	private alertservice: AlertsService
  ) { }

  ngOnInit(): void {
    this.tfa_enabled = this.authService.userSubject.value?.tfa_enabled;
  }

  openDialogUsername() {
    const dialogRef = this.dialog.open(DialogUsernameComponent, {
      data: { title: 'Change your username' }
    });

    dialogRef.afterClosed().subscribe(
      () => this.username = this.userService.Username
    );
  }

  openDialogAvatar() {
    const dialogRef = this.dialog.open(DialogAvatarComponent, {
      data: { title: 'Change your profile picture' }
    });
    dialogRef.afterClosed().subscribe(
      () => this.image = this.userService.ImageUrl
    );
  }



  enableTfa() {
    this.router.navigate(['/enable2fa']);
  }

  async disableTfa() {
    this.http.post('/backend/auth/tfa_disable', null, { withCredentials: true }).subscribe(async (result) => {
      let res = result;
      if (res) {
        await this.authService.updateUser();
        this.tfa_enabled = this.authService.userSubject.value?.tfa_enabled;
      }
	  if (!(this.tfa_enabled)) {
		this.alertservice.success('TFA Successfully Disabled');
	  } else {
		this.alertservice.warning('Failed disabling TFA');
	  }
    });
  }

  logOut() {
    this.authService.logout();
  }


}
