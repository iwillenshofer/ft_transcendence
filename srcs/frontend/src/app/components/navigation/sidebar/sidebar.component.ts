import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/auth/user.model';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';
import { UserInterface } from 'src/app/model/user.interface';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  currentUser: User | null = null;

  IsDialogOpen = false;
  avatar: string = "";
  username: string = "";


  constructor(
    private userService: UserService,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {

    this.username = this.userService.username;
    this.avatar = this.userService.avatar;

    this.userService.usernameChange.subscribe(value => {
      this.username = value;
    });

    this.userService.avatarChange.subscribe(value => {
      this.avatar = value;
    });

    if (this.userService.avatar == '')
      this.userService.getImageFromServer().subscribe(
        (result) => { this.avatar = this.userService.avatar = '/backend/' + result.url })
    else
      this.avatar = this.userService.avatar;

    if (this.userService.username == '')
      this.userService.getUsernameFromServer().subscribe(
        (result) => { this.username = this.userService.username = result.username })
  }

}
