import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { getUserId } from "../../auth/auth.module"

@Injectable()
export class ChatSocket extends Socket {

  constructor() {
    super({
      url: 'http://localhost:3000/chat', options: {
        autoConnect: false,
        extraHeaders: { Userid: getUserId() }
      }
    });
  }
}
