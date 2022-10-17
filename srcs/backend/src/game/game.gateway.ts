import { WebSocketGateway, SubscribeMessage, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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
    this.server.emit("position", this.positionP1, this.positionP2);
  }

  @SubscribeMessage('move')
  move(client: Socket, command: string) {
    if (!this.player1)
      this.player1 = client.id;
    else
      this.player2 = client.id;
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
}

/*
      https://www.youtube.com/watch?app=desktop&v=atbdpX4CViM
      https://nest-ionic-examples.github.io/01-simple-chat/
      https://www.digitalocean.com/community/tutorials/angular-socket-io
      https://www.thepolyglotdeveloper.com/2019/04/using-socketio-create-multiplayer-game-angular-nodejs/
      https://docs.nestjs.com/websockets/gateways
      https://socket.io/docs/v4/typescript/
*/