import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/auth/user.model';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  currentUser: User | null = null;
  tfa_enabled: boolean | undefined = false;
  faEdit = faEdit;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getUserFromLocalStorage();
  }

}
