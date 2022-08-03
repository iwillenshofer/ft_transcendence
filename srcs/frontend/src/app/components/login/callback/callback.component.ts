import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { User } from 'src/app/auth/user.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ThisReceiver } from '@angular/compiler';

@Component({
	selector: 'app-callback',
	templateUrl: './callback.component.html',
	styleUrls: ['./callback.component.scss']
})

/*
** the Callback component is called by the backend, after JWT was completed (or unsuccessful),
** and will determine wether the user is logged in or if the authentication failed.
*/

export class LoginCallbackComponent implements OnInit {

	currentUser: User | null = null;
	dataSubject: BehaviorSubject<any>;
	need_tfa: boolean = false;

	constructor(
		private activatedRoute: ActivatedRoute,
		private authService: AuthService,
		private cookieService: CookieService,
		private http: HttpClient,
		private router: Router,
	) {
		this.authService.user.subscribe(user => this.currentUser = user);
		this.dataSubject = new BehaviorSubject<any>(null);
	}

	logOut() {
		this.authService.logout();
	}

	initLogin() {
		this.authService.initLogin();
	}

	ngOnInit() {
		console.log('profile');
		this.getToken();
	}

	async getToken() {
		this.activatedRoute.queryParams.subscribe(params => {
			const code = params['code'];
			if (!(code)) {
				this.router.navigate(['/']);
				return;
			}
			this.http.get<any>('/backend/auth/token/' + code).subscribe(result => {
				if (!(result) || !(result.token)) {
					this.router.navigate(['/']);
					return;
				}
				localStorage.setItem('token', result.token);
				this.getUser();
			});
		});
	}

	/*
	** the functions below must be implemented in other services, like User service
	*/
	async getUser() {
		console.log('current token: ' + localStorage.getItem('token'));
		this.http.get<User>('/backend/auth/profile', { withCredentials: true }).subscribe(result => {
			this.authService.userSubject.next(result);
			localStorage.setItem('user', JSON.stringify(result));
			if (this.authService.isAuthenticated())
				this.router.navigate(['/']);
			else if (this.authService.isJwtAuthenticated())
				this.need_tfa = true;
		});
	}

	async getData() {
		this.http.get<User>('/backend/auth/data', { withCredentials: true }).subscribe(result => {
			this.dataSubject.next(result);
		});
	}

	async refreshToken() {
		this.http.get<User>('/backend/auth/refreshtoken', { withCredentials: true }).subscribe(result => {
			console.log(result);
		});
	}
}


/*
** https://blog.logrocket.com/jwt-authentication-best-practices/
** 
*/
