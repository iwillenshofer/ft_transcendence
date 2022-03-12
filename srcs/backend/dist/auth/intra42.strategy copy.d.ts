declare const Intra42Strategy_base: new (...args: any[]) => import("passport-oauth2");
export declare class Intra42Strategy extends Intra42Strategy_base {
    constructor();
    validate(accessToken: string): Promise<any>;
}
export {};
