import { Component, OnInit } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { interval } from 'rxjs';
import { AlertsService } from 'src/app/alerts/alerts.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
	selector: 'app-loginpage',
	templateUrl: './loginpage.component.html',
	styleUrls: ['./loginpage.component.scss']
})


export class LoginpageComponent implements OnInit {

	constructor(private authservice: AuthService,
		private alertservice: AlertsService) { }

	ngOnInit(): void {
	}

	login()	{
		window.location.href='/auth/login';
	}
}
