import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  	constructor() { }

	private loggedIn: boolean = true;
  	private popup: Window | null = null;
  	private promise: Promise<unknown> | null = null;
	private timer: number | undefined = undefined;
	
	initLogin() {
		this.popup = this.createPopupWindow();
		const asyncFunction = (resolve: any, reject: any) => {
			const isPopupClosed = () => {
				console.log('waiting');
				if (!this.popup || this.popup.closed)
				{
					//here we checked if we are logged in
					if (this.loggedIn)
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
		this.promise = new Promise(asyncFunction)
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

	cleanUp() {
		this.popup?.close();
		this.popup = null;
		if (this.timer)
			clearInterval(this.timer);
		this.timer = undefined;
	};

	/*
	** we create a popup window and listen to its
	** message and storage events to determine if user is logged in.
	*/
	createPopupWindow(): &Window | null
	{
		let win: &Window | null
		const url: string = 'http://www.google.com/';
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
		win?.addEventListener('message', this.eventHandler.bind(this), false);
		win?.addEventListener('storage', this.eventHandler.bind(this), false);
		return (win);
	}

	/*
	** this event handler will check if the user is logged in
	*/
	eventHandler(evt:any): void {
		console.log(evt);
		console.log("Is the user logged in? We don't know yet... we need to code it!");
	}
}
