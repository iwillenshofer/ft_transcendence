import { Component, OnInit } from '@angular/core';

export const INITIAL_VELOCITY = .025

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

  update(delta: number) {
    this.x += this.direction.x * this.velocity * delta;
    this.y += this.direction.y * this.velocity * delta;
    const rect = this.rect()

    if (rect.bottom >= window.innerHeight || rect.top <= 102) {
      this.direction.y *= -1;
    }
    if (rect.right >= window.innerWidth || rect.left <= 0) {
      this.direction.x *= -1;
    }
  }

  reset() {
    this.x = 50;
    this.y = 50;
    this.direction = { x: 0.75, y: 0.5 };
    while (Math.abs(this.direction.x) <= 0.2 || Math.abs(this.direction.x) >= 0.9) {
      const heading = Math.random() % (2 * Math.PI);
      console.log(heading)
      this.direction = { x: Math.cos(heading), y: Math.sin(heading) };
    }
    this.velocity = INITIAL_VELOCITY;
  }

  rect() {
    return this.ballElem.getBoundingClientRect()
  }
}
