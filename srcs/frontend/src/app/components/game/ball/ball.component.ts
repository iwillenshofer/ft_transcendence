import { Component, OnInit } from '@angular/core';

export const INITIAL_VELOCITY = .025
export const VELOCITY_INCREASE = 0.000005

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss']
})
export class BallComponent implements OnInit {

  ballElem!: HTMLElement;
  direction: { x: number; y: number } = { x: 0.0, y: 0.0 };

  velocity: number = INITIAL_VELOCITY;

  constructor() { }

  ngOnInit(): void {
    let ballElem = document.getElementById('ball');
    if (ballElem) {
      this.ballElem = ballElem;
      this.reset();
    }
  }

  get x() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"))
  }

  set x(value: number) {
    this.ballElem.style.setProperty("--x", value.toString());
  }

  get y() {
    return parseFloat(
      getComputedStyle(this.ballElem).getPropertyValue('--y')
    );
  }

  set y(value: number) {
    this.ballElem.style.setProperty("--y", value.toString());
  }

  update(delta: number, paddleRects: any[]) {
    this.x += this.direction.x * this.velocity * delta;
    this.y += this.direction.y * this.velocity * delta;
    this.velocity += VELOCITY_INCREASE * delta;
    const rect = this.rect()

    if (rect.bottom >= (window.innerHeight - 5) || rect.top <= 104) {
      this.direction.y *= -1;
    }

    if (paddleRects.some(r => this.isCollision(r, rect))) {
      this.direction.x *= -1;
    }
  }

  reset() {
    this.x = 50;
    this.y = 50;
    this.direction = { x: 0, y: 0 };
    while (Math.abs(this.direction.x) <= 0.2 || Math.abs(this.direction.x) >= 0.9) {
      const heading = this.randomNumberBetween(0, 2 * Math.PI);
      this.direction = { x: Math.cos(heading), y: Math.sin(heading) };
    }
    this.velocity = INITIAL_VELOCITY;
  }

  randomNumberBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }


  rect() {
    return this.ballElem.getBoundingClientRect()
  }

  isCollision(rect1: DOMRect, rect2: DOMRect) {
    return Math.ceil(rect1.left) <= Math.floor(rect2.right) && Math.ceil(rect1.right) >= Math.floor(rect2.left) && Math.ceil(rect1.top) <= Math.floor(rect2.bottom) && Math.ceil(rect1.bottom) >= Math.floor(rect2.top);
  }
}
