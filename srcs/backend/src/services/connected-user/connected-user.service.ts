import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedUserEntity } from 'src/chat/entities/connected-user.entity';
import { UserEntity } from 'src/users/users.entity';
import { UserInterface } from 'src/users/users.interface';
import { Not, Repository } from 'typeorm';

@Injectable()
export class ConnectedUsersService {

    constructor(
        @InjectRepository(ConnectedUserEntity)
        private readonly connectedUserRepository: Repository<ConnectedUserEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) { }

    async createConnectedUser(socketId: string, user: UserEntity): Promise<ConnectedUserEntity> {
        let connectedUser = new ConnectedUserEntity();
        connectedUser.socketId = socketId;
        connectedUser.user = user;
        return this.connectedUserRepository.save(connectedUser);
    }

    async updateSocketIdConnectedUSer(socketId: string, connectedUser: ConnectedUserEntity): Promise<ConnectedUserEntity> {
        connectedUser.socketId = socketId;
        connectedUser.connected = true;
        return await this.connectedUserRepository.save(connectedUser);
    }

    async getByUserId(userId: number): Promise<ConnectedUserEntity> {
        return await this.connectedUserRepository.findOne({
            where: { user: { id: userId } },
            relations: { user: true },
        });

    }

	async getUsersById(userId: number): Promise<ConnectedUserEntity[]> {
        return await this.connectedUserRepository.find({
            where: { user: { id: userId } },
            relations: { user: true },
        });
    }

    async isUserOnline(userId: number): Promise<Boolean> {
        let connectedUser = await this.getByUserId(userId);
        if (connectedUser != null)
            return (true);
        return (false);
    }

    async deleteBySocketId(socketId: string) {
        let connectedUser = await this.connectedUserRepository.findOneBy({ socketId: socketId });
        if (connectedUser) {
            connectedUser.connected = false;
            connectedUser.socketId = "";
            await this.connectedUserRepository.save(connectedUser);
        }

    }

    async deleteByUserId(userId: number) {
        let connectedUser = await this.connectedUserRepository.findOneBy({ user: { id: userId } });
        if (connectedUser) {
            connectedUser.connected = false;
            connectedUser.socketId = "";
            await this.connectedUserRepository.save(connectedUser);
        }

    }

    async getAllUserOnline() {
        const users = await this.userRepository.findBy({
            connected_user: { connected: true },
        });
        return users;

        // const users = await this.userRepository
        //     .createQueryBuilder("user")
        //     .leftJoinAndSelect("user.connected_user", "connected_user")
        //     .where("connected_user.connected = :connected", { connected: true })
        //     .andWhere('user.username != :me', { me: me })
        //     .getMany();
        // return users;
    }

    async getAllConnectedUsers() {
        const users = await this.connectedUserRepository.find();
        return users;

        // const users = await this.connectedUserRepository
        //     .createQueryBuilder("connected_user")
        //     .where('user.username != :me', { me: me })
        //     .getMany();
        // return users;
    }
}
