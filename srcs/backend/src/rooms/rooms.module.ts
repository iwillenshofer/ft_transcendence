import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EncryptService } from 'src/services/encrypt.service';
import { RoomsController } from './rooms.controller';
import { RoomEntity } from './rooms.entity';
import { RoomsService } from './rooms.service';

@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([RoomEntity])
    ],
    providers: [RoomsService, EncryptService],
    exports: [RoomsService],
    controllers: [RoomsController]
})

export class RoomsModule { }