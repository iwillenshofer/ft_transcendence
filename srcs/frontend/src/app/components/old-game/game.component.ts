import { gameSocket } from './game-socket';
import { PowerupComponent } from './powerup/powerup.component';
import { PaddleComponent } from './paddle/paddle.component';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { BallComponent } from './ball/ball.component';

export const PADDLE_SPEED = 0.1;
export const MAX_SCORE = 10;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  socket!: gameSocket;
  lastTime!: number;
  currentAnimationFrameId?: number;
  player1Score = 0;
  player2Score = 0;
  paused: boolean = false;
  play: boolean = false;
  finished: boolean = false;
  message!: string;
  mode!: string;
  powerUpMode: boolean = false;
  initHeight = window.innerHeight;

  constructor() { }

  @ViewChild(BallComponent) ball!: BallComponent;
  @ViewChild('player1') player1Paddle!: PaddleComponent;
  @ViewChild('player2') player2Paddle!: PaddleComponent;
  @ViewChild('computer') computerPaddle!: PaddleComponent;
  @ViewChild(PowerupComponent) powerup!: PowerupComponent;

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    let cont = 0;
    let tableRect = document.getElementById('table')!.getBoundingClientRect();
    let max_height = tableRect.top;
    let min_height = tableRect.bottom;
    switch (event.key) {
      case 'p':
      case 'P':
        if (this.play && !this.finished)
          this.pause();
        break;

      case 'w':
      case 'W':
        while (++cont < 100 && !this.paused && Number(this.player1Paddle.rect.top) > max_height) {
          this.player1Paddle.position -= PADDLE_SPEED;
        }
        break;

      case 's':
      case 'S':
        while (++cont < 100 && !this.paused && Number(this.player1Paddle.rect.y) < min_height - this.player1Paddle.rect.height)
          this.player1Paddle.position += PADDLE_SPEED;
        break;

      case 'ArrowUp':
        while (++cont < 100 && !this.paused && this.player2Paddle && Number(this.player2Paddle.rect.y) > max_height)
          this.player2Paddle.position -= PADDLE_SPEED;
        // if (!this.paused && this.computerPaddle && Number(this.player1Paddle.rect.y) > 155)
        // this.player1Paddle.position -= PADDLE_SPEED;
        break;

      case 'ArrowDown':
        while (++cont < 100 && !this.paused && this.player2Paddle && Number(this.player2Paddle.rect.y) < min_height - this.player2Paddle.rect.height)
          this.player2Paddle.position += PADDLE_SPEED;
        // if (!this.paused && this.computerPaddle && Number(this.player1Paddle.rect.y) < 600)
        // this.player1Paddle.position += PADDLE_SPEED;
        break;

      case 'q':
      case 'Q':
        if (this.paused || this.finished) {
          window.location.reload();
        }
        break;

      default:
        break;
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  start(mode: string) {
    this.mode = mode;
    this.play = true;
    this.player1Score = 0;
    this.player2Score = 0;
    this.lastTime = 0;
    this.currentAnimationFrameId = window.requestAnimationFrame(this.update.bind(this));
    this.ball.reset();
    this.paused = false;
    this.finished = false;
    this.update(1);
  }

  update(time: number) {
    if (this.lastTime) {
      const delta = time - this.lastTime;

      if (this.player2Paddle) {
        this.ball.update(delta, [this.player1Paddle.rect, this.player2Paddle.rect]);
      }

      if (this.computerPaddle) {
        let table = document.getElementById('table')!.getBoundingClientRect();
        this.ball.update(delta, [this.player1Paddle.rect, this.computerPaddle.rect]);
        this.computerPaddle.update(delta, this.ball.y, table);
      }

    }
    if (this.powerUpMode)
      this.powerUps(time);

    if (this.isLose())
      this.handleLose();

    this.lastTime = time;
    this.currentAnimationFrameId = window.requestAnimationFrame(this.update.bind(this));
    if (this.player1Score == MAX_SCORE || this.player2Score == MAX_SCORE)
      this.finish();
  }

  powerUps(time: number) {
    let anyPaddle;
    if (this.player2Paddle)
      anyPaddle = this.player2Paddle
    else
      anyPaddle = this.computerPaddle

    if (this.initHeight != window.innerHeight) {
      this.powerup.update();
      this.initHeight = window.innerHeight;
    }
    if (time - this.powerup.time > 5000 && this.ball.lastTouch) {
      this.powerup.display();
    }
    if (this.powerup.bg_color != 'black' && this.powerup.isCollision(this.ball.rect())) {
      let color = this.powerup.bg_color;
      switch (color) {
        case 'green':
          this.powerup.collid = "BIG PADDLE";
          if (this.ball.lastTouch == 1) {
            this.player1Paddle.reset();
            this.player1Paddle.height = 50;
          }
          if (this.ball.lastTouch == 2) {
            anyPaddle.reset();
            anyPaddle.height = 50;
          }
          break;
        case 'red':
          this.powerup.collid = "small paddle"
          if (this.ball.lastTouch == 1)
            this.player1Paddle.height = 10;
          if (this.ball.lastTouch == 2)
            anyPaddle.height = 10;
          break;
        case 'blue':
          this.powerup.collid = "BIG BALL"
          this.ball.size = 10;
          break;
        default:
          break;
      }
      this.powerup.collided(time);
    }

    if (time - this.powerup.time > 10000) {
      this.player1Paddle.height = 20;
      anyPaddle.height = 20;
      this.ball.size = 2;
    }
  }

  isLose() {
    const rect = this.ball.rect();
    return rect.right >= window.innerWidth || rect.left <= 0;
  }

  handleLose() {
    const rect = this.ball.rect();
    if (rect.right >= window.innerWidth)
      this.player1Score += 1;
    if (rect.left <= 0)
      this.player2Score += 1;
    this.ball.reset();
    if (this.computerPaddle)
      this.computerPaddle.reset()
  }

  pause() {
    this.paused = !this.paused;
    if (this.paused) {
      this.lastTime = 0;
      window.cancelAnimationFrame(this.currentAnimationFrameId as number);
    }
    if (!this.paused) {
      window.requestAnimationFrame(this.update.bind(this));
    }
  }

  finish() {
    this.finished = true;
    window.cancelAnimationFrame(this.currentAnimationFrameId as number);
    if (this.computerPaddle) {
      if (this.player1Score == MAX_SCORE)
        this.message = "You won!";
      else
        this.message = "Computer won!";
    }
    else {
      if (this.player1Score == MAX_SCORE)
        this.message = "Player1 won!";
      else
        this.message = "Player2 won!";
    }
  }

  togglePowerUp() {
    this.powerUpMode = !this.powerUpMode;
  }


  joinQueue() {
    if (!this.powerUpMode)
      this.socket.emit("joinNormalGame");
    else
      this.socket.emit("joinPowerGame");
    // this.stat = GameStat.NORMAL_QUEUE;
  }
}

// https://www.youtube.com/watch?v=PeY6lXPrPaA