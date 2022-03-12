import { Component, OnInit} from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { interval } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})


export class LoginpageComponent implements OnInit {
	
	private title: string = 'auth';
	private intervalId: any = null;
	private popup: Window | null = null;
	
	constructor(private authservice: AuthService) { }
	
	ngOnInit(): void {
	}

	displayPopup()
	{
		this.authservice.initLogin();
	}
}
