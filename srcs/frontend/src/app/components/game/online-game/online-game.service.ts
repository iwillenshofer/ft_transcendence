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

  run() {
    game.update();
  }

  reset() {
    game.gameStart();
  }

  isP1(socket: any) {
    if (socket == game.player1.socket)
      game.f_isP1(true);
    else
      game.f_isP1(false);
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

  // getScore() {
  //   return [game.player1.score, game.player2.score]
  // }
}
