/// <reference types="node" />
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UserDTO } from 'src/users/users.dto';
import { Writable } from 'typeorm/platform/PlatformTools';
export declare class AuthService {
    private jwtService;
    private userService;
    constructor(jwtService: JwtService, userService: UsersService);
    getOrCreateUser(data: any): Promise<UserDTO>;
    getAccessToken(user: any, tfa_fulfilled?: boolean): Promise<string>;
    getRefreshToken(user: any): Promise<string>;
    generateCallbackCode(user_id: number): Promise<string>;
    retrieveCallbackToken(code: string): Promise<{
        username: string;
        id: number;
    } | null>;
    disableTwoFactor(user_id: number): Promise<boolean>;
    disableTwoFactor2(user_id: number, code: string): Promise<boolean>;
    verifyTwoFactor(user_id: number, code: string): Promise<boolean>;
    generateQrCode(user_id: number, stream: Writable): Promise<any>;
}
