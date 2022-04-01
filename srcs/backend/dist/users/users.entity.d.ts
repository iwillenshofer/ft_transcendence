import { BaseEntity } from 'typeorm';
export declare class User extends BaseEntity {
    id: number;
    username: string;
    fullname: string;
    refreshtoken: string;
    tfa_enabled: boolean;
    tfa_code: string;
    created_at: Date;
    updated_at: Date;
    tfa_fulfilled: boolean;
}
