import { UserEntity } from './users.entity';
export declare class UserDTO {
    id: number;
    username: string;
    fullname: string;
    avatar_url: string;
    tfa_fulfilled?: boolean;
    tfa_enabled?: boolean;
    constructor(id?: number, username?: string, fullname?: string, avatar_url?: string);
    static from(dto: Partial<UserDTO>): UserDTO;
    static fromEntity(entity: UserEntity): UserDTO;
    toEntity(): UserEntity;
}
