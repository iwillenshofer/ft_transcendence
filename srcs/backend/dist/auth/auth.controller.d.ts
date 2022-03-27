import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
export declare class AuthController {
    private authService;
    private userService;
    constructor(authService: AuthService, userService: UsersService);
    login(req: any): Promise<void>;
    callback(res: any, req: any): Promise<void>;
    profile(req: any): Promise<string>;
    logout(res: any): Promise<{
        msg: string;
    }>;
    refreshToken(res: any, req: any): Promise<void>;
    getdata(req: any): Promise<string>;
    get_qrcode(res: Response, req: any): Promise<any>;
    activate_tfa(req: any): Promise<boolean>;
    verify_tfa(body: any, req: any, res: any): Promise<any>;
}
