import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { interval } from 'rxjs';
import { AlertsService } from 'src/app/alerts/alerts.service';
import { AuthService } from 'src/app/auth/auth.service';


class Ball {
	public x: number = 0;
	public y: number = 0;
	public radius: number = 0;
	public color: string = '';
	public vx: number = 0;
	public vy: number = 0;


	constructor (canvas_x: number, canvas_y: number) {
		let colors = ["#111111","#333333","#555555","#7777777","#999999","#bbbbbb","#dddddd","#ffffff", "#f47b37", "#fcb338", "#fcc816"];
		var rndColor= Math.floor((Math.random() * colors.length) + 1);
		this.vx = Math.floor((Math.random() * 4) + 1) * (Math.floor(Math.random() * 2) ? 1 : -1);
		this.vy = Math.floor((Math.random() * 4) + 1) * (Math.floor(Math.random() * 2) ? 1 : -1);;
		this.color = colors[rndColor];
		this.radius = Math.floor((Math.random() * 5) + 1);
		this.x =  Math.floor((Math.random() * canvas_x - 40) + 20);
		this.y =  Math.floor((Math.random() * canvas_y - 40) + 20);
	}

	update(canvas_x: number, canvas_y: number) {
		this.x += this.vx;
		this.y += this.vy;
		if (this.y <= 10 || this.y >= canvas_y)
			this.vy = -this.vy;
		if (this.x <= 10 || this.x >= canvas_x)
			this.vx = -this.vx;
	}

}

@Component({
	selector: 'app-loginpage',
	templateUrl: './loginpage.component.html',
	styleUrls: ['./loginpage.component.scss']
})
export class LoginpageComponent implements AfterViewInit {

	constructor(private authservice: AuthService,
		private alertservice: AlertsService) {
		 }

	@ViewChild("loginpage")
	private pageCanvas!: ElementRef;
	private canvas: any;
	private ball: Ball[] = []; 
	private ctx: any;

	drawBall(ball: Ball) {
		this.ctx.beginPath();
		this.ctx.arc(ball.x, ball.y, ball.radius, Math.PI * 2, false);
		this.ctx.fillStyle = ball.color;
		this.ctx.fill();
		this.ctx.closePath();
		ball.update(this.canvas.width, this.canvas.height);
	}

	resizeCanvas() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}

	clearCanvas(){
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	
	update() {
		this.clearCanvas();
		for (var ball of this.ball)
			this.drawBall(ball);
	}

	ngAfterViewInit(): void {
		this.canvas = this.pageCanvas.nativeElement;
		this.resizeCanvas();
		window.addEventListener('resize', () => { this.resizeCanvas() }, false);
		this.ctx = this.canvas.getContext("2d");
		this.clearCanvas();
		for (let i = 1; i < 30; i++)
			this.ball.push(new Ball(this.canvas.width, this.canvas.height));
		setInterval(() => { this.update() }, 1000/60);
	}

	login()	{
		window.location.href='/auth/login';
	}

}
