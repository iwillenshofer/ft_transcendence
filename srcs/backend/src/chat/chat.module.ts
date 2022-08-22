import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { ChatGateway } from './gateway/chat.gateway';
import { RoomService } from './services/room/room.service';

@Module({
    imports: [UsersModule, AuthModule],
    providers: [ChatGateway, RoomService]
})

export class ChatModule { }
