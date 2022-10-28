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

  getFinalMessage(disconnected: any): string {
    if (disconnected) {
      if (game.player1.socket == disconnected)
        return 'Player2 won by abandonment'
      else if (game.player1.socket == disconnected)
        return 'Player1 won by abandonment'
    }
    if (game.player1.score > game.player2.score)
      return 'Player1 Won';
    else
      return 'Player2 Won';
  }

  // getScore() {
  //   return [game.player1.score, game.player2.score]
  // }
}
