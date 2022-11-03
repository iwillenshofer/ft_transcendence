import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.service';
import { EncryptService } from 'src/services/encrypt.service';

@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([UserEntity])
    ],
    providers: [UserService, EncryptService],
    exports: [UserService],
    controllers: [UserController]
})

export class UserModule { }
