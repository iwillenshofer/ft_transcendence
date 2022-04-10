import { UserInterface } from "src/users/users.interface";
export interface RoomInterface {
    id?: number;
    name?: string;
    description?: string;
    users?: UserInterface[];
    created_at?: Date;
    updated_at?: Date;
}
