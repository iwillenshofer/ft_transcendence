import { WebSocketGateway, SubscribeMessage, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: '*:*' })
export class GameGateway {

  @WebSocketServer()
  server: Server;

  position = {
    x: 200,
    y: 200
  };

  @SubscribeMessage('joinGame')
  joinGame(client: Socket) {
    console.log('PSOTICAO', this.position)
    this.server.emit("position", this.position);

  }

  @SubscribeMessage('move')
  move(client: Socket, data: string) {
    console.log('NAYRAN', data);
    switch (data) {
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
}