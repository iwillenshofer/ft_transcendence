import { NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
export declare class AppMiddleware implements NestMiddleware {
    private jwtService;
    constructor(jwtService: JwtService);
    use(req: any, res: any, next: () => void): Promise<void>;
}
