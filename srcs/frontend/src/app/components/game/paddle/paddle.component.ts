import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';

export const COMPUTER_SPEED = 0.5

@Component({
  selector: 'app-paddle',
  templateUrl: './paddle.component.html',
  styleUrls: ['./paddle.component.scss']
})
export class PaddleComponent implements OnInit, AfterViewChecked {

  paddleElem!: HTMLElement;
  @Input() name!: 'player1' | 'player2' | 'computer';
  @Input() side!: 'left' | 'right';
  hasReset = false;

  constructor() { }

  ngAfterViewChecked(): void {
    let paddleElem = document.getElementById(`${this.name}-paddle`);
    if (paddleElem) {
      this.paddleElem = paddleElem;
      if (!this.hasReset) {
        this.hasReset = true;
        this.reset();
      }
    }
  }

  ngOnInit(): void { }

  get position() {
    return parseFloat(getComputedStyle(this.paddleElem).getPropertyValue("--paddle-position"))
  }

  set position(value: number) {
    this.paddleElem.style.setProperty("--paddle-position", value.toString());
  }

  update(delta: number, ballHeight: number, table: DOMRect) {
    let direction = Math.round(ballHeight - this.position);
    if (this.name === 'computer') {
      if (this.rect.top > table.top && this.rect.bottom < table.bottom)
        this.position += COMPUTER_SPEED * direction;
      if (this.rect.top < table.top || this.rect.bottom > table.bottom)
        this.position -= COMPUTER_SPEED * direction;;
    }
  }

  reset() {
    this.position = 50;
    this.height = 20;
  }

  get rect() {
    return this.paddleElem.getBoundingClientRect();
  }

  get height() {
    return parseFloat(getComputedStyle(this.paddleElem).getPropertyValue("--paddle-size"))
  }

  set height(value: number) {
    this.paddleElem.style.setProperty("--paddle-size", value.toString());
  }


}