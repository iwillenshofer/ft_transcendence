import { Component, OnInit, ViewChild } from '@angular/core';
import { BallComponent } from './ball/ball.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  lastTime!: number;
  currentAnimationFrameId?: number;


  constructor() { }

  @ViewChild(BallComponent) ball!: BallComponent;

  ngOnInit(): void {
    // this.update(0);
  }
  ngAfterViewInit(): void {
    this.update(0);
  }

  update(time: number) {
    if (this.lastTime) {
      const delta = time - this.lastTime;
      this.ball.update(delta);
    }
    this.lastTime = time;
    this.currentAnimationFrameId = window.requestAnimationFrame(this.update.bind(this));
  }
}

// https://www.youtube.com/watch?v=PeY6lXPrPaA