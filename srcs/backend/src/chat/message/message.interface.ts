import { RoomEntity } from "src/room/room.entity";
import { RoomInterface } from "src/room/room.interface";
import { UserEntity } from "src/user/user.entity";
import { UserInterface } from "src/user/user.interface";

export interface MessageInterface {
    id: number;
    message: String;
    userId: number;
    room: RoomInterface;
    created_at: Date;
}