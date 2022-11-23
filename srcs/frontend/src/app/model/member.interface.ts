import { MessageInterface } from "../components/chat/models/message.interface";
import { UserInterface } from "./user.interface";

export interface MemberInterface {
    id?: number;
    user: UserInterface;
    role: MemberRole;
    socketId?: string;
    messages: MessageInterface[];
}

export enum MemberRole {
    Owner = 1,
    Administrator = 2,
    Member = 3
}