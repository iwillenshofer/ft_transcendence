import { Game } from './game';
import { UseGuards } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TfaGuard } from 'src/auth/tfa/tfa.guard';

@WebSocketGateway({ cors: '*:*', namespace: 'game' })
export class GameGateway {

  @WebSocketServer()
  server: Server;

  player1: any;
  player2: any;
  games: Game[] = [];

  @SubscribeMessage('liveGames')
  liveGames(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    let liveGames: Game[] = [];
    this.games.forEach(game => {
      if (!game.finished)
        liveGames.push(game);
    });
    this.server.to(client.id).emit("games", liveGames);
    liveGames.length = 0;
  }

  @SubscribeMessage('watchGame')
  watchGame(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    this.setPlayers(client, data);
  }

  @SubscribeMessage('joinGame')
  joinGame(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    let customGame = data;
    let gameIndex = this.checkGameArray(customGame);
    this.setPlayers(client, gameIndex);
  }

  checkGameArray(customGame: string) {
    if (this.games.length > 0) {
      for (let index = 0; index < this.games.length; index++) {
        if (this.games[index].isCustom === customGame) {
          if (this.games[index].player1.socket == '' || this.games[index].player2.socket == '') {
            return index;
          }
        }
      };
    }
    this.games.push(new Game(this.games.length.toString(), customGame));
    return this.games.length - 1;
  }

  setPlayers(client, gameIndex) {
    const game = this.games[gameIndex]
    if (!game.player1.socket) {
      game.player1.socket = client.id;
      console.log('player1 connected')
    }
    else if (!game.player2.socket) {
      game.player2.socket = client.id;
      console.log('player2 connected')
    }
    client.join(game.gameID)
    if (game.player1.socket && game.player2.socket)
      this.server.to(game.gameID).emit("players", game.player1.socket, game.player2.socket, game.gameID);
  }

  @SubscribeMessage('randomBall')
  ballDirectionX(@MessageBody() data: string, @ConnectedSocket() client: Socket,) {
    let gameID = data[0];
    let ball = data[1];
    let ballDir = data[2];
    this.server.to(gameID).emit("ball", ball, ballDir);
  }

  @SubscribeMessage('move')
  move(@MessageBody() data: string, @ConnectedSocket() client: Socket,) {
    let gameID = data[0];
    let game = this.games[gameID];
    game.player1 = data[1];
    game.player2 = data[2];
    let command = data[3];
    let player: any;
    if (client.id == game.player1.socket)
      player = game.player1;
    else if (client.id == game.player2.socket)
      player = game.player2;
    switch (command) {
      case "up":
        if (player.y > 0) {
          player.y -= 30;
          this.server.to(gameID).emit("updatePaddle", game.player1, game.player2);
        }
        break;
      case "down":
        if (player.y < (720 - player.height))
          player.y += 30;
        this.server.to(gameID).emit("updatePaddle", game.player1, game.player2);
        break;
    }
  }

  @UseGuards(TfaGuard)
  handleDisconnect(client: Socket, ...args: any[]) {
    const gameID = this.findGameBySocketId(client.id);
    const game = this.games[gameID]
    if (game && (client.id == game.player1.socket || client.id == game.player2.socket)) {
      this.server.to(gameID.toString()).emit("endGame");
      if (client.id == game.player1.socket && !game.player2.socket) {
        game.player1.socket = null;
        delete this.games[game.gameID];
        this.games.splice(Number(game.gameID), 1);
      }
      if (client.id == game.player1.socket)
        game.player1.socket = null;
      else
        game.player2.socket = null;
      if (!game.player1.socket && !game.player2.socket) {
        delete this.games[gameID];
        this.games.splice(Number(gameID), 1);
      }
    }
  }

  findGameBySocketId(socketID: string) {
    for (let index = 0; index < this.games.length; index++) {
      let game = this.games[index];
      if (game.player1.socket == socketID || game.player2.socket == socketID)
        return (index);
    }
  }

  @SubscribeMessage('score')
  score(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    let gameID = data[0];
    let scoreP1 = data[1];
    let scoreP2 = data[2];
    let finished = data[3];
    this.games[gameID].finished = finished;
    this.server.to(gameID).emit("updateScore", scoreP1, scoreP2, finished);
  }

  @SubscribeMessage('powerUp')
  powerUp(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    let gameID = data[0];
    let powerUp = data[1];
    this.server.to(gameID).emit("updatePowerUp", powerUp);
  }

  // @SubscribeMessage('gameUpdate')
  // update(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
  //   let gameID = data;
  //   const game = this.games[gameID];
  //   // this.server.to(gameID).emit("draw", game.ball, game.player1, game.player2, game.powerUp);
  //   // this.server.to(gameID).emit("score", game.player1, game.player2, game.finished);
  // }
}


/*
      https://www.youtube.com/watch?app=desktop&v=atbdpX4CViM
      https://nest-ionic-examples.github.io/01-simple-chat/
      https://www.digitalocean.com/community/tutorials/angular-socket-io
      https://www.thepolyglotdeveloper.com/2019/04/using-socketio-create-multiplayer-game-angular-nodejs/
      https://docs.nestjs.com/websockets/gateways
      https://socket.io/docs/v4/typescript/
*/