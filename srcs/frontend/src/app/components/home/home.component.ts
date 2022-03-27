import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	currentUser: User | null = null;
  tfa_enabled: boolean | undefined = false;
  data: any = null;
	constructor(
    private authService: AuthService ,
    private http: HttpClient,
    private router: Router,
    )	{}

  ngOnInit(): void {
	  this.tfa_enabled = this.authService.userSubject.value?.tfa_enabled;
    this.http.get('/backend/auth/data',{ withCredentials: true }).subscribe((result) => {
      this.data = result;
    });
  }

  enableTfa()
  {
    this.router.navigate(['/enable2fa']);
  } 

  disableTfa()
  {
    this.http.post('/backend/auth/tfa_disable', null, { withCredentials: true }).subscribe((result) => {
			let res = result;
      console.log(res);
    });
  }

  logOut()
  {
    this.authService.logout();
  }
}
