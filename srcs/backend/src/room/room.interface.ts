import { MessageInterface } from "src/chat/message/message.interface";
import { UserInterface } from "src/user/user.interface";

export interface RoomInterface {
    id?: number;
    name?: string;
    description?: string;
    type: RoomType;
    creatorId: number;
    password: string;
    users?: UserInterface[];
    messages?: MessageInterface[];
    created_at?: Date;
    updated_at?: Date;
}

export enum RoomType {
    Public,
    Private,
    Protected,
}