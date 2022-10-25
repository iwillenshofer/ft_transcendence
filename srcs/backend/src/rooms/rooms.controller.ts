import { HttpService } from '@nestjs/axios';
import { Controller, Get, Param, Request } from '@nestjs/common';
import { of } from 'rxjs';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {

    constructor(
        private roomService: RoomsService,
        private readonly HttpService: HttpService
    ) { }

    @Get('is-room-name-taken/:name')
    async isUsernameTaken(@Param('name') roomName, @Request() req) {
        return of(await this.roomService.isRoomNameTaken(roomName))
    }
}
