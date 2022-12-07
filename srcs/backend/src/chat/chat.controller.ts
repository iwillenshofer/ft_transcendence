import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { of } from 'rxjs';
import { ChatService } from './chat.service';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { ConnectedUsersService } from 'src/services/connected-user/connected-user.service';
import { CreateRoomDto } from './dto/createRoom.dto';
import { EncryptService } from 'src/services/encrypt.service';
import { UsersService } from 'src/users/users.service';
import { MemberRole } from './models/memberRole.model';
import { ChatGateway } from './chat.gateway';

@Controller('chat')
export class ChatController {

    constructor(
        private chatService: ChatService,
        private connectedUsersService: ConnectedUsersService,
        private encrypt: EncryptService,
        private userService: UsersService,
        private connectedUser: ConnectedUsersService,
        private readonly chatGateway: ChatGateway
    ) { }

    @UseGuards(JwtGuard)
    @Get('is-room-name-taken/:name')
    async isUsernameTaken(@Param('name') roomName) {
        return of(await this.chatService.isRoomNameTaken(roomName))
    }

    @UseGuards(JwtGuard)
    @Get('searchusers/:username')
    async getUsers(@Param('username') username, @Request() req) {
        let ret = await this.chatService.searchUsers(username, req.user.username, req.user.id);
        return (JSON.stringify(ret));
    }

    @UseGuards(JwtGuard)
    @Get('get_all_my_rooms_as_text')
    async getAllMyRoomsAsText(@Request() req) {
        return of(await this.chatService.getAllMyRoomsAsText(req.user.id));
    }

    @UseGuards(JwtGuard)
    @Get('get_my_rooms')
    async getMyRooms(@Request() req) {
        return of(await this.chatService.getMyRooms(req.user.id));
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

    @UseGuards(JwtGuard)
    @Get('get_my_member_of_room/:roomId')
    async getMyMemberOfRoom(@Param('roomId') roomId, @Request() req) {
        return of(await this.chatService.getMyMemberOfRoom(roomId, req.user.id));
    }

    @UseGuards(JwtGuard)
    @Get("is_blocked/:userId")
    async isBlockedUser(@Param('userId') userId, @Request() req) {
        return of(await this.chatService.isBlockedUser(+req.user.id, +userId));
    }

    @UseGuards(JwtGuard)
    @Post('create_room')
    async createRoom(@Body() new_room: CreateRoomDto, @Request() req) {

        const room = CreateRoomDto.from(new_room);
        const connected_user = await this.connectedUser.getByUserId(+req.user.id);

        if (room.password)
            room.password = this.encrypt.encode(room.password);

        const owner = await this.userService.getUser(+req.user.id);
        if (owner) {
            const member = await this.chatService.createMember(owner.toEntity(), connected_user.socketId, MemberRole.Owner);

            await this.chatService.createRoom(room.toEntity(), [member]);
            await this.chatGateway.emitRooms(+req.user.id, connected_user.socketId);

            const publicRooms = await this.chatService.getPublicAndProtectedRooms({ page: 1, limit: 3 });
            const connectedUsers = await this.connectedUsersService.getAllConnectedUsers();
            connectedUsers.forEach(user => {
                this.chatGateway.server.to(user.socketId).emit('publicRooms', publicRooms);

            })
        }
    }

    @UseGuards(JwtGuard)
    @Post('create_direct_room')
    async createDirectRoom(@Body() data: { room: CreateRoomDto, user_id: number }, @Request() req) {

        const room = CreateRoomDto.from(data.room);
        const connected_user = await this.connectedUser.getByUserId(+req.user.id);

        const owner = await this.userService.getUser(+req.user.id);
        const ownerMember = await this.chatService.createMember(owner.toEntity(), connected_user.socketId, MemberRole.Member);

        const invited = await this.userService.getUser(data.user_id);
        const socketId_invited = (await this.connectedUsersService.getByUserId(invited.id)).socketId;
        const invitedMember = await this.chatService.createMember(invited.toEntity(), socketId_invited, MemberRole.Member);

        await this.chatService.createRoom(room.toEntity(), [ownerMember, invitedMember]);
        await this.chatGateway.emitRooms(owner.id, ownerMember.socketId);
        await this.chatGateway.emitRooms(invited.id, invitedMember.socketId);
    }
}
