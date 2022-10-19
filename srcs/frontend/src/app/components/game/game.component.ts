import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  menu: boolean = true;
  paused: boolean = false;

  mode: string = '';

  public ngOnInit() {
  }

  startGame(mode: string) {
    this.mode = mode;
    console.log(this.mode)
    this.menu = false;
  }
}