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

  lastTime!: number;
  currentAnimationFrameId?: number;
  player1Score = 0;
  player2Score = 0;
  paused: boolean = false;
  play: boolean = false;
  finished: boolean = false;
  message!: string;
  mode!: string;
  powerUpMode: boolean = true;
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
        while (++cont < 50 && !this.paused && Number(this.player1Paddle.rect.top) > max_height) {
          this.player1Paddle.position -= PADDLE_SPEED;
        }
        break;

      case 's':
      case 'S':
        while (++cont < 50 && !this.paused && Number(this.player1Paddle.rect.y) < min_height - this.player1Paddle.rect.height)
          this.player1Paddle.position += PADDLE_SPEED;
        break;

      case 'ArrowUp':
        while (++cont < 50 && !this.paused && this.player2Paddle && Number(this.player2Paddle.rect.y) > max_height)
          this.player2Paddle.position -= PADDLE_SPEED;
        // if (!this.paused && this.computerPaddle && Number(this.player1Paddle.rect.y) > 155)
        // this.player1Paddle.position -= PADDLE_SPEED;
        break;

      case 'ArrowDown':
        while (++cont < 50 && !this.paused && this.player2Paddle && Number(this.player2Paddle.rect.y) < min_height - this.player2Paddle.rect.height)
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

      if (this.player2Paddle)
        this.ball.update(delta, [this.player1Paddle.rect, this.player2Paddle.rect]);

      if (this.computerPaddle) {
        this.ball.update(delta, [this.player1Paddle.rect, this.computerPaddle.rect]);
        if (Number(this.ball.y) > 15 && Number(this.ball.y) < 85)
          this.computerPaddle.update(delta, this.ball.y)
      }
    }
    if (this.powerUpMode) {
      if (this.initHeight != window.innerHeight) {
        this.powerup.update();
        this.initHeight = window.innerHeight;
      }
      // if (time - this.powerup.time > 5000) {
      if (time - this.powerup.time > 1) {
        this.powerup.display();
      }
      if (this.powerup.bg_color != 'black' && this.powerup.isCollision(this.ball.rect())) {
        this.powerup.collided(time);
      }
    }

    if (this.isLose()) {
      this.handleLose();
    }

    this.lastTime = time;
    this.currentAnimationFrameId = window.requestAnimationFrame(this.update.bind(this));
    if (this.player1Score == MAX_SCORE || this.player2Score == MAX_SCORE)
      this.finish();
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
}

// https://www.youtube.com/watch?v=PeY6lXPrPaA