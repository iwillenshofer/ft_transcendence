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
	

	/*
	** popup variables
	*/
	private popup: Window | null = null;
	private timer: number | undefined = undefined;
	
	initLogin() {
		const url: string = '/auth/login';
		window.location.href = url;
	};

	serverLogout()
	{
		return (this.http.get('http://localhost:3000/auth/logout', { withCredentials: true }));
	}

	refreshToken()
	{
		return  (this.http.get('http://localhost:3000/auth/refreshtoken', { withCredentials: true }));
	}

	logout(): void {
		this.serverLogout().subscribe({
			next: () => {
				this.userSubject.next(null);
				localStorage.removeItem('user');
				this.router.navigate(['/']);
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
	
	/*
	** Popup login
	*/
	cleanUp() {
		this.popup?.close();
		this.popup = null;
		if (this.timer)
			clearInterval(this.timer);
		this.timer = undefined;
		localStorage.removeItem('popup');
	};
	
	initLoginPopup() {
		this.cleanUp();
		this.popup = this.createPopupWindow();
		this.popup?.localStorage.setItem('popup', 'true');
		const asyncFunction = (resolve: any, reject: any) => {
			const isPopupClosed = () => {
				console.log('waiting');
				if (!this.popup || this.popup.closed)
				{
					if (this.tryLogin())
						resolve('Popup is closed and user is logged in.');
					else
						reject('Popup is closed and user is not logged in.');
				}
			};
			if (!this.popup) {
				reject('Something weird happened with the popup');
			} else {
				this.timer = window.setInterval(isPopupClosed, 1000);
			}
		}
		let promise = new Promise(asyncFunction)
		.then(
			(val) => this.popupSuccess(val),
			(err) => this.popupError(err)
			)
		.catch(	
			(err) => this.popupError(err)
		)
	};

	/*
	** Something went right! :D
	** User is logged in and ready to navigate.
	*/

	popupSuccess(val: string | unknown) {
		this.cleanUp();
		console.log('ok' + val)
		this.router.navigate(['login/callback']);
	};

	/*
	** Something went wrong: Either the popup was closed before completing
	** or there was a popup blocker...
	** we will just clean things up
	*/
	popupError(val: string | unknown) {
		this.cleanUp();
		console.log('therewasanerror: ' + val)
	};

	/*
	cleanUp() {
		this.popup?.close();
		this.popup = null;
		if (this.timer)
			clearInterval(this.timer);
		this.timer = undefined;
	};*/

	/*
	** we create a popup window and listen to its
	** message and storage events to determine if user is logged in.
	*/
	
	createPopupWindow(): &Window | null
	{
		let win: &Window | null
		const url: string = '/auth/login';
		const h: number = 500;
		const w: number = 330;
		const title = 'windowtitle';
		const parentX: number = window.top ? window.top.screenX : 0;
		const parentY: number = window.top ? window.top.screenY : 0;
		const parentHeight: number = window.top ? window.top.outerHeight : h;
		const parentWidth: number = window.top ? window.top.outerWidth : w;
		const childX = parentWidth / 2 + parentX - (h / 2);
		const childY = parentHeight / 2 + parentY - (h / 2);
		win = window.open(url, title, `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${childY}, left=${childX}`);
		return (win);
	}
}
