import { Injectable } from '@nestjs/common';
import { RoomEntity } from 'src/chat/models/room.entity';
import { Repository } from 'typeorm';
import { dataSource } from 'src/app.datasource';
import { RoomInterface } from 'src/chat/models/room.interface';
import { UserInterface } from 'src/users/users.interface';

@Injectable()
export class RoomService {

	constructor() {}

	async createRoom(room: RoomInterface, creator: UserInterface): Promise<RoomInterface> {
		const new_room = await this.addCreatorToRoom(room, creator);
		return dataSource.getRepository(RoomEntity).save(new_room);
	}

	async addCreatorToRoom(room: RoomInterface, creator: UserInterface): Promise<RoomInterface> {
		room.users.push(creator);
		return (room);
	}

	async getUserRooms(user_id: number): Promise<RoomInterface[]>{
		const query = dataSource.getRepository(RoomEntity)
		.createQueryBuilder('room')
		.leftJoin('room.users', 'user')
		.where('user.id = :user_id', {user_id});
		return query.getMany();
	}

}

