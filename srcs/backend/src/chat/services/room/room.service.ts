import { Injectable } from '@nestjs/common';
import { RoomEntity } from 'src/chat/models/room.entity';
import { RoomInterface } from 'src/chat/models/room.interface';
import { UserInterface } from 'src/users/users.interface';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class RoomService {

	constructor(
		@InjectRepository(RoomEntity)
		private readonly roomRepository: Repository<RoomEntity>
	) { }

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
