import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { TfaService } from '@nestjs/tfa';
declare const TfaRefreshStrategy_base: new (...args: any[]) => any;
export declare class TfaRefreshStrategy extends TfaRefreshStrategy_base {
    private userService;
    private tfaService;
    constructor(userService: UsersService, tfaService: TfaService);
    validate(req: Request, payload: any): Promise<{
        userId: any;
        username: any;
    }>;
}
export {};
