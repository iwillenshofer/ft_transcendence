"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Intra42Strategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_oauth2_1 = require("passport-oauth2");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const auth_service_1 = require("../auth.service");
let Intra42Strategy = class Intra42Strategy extends (0, passport_1.PassportStrategy)(passport_oauth2_1.Strategy, "intra42") {
    constructor(authService) {
        super({
            passReqToCallback: true,
            clientID: process.env.CLIENT_ID,
            authorizationURL: process.env.BASE_URL + "/oauth/authorize",
            tokenURL: process.env.BASE_URL + "/oauth/token",
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "/auth/callback",
        });
        this.authService = authService;
    }
    async validate(req, accessToken, refreshToken) {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(req.url);
        let user = null;
        let httpservice = new axios_1.HttpService;
        let header = { Authorization: `Bearer ${accessToken}` };
        try {
            const req = await httpservice.get(process.env.BASE_URL + "/v2/me", { headers: header });
            console.log(req);
            const data = await (0, rxjs_1.lastValueFrom)(req);
            console.log(data);
            user = await this.authService.getOrCreateUser(data.data);
            if (!user)
                throw new common_1.UnauthorizedException();
        }
        catch (error) {
            throw new common_1.UnauthorizedException();
        }
        return (user);
    }
};
Intra42Strategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], Intra42Strategy);
exports.Intra42Strategy = Intra42Strategy;
//# sourceMappingURL=intra42.strategy.js.map