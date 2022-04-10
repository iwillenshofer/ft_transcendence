import { UserEntity } from 'src/users/users.entity';
export declare class RoomEntity {
    id: number;
    name: string;
    description: string;
    users: UserEntity[];
    created_at: Date;
    updated_at: Date;
}
