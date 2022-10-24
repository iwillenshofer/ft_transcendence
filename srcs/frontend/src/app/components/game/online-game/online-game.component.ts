import { Component, ViewChild, ElementRef, OnInit, HostListener, Input } from '@angular/core';
import io from "socket.io-client";

@Component({
  selector: 'app-online-game',
  templateUrl: './online-game.component.html',
  styleUrls: ['./online-game.component.scss']
})
export class OnlineGameComponent implements OnInit {

  @Input() mode: any;
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
  private gameID: string = '';

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    switch (event.key) {
      case 'w':
      case 'W':
      case 'ArrowUp':
        this.socket.emit("move", this.gameID, "up");
        break;

      case 's':
      case 'S':
      case 'ArrowDown':
        this.socket.emit("move", this.gameID, "down");
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
    this.socket.on("players", (player1: any, player2: any, gameID: string) => {
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
        this.gameID = gameID;
        this.isWaiting = false;
        this.ball = this.gameCanvas.nativeElement.getContext("2d");
        this.update();
      }
    })

  }

  update() {
    this.socket.emit("gameUpdate", this.gameID, 1);
    this.draw()
    this.updateScore();
    this.currentAnimationFrameId = window.requestAnimationFrame(this.update.bind(this));
  }

  updateScore() {
    this.socket.on("score", (player1: any, player2: any, finished: boolean) => {
      this.scoreP1 = player1.score;
      this.scoreP2 = player2.score;
      this.finished = finished;
      if (this.finished) {
        this.draw();
        this.finish(player1, player2);
      }
    })
  }

  finish(player1: any, player2: any) {
    console.log(this.socket, player1.socket)
    if (this.socket.id == player1.socket) {
      if (player1.score > player2.score)
        this.finishedMessage = 'Winner';
      else
        this.finishedMessage = 'Loser';
    }
    else if (this.socket.id == player2.socket) {
      if (player2.score > player1.score)
        this.finishedMessage = 'Winner';
      else
        this.finishedMessage = 'Loser';
    }
    window.cancelAnimationFrame(this.currentAnimationFrameId as number);
  }

  draw() {
    this.socket.on("draw", (ball: any, player1: any, player2: any) => {
      this.ball.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height);
      this.drawLines();
      this.drawBall(ball.x, ball.y);
      this.updatePaddles(player1.x, player1.y, player2.x, player2.y);
    });
  }

  updatePaddles(P1x: number, P1y: number, P2x: number, P2y: number) {
    this.player1.fillRect(P1x, P1y, 10, 100);
    this.player2.fillRect(P2x, P2y, 10, 100);
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
