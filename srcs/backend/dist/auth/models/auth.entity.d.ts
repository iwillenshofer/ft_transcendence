import { UserEntity } from 'src/users/users.entity';
import { BaseEntity } from 'typeorm';
export declare class AuthEntity extends BaseEntity {
    id: number;
    user: UserEntity;
    hash: string;
    used: boolean;
    created_at: Date;
    updated_at: Date;
}
