import { Strategy } from "passport-strategy";
import { AuthService } from "../auth.service";
import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
declare const FakeIntra42Strategy_base: new (...args: any[]) => Strategy;
export declare class FakeIntra42Strategy extends FakeIntra42Strategy_base {
    private authService;
    constructor(authService: AuthService);
    authenticate(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, options?: any): Promise<void>;
    validate(): Promise<any>;
}
export {};
