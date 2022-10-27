import { Component, ViewChild, ElementRef, OnInit, HostListener, Input, OnDestroy } from '@angular/core';
import io from "socket.io-client";
import { OnlineGameService } from './online-game.service';


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
  socket: any;
  isWaiting: boolean = true;
  currentAnimationFrameId?: number;
  finishedMessage: string = '';
  private gameID: string = '';
  username: string = '';
  scoreP1: number = 0;
  scoreP2: number = 0;
  finished: boolean = false;

  player1: any;
  player2: any;
  ball: any;

  constructor(public gameService: OnlineGameService) {
    this.ball = gameService.getBall();
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
    this.gameService.setMode(this.mode)
    this.gameService.setCustom(this.powerUps)
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }

  ngAfterViewInit() {
    this.canvas = this.gameCanvas.nativeElement.getContext("2d");
    this.canvas.fillStyle = "white";
    this.socket.on("players", (player1: any, player2: any, gameID: string) => {
      this.setPlayers(player1, player2, gameID)
      // this.gameService.reset()
      this.isWaiting = false;
      this.update();
    })
  }

  setPlayers(player1: any, player2: any, gameID: string) {
    if (player1)
      this.gameService.setP1Socket(player1);
    if (player2) {
      this.gameService.setP2Socket(player2);
    }
    if (player1 && player2) {
      this.gameService.setGameID(gameID);
      this.gameService.setGameSocket(this.socket);
      this.gameService.isP1(this.socket.id);
      this.player1 = this.gameService.getPlayer1();
      this.player2 = this.gameService.getPlayer2();
      this.gameID = gameID;
    }
  }

  update() {
    this.gameService.run();
    this.draw();
    this.updateScore();
    this.endGame();
    this.currentAnimationFrameId = window.requestAnimationFrame(this.update.bind(this));
  }

  draw() {
    this.canvas.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height);
    this.drawLines();
    if (!this.finished)
      this.drawBall(this.gameService.getBall());
    this.updatePaddles(this.gameService.getPlayer1(), this.gameService.getPlayer2());
    this.drawPowerUp(this.gameService.getPowerUp())
  }

  updateScore() {
    this.socket.on("updateScore", (scoreP1: any, scoreP2: any, finished: any) => {
      this.scoreP1 = scoreP1;
      this.scoreP2 = scoreP2;
      this.finished = finished;
      if (finished)
        this.finish();
    })
  }

  endGame() {
    this.socket.on("endGame", () => {
      console.log('stop')
      this.finished = true;
      this.finish();
    })
  }

  finish() {
    console.log('stop2')

    if (this.socket.id == this.player1) {
      if (this.scoreP1 > this.scoreP2)
        this.finishedMessage = 'Winner';
      else
        this.finishedMessage = 'Loser'
    }
    else if (this.socket.id == this.player2) {
      if (this.scoreP2 > this.scoreP1)
        this.finishedMessage = 'Winner';
      else
        this.finishedMessage = 'Loser'
    }
    else {
      if (this.scoreP1 > this.scoreP2)
        this.finishedMessage = 'Player1 Won';
      else
        this.finishedMessage = 'Player2 Won'
    }
    this.gameService.stopGame();
    window.cancelAnimationFrame(this.currentAnimationFrameId as number);
    this.socket.disconnect();
  }

  updatePaddles(P1: any, P2: any) {
    this.canvas.fillRect(P1.x, P1.y, P1.width, P1.height);
    this.canvas.fillRect(P2.x, P2.y, P2.width, P2.height);
  }

  drawBall(ball: any) {
    this.canvas.beginPath();
    this.canvas.arc(ball.x, ball.y, ball.radius * 2, 0, Math.PI * 2, true);
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
