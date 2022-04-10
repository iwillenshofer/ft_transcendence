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
exports.JwtRefreshStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const users_service_1 = require("../../users/users.service");
const jwt_1 = require("@nestjs/jwt");
let JwtRefreshStrategy = class JwtRefreshStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-refresh') {
    constructor(userService, jwtService) {
        super({
            ignoreExpiration: true,
            passReqToCallback: true,
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken()
        });
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async validate(req, payload) {
        const refreshtoken = req === null || req === void 0 ? void 0 : req.cookies['refresh_token'];
        if (!payload || !(refreshtoken))
            throw new common_1.UnauthorizedException;
        try {
            await this.jwtService.verify(refreshtoken, { secret: process.env.JWT_REFRESH_SECRET });
        }
        catch (err) {
            throw new common_1.UnauthorizedException;
        }
        const user_refreshtoken = await this.userService.getRefreshToken(payload.id);
        if (!user_refreshtoken || user_refreshtoken != refreshtoken)
            throw new common_1.UnauthorizedException;
        return payload;
    }
};
JwtRefreshStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], JwtRefreshStrategy);
exports.JwtRefreshStrategy = JwtRefreshStrategy;
//# sourceMappingURL=jwtrefresh.strategy.js.map