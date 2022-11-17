import { OnlineGameService } from './online-game.service';
import { Component, OnChanges, OnInit } from '@angular/core';
import io from "socket.io-client";
import { AuthService } from 'src/app/auth/auth.service';
import { AlertsService } from 'src/app/alerts/alerts.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  private socket: any;
  menu: boolean = true;
  cmenu: boolean = false;
  paused: boolean = false;
  mode: string = '';
  powerUps: boolean = false;
  showLiveGames: boolean = false;
  liveGames: any;
  toWatch: any;
  challenged: string = "";

  constructor(protected gameService: OnlineGameService, private auth: AuthService, private alert: AlertsService) { }

  ngOnDestroy() {
    this.gameService.challenged = null;
  }

  public async ngOnInit() {
    if (this.gameService.challenged) {
      this.cmenu = true;
      this.challenged = this.gameService.challenged;
      this.powerUps = this.gameService.powerUps;
      let username;
      await this.auth.getUser().then(data => {
        username = data.username;
      });
      if (username == this.challenged) {
        this.startGame('friend')
        this.alert.clear()
      }
    }
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
    this.liveGames = undefined;
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
  }

  quit(event: boolean) {
    this.menu = true;
    this.mode = 'quit';
  }
}