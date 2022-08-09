import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-powerup',
  templateUrl: './powerup.component.html',
  styleUrls: ['./powerup.component.scss']
})
export class PowerupComponent implements OnInit {

  powerElem!: HTMLElement;
  showPowerUp: boolean = false;

  constructor() { }

  ngOnInit(): void {
    let powerElem = document.getElementById('powerup');
    if (powerElem) {
      this.powerElem = powerElem;
    }
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

  isCollision(rect: DOMRect) {
    let powerRect = this.rect()
    return powerRect.left <= rect.right && powerRect.right >= rect.left && powerRect.top <= rect.bottom && powerRect.bottom >= rect.top;
  }
}
