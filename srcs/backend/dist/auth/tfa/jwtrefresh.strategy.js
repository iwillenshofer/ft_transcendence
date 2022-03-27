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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TfaRefreshStrategy = void 0;
const passport_tfa_1 = require("passport-tfa");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const users_service_1 = require("../../users/users.service");
const tfa_1 = require("@nestjs/tfa");
let TfaRefreshStrategy = class TfaRefreshStrategy extends (0, passport_1.PassportStrategy)(passport_tfa_1.Strategy, 'tfa-refresh') {
    constructor(userService, tfaService) {
        super({
            ignoreExpiration: true,
            passReqToCallback: true,
            secretOrKey: process.env.JWT_SECRET,
            tfaFromRequest: passport_tfa_1.ExtractTfa.fromExtractors([(req) => {
                    const data = req === null || req === void 0 ? void 0 : req.cookies['auth'];
                    console.log('cookies: ' + (data === null || data === void 0 ? void 0 : data.token));
                    return (data === null || data === void 0 ? void 0 : data.token);
                }]),
        });
        this.userService = userService;
        this.tfaService = tfaService;
    }
    async validate(req, payload) {
        let data = null;
        let user = null;
        data = req === null || req === void 0 ? void 0 : req.cookies['auth'];
        console.log(data);
        console.log(payload);
        if (!payload || !(data === null || data === void 0 ? void 0 : data.refreshtoken))
            throw new common_1.UnauthorizedException;
        try {
            this.tfaService.verify(data === null || data === void 0 ? void 0 : data.refreshtoken, { secret: process.env.JWT_REFRESH_SECRET });
        }
        catch (err) {
            throw new common_1.UnauthorizedException;
        }
        user = await this.userService.getUser(payload.sub);
        console.log(user);
        if (!user || user.id != payload.sub || user.refreshtoken != data.refreshtoken)
            throw new common_1.UnauthorizedException;
        return { userId: payload.sub, username: payload.username };
    }
};
TfaRefreshStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService, typeof (_a = typeof tfa_1.TfaService !== "undefined" && tfa_1.TfaService) === "function" ? _a : Object])
], TfaRefreshStrategy);
exports.TfaRefreshStrategy = TfaRefreshStrategy;
//# sourceMappingURL=jwtrefresh.strategy.js.map