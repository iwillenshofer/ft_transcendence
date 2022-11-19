import { MessageInterface } from "../components/chat/models/message.interface";
import { Meta } from "./meta.interface";
import { RoomInterface } from "./room.interface";
import { UserInterface } from "./user.interface";

export interface Message {
    id?: number;
    message: string;
    user?: UserInterface;
    room: RoomInterface;
    created_at?: Date;
}

export interface MessagePaginateInterface {
    items: MessageInterface[];
    meta: Meta;
}