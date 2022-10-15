import { WebSocketGateway, SubscribeMessage, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: '*:*' })
export class GameGateway {

  @WebSocketServer()
  server: Server;

  position = {
    x: 500,
    y: 200,
  };

  player1: any = null;
  player2: any = null;

  @SubscribeMessage('joinGame')
  joinGame(client: Socket) {
    this.setPlayers(client.id);
    this.server.emit("position", this.position);
  }

  @SubscribeMessage('move')
  move(client: Socket, command: string) {
    console.log(client.id, command);
    switch (command) {
      case "left":
        this.position.x -= 5;
        this.server.emit("position", this.position);
        break;
      case "right":
        this.position.x += 5;
        this.server.emit("position", this.position);
        break;
      case "up":
        this.position.y -= 5;
        this.server.emit("position", this.position);
        break;
      case "down":
        this.position.y += 5;
        this.server.emit("position", this.position);
        break;
    }
  }

  setPlayers(player: any) {
    if (!this.player1)
      this.player1 = player;
    else if (!this.player2)
      this.player2 = player;
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