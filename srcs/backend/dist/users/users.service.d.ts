export declare class User {
    id: number;
    nickname: string;
    fullname: string;
    refreshtoken: string;
    tfa_enabled: boolean;
    tfa_code: string;
    tfa_fulfilled?: boolean;
}
export declare class UsersService {
    users: User[];
    getUser(intra_id: number): Promise<User | undefined>;
    createUser(intra_id: number, login: string, displayname: string): Promise<User | undefined>;
    updateRefreshToken(id: number, token: string): Promise<void>;
    enable2FASecret(id: number, enable?: boolean): Promise<void>;
    set2FASecret(id: number, secret: string): Promise<void>;
    disable2FASecret(id: number, secret: string): Promise<void>;
    getTfaEnabled(id: number): Promise<boolean>;
}
