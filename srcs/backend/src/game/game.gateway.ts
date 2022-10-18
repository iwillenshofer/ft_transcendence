import { UseGuards } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TfaGuard } from 'src/auth/tfa/tfa.guard';

@WebSocketGateway({ cors: '*:*' })
export class GameGateway {

  @WebSocketServer()
  server: Server;

  positionP1 = {
    x: 50,
    y: 200,
  };

  positionP2 = {
    x: 500,
    y: 200,
  };

  player1: any = null;
  player2: any = null;

  @SubscribeMessage('joinGame')
  joinGame(client: Socket) {
    if (!this.player1) {
      this.player1 = client.id;
      console.log('player1 connected')
    }
    else if (!this.player2) {
      this.player2 = client.id;
      console.log('player2 connected')
    }
    else {
      console.log('player3?')
    }
    this.server.emit("position", this.positionP1, this.positionP2);
  }

  @SubscribeMessage('move')
  move(client: Socket, command: string) {
    let position = this.positionP2;
    if (client.id == this.player1) {
      position = this.positionP1;
    }
    // console.log(client.id, this.player1, this.player2);
    switch (command) {
      case "up":
        position.y -= 5;
        this.server.emit("position", this.positionP1, this.positionP2);
        break;
      case "down":
        position.y += 5;
        this.server.emit("position", this.positionP1, this.positionP2);
        break;
    }
  }

  @UseGuards(TfaGuard)
  handleDisconnect(client: Socket, ...args: any[]) {
    if (client.id == this.player1) {
      this.player1 = null;
      console.log('player1 disconnected')
    }
    else if (client.id == this.player2) {
      this.player2 = null;
      console.log('player2 disconnected')
    }
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