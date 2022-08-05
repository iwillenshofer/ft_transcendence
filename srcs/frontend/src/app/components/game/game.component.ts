import { PaddleComponent } from './paddle/paddle.component';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { BallComponent } from './ball/ball.component';

export const PADDLE_SPEED = 4.2;

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
        console.log("Pause")
        break;

      case 'w':
      case 'W':
        if (Number(this.player1Paddle.rect.y) > 106)
          this.player1Paddle.position -= PADDLE_SPEED;
        break;

      case 's':
      case 'S':
        if (Number(this.player1Paddle.rect.y) < 689)
          this.player1Paddle.position += PADDLE_SPEED;
        break;

      case 'ArrowUp':
        if (this.player2Paddle && Number(this.player2Paddle.rect.y) > 106)
          this.player2Paddle.position -= PADDLE_SPEED;
        break;

      case 'ArrowDown':
        if (this.player2Paddle && Number(this.player2Paddle.rect.y) < 689)
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
        this.ball.update(delta, [this.player1Paddle.rect, this.computerPaddle]);
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
}

// https://www.youtube.com/watch?v=PeY6lXPrPaA