import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EncryptService } from 'src/services/encrypt.service';
import { UserEntity } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { RoomEntity } from './entities/room.entity';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MessageEntity } from './entities/message.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ChatGateway } from './chat.gateway';
import { ConnectedUserService } from 'src/services/connected-user/connected-user.service';
import { ConnectedUserEntity } from './entities/connected-user.entity';
import { MemberEntity } from './entities/member.entity';
import { UserService } from 'src/user/user.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        UserModule,
        HttpModule,
        TypeOrmModule.forFeature([UserEntity, RoomEntity, MessageEntity, ConnectedUserEntity, MemberEntity])],
    providers: [ChatGateway, ChatService, EncryptService, ConnectedUserService, UserService],
    exports: [ChatService],
    controllers: [ChatController]
})

export class ChatModule { }
