declare const TfaStrategy_base: new (...args: any[]) => any;
export declare class TfaStrategy extends TfaStrategy_base {
    constructor();
    validate(payload: any): Promise<{
        userId: any;
        username: any;
    }>;
}
export {};
