import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UserDTO } from 'src/users/users.dto';
export declare class AuthService {
    private jwtService;
    private userService;
    constructor(jwtService: JwtService, userService: UsersService);
    getOrCreateUser(data: any): Promise<UserDTO>;
    getAccessToken(user: any): Promise<string>;
    getRefreshToken(user: any): Promise<string>;
    disableTwoFactor(user_id: number): Promise<boolean>;
    disableTwoFactor2(user_id: number, code: string): Promise<boolean>;
    verifyTwoFactor(user_id: number, code: string): Promise<boolean>;
    generateQrCode(user_id: number, stream: Response): Promise<any>;
}
