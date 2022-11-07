import { Component, OnInit } from '@angular/core';
import io from "socket.io-client";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  private socket: any;
  menu: boolean = true;
  paused: boolean = false;
  mode: string = '';
  powerUps: boolean = false;
  showLiveGames: boolean = false;
  liveGames: any;
  toWatch: any;

  public ngOnInit() {
  }

  startGame(mode: string) {
    this.mode = mode;
    this.menu = false;
  }

  togglePowerUps() {
    this.powerUps = !this.powerUps;
  }

  toggleLiveGames() {
    this.showLiveGames = true;
    this.socket = io("http://localhost:3000/game");
    this.socket.emit("liveGames");
    this.socket.on("games", (games: any) => {
      if (games.length > 0)
        this.liveGames = games;
    });
  }

  toggleInstructions() {
    this.showLiveGames = false;
  }

  watchGame(player1: any) {
    this.menu = false;
    this.mode = 'spec';
    this.toWatch = player1;
    console.log(player1);
  }

  quit(event: boolean) {
    this.menu = true;
    this.mode = 'quit';
  }
}