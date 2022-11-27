import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendsEntity } from './friends.entity';
import { Brackets, Equal, Repository } from 'typeorm';
import { UserEntity } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { FriendsStatusDTO } from './friendsStatus.dto';
import { StatsService } from 'src/stats/stats.service';

@Injectable()
export class FriendsService {

    constructor(
        @InjectRepository(FriendsEntity)
        private friendsRepository: Repository<FriendsEntity>,
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
        private usersService: UsersService,
        private statsService: StatsService
    ) { }

    async getFriendshipStatus(username: string, me: string): Promise<FriendsStatusDTO> {
        // console.log("getting status for: " + username);
        let u1 = await this.usersService.getUserByUsername(me);
        let u2 = await this.usersService.getUserByUsername(username);
        if (!(u1) || !(u2))
            return (new FriendsStatusDTO(5));
        else if (u1.id == u2.id)
            return (new FriendsStatusDTO(6));
        // console.log("IDS: " + u1.id + " - " + u2.id);
        // console.log("USER1: " + u1);
        // console.log("USER2: " + u2);

        let friendship = await this.friendsRepository.createQueryBuilder('f')
            .innerJoinAndSelect('f.user1', 'u1')
            .innerJoinAndSelect('f.user2', 'u2')
            .where(new Brackets(qb => {
                qb.where('u1.id = :v1', { v1: u1.id })
                qb.andWhere('u2.id = :v2', { v2: u2.id })
            }))
            .orWhere(new Brackets(qb => {
                qb.where('u2.id = :v3', { v3: u1.id })
                qb.andWhere('u1.id = :v4', { v4: u2.id })
            }))
            .getOne()
        // console.log("friendship FOUND: " + JSON.stringify(friendship));
        if (friendship) {
            if (friendship.accepted) { return (new FriendsStatusDTO(3)); }
            else if (friendship.user1.id == u1.id) { return (new FriendsStatusDTO(1)); }
            return (new FriendsStatusDTO(2));
        }
        return (new FriendsStatusDTO(0));
    }

    async getFriends(username: string) {
        let lst: any[] = [];

        let res = await this.friendsRepository
            .createQueryBuilder('f')
            .innerJoinAndSelect('f.user1', 'u1')
            .innerJoinAndSelect('f.user2', 'u2')
            .where(new Brackets(qb => {
                qb.where('u1.username = :v1', { v1: username })
                qb.orWhere('u2.username = :v2', { v2: username })
            }))
            .andWhere("f.accepted = true")
            .getMany();

        for (var item of res) {
            let user: any = item.user1?.username == username ? item.user2 : item.user1;
            lst.push({ 'username': user.username, 'avatar_url': user.avatar_url })
        }
        // console.log(res);
        return lst;
    }

    async getRequests(username: string) {
        let lst: any[] = [];

        let res = await this.friendsRepository
            .createQueryBuilder('f')
            .innerJoinAndSelect('f.user1', 'u1')
            .innerJoinAndSelect('f.user2', 'u2')
            .where(new Brackets(qb => {
                qb.where('u1.username = :v1', { v1: username })
                qb.orWhere('u2.username = :v2', { v2: username })
            }))
            .andWhere("f.accepted = false")
            .getMany();
        // console.log("SIZE: " +  res.length);
        // console.log("USERNAME: " +  username);

        for (var item of res) {
            let user: any = item.user1?.username == username ? item.user2 : item.user1;
            // console.log("Request list: "+ user.username);

            lst.push({ 'username': user.username, 'avatar_url': user.avatar_url, 'by_me': (item.user1?.username == username) })
        }
        // console.log(res);
        return lst;
    }

    async searchUsers(search: string, me: string) {
        let res = await this.usersRepository
            .createQueryBuilder("user")
            .select(['user.username', 'user.avatar_url'])
            .where('user.username != :me', { me: me })
            .andWhere("user.username like :name", { name: `%${search}%` })
            .getMany();
        // console.log(res);
        return res;
    }

    async requestFriendship(username: string, me: string) {
        let status = await this.getFriendshipStatus(username, me);
        // console.log("firsttFrienship: " + JSON.stringify(status));
        if (status.getStatus()) {
            return JSON.stringify(status);
        };
        let user1 = await this.usersService.getUserByUsername(me);
        let user2 = await this.usersService.getUserByUsername(username);
        let friendship: FriendsEntity = this.friendsRepository.create({
            user1: user1,
            user2: user2,
            accepted: false
        })
        const res = await this.friendsRepository.save(friendship);
        if (!res)
            return (new FriendsStatusDTO(0));
        return (new FriendsStatusDTO(4));
    }

    async acceptFriendship(username: string, me: string) {
        let u1 = await this.usersService.getUserByUsername(me);
        let u2 = await this.usersService.getUserByUsername(username);
        let friendship = await this.friendsRepository.createQueryBuilder('f')
            .innerJoinAndSelect('f.user1', 'u1')
            .innerJoinAndSelect('f.user2', 'u2')
            .where(new Brackets(qb => {
                qb.where('u1.id = :v1', { v1: u1.id })
                qb.andWhere('u2.id = :v2', { v2: u2.id })
            }))
            .orWhere(new Brackets(qb => {
                qb.where('u2.id = :v3', { v3: u1.id })
                qb.andWhere('u1.id = :v4', { v4: u2.id })
            }))
            .getOne();
        if (friendship) {
            friendship.accepted = true;
            const res = await this.friendsRepository.save(friendship);
            await this.statsService.friendsAchievements(u1.id);
            await this.statsService.friendsAchievements(u2.id);
        }
        return (await this.getFriendshipStatus(username, me));
    }

    async deleteFriendship(username: string, me: string) {
        let u1 = await this.usersService.getUserByUsername(me);
        let u2 = await this.usersService.getUserByUsername(username);
        let friendship = await this.friendsRepository.createQueryBuilder()
            .delete()
            .from(FriendsEntity)
            .where(new Brackets(qb => {
                qb.where('user1 = :v1', { v1: u1.id })
                qb.andWhere('user2 = :v2', { v2: u2.id })
            }))
            .orWhere(new Brackets(qb => {
                qb.where('user2 = :v3', { v3: u1.id })
                qb.andWhere('user1 = :v4', { v4: u2.id })
            })).execute();
        return (this.getFriendshipStatus(username, me));
    }
}
