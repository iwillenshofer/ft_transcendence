import { Component, ViewChild, ElementRef, OnInit, HostListener, Input, OnDestroy } from '@angular/core';
import io from "socket.io-client";
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-online-game',
  templateUrl: './online-game.component.html',
  styleUrls: ['./online-game.component.scss']
})
export class OnlineGameComponent implements OnInit, OnDestroy {

  @ViewChild("game")
  private gameCanvas!: ElementRef;
  private canvas: any;
  @Input() mode: any;
  @Input() powerUps: any;
  @Input() specGame: any;
  private socket: any;
  private player1: any;
  private player2: any;
  isWaiting: boolean = true;
  scoreP1: number = 0;
  scoreP2: number = 0;
  currentAnimationFrameId?: number;
  finished: boolean = false;
  finishedMessage: string = '';
  private gameID: string = '';
  username: string = '';

  constructor(private userService: UserService) { }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    switch (event.key) {
      case 'w':
      case 'W':
      case 'ArrowUp':
        if (this.player1 && this.player2 && this.mode != 'spec')
          this.socket.emit("move", this.gameID, "up");
        break;

      case 's':
      case 'S':
      case 'ArrowDown':
        if (this.player1 && this.player2 && this.mode != 'spec')
          this.socket.emit("move", this.gameID, "down");
        break;

      case 'q':
      case 'Q':
        if (this.finished || this.isWaiting || this.mode == 'spec') {
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
    if (this.mode == 'spec') {
      this.socket.emit("watchGame", this.specGame);
    }
    else
      this.socket.emit("joinGame", this.powerUps);
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }

  public ngAfterViewInit() {
    this.canvas = this.gameCanvas.nativeElement.getContext("2d");
    this.canvas.fillStyle = "white";
    this.socket.on("players", (player1: any, player2: any, gameID: string) => {
      console.log('players');
      if (player1)
        this.player1 = player1;
      if (player2)
        this.player2 = player2;
      this.gameID = gameID;
      if (this.player1 && this.player2) {
        this.isWaiting = false;
        this.update();
      }
    })
  }

  update() {
    if (this.socket.id == this.player1)
      this.socket.emit("gameUpdate", this.gameID);
    this.draw()
    // this.updateScore();
    this.currentAnimationFrameId = window.requestAnimationFrame(this.update.bind(this));
  }

  // updateScore() {
  //   this.socket.on("score", (player1: any, player2: any, finished: boolean) => {
  //     this.scoreP1 = player1.score;
  //     this.scoreP2 = player2.score;
  //     this.finished = finished;
  //     if (this.finished)
  //       this.finish(player1, player2);
  //   })
  // }

  finish(player1: any, player2: any) {
    if (this.socket.id == player1.socket) {
      this.finishedMessage = player1.message;
    }
    if (this.socket.id == player2.socket) {
      this.finishedMessage = player2.message;
    }
    window.cancelAnimationFrame(this.currentAnimationFrameId as number);
    this.socket.disconnect();
  }

  draw() {
    this.socket.on("draw", (ball: any, player1: any, player2: any, powerUp: any) => {
      this.canvas.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height);
      this.drawLines();
      if (!this.finished)
        this.drawBall(ball.x, ball.y, ball.radius);
      this.updatePaddles(player1, player2);
      this.drawPowerUp(powerUp)
    });
  }

  updatePaddles(P1: any, P2: any) {
    this.canvas.fillRect(P1.x, P1.y, P1.width, P1.height);
    this.canvas.fillRect(P2.x, P2.y, P2.width, P2.height);
  }

  drawBall(x: any, y: any, radius: any) {
    this.canvas.beginPath();
    this.canvas.arc(x, y, radius * 2, 0, Math.PI * 2, true);
    this.canvas.closePath();
    this.canvas.fill();
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
      var img = document.getElementById("powerUp");
      ctx.drawImage(img, powerUp.x, powerUp.y, 100, 100);
    }
  }
}
