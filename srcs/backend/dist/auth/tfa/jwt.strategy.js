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
exports.TfaStrategy = void 0;
const passport_tfa_1 = require("passport-tfa");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
let TfaStrategy = class TfaStrategy extends (0, passport_1.PassportStrategy)(passport_tfa_1.Strategy, 'tfa') {
    constructor() {
        super({
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
            tfaFromRequest: passport_tfa_1.ExtractTfa.fromExtractors([(req) => {
                    const data = req === null || req === void 0 ? void 0 : req.cookies['auth'];
                    console.log('cookies: ' + (data === null || data === void 0 ? void 0 : data.token));
                    return (data === null || data === void 0 ? void 0 : data.token);
                }]),
        });
    }
    async validate(payload) {
        if (!payload || !payload.sub)
            throw new common_1.UnauthorizedException;
        console.log(payload.username);
        return { userId: payload.sub, username: payload.username };
    }
};
TfaStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], TfaStrategy);
exports.TfaStrategy = TfaStrategy;
//# sourceMappingURL=jwt.strategy.js.map