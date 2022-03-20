import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.service';
export declare class AuthService {
    private jwtService;
    private userService;
    constructor(jwtService: JwtService, userService: UsersService);
    getOrCreateUser(data: any): Promise<User | undefined>;
    getAccessToken(user: any): Promise<string>;
    getRefreshToken(user: any): Promise<string>;
}
