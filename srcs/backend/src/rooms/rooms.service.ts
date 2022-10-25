
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { EncryptService } from 'src/services/encrypt.service';
import { UserInterface } from 'src/users/users.interface';
import { Repository } from 'typeorm';
import { RoomEntity } from './rooms.entity';
import { RoomInterface } from './rooms.interface';

@Injectable()
export class RoomsService {

    constructor(
        @InjectRepository(RoomEntity)
        private roomRepository: Repository<RoomEntity>,
        private readonly encrypt: EncryptService) { }

    async isRoomNameTaken(roomName: string) {
        console.log("here")
        let count = await this.roomRepository.countBy({ name: roomName })
        return count == 0 ? false : true;
    }

    async createRoom(room: RoomInterface, creator: UserInterface): Promise<RoomInterface> {
        const newRoom = await this.addCreatorToRoom(room, creator);
        return this.roomRepository.save(newRoom);
    }

    async addCreatorToRoom(room: RoomInterface, creator: UserInterface): Promise<RoomInterface> {
        room.users.push(creator);
        return (room);
    }

    async getRoomsForUsers(userId: number, options: IPaginationOptions): Promise<Pagination<RoomInterface>> {
        const query = this.roomRepository
            .createQueryBuilder('room')
            .leftJoin('room.users', 'user')
            .where('user.id = :userId', { userId })
            .leftJoinAndSelect('room.users', 'all_users')
        return paginate(query, options);
    }

}
