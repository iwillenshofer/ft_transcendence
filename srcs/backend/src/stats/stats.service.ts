import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { GameEntity } from 'src/game/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/users.entity';
import { AchievementsEntity } from './achievements.entity';
import { UsersService } from 'src/users/users.service';
import { FriendsEntity } from 'src/friends/friends.entity';

@Injectable()
export class StatsService {

    constructor(
        @InjectRepository(GameEntity)
        private gameRepository: Repository<GameEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(FriendsEntity)
        private friendsRepository: Repository<FriendsEntity>,
        @InjectRepository(AchievementsEntity)
        private achievementsRepository: Repository<AchievementsEntity>,
        @Inject(forwardRef(() => UsersService))
        private userService: UsersService
    ) {
        this.achievements["g1"] =  "play 10 games";
        this.achievements["g2"] =  "play 20 games";
        this.achievements["g3"] =  "play 50 games";
        this.achievements["g4"] =  "win 5 games";
        this.achievements["g5"] =  "win 10 games";
        this.achievements["g6"] =  "win 30 games";
        this.achievements["g7"] =  "win 3 games in a row";
        this.achievements["g8"] =  "win 5 games in a row";
        this.achievements["g9"] =  "win 10 games in a row";
        this.achievements["f1"] =  "make 3 friends";
        this.achievements["f2"] =  "make 7 friends";
        this.achievements["f3"] =  "make 10 friends";
        this.achievements["l1"] =  "login 3 times";
        this.achievements["l2"] =  "login 10 times";
        this.achievements["l3"] =  "login 50 times";
        this.achievements["r1"] =  "reach rating 1000";
        this.achievements["r2"] =  "reach rating 1200";
        this.achievements["r2"] =  "reach rating 1500";
    }

    private achievements: { [name: string] : string; } = {};

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
            .select(['u.username', 'u2.username', 'u.avatar_url', 'u2.avatar_url', 'games.scoreP1', 'games.scoreP2', 'games.winner'])
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





	/*
	** Achievements, History, Stats, Info
	*/
	async getUserStats(username:string) { 
		let user = await this.userRepository.findOneBy({ username: username });
		if (!user)
			return (null);
		

	}

    _expectedProbability(ratingA: number, ratingB: number): number {
        return (1.0 / (1.0 + Math.pow(10,((ratingB - ratingA) / 400) ) ));
    }

    _newRating(ratingA: number, ratingB: number, scoreA: number): number {
        return  Math.round(ratingA + (32 * ( scoreA - this._expectedProbability(ratingA, ratingB) )));
    }

    async updateRating(game: GameEntity) {
		let user1 = game.idP1;
        let user2 = game.idP2;
        let tmpU1 = this._newRating(user1.rating, user2.rating, (game.winner.id == game.idP1.id ? 1 : 0));
        let tmpU2 = this._newRating(user2.rating, user1.rating, (game.winner.id == game.idP2.id ? 1 : 0));
        user1.rating = (tmpU1 > 100) ? tmpU1 : 100;
        user2.rating = (tmpU2 > 100) ? tmpU2 : 100;
        await user1.save();
        await user2.save();
        await this.ratingAchievements(user1.id);
        await this.ratingAchievements(user2.id);
	}

    async getAchievements(username: string)
    {
        const user_id: number = await this.userService.getIdByUsername(username);
        console.log("getting achievements for user " + username + " " + user_id);
        const achievements = await this.achievementsRepository
        .createQueryBuilder('f')
        .leftJoinAndSelect("f.user", "user")
        .where('user.id = :v1', {v1: user_id})
        .getMany();
        return (achievements);   
    }

    async addAchievement(user_id: number, achievement: string) {
        const exists = await this.achievementsRepository
        .createQueryBuilder('f')
        .leftJoinAndSelect("f.user", "user")
        .where(new Brackets(qb => {
            qb.where('user.id = :v1', {v1: user_id})
            qb.andWhere('achievement = :v2', {v2: achievement})
          }))
        .getOne();
        console.log("adding achievement:" + user_id);
        if (exists) {
            return null;
        } else {
            let friendship: AchievementsEntity = this.achievementsRepository.create({
                user: await this.userService.getUserByID(user_id),
                achievement: achievement,
                description: this.achievements[achievement]
            });
            const res = await this.achievementsRepository.save(friendship);
            return (res);
        }
    }

    //ok
    async gameAchievements(user_id: number)
    { 
        const games: number = await this.gameRepository
            .createQueryBuilder('f')
            .where('user = :v1', {v1: user_id})
            .getCount();
        if (games >= 10) {this.addAchievement(user_id, "g1")};
        if (games >= 20) {this.addAchievement(user_id, "g2")};
        if (games >= 50) {this.addAchievement(user_id, "g3")};
        const wins: number = await this.gameRepository
            .createQueryBuilder('f')
            .where('user = :v1', {v1: user_id})
            .andWhere('winner = :v2', { v2: user_id })
            .getCount();
        if (wins >= 5) {this.addAchievement(user_id, "g1")};
        if (wins >= 10) {this.addAchievement(user_id, "g2")};
        if (wins >= 30) {this.addAchievement(user_id, "g3")};
        let winRowCount = 0;
        const winsRow: GameEntity[] = await this.gameRepository
        .createQueryBuilder('f')
        .where('user = :v1', {v1: user_id})
        .orderBy('created_at', 'DESC')
        .getMany();
        for(let i=0;(i < winsRow.length && winsRow.at(i).winner.id == user_id); i++) {winRowCount++};
        if (winRowCount >= 3) {this.addAchievement(user_id, "g7")};
        if (winRowCount >= 5) {this.addAchievement(user_id, "g8")};
        if (winRowCount >= 10) {this.addAchievement(user_id, "g9")};

    }

    //ok
    async friendsAchievements(user_id: number)
    { 
        const friends: number = await this.friendsRepository
        .createQueryBuilder('f')
        .where('user = :v1', {v1: user_id})
        .getCount();
        if (friends >= 3) {this.addAchievement(user_id, "f1")};
        if (friends >= 7) {this.addAchievement(user_id, "f2")};
        if (friends >= 10) {this.addAchievement(user_id, "f3")};
    }

    //ok
    async ratingAchievements(user_id: number)
    {
        const user: UserEntity = await this.userService.getUserByID(user_id);
        if (user) {
            if (user.rating >= 1000) {this.addAchievement(user_id, "r1")};
            if (user.rating >= 1200) {this.addAchievement(user_id, "r2")};
        }
    }

    //ok
    async loginAchievements(user_id: number)
    {
        const user: UserEntity = await this.userService.getUserByID(user_id);
        if (user) {
            console.log("checking login acchievements for user " + user.username + ": " + user_id);
            if (user.login_count >= 3) {this.addAchievement(user_id, "l1")};
            if (user.login_count >= 10) {this.addAchievement(user_id, "l2")};
            if (user.login_count >= 50) {this.addAchievement(user_id, "l3")};
        }
    }
}


