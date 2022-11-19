import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users.service';
import { EncryptService } from 'src/services/encrypt.service';
import { StatsModule } from 'src/stats/stats.module';
import { StatsService } from 'src/stats/stats.service';
import { GameEntity } from 'src/game/game.entity';
import { FriendsEntity } from 'src/friends/friends.entity';
import { AchievementsEntity } from 'src/stats/achievements.entity';

@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([UserEntity, GameEntity, FriendsEntity, AchievementsEntity]),
    ],
    providers: [UsersService, EncryptService, UserEntity, StatsService],
    exports: [UsersService, EncryptService, UserEntity, HttpModule],
    controllers: [UsersController]
})

export class UsersModule { }
