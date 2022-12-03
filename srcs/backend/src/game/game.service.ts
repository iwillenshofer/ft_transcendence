import { GameEntity } from './game.entity';
import { UsersService } from 'src/users/users.service';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './game';
import { IGame } from './game.interface';
import { Repository } from 'typeorm';
import { StatsService } from 'src/stats/stats.service';

@Injectable()
export class GameService {

    constructor(
        private usersService: UsersService,
        private statsService: StatsService,
        @InjectRepository(GameEntity) private gameRepository: Repository<GameEntity>,
    ) { }

    async addGame(game: Game) {
        if (!game.winner)
            return;
        const gameEntity = new GameEntity;
        gameEntity.usernameP1 = game.player1.username;
        gameEntity.usernameP2 = game.player2.username;
        gameEntity.scoreP1 = game.player1.score;
        gameEntity.scoreP2 = game.player2.score;
        gameEntity.isChallenge = game.challenge;
        gameEntity.winner = await this.usersService.getUserByUsername(game.winner.username);
        gameEntity.idP1 = await this.usersService.getUserByUsername(gameEntity.usernameP1);
        gameEntity.idP2 = await this.usersService.getUserByUsername(gameEntity.usernameP2);
        this.gameRepository.save(gameEntity);
		if (!(gameEntity.isChallenge))
        	this.statsService.updateRating(gameEntity);
        this.statsService.gameAchievements(gameEntity.idP1.id);
        this.statsService.gameAchievements(gameEntity.idP2.id);
    }

    async getGamesByUsername(username: string) {
        // let user = await this.userRepository.findOneBy({ id: id });
        // return auser.games;
    }
}
