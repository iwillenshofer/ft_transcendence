import { UsersModule } from './../users/users.module';
import { GameEntity } from 'src/game/game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { StatsService } from 'src/stats/stats.service';
import { UserEntity } from 'src/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GameEntity, UserEntity]), UsersModule],
  providers: [GameGateway, GameService, StatsService]
})
export class GameModule { }
