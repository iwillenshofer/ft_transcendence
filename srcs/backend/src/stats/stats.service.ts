import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { GameEntity } from 'src/game/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/users.entity';

@Injectable()
export class StatsService {

    constructor(
        @InjectRepository(GameEntity)
        private gameRepository: Repository<GameEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) {}

	async getHistory(username: string): Promise<any[]> {

		let res = await this.gameRepository
            .createQueryBuilder("games")
            .innerJoinAndMapOne(
                'games.user1',
                "User",
                'u',
                'u.id= games.idP1'
              )
              .innerJoinAndMapOne(
                'games.user2',
                "User",
                'u2',
                'u2.id= games.idP2'
              )
            .select(['u.username', 'u2.username', 'u.avatar_url', 'u2.avatar_url', 'games.scoreP1', 'games.scoreP2', 'games.winner', 'games.isCustom'])
            .where("u.username = :username", {username: username})
            .orWhere("u2.username = :username", {username: username})
            .getMany();
        console.log(res);
        return res;
	}

    async getUserinfo(username: string) {
		let user = await this.userRepository.findOneBy({ username: username });
        console.log(user);
		return ({
            'username': username,
            'fullname': user.fullname,
            'avatar_url': user.avatar_url,
            'created_at': user.created_at,
            'rating': user.rating
        });
	}


    _expectedProbability(ratingA: number, ratingB: number): number {
        return (1.0 / (1.0 + Math.pow(10,((ratingB - ratingA) / 400) ) ));
    }

    _newRating(ratingA: number, ratingB: number, scoreA: number): number {
        return  Math.round(ratingA + (32 * ( scoreA - this._expectedProbability(ratingA, ratingB) )));
    }

    async updateRating(game: GameEntity) {
		let user1 = await this.userRepository.findOneBy({ id: game.idP1 });
        let user2 = await this.userRepository.findOneBy({ id: game.idP2 });
        let tmpU1 = this._newRating(user1.rating, user2.rating, (game.winner == user1.id ? 1 : 0));
        let tmpU2 = this._newRating(user2.rating, user1.rating, (game.winner == user2.id ? 1 : 0));
        user1.rating = (tmpU1 > 100) ? tmpU1 : 100;
        user2.rating = (tmpU2 > 100) ? tmpU1 : 100;
        user1.save();
        user2.save();
	}
}


