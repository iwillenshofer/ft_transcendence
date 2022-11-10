import { GameService } from './game.service';
import { Game } from './game';
import { UseGuards } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TfaGuard } from 'src/auth/tfa/tfa.guard';
import { randomInt } from 'crypto';

@WebSocketGateway({ cors: '*:*', namespace: 'game' })
export class GameGateway {

  constructor(private gameService: GameService) { }

  @WebSocketServer()
  server: Server;

  player1: any;
  player2: any;
  games: Game[] = [];

  @SubscribeMessage('inGame')
  async isInGame(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    let username = data;
    let res = false;
    this.games.forEach(game => {
      if (!game.finished && (game.player1.username === username || game.player2.username === username))
        res = true;
    });
    this.server.to(client.id).emit("friends", res);
  }

  @SubscribeMessage('liveGames')
  async liveGames(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    let liveGames: Game[] = [];
    this.games.forEach(game => {
      if (!game.finished && game.connected >= 2)
        liveGames.push(game);
    });
    this.server.to(client.id).emit("games", liveGames);
    liveGames.length = 0;
  }

  @SubscribeMessage('watchGame')
  async watchGame(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    const game = this.findGameBySocketId(data);
    if (game) {
      game.connected += 1;
      client.join(game.gameID)
      client.rooms.add(game.gameID)
      this.server.to(game.gameID).emit("specs", game.player1, game.player2);
    }
    else
      this.server.to(client.id).emit("gameUnavailable");
  }

  @SubscribeMessage('joinGame')
  async joinGame(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    let customGame = data[0];
    let username = data[1];
    const gameID = this.checkGameArray(customGame);
    this.setPlayers(client, gameID, username);
  }

  checkGameArray(customGame: string) {
    if (this.games.length > 0) {
      for (let index = 0; index < this.games.length; index++) {
        let game = this.games[index];
        if (game && game.isCustom === customGame) {
          if (game.player1.socket == '' || game.player2.socket == '') {
            return game.gameID;
          }
        }
      };
    }
    let gameID = this.checkGameID(randomInt(1024).toString());
    this.games.push(new Game(gameID, customGame));
    return gameID;
  }

  checkGameID(id: string) {
    for (let index = 0; index < this.games.length; index++) {
      let game = this.games[index];
      if (game && game.gameID === id) {
        id = (Number(id) + 1).toString();
        index = 0;
      }
    }
    return id;
  }

  setPlayers(client, gameID, username) {
    const game = this.findGameByGameId(gameID);
    if (game) {
      if (!game.player1.socket) {
        game.player1.socket = client.id;
        game.player1.username = username;
      }
      else if (!game.player2.socket) {
        game.player2.socket = client.id;
        game.player2.username = username;
      }
      client.join(game.gameID)
      client.rooms.add(game.gameID)
      game.connected += 1;
      if (game.player1.socket && game.player2.socket) {
        if (client.id == game.player1.socket || client.id == game.player2.socket)
          this.server.to(game.gameID).emit("players", game.player1, game.player2);
      }
    }
  }

  findGameByGameId(gameID) {
    for (let index = 0; index < this.games.length; index++) {
      let game = this.games[index];
      if (game && game.gameID === gameID)
        return (game);
    }
  }

  @SubscribeMessage('setPaddles')
  async setPaddles(@MessageBody() data: string, @ConnectedSocket() client: Socket,) {
    const game = this.findGameBySocketId(client.id);
    if (game) {
      if (this.isPlayer1(game.gameID, client.id)) {
        game.player1.height = Number(data[0]);
        game.player2.height = Number(data[1]);
      }
      this.server.to(game.gameID).emit('updatePaddle', game.player1, game.player2)
    }
  }

  @SubscribeMessage('resetPaddles')
  async resetPaddles(@MessageBody() data: string, @ConnectedSocket() client: Socket,) {
    const game = this.findGameBySocketId(client.id);
    if (game) {
      let player1 = game.player1;
      let player2 = game.player2;
      player1.y = 360 - (player1.height / 2);
      player1.x = 20;
      player2.y = 360 - (player2.height / 2);
      player2.x = 1250;
      player1.height = 150;
      player2.height = 150;
      this.server.to(game.gameID).emit('updatePaddle', player1, player2)
    }
  }

  @SubscribeMessage('syncBall')
  async syncBall(@MessageBody() data: string, @ConnectedSocket() client: Socket,) {
    const game = this.findGameBySocketId(client.id);
    if (game && this.isPlayer1(game.gameID, client.id)) {
      game.ball = data;
      this.server.to(game.gameID).emit("ball", game.ball);
      this.server.to(game.gameID).emit("updateScore", game.player1.score, game.player2.score, game.finished);
    }
  }

  @SubscribeMessage('move')
  async move(@MessageBody() data: string, @ConnectedSocket() client: Socket,) {
    const game = this.findGameBySocketId(client.id);
    if (game) {
      let command = data;
      let player: any;
      if (client.id == game.player1.socket)
        player = game.player1;
      else if (client.id == game.player2.socket)
        player = game.player2;
      switch (command) {
        case "up":
          if (player.y > 0) {
            player.y -= 30;
            this.server.to(game.gameID).emit("updatePaddle", game.player1, game.player2);
          }
          break;
        case "down":
          if (player.y < (720 - player.height))
            player.y += 30;
          this.server.to(game.gameID).emit("updatePaddle", game.player1, game.player2);
          break;
      }
    }
  }

  @UseGuards(TfaGuard)
  async handleDisconnect(client: Socket, ...args: any[]) {
    const game = this.findGameBySocketId(client.id);
    if (game) {
      const gameID = game.gameID;
      game.connected -= 1;
      if (client.id == game.player1.socket || client.id == game.player2.socket) {
        this.server.to(gameID).emit("endGame", client.id);
        if (client.id == game.player1.socket && !game.player2.socket) {
          this.deleteGameById(gameID)
        }
        else if (client.id == game.player1.socket) {
          game.player1.disconnected = true;
          await this.gameService.addGame(game)
        }
        else if (client.id == game.player2.socket) {
          game.player2.disconnected = true;
        }
      }
      if (game.player1.disconnected && game.player2.disconnected) {
        this.server.in(gameID).disconnectSockets();
        this.deleteGameById(gameID);
      }
    }
  }

  deleteGameById(gameID: string) {
    for (let index = 0; index < this.games.length; index++) {
      let game = this.games[index];
      if (game && game.gameID == gameID) {
        delete this.games[index];
        this.games.splice(index, 1);
      }
    }
  }

  findGameBySocketId(socketID: string) {
    for (let index = 0; index < this.games.length; index++) {
      let game = this.games[index];
      if (game && (game.player1.socket == socketID || game.player2.socket == socketID))
        return (game);
    }
  }

  @SubscribeMessage('score')
  async score(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    const game = this.findGameBySocketId(client.id);
    if (game && this.isPlayer1(game.gameID, client.id)) {
      let scoreP1 = data[0];
      let scoreP2 = data[1];
      let finished = data[2];
      game.finished = Boolean(finished);
      game.player1.score = Number(scoreP1);
      game.player2.score = Number(scoreP2);
      this.server.to(game.gameID).emit("updateScore", scoreP1, scoreP2, finished);
    }
  }

  @SubscribeMessage('powerUp')
  async powerUp(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    const game = this.findGameBySocketId(client.id);
    if (game && this.isPlayer1(game.gameID, client.id)) {
      game.powerUp = data;
      this.server.to(game.gameID).emit("updatePowerUp", game.powerUp);
    }
  }

  @SubscribeMessage('finishMessage')
  async finishMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    const game = this.findGameBySocketId(client.id);
    if (game) {
      if (data[1] == '1')
        game.winner = game.player1;
      else if (data[1] == '2')
        game.winner = game.player2;
      else
        game.winner = null;
      this.server.to(game.gameID).emit("winner", data[0]);
    }
  }

  isPlayer1(gameID: string, id: any) {
    const game = this.findGameBySocketId(id);
    if (game && game.player1 && id == game.player1.socket)
      return true;
    return false;
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