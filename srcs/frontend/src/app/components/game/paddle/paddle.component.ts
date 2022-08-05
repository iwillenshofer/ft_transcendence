import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';

export const COMPUTER_SPEED = 0.02

@Component({
  selector: 'app-paddle',
  templateUrl: './paddle.component.html',
  styleUrls: ['./paddle.component.scss']
})
export class PaddleComponent implements OnInit, AfterViewChecked {

  PaddleElem!: HTMLElement;
  @Input() name!: 'player1' | 'player2' | 'computer';
  @Input() side!: 'left' | 'right';
  hasReset = false;

  constructor() { }

  ngAfterViewChecked(): void {
    let PaddleElem = document.getElementById(`${this.name}-paddle`);
    if (PaddleElem) {
      this.PaddleElem = PaddleElem;
      if (!this.hasReset) {
        this.hasReset = true;
        this.reset();
      }
    }
  }

  ngOnInit(): void { }

  get position() {
    return parseFloat(getComputedStyle(this.PaddleElem).getPropertyValue("--paddle-position"))
  }

  set position(value: number) {
    this.PaddleElem.style.setProperty("--paddle-position", value.toString());
  }

  update(delta: number, ballHeight: number) {
    if (this.name === 'computer')
      this.position += COMPUTER_SPEED * delta * (ballHeight - this.position);
  }

  reset() {
    this.position = 50;
  }

  get rect() {
    return this.PaddleElem.getBoundingClientRect();
  }
}
