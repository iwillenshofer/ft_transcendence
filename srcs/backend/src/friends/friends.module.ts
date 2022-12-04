import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsEntity } from './friends.entity';
import { UserEntity } from 'src/users/users.entity';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from 'src/users/users.module';
import { EncryptService } from 'src/services/encrypt.service';
import { StatsService } from 'src/stats/stats.service';
import { StatsModule } from 'src/stats/stats.module';
import { BlockedUsersEntity } from 'src/chat/entities/blocked-users.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([FriendsEntity, UserEntity, BlockedUsersEntity]),
    UsersModule,
    StatsModule
  ],
  providers: [FriendsService],
  controllers: [FriendsController],
  exports: [FriendsService]
})
export class FriendsModule { }
