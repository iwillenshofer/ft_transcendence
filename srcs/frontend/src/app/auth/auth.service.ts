import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
  ) { }

  private popup: Window | null = null;

  initLoginFlowInPopup() {
	return new Promise((resolve, reject) => {
		this.popup = this.createPopupWindow();
        let checkForPopupClosedTimer: any;
        const checkForPopupClosed = () => {
			if (!this.popup || this.popup.closed) {
			  console.log('popup_closed');
			  resolve(1);
			}
		  };
		  if (!this.popup) {
			  console.log('popup_blocked');
			  resolve(1);
		  } else {
			  checkForPopupClosedTimer = window.setInterval(checkForPopupClosed, 1000);
		  }

		console.log("hello");
	})
  }
 

  	createPopupWindow(): &Window | null
	{
		let win: &Window | null
		const url: string = '/login';
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
		win?.addEventListener('message', this.closedPopup.bind(this), false);
		win?.addEventListener('unload', this.closedPopup.bind(this), false);
		return (win);
	}

	closedPopup(evt:any): void {
		console.log(evt);
	}


  public initLoginFlowInPopupXXX() {
    let windowRef: Window | any = null
    return new Promise((resolve, reject) => {
        /**
         * Error handling section
         */
        const checkForPopupClosedInterval = 500;

        let windowRef: any = null;
        // If we got no window reference we open a window
        // else we are using the window already opened
        if (!windowRef) {
          windowRef == window.open('http://google.com', 'loginwindow', `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=100, height=100, top=0, left=0`);
        } else if (windowRef && !windowRef.closed) {
          windowRef = windowRef;
          windowRef.location.href = 'http://google.com';
        }

        let checkForPopupClosedTimer: any;

        const tryLogin = (hash: string) => {
          this.tryLogin('hello').then(
            () => {
              cleanup();
              resolve(true);
            },
            (err) => {
              cleanup();
              reject(err);
            }
          );
        };

        const checkForPopupClosed = () => {
          if (!windowRef || windowRef.closed) {
            cleanup();
			console.log('popup_closed');
            reject(3);
          }
        };
        if (!windowRef) {
			console.log('popup_blocked');
          reject(2);
        } else {
          checkForPopupClosedTimer = window.setInterval(
            checkForPopupClosed,
            checkForPopupClosedInterval
          );
        }

        const cleanup = () => {
          window.clearInterval(checkForPopupClosedTimer);
          window.removeEventListener('storage', storageListener);
          window.removeEventListener('message', listener);
          if (windowRef !== null) {
            windowRef.close();
          }
          windowRef = null;
        };

        const listener = (e: MessageEvent) => {
          const message = this.processMessageEventMessage(e);

          if (message && message !== null) {
            window.removeEventListener('storage', storageListener);
            tryLogin(message);
          } else {
            console.log('false event firing');
          }
        };

        const storageListener = (event: StorageEvent) => {
          if (event.key === 'auth_hash') {
            window.removeEventListener('message', listener);
            tryLogin('message');
          }
        };

        window.addEventListener('message', listener);
        window.addEventListener('storage', storageListener);
      });
  }

	public tryLogin(v: any): Promise<boolean> {
		return Promise.reject(0);
	  }
	protected processMessageEventMessage(e: MessageEvent): string {
		let expectedPrefix = '#';

		if (!e || !e.data || typeof e.data !== 'string') {
			return "";
		}

		const prefixedMessage: string = e.data;

		if (!prefixedMessage.startsWith(expectedPrefix)) {
			return "";
		}
		return '#' + prefixedMessage.substr(expectedPrefix.length);
	}
	
  }










