import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsEntity } from './friends.entity';
import { UserEntity } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from 'src/users/users.module';
import { EncryptService } from 'src/services/encrypt.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([FriendsEntity, UserEntity])
  ],
  providers: [FriendsService, UsersService, EncryptService],
  controllers: [FriendsController],
})
export class FriendsModule {}