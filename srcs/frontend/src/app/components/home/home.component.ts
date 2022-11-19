import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  currentUser: User | null = null;
  data: any = null;

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.http.get('/backend/auth/data', { withCredentials: true }).subscribe((result) => {
      this.data = result;
    });
  }

  async getData() {
    this.http.get('/backend/user/getAllConnectedUser', { withCredentials: true }).subscribe((result) => {
      this.data = result;
    });
  }

}
