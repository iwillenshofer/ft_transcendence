declare const Intra42Strategy_base: new (...args: any[]) => any;
export declare class Intra42Strategy extends Intra42Strategy_base {
    constructor();
    validate(accessToken: string): Promise<any>;
}
export {};
