import { UserEntity } from './users.entity';
import { UserDTO } from './users.dto';
export { UserEntity };
export declare class UsersService {
    getUser(intra_id: number): Promise<UserDTO | null>;
    createUser(intra_id: number, login: string, displayname: string, image_url: string): Promise<UserDTO>;
    updateRefreshToken(id: number, token: string): Promise<void>;
    getRefreshToken(id: number): Promise<string>;
    enable2FASecret(id: number, enable?: boolean): Promise<void>;
    set2FASecret(id: number, secret: string): Promise<void>;
    disable2FASecret(id: number, secret: string): Promise<void>;
    getTfaEnabled(id: number): Promise<boolean>;
    getTfaCode(id: number): Promise<string>;
}
