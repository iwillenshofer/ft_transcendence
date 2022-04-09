import { Injectable } from '@angular/core';
import { ChatSocket } from './chat.socket';
import { map } from 'rxjs/operators';

class Data { 
  msg: string = '';
}

@Injectable()
export class ChatService {

  constructor(private socket: ChatSocket) {}

  sendMessage(msg: string) {
    this.socket.emit('message', msg);
  }

  getMessage() {
    return this.socket.fromEvent('message');
  }
}
