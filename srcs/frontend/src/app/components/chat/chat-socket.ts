import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { AuthService } from 'src/app/auth/auth.service';
import { getUserId } from "../../auth/auth.module"

@Injectable()
export class ChatSocket extends Socket {

  constructor() {
    super({
      url: 'http://127.0.0.1:3000/chat', options: {
        autoConnect: false,
        extraHeaders: { userid: getUserId() ?? "null" }
      }
    })
    console.log("socket construcotr")
  }
}
