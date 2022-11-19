import { RoomInterface } from "src/app/model/room.interface";
import { MemberInterface } from "./member.interface";

export interface MessageInterface {
    id?: number;
    message: string;
    member: MemberInterface;
    room: RoomInterface;
    created_at?: Date;
}