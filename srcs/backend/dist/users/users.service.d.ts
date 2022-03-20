export declare class User {
    id: number;
    nickname: string;
    fullname: string;
    refreshtoken: string;
}
export declare class UsersService {
    users: User[];
    getUser(intra_id: number): Promise<User | undefined>;
    createUser(intra_id: number, login: string, displayname: string): Promise<User | undefined>;
    updateRefreshToken(id: number, token: string): Promise<void>;
}
