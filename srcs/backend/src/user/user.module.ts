import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HttpModule, HttpService } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.service';
import { EncryptService } from 'src/services/encrypt.service';
import { ConnectedUserService } from 'src/services/connected-user/connected-user.service';
import { ConnectedUserEntity } from 'src/chat/entities/connected-user.entity';
import { ChatService } from 'src/chat/chat.service';
import { RoomEntity } from 'src/chat/entities/room.entity';
import { MessageEntity } from 'src/chat/entities/message.entity';
import { MemberEntity } from 'src/chat/entities/member.entity';
import { ChatModule } from 'src/chat/chat.module';

@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([UserEntity, RoomEntity, MessageEntity, ConnectedUserEntity, MemberEntity])
    ],
    providers: [UserService, EncryptService, ChatService, ConnectedUserService],
    exports: [UserService],
    controllers: [UserController]
})

export class UserModule { }
