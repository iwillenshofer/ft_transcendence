import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EncryptService } from 'src/services/encrypt.service';
import { UserModule } from 'src/user/user.module';
import { UserEntity, UserService } from 'src/user/user.service';
import { RoomController } from './room.controller';
import { RoomEntity } from './room.entity';
import { RoomService } from './room.service';

@Module({
    imports: [
        HttpModule,
        UserModule,
        TypeOrmModule.forFeature([UserEntity, RoomEntity]),

    ],
    providers: [RoomService, EncryptService],
    exports: [RoomService],
    controllers: [RoomController]
})

export class RoomModule { }