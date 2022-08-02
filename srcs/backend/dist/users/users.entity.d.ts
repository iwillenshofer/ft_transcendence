import { RoomEntity } from 'src/chat/models/room.entity';
import { BaseEntity } from 'typeorm';
export declare class UserEntity extends BaseEntity {
    id: number;
    username: string;
    fullname: string;
    avatar_url: string;
    refreshtoken: string;
    tfa_enabled: boolean;
    tfa_code: string;
    rooms: RoomEntity[];
    created_at: Date;
    updated_at: Date;
    tfa_fulfilled: boolean;
}
