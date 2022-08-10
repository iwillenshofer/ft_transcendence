import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-powerup',
  templateUrl: './powerup.component.html',
  styleUrls: ['./powerup.component.scss']
})
export class PowerupComponent implements OnInit {

  powerElem!: HTMLElement;
  time: number = 1;
  effect: number = 1;

  constructor() { }

  ngOnInit(): void {
    let powerElem = document.getElementById('powerup');
    if (powerElem) {
      this.powerElem = powerElem;
      this.update();
    }
  }

  update() {
    this.x = this.randomNumberBetween(10, 90);
    //rect.bottom >= (window.innerHeight - 5) || rect.top <= 104
    this.y = this.randomNumberBetween(105, window.innerHeight - this.rect().height - 5);
  }

  rect() {
    return this.powerElem.getBoundingClientRect()
  }

  get x() {
    return parseFloat(getComputedStyle(this.powerElem).getPropertyValue("--x"))
  }

  set x(value: number) {
    this.powerElem.style.setProperty("--x", value.toString());
  }

  get y() {
    return parseFloat(
      getComputedStyle(this.powerElem).getPropertyValue('--y')
    );
  }

  set y(value: number) {
    this.powerElem.style.setProperty("--y", value.toString());
  }

  get bg_color() {
    return getComputedStyle(this.powerElem).getPropertyValue('--bg-color');
  }

  set bg_color(value: string) {
    this.powerElem.style.setProperty("--bg-color", value.toString());
  }

  isCollision(rect: DOMRect) {
    let powerRect = this.rect()
    return powerRect.left <= rect.right && powerRect.right >= rect.left && powerRect.top <= rect.bottom && powerRect.bottom >= rect.top;
  }

  randomNumberBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  collided(time: number) {
    let color = this.bg_color;
    console.log(color);
    this.bg_color = 'black';
    this.update();
    this.time = time;
  }

  display() {
    if (this.effect > 0 && this.effect <= 33)
      this.bg_color = 'blue';
    // this.effect = 'fast'

    if (this.effect > 33 && this.effect <= 66)
      this.bg_color = 'green';
    // this.effect = 'bigger'
    if (this.effect > 66 && this.effect <= 100)
      this.bg_color = 'red';
    // this.effect = 'small'
    if (this.effect == 100)
      this.effect = 1;
    else
      this.effect++;
  }
}
