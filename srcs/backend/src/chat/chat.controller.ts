import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, Param, Post, Request, Response, UseGuards } from '@nestjs/common';
import { of } from 'rxjs';
import { ChatService } from './chat.service';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { ConnectedUsersService } from 'src/services/connected-user/connected-user.service';

@Controller('chat')
export class ChatController {

    constructor(
        private chatService: ChatService,
        private connectedUsersService: ConnectedUsersService
    ) { }

    @Get('is-room-name-taken/:name')
    async isUsernameTaken(@Param('name') roomName) {
        return of(await this.chatService.isRoomNameTaken(roomName))
    }

    // @UseGuards(JwtGuard)
    // @Get('get_all_my_conv_rooms_as_text')
    // async getAllMyConvRoomsAsText(@Response() res, @Request() req) {
    //     res.status(200).send(await this.chatService.getAllMyConvRoomsAsText(req.user.id));
    // }

    @UseGuards(JwtGuard)
    @Get('get_all_my_rooms_as_text')
    async getAllMyRoomsAsText(@Request() req) {
        return of(await this.chatService.getAllMyRoomsAsText(req.user.id));
    }

    @Post('verify_password')
    async verifyPassword(@Body() body): Promise<Object> {
        return of(await this.chatService.verifyPassword(body.roomId, body.password));
    }

    @UseGuards(JwtGuard)
    @Get('is_user_online/:userId')
    async isUserOnline(@Param('userId') userId) {
        return of(await this.connectedUsersService.isUserOnline(userId));
    }

    @UseGuards(JwtGuard)
    @Get('get_non_added_users')
    async getNonAddedUsers(@Request() req) {
        return of(await this.chatService.getNonAddedUsers(req.user.id));
    }
}