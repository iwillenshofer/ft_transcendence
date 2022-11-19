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
  ) { }

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
      .where("u.username = :username", { username: username })
      .orWhere("u2.username = :username", { username: username })
      .getMany();
    // console.log(res);
    return res;
  }

  async getUserinfo(username: string) {
    let user = await this.userRepository.findOneBy({ username: username });
    // console.log(user);
    return ({
      'username': username,
      'fullname': user.fullname,
      'avatar_url': user.avatar_url,
      'created_at': user.created_at,
    });
  }

  async getStatusByUsername(username: string) {
    let user = await this.userRepository.findOneBy({ username: username });
    return user.status;
  }

  async setStatusByUsername(username: string, status: string) {
    let user = await this.userRepository.findOneBy({ username: username });
    user.status = status;
    await this.userRepository.save(user);
    return user.status;
  }
}


