import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedUserEntity } from 'src/chat/entities/connected-user.entity';
import { UserEntity } from 'src/users/users.entity';
import { UserInterface } from 'src/users/users.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ConnectedUsersService {

    constructor(
        @InjectRepository(ConnectedUserEntity)
        private readonly connectedUserRepository: Repository<ConnectedUserEntity>
    ) { }

    async createConnectedUser(socketId: string, user: UserEntity): Promise<ConnectedUserEntity> {
        let connectedUser = new ConnectedUserEntity();
        connectedUser.socketId = socketId;
        connectedUser.user = user;
        return this.connectedUserRepository.save(connectedUser);
    }

    async updateSocketIdConnectedUSer(socketId: string, connectedUser: ConnectedUserEntity): Promise<ConnectedUserEntity> {
        connectedUser.socketId = socketId;
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
        return await this.connectedUserRepository.delete({ socketId: socketId });
    }

    async deleteByUserId(userId: number) {
        return await this.connectedUserRepository.delete({ id: userId });
    }

    async getAllConnectedUser() {
        return await this.connectedUserRepository.find();
    }
}
