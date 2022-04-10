import { RoomInterface } from 'src/chat/models/room.interface';
import { UserInterface } from 'src/users/users.interface';
export declare class RoomService {
    constructor();
    createRoom(room: RoomInterface, creator: UserInterface): Promise<RoomInterface>;
    addCreatorToRoom(room: RoomInterface, creator: UserInterface): Promise<RoomInterface>;
    getUserRooms(user_id: number): Promise<RoomInterface[]>;
}
