/// <reference types="node" />
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { Writable } from 'typeorm/platform/PlatformTools';
export declare class AuthController {
    private authService;
    private userService;
    constructor(authService: AuthService, userService: UsersService);
    login(req: any, hash: any): Promise<void>;
    callback(res: any, req: any): Promise<void>;
    profile(req: any): Promise<string>;
    token(code: any, res: any): Promise<{
        token: string;
    }>;
    logout(res: any): Promise<{
        msg: string;
    }>;
    refreshToken(res: any, req: any): Promise<void>;
    getdata(res: any): Promise<void>;
    get_qrcode(res: Writable, req: any): Promise<any>;
    activate_tfa(req: any): Promise<boolean>;
    verify_tfa(body: any, req: any, res: any): Promise<any>;
}
