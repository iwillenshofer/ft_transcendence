import { AuthService } from "../auth.service";
declare const Intra42Strategy_base: new (...args: any[]) => any;
export declare class Intra42Strategy extends Intra42Strategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(accessToken: string, refreshToken: string): Promise<any>;
}
export {};
