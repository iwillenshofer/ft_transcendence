import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loginpopup',
  templateUrl: './loginpopup.component.html',
  styleUrls: ['./loginpopup.component.css']
})
export class LoginpopupComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
}

  login(){
	parent.postMessage('Clicked');
	window.close();
	}
}
