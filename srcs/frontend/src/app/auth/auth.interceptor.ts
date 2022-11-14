import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpClient } from "@angular/common/http"
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { catchError, Observable, throwError, switchMap, map } from "rxjs";
import { Injectable } from "@angular/core";
import { AlertsService } from "../alerts/alerts.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(
		private authService: AuthService,
		private router: Router,
		private http: HttpClient,
		private alertservice: AlertsService
	) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const new_req = req.clone({
			headers: req.headers.set('authorization', 'Bearer ' + localStorage.getItem('token')),
			withCredentials: true
		}
		);
		if (req.url.indexOf('/refreshtoken') >= 0 || req.url.indexOf('/logout') >= 0)
			return next.handle(new_req);
		return next.handle(new_req).pipe<any>(
			catchError((error) => {
				if (error.status == 401) {
					return this.handleError(req, next, error);
				} else {
					this.alertservice.danger("Something bad happened and you'll have to login again!")
					this.authService.logout();
					return this.router.navigate(['/']);
				}
			})
		)
	}

	private handleError(req: HttpRequest<any>, next: HttpHandler, originalError: any) {
		// console.log('handling 401 error');
		return this.http.get<any>('/backend/auth/refreshtoken', { withCredentials: true }).pipe(
			switchMap((data: any) => {
				// console.log(JSON.stringify(data));
				localStorage.removeItem('token');
				localStorage.setItem('token', data.token);
				const new_req = req.clone({
					headers: req.headers.set('authorization', 'Bearer ' + data.token),
					withCredentials: true
				}
				);
				return next.handle(new_req);
			}),
			catchError((error) => {
				// console.log('');
				this.alertservice.danger("Is your token that old or are you trying something fancy? Let's login again")
				this.authService.logout();
				return this.router.navigate(['/']);
			})
		)
	}

}
