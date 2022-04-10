import { RoomInterface } from "src/chat/models/room.interface";

export interface UserInterface {
    id?: number;
    username?: string;
    fullname?: string;
    refreshtoken?: string;
    tfa_enabled?: boolean;
    tfa_code?: string;
		rooms?: RoomInterface[];
    created_at?: Date;
    updated_at?: Date;
}
