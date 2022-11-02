import { UsersModule } from './../users/users.module';
import { GameEntity } from 'src/game/game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([GameEntity]), UsersModule],
  providers: [GameGateway, GameService]
})
export class GameModule { }
