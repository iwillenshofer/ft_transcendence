import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
declare const JwtRefreshStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    private userService;
    private jwtService;
    constructor(userService: UsersService, jwtService: JwtService);
    validate(req: Request, payload: any): Promise<any>;
}
export {};
