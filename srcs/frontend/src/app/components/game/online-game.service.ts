import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OnlineGameService {

  challenged: any;
  powerUps: any;

  constructor() { }

  challenge(username: any) {
    this.challenged = username;
  }

  togglePowerUps(powerUps: any) {
    this.powerUps = powerUps;
  }
}
