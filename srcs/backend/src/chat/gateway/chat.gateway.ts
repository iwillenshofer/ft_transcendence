import { UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { TfaGuard } from 'src/auth/tfa/tfa.guard';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer()
  server;

  @UseGuards(TfaGuard)
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    console.log('message' + JSON.stringify(payload) );
    this.server.emit('message' + JSON.stringify(payload));
  }

  @UseGuards(TfaGuard)
  handleConnection(client: any, ...args: any[]) {
      console.log('on connect');
  }

  handleDisconnect(client: any) {      
    console.log('on disconnect');
  }

}
