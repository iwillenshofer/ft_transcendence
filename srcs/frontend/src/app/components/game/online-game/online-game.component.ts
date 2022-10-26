import { Component, ViewChild, ElementRef, OnInit, HostListener, Input, OnDestroy } from '@angular/core';
import io from "socket.io-client";
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-online-game',
  templateUrl: './online-game.component.html',
  styleUrls: ['./online-game.component.scss']
})
export class OnlineGameComponent implements OnInit, OnDestroy {

  @Input() mode: any;
  @Input() powerUps: any;
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
  username: string = '';
  effect: number = 0;

  constructor(private userService: UserService) { }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    switch (event.key) {
      case 'w':
      case 'W':
      case 'ArrowUp':
        if (this.player1 && this.player2)
          this.socket.emit("move", this.gameID, "up");
        break;

      case 's':
      case 'S':
      case 'ArrowDown':
        if (this.player1 && this.player2)
          this.socket.emit("move", this.gameID, "down");
        break;

      case 'q':
      case 'Q':
        if (this.finished || this.isWaiting) {
          location.reload();
        }
        break;

      default:
        break;
    }
  }

  ngOnInit(): void {
    // if (this.userService.Username == '')
    //   this.userService.getUsernameFromServer().subscribe(
    //     (result) => { this.username = this.userService.Username = result.username })
    // else
    //   this.username = this.userService.Username;
    this.socket = io("http://localhost:3000/game");
    this.socket.emit("joinGame", this.powerUps);
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }

  public ngAfterViewInit() {
    this.socket.on("players", (player1: any, player2: any, gameID: string) => {
      if (player1) {
        this.player1 = this.gameCanvas.nativeElement.getContext("2d");
        this.player1.fillStyle = "white";
      }
      if (player2)
        this.player2 = this.gameCanvas.nativeElement.getContext("2d");
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
      if (this.finished)
        this.finish(player1, player2);
    })
  }

  finish(player1: any, player2: any) {
    if (this.socket.id == player1.socket) {
      this.finishedMessage = player1.message;
    }
    if (this.socket.id == player2.socket) {
      this.finishedMessage = player2.message;
    }
    window.cancelAnimationFrame(this.currentAnimationFrameId as number);
    this.socket.emit('endGame', this.gameID);
  }

  draw() {
    this.socket.on("draw", (ball: any, player1: any, player2: any, powerUp: any) => {
      this.ball.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height);
      this.drawLines();
      if (!this.finished)
        this.drawBall(ball.x, ball.y, ball.radius);
      this.updatePaddles(player1, player2);
      this.drawPowerUp(powerUp)
    });
  }

  updatePaddles(P1: any, P2: any) {
    this.player1.fillRect(P1.x, P1.y, P1.width, P1.height);
    this.player2.fillRect(P2.x, P2.y, P2.width, P2.height);
  }

  drawBall(x: any, y: any, radius: any) {
    this.ball.beginPath();
    this.ball.arc(x, y, radius * 2, 0, Math.PI * 2, true);
    this.ball.closePath();
    this.ball.fill();
  }

  drawLines() {
    for (let x = 3; x < 720;) {
      this.gameCanvas.nativeElement.getContext("2d").fillRect(640, x, 12, 10);
      x += 20;
    }
  }

  drawPowerUp(powerUp: any) {
    let ctx = this.gameCanvas.nativeElement.getContext("2d");
    if (powerUp.show) {
      // ctx.lineWidth = "5";
      // ctx.fillRect(powerUp.x, powerUp.y, 100, 100);
      // ctx.fill();
      var img = document.getElementById("powerUp");
      ctx.drawImage(img, powerUp.x, powerUp.y, 100, 100);
    }
  }

  // colorPowerUp(): string {
  //   if (this.effect == 10000)
  //     this.effect = 1;
  //   else
  //     this.effect++;
  //   if (this.effect > 0 && this.effect <= 3333)
  //     return "blue";
  //   if (this.effect > 3333 && this.effect <= 6666)
  //     return "green";
  //   else
  //     return "red";
  // }
}
