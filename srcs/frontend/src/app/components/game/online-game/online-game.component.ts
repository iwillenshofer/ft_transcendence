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
  private socket: any;
  private player1: any;
  private player2: any;
  isWaiting: boolean = true;
  scoreP1: number = 0;
  scoreP2: number = 0;
  private ball: any;
  currentAnimationFrameId?: number;
  finished: boolean = false;
  finishedMessage: string = '';

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
    this.socket = io("http://localhost:3000/game");
    this.socket.emit("joinGame");
  }

  public ngAfterViewInit() {
    this.drawLines();
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
        this.ball = this.gameCanvas.nativeElement.getContext("2d");
        this.update();
      }
    })

  }

  lastTime!: number;
  update() {
    this.socket.emit("gameUpdate", 1);
    this.draw()
    this.updateScore();
    this.currentAnimationFrameId = window.requestAnimationFrame(this.update.bind(this));
  }

  updateScore() {
    this.socket.on("score", (scoreP1: number, scoreP2: number, finished: boolean, finishedMessage: string) => {
      this.scoreP1 = scoreP1;
      this.scoreP2 = scoreP2;
      this.finished = finished;
      if (this.finished) {
        this.draw();
        this.finishedMessage = finishedMessage;
        this.finish();
      }
    })
  }

  finish() {
    window.cancelAnimationFrame(this.currentAnimationFrameId as number);
  }

  draw() {
    this.socket.on("draw", (ball: any, positionP1: any, positionP2: any) => {
      this.ball.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height);
      this.drawLines();
      this.drawBall(ball.x, ball.y);
      this.updatePaddles(positionP1, positionP2);
    });
  }

  updatePaddles(positionP1: { x: any; y: any; }, positionP2: { x: any; y: any; }) {
    this.player1.fillRect(positionP1.x, positionP1.y, 10, 100);
    this.player2.fillRect(positionP2.x, positionP2.y, 10, 100);
  }

  drawBall(x: any, y: any) {
    this.ball.beginPath();
    this.ball.arc(x, y, 10, 0, Math.PI * 2, true);
    this.ball.closePath();
    this.ball.fill();
  }

  drawLines() {
    for (let x = 3; x < 500;) {
      this.gameCanvas.nativeElement.getContext("2d").fillRect(275, x, 12, 10);
      x += 20;
    }
  }
}
