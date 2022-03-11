import { Component, OnInit} from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { interval } from 'rxjs';
import { AuthModule } from 'src/app/auth/auth.module';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})


export class LoginpageComponent implements OnInit {
	
	private title: string = 'auth';
	private intervalId: any = null;
	private popup: Window | null = null;
	
	constructor() { }
	
	ngOnInit(): void {
	}


	displayPopup()
	{

	}
	
  	displayPopup2xxx() {
		const url: string = '/login';
		const h: number = 500;
		const w: number = 330;
		const parentX: number = window.top ? window.top.screenX : 0;
		const parentY: number = window.top ? window.top.screenY : 0;
		const parentHeight: number = window.top ? window.top.outerHeight : h;
		const parentWidth: number = window.top ? window.top.outerWidth : w;
		const childX = parentWidth / 2 + parentX - (h / 2);
		const childY = parentHeight / 2 + parentY - (h / 2);

		this.popup = window.open(url, this.title, `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${childY}, left=${childX}`);
		this.popup?.addEventListener('message', this.closedPopup.bind(this), false);
		this.popup?.addEventListener('unload', this.closedPopup.bind(this), false);

		let timer = setInterval(checkChild, 500, {w: this.popup});

		function checkChild(w: Window | null) {
			console.log(w);

			if (w && w.closed) {
				alert("Child window closed");   
				clearInterval(timer);
			}
		}

		console.log("hello");
	}
	
	closedPopup(evt:any): void {
		console.log(evt);
	}
  
}
