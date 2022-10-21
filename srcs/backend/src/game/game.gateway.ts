import { UseGuards } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TfaGuard } from 'src/auth/tfa/tfa.guard';

@WebSocketGateway({ cors: '*:*' })
export class GameGateway {

  @WebSocketServer()
  server: Server;

  player1: any;
  positionP1 = {
    x: 0,
    y: 0,
  };
  player2: any;
  positionP2 = {
    x: 0,
    y: 0,
  };

  @SubscribeMessage('joinGame')
  joinGame(client: Socket) {
    this.setPlayers(client.id);
    this.server.emit("players", this.player1, this.player2);
    this.server.emit("position", this.positionP1, this.positionP2);
  }

  @SubscribeMessage('move')
  move(client: Socket, command: string) {
    let position;
    if (client.id == this.player1) {
      position = this.positionP1;
    }
    if (client.id == this.player2) {
      position = this.positionP2;
    }
    if (client.id == this.player1 || client.id == this.player2) {
      switch (command) {
        case "up":
          if (position.y > 0)
            position.y -= 5;
          this.server.emit("position", this.positionP1, this.positionP2);
          break;
        case "down":
          if (position.y < 400)
            position.y += 5;
          this.server.emit("position", this.positionP1, this.positionP2);
          break;
      }
    }
  }

  @UseGuards(TfaGuard)
  handleDisconnect(client: Socket, ...args: any[]) {
    if (client.id == this.player1) {
      this.player1 = null;
      console.log('player1 disconnected')
      this.resetPlayersPosition();
    }
    else if (client.id == this.player2) {
      this.player2 = null;
      console.log('player2 disconnected')
      this.resetPlayersPosition();
    }
  }

  setPlayers(clientId) {
    if (!this.player1) {
      this.player1 = clientId;
      console.log('player1 connected')
    }
    else if (!this.player2) {
      this.player2 = clientId;
      console.log('player2 connected')
      this.resetPlayersPosition();
    }
    else {
      console.log('spec')
    }
  }

  resetPlayersPosition() {
    this.positionP1.x = 20;
    this.positionP1.y = 200;
    this.positionP2.x = 535;
    this.positionP2.y = 200;
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