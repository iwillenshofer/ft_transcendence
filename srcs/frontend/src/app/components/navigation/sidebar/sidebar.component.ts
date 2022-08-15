import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/auth/user.model';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  currentUser: User | null = null;

  IsDialogOpen = false;
  image: string = "";
  username: string = "";

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
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


}
