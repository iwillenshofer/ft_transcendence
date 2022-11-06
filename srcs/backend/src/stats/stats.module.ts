import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from 'src/game/game.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/users.entity';

@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([GameEntity, UserEntity])
    ],
    providers: [StatsService],
    exports: [StatsService],
    controllers: [StatsController]
})

export class StatsModule {}
