import { Meta } from "./meta.interface";
import { UserInterface } from "./user.interface";

export interface RoomInterface {
    id?: number;
    name?: string;
    name2?: string;
    description?: string;
    type: RoomType;
    creator?: string;
    password?: string;
    users?: UserInterface[];
    created_at?: Date;
    updated_at?: Date;
}

export interface RoomPaginateInterface {
    items: RoomInterface[];
    meta: Meta;
}

export enum RoomType {
    Public = 1,
    Private = 2,
    Protected = 3,
    Direct = 4
}