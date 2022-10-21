import { Meta } from "./meta.interface";
import { UserInterface } from "./user.interface";

export interface RoomInterface {
    id?: number;
    name?: string;
    description?: string;
    users?: UserInterface[];
    created_at?: Date;
    updated_at?: Date;
}

export interface RoomPaginateInterface {
    items: RoomInterface[];
    meta: Meta;
}