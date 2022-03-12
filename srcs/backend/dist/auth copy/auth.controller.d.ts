import { Response } from 'express';
export declare class AuthController {
    login(): void;
    status(): void;
    logout(): void;
    callback(res: Response): void;
}
