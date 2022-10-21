import { Component, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import io from "socket.io-client";

@Component({
  selector: 'app-online-game',
  templateUrl: './online-game.component.html',
  styleUrls: ['./online-game.component.scss']
})
export class OnlineGameComponent implements OnInit {

  @ViewChild("game")
  private gameCanvas!: ElementRef;
  @ViewChild("ball")
  private ballCanvas!: ElementRef;
  private socket: any;
  private player1: any;
  private player2: any;
  isWaiting: boolean = true;


  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    switch (event.key) {
      case 'w':
      case 'W':
      case 'ArrowUp':
        this.socket.emit("move", "up");
        break;

      case 's':
      case 'S':
      case 'ArrowDown':
        this.socket.emit("move", "down");
        break;

      default:
        break;
    }
  }

  ngOnInit(): void {
    this.socket = io("http://localhost:3000");
    this.socket.emit("joinGame");
  }

  public ngAfterViewInit() {
    this.socket.on("players", (player1: any, player2: any) => {
      if (player1) {
        this.player1 = this.gameCanvas.nativeElement.getContext("2d");
        this.player1.fillStyle = "white";
        this.player1.fillRect(20, 200, 10, 100);
      }
      if (player2) {
        this.player2 = this.gameCanvas.nativeElement.getContext("2d");
        this.player2.fillStyle = "white";
        this.player2.fillRect(535, 200, 10, 100);
      }
      this.drawLines();
      if (this.player1 && this.player2) {
        this.isWaiting = false;
        this.updatePaddles();
        this.ball = this.gameCanvas.nativeElement.getContext("2d");
        this.drawBall()
        // this.updateBall(1);
      }
    })

  }

  updatePaddles() {
    this.socket.on("position", (positionP1: { x: any; y: any }, positionP2: { x: any, y: any }) => {
      this.player1.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height);
      this.player2.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height);
      this.player1.fillRect(positionP1.x, positionP1.y, 10, 100);
      this.player2.fillRect(positionP2.x, positionP2.y, 10, 100);
      this.drawBall();
      this.drawLines();
    });
  }

  lastTime!: number;
  private ball: any;

  drawBall() {
    this.ball.beginPath();
    this.ball.arc(280, 250, 10, 0, Math.PI * 2, true);
    this.ball.closePath();
    this.ball.fill();
  }

  drawLines() {
    for (let x = 3; x < 500;) {
      this.gameCanvas.nativeElement.getContext("2d").fillRect(275, x, 12, 10);
      x += 20;
    }
  }

  // updateBall(time: number) {
  //   if (this.lastTime) {
  //     const delta = time - this.lastTime;
  //     this.ball.update(delta);
  //     if (this.isLose())
  //       this.handleLose();

  //     this.lastTime = time;
  //     this.currentAnimationFrameId = window.requestAnimationFrame(this.update.bind(this));
  //     if (this.player1Score == MAX_SCORE || this.player2Score == MAX_SCORE)
  //       this.finish();
  //   }
  // }
}
