import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { RoomEntity } from 'src/room/room.entity';
import { RoomModule } from 'src/room/room.module';
import { RoomService } from 'src/room/room.service';
import { EncryptService } from 'src/services/encrypt.service';
import { UserEntity } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './gateway/chat.gateway';

@Module({
    imports: [UserModule, RoomModule, AuthModule, TypeOrmModule.forFeature([RoomEntity, UserEntity])],
    providers: [ChatGateway, RoomService, EncryptService]
})

export class ChatModule { }
