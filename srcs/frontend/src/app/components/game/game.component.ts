import { PaddleComponent } from './paddle/paddle.component';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { BallComponent } from './ball/ball.component';

export const PADDLE_SPEED = 8;

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

  constructor() { }

  @ViewChild(BallComponent) ball!: BallComponent;
  @ViewChild('player1') player1Paddle!: PaddleComponent;
  @ViewChild('player2') player2Paddle!: PaddleComponent;
  @ViewChild('computer') computerPaddle!: PaddleComponent;


  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape':
      case 'p':
      case 'P':
        this.pause();
        break;

      case 'w':
      case 'W':
        if (!this.paused && Number(this.player1Paddle.rect.y) > 155)
          this.player1Paddle.position -= PADDLE_SPEED;
        break;

      case 's':
      case 'S':
        if (!this.paused && Number(this.player1Paddle.rect.y) < 600)
          this.player1Paddle.position += PADDLE_SPEED;
        break;

      case 'ArrowUp':
        if (!this.paused && this.player2Paddle && Number(this.player2Paddle.rect.y) > 155)
          this.player2Paddle.position -= PADDLE_SPEED;
        break;

      case 'ArrowDown':
        if (!this.paused && this.player2Paddle && Number(this.player2Paddle.rect.y) < 600)
          this.player2Paddle.position += PADDLE_SPEED;
        break;

      default:
        console.log(event.key)
        break;
    }
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.update(0);
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

      if (this.isLose()) {
        this.handleLose();
      }
    }

    this.lastTime = time;
    this.currentAnimationFrameId = window.requestAnimationFrame(this.update.bind(this));
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
}

// https://www.youtube.com/watch?v=PeY6lXPrPaA