import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { AuthService } from "../auth/auth.service"
import { getUserId } from "../auth/auth.module"

@Injectable()
export class ChatSocket extends Socket {
    constructor(private authService: AuthService) {
        super({
            url: 'http://localhost:3000/', options: {
                extraHeaders: {
                    Userid: getUserId()
                }
            }
        });
    }
}
