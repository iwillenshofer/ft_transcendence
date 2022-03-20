declare const Intra42Guard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class Intra42Guard extends Intra42Guard_base {
    constructor();
    handleRequest(err: any, user: any, info: any, context: any, status: any): any;
}
export {};
