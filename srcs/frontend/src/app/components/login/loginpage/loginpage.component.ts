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
		
	constructor(private authservice: AuthService) { }
	
	ngOnInit(): void {
	}

	// initLogin()
	// {
	// 	this.authservice.initLogin();
	// }
}
