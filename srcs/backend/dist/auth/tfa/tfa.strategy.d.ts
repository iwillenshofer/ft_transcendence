import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
declare const TfaStrategy_base: new (...args: any[]) => Strategy;
export declare class TfaStrategy extends TfaStrategy_base {
    private userService;
    private jwtService;
    constructor(userService: UsersService, jwtService: JwtService);
    validate(req: Request, payload: any): Promise<any>;
}
export {};
