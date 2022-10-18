import { UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { TfaGuard } from 'src/auth/tfa/tfa.guard';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  private server: Server;

  private messages: string[] = [];

  //@UseGuards(TfaGuard)
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    this.messages.push(JSON.stringify(payload));
    this.server.emit('message', this.messages);
  }

  afterInit(server: Server) {
  }

  @UseGuards(TfaGuard)
  handleConnection(client: Socket, ...args: any[]) {
  }

  handleDisconnect(client: Socket, ...args: any[]) {
  }

}
