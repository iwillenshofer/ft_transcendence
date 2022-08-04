import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-paddle',
  templateUrl: './paddle.component.html',
  styleUrls: ['./paddle.component.scss']
})
export class PaddleComponent implements OnInit {

  @Input() name!: 'player1' | 'player2';
  @Input() side!: 'left' | 'right';

  constructor() { }

  ngOnInit(): void {
  }

}
