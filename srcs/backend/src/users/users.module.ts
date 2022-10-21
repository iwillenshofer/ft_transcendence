import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users.service';
import { EncryptService } from 'src/services/encrypt.service';

@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([UserEntity])
    ],
    providers: [UsersService, EncryptService],
    exports: [UsersService],
    controllers: [UsersController]
})

export class UsersModule { }
