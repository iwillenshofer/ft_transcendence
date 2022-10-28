import { Injectable } from '@angular/core';
import * as game from './game'
@Injectable({
  providedIn: 'root'
})
export class OnlineGameService {

  constructor() { }

  getBall() {
    return game.ball;
  }

  getPowerUp() {
    return game.powerUp;
  }

  getPlayer1() {
    return game.player1;
  }

  getPlayer2() {
    return game.player2;
  }

  setP1Socket(socket: any) {
    game.setP1Socket(socket);
  }

  setP2Socket(socket: any) {
    game.setP2Socket(socket);
  }

  setP1Username(username: any) {
    game.setP1Username(username);
  }

  setP2Username(username: any) {
    game.setP2Username(username);
  }

  run() {
    game.update();
  }

  reset() {
    game.gameStart();
  }

  setGameID(gameID: any) {
    game.setGameID(gameID)
  }

  setGameSocket(socket: any) {
    game.setGameSocket(socket)
  }

  setMode(mode: any) {
    game.setMode(mode);
  }

  setCustom(custom: boolean) {
    game.setCustom(custom);
  }

  getFinalMessage(reason: any, disconnected: any): string {
    if (reason == 'down')
      return 'Server is off'
    if (reason == 'disconnect') {
      if (game.player1.socket == disconnected)
        return game.player2.username + '\nwon';
      else if (game.player2.socket == disconnected)
        return game.player1.username + '\nwon';
    }
    if (game.player1.score > game.player2.score)
      return game.player1.username + '\nwon';
    else
      return game.player2.username + '\nwon';
  }

  // getScore() {
  //   return [game.player1.score, game.player2.score]
  // }
}
