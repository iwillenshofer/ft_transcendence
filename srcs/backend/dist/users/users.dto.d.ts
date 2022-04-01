import { User } from './users.entity';
export declare class UserDTO {
    id: number;
    username: string;
    fullname: string;
    tfa_fulfilled?: boolean;
    tfa_enabled?: boolean;
    constructor(id?: number, username?: string, fullname?: string);
    static from(dto: Partial<UserDTO>): UserDTO;
    static fromEntity(entity: User): UserDTO;
    toEntity(): User;
}
