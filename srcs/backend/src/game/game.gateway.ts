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

  @SubscribeMessage('joinGame')
  joinGame(client: Socket) {
    let gameIndex = this.checkGameArray();
    this.setPlayers(client, gameIndex);
  }

  checkGameArray() {
    if (this.games.length > 0) {
      for (let index = 0; index < this.games.length; index++) {
        if (this.games[index].player1.socket == '' || this.games[index].player2.socket == '') {
          return index;
        }
      };
    }
    this.games.push(new Game(this.games.length.toString()));
    return this.games.length - 1;
  }

  setPlayers(client, gameIndex) {
    const game = this.games[gameIndex]
    if (!game.player1.socket) {
      game.player1.socket = client.id;
      client.join(game.gameID);
      console.log('player1 connected')
    }
    else if (!game.player2.socket) {
      game.player2.socket = client.id;
      console.log('player2 connected')
      client.join(game.gameID)
      game.gameStart();
      this.server.to(game.gameID).emit("players", game.player1, game.player2, game.gameID);
    }
    else {
      console.log('spec')
      client.join(game.gameID)
    }
  }

  @SubscribeMessage('move')
  move(@MessageBody() data: string, @ConnectedSocket() client: Socket,) {
    console.log(data)
    let gameID = data[0];
    let command = data[1];
    let player;
    if (client.id == this.games[gameID].player1.socket) {
      player = this.games[gameID].player1;
    }
    else if (client.id == this.games[gameID].player2.socket) {
      player = this.games[gameID].player2;
    }
    this.games[gameID].move(player, command);
  }

  @UseGuards(TfaGuard)
  handleDisconnect(client: Socket, ...args: any[]) {
    // if (client.id == this.player1) {
    //   this.player1 = null;
    //   // console.log('player1 disconnected')
    //   this.resetPlayersPosition();
    // }
    // else if (client.id == this.player2) {
    //   this.player2 = null;
    //   // console.log('player2 disconnected')
    //   this.resetPlayersPosition();
    // }
  }

  lastTime!: number;

  @SubscribeMessage('gameUpdate')
  update(@MessageBody() data: string, @ConnectedSocket() client: Socket,) {
    let gameID = data[0];
    let time = data[1];
    const game = this.games[gameID];
    if (this.lastTime) {
      game.ballUpdate(time);
      this.server.to(gameID).emit("draw", game.ball, game.player1, game.player2);
    }
    if (game.isLose()) {
      game.handleLose();
    }
    this.server.to(gameID).emit("score", game.player1, game.player2, game.finished);
    this.lastTime = Number(time);
  }
}


/*
      https://www.youtube.com/watch?app=desktop&v=atbdpX4CViM
      https://nest-ionic-examples.github.io/01-simple-chat/
      https://www.digitalocean.com/community/tutorials/angular-socket-io
      https://www.thepolyglotdeveloper.com/2019/04/using-socketio-create-multiplayer-game-angular-nodejs/
      https://docs.nestjs.com/websockets/gateways
      https://socket.io/docs/v4/typescript/
*/