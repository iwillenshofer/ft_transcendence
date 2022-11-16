import { Component, OnInit } from '@angular/core';
import { faGears, faHome, faTableTennis, faComments, faStar, faRightFromBracket, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from 'src/app/services/user.service';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { AlertsService } from 'src/app/alerts/alerts.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  
  public userSubject: BehaviorSubject<User | null>;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertService: AlertsService
    ) { 
      this.userSubject = this.authService.userSubject;
    }
  
  icons: IconDefinition[] = [
    faHome,
    faTableTennis,
    faComments,
    faStar,
    faGears,
    faRightFromBracket,
  ];

  tryAccept() {
    console.log('accepting');
  }

  tryDeny() {
    console.log('denying');
  }

  tryAlert() {
    this.alertService.challenge('hello',
      {
        accept_click: () => {
          this.tryAccept();
        },
        deny_click: () => {
          this.tryDeny();
        }
      }
    );
  }

  logout() {
    this.authService.logout();
  }

  ngOnInit(): void {

  }

};