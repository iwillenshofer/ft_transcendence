import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { RoomEntity } from 'src/rooms/rooms.entity';
import { RoomsService } from 'src/rooms/rooms.service';
import { EncryptService } from 'src/services/encrypt.service';
import { UsersModule } from 'src/users/users.module';
import { ChatGateway } from './gateway/chat.gateway';

@Module({
    imports: [UsersModule, AuthModule, TypeOrmModule.forFeature([RoomEntity])],
    providers: [ChatGateway, RoomsService, EncryptService]
})

export class ChatModule { }
