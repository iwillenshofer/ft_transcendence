import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	currentUser: User | null = null;
	constructor(private authService: AuthService)
	{
		this.authService.user.subscribe(user => this.currentUser = user);
	}

  ngOnInit(): void {
	  
  }

}
