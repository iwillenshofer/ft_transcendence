import { Component, OnInit } from '@angular/core';
import { faGears, faHome, faTableTennis, faComments, faStar, faRightFromBracket, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private userService: UserService
    ) { }
  image: string = "";
  username: string = "";
  
  icons: IconDefinition[] = [
    faHome,
    faTableTennis,
    faComments,
    faStar,
    faGears,
    faRightFromBracket,
  ];

  logout() {
    this.authService.logout();
  }

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

};