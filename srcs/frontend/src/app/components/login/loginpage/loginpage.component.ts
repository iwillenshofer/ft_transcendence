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
	public removing: boolean = false;
	public alpha: number = 500;

	constructor (canvas_x: number, canvas_y: number, x: number = 0, y: number = 0) {
		let colors = ["#111111","#333333","#7777777","#999999","#bbbbbb","#dddddd","#ffffff", "#f47b37", "#fcb338", "#fcc816"];
		var rndColor= Math.floor((Math.random() * colors.length) + 1);
		this.vx = Math.floor((Math.random() * 15) + 1) * (Math.floor(Math.random() * 2) ? 1 : -1);
		this.vy = Math.floor((Math.random() * 15) + 1) * (Math.floor(Math.random() * 2) ? 1 : -1);;
		this.color = colors[rndColor];
		this.radius = Math.floor((Math.random() * 5) + 1);
		this.x = x;
		this.y = y;
		if (this.x == 0)	this.x =  Math.floor((Math.random() * canvas_x - 40) + 20);
		if (this.y == 0)	this.y =  Math.floor((Math.random() * canvas_y - 40) + 20);
	}

	update(canvas_x: number, canvas_y: number) {
		this.x += this.vx;
		this.y += this.vy;
		if (this.y <= 10 || this.y >= canvas_y)
			this.vy = -this.vy;
		if (this.x <= 10 || this.x >= canvas_x)
			this.vx = -this.vx;
		if (this.removing && this.alpha > 0)
			this.alpha -= 1;
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
		this.ctx.globalAlpha = ball.alpha / 500;
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
		this.ball = this.ball.filter(item => (item.alpha !== 0));
		for (var ball of this.ball)
			this.drawBall(ball);
	}

	clickEvent(event: any) {
		const rect = this.canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		for (var ball of this.ball)
			ball.removing = true;
		for (let i = 1; i < 50; i++)
			this.ball.push(new Ball(this.canvas.width, this.canvas.height, x, y));
	}

	ngAfterViewInit(): void {
		this.canvas = this.pageCanvas.nativeElement;
		this.resizeCanvas();
		window.addEventListener('resize', () => { this.resizeCanvas() }, false);
		window.addEventListener('mousedown', (e: any) => {
			this.clickEvent(e);
		  })
		this.ctx = this.canvas.getContext("2d");
		this.clearCanvas();
		for (let i = 1; i < 30; i++)
			this.ball.push(new Ball(this.canvas.width, this.canvas.height));
		setInterval(() => { this.update() }, 1800/60);
	}

	login()	{
		window.location.href='/auth/login';
	}

}
