import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpClient } from "@angular/common/http"
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { catchError, Observable, throwError, switchMap, map } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor (
		private authService: AuthService,
		private router: Router,
		private http: HttpClient
	) { }

	intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if (req.url.indexOf('/refreshtoken') >= 0)
			return next.handle(req);
		return next.handle(req).pipe<any>(
			catchError((error) => {
				console.log('the error was here1');
				if (error.status == 401) {
					return this.handleError(req, next, error);
				} else {
					return throwError(() => error);
				}

			})
		)
	}

	private handleError(req: HttpRequest<any>, next: HttpHandler, originalError: any) {
		console.log('handling 401 error');
		return this.authService.refreshToken().pipe(
			switchMap((data) => {
				console.log(data);
				return next.handle(req);
			}),
			catchError((error) => {
				this.authService.logout();
				return throwError(() => error);
			})
		)
	}
}
