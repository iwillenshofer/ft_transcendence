
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { EncryptService } from 'src/services/encrypt.service';
import { UserDTO } from 'src/user/user.dto';
import { UserInterface } from 'src/user/user.interface';
import { UserEntity, UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { RoomEntity } from './room.entity';
import { RoomInterface, RoomType } from './room.interface';

@Injectable()
export class RoomService {

    constructor(
        @InjectRepository(RoomEntity)
        private roomRepository: Repository<RoomEntity>,
        private readonly encrypt: EncryptService,
        private readonly UserService: UserService) { }

    async isRoomNameTaken(roomName: string) {
        console.log("here")
        let count = await this.roomRepository.countBy({ name: roomName })
        return count == 0 ? false : true;
    }

    async createRoom(room: RoomInterface, creatorId: number): Promise<RoomInterface> {
        const creator = await this.UserService.getUser2(creatorId);
        const newRoom = await this.addCreatorToRoom(room, creator);
        console.log(newRoom);
        return this.roomRepository.save(newRoom);
    }

    async addCreatorToRoom(room: RoomInterface, creator: UserInterface): Promise<RoomInterface> {
        room.users = [];
        room.users.push(creator);
        room.creatorId = creator.id;
        return (room);
    }

    async addUserToRoom(room: RoomInterface, user: UserInterface): Promise<boolean> {
        const currentRoom = await this.roomRepository.findOneBy({ id: room.id });
        const listUsers = currentRoom.users || [];
        const isUserExist = listUsers.find(element => element === user);
        if (isUserExist == undefined) {
            room.users = room.users || [];
            room.users.push(user);
            this.roomRepository.save(room);
            console.log('success')
            return (true);
        }
        return (false);
    }

    async getRoomsForUsers(userId: number, options: IPaginationOptions): Promise<Pagination<RoomInterface>> {
        const query = this.roomRepository
            .createQueryBuilder('room')
            .leftJoin('room.users', 'user')
            .where('user.id = :userId', { userId })
            .leftJoinAndSelect('room.users', 'all_users')
        return paginate(query, options);
    }

    async getPublicRooms(options: IPaginationOptions): Promise<Pagination<RoomInterface>> {
        const type = 1;
        const query = this.roomRepository
            .createQueryBuilder('room')
            .where('type = :type', { type })
            .leftJoinAndSelect('room.users', 'all_users')
        return paginate(query, options);
    }

    async getRoomById(roomId: number): Promise<RoomInterface> {
        return await this.roomRepository.findOneBy({ id: roomId });
    }

}
