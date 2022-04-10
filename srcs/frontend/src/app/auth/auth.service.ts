import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { CookieService } from 'ngx-cookie-service'
import { Router } from '@angular/router'
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})

/*
** Observables and BehaviourSubject are used to let any
** module subscribed to these components know if there is 
** any change to it.
*/

export class AuthService {

  	constructor(
		private cookieService: CookieService,
		private router: Router,
		private http: HttpClient
	)
	{
		this.userSubject = new BehaviorSubject<User | null>(this.getUserFromLocalStorage());
		this.user = this.userSubject.asObservable();
	}

	public userSubject: BehaviorSubject<User | null>;
	public user: Observable<User | null>;
	
	isAuthenticated(): boolean {
		if (!(this.userSubject.value) || !(this.userSubject.value.tfa_fulfilled))
			return false;
		console.log(this.userSubject.value);
		return (true);
	}

	isJwtAuthenticated(): boolean {
		if (!(this.userSubject.value) || !(this.userSubject.value.id))
			return false;
		console.log(this.userSubject.value);
		return (true);
	}
	/*
	** popup variables
	*/
	initLogin() {
		const url: string = '/auth/login';
		window.location.href = url;
	};

	serverLogout()
	{
		return (this.http.get('/backend/auth/logout', { withCredentials: true }));
	}

	refreshToken()
	{
		return (this.http.get<any>('/backend/auth/refreshtoken', { withCredentials: true }));
	}

	logout(): void {
		this.serverLogout().subscribe({
			next: () => {
				this.userSubject.next(null);
				localStorage.removeItem('user');
				localStorage.removeItem('token');
				this.router.navigate(['/login']);
			}
		});
	}

	/*
	**
	*/

	getUserFromLocalStorage(): User | null {
		let user: string | null = localStorage.getItem('user');
		if (user)		
		{
			let result: User = JSON.parse(user);
			return (result);
		}
		return (null);
	}

	tryLogin(): boolean {
		let result: User | null = this.getUserFromLocalStorage();
		this.userSubject.next(result);
		if (result)
			return (true);
		return (false);
	}
	
	
}
