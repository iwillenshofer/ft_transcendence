import { UserInterface } from "src/app/model/user.interface";
import { MessageInterface } from "./message.interface";

export interface MemberInterface {
    id?: number;
    user: UserInterface;
    socketId?: string;
    messages?: MessageInterface[];
    created_at?: Date;
}
