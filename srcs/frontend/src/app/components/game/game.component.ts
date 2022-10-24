import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox'

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  menu: boolean = true;
  paused: boolean = false;
  mode: string = '';
  powerUps: boolean = false;

  public ngOnInit() {
  }

  startGame(mode: string) {
    this.mode = mode;
    this.menu = false;
  }

  togglePowerUps() {
    this.powerUps = !this.powerUps;
  }
}