declare const Intra42AuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class Intra42AuthGuard extends Intra42AuthGuard_base {
    constructor();
    handleRequest(err: any, user: any, info: any, context: any, status: any): any;
}
export {};
