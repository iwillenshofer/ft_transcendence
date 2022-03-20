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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(jwtService, userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }
    async getOrCreateUser(data) {
        let user;
        if (!data || !(data === null || data === void 0 ? void 0 : data.id) || !(data === null || data === void 0 ? void 0 : data.login) || !(data === null || data === void 0 ? void 0 : data.displayname))
            return (null);
        user = await this.userService.getUser(data.id);
        if (user) {
            return (user);
        }
        else
            return (await this.userService.createUser(data.id, data.login, data.displayname));
    }
    async getAccessToken(user) {
        const payload = { username: user.nickname, sub: user.id };
        return (this.jwtService.sign(payload, { secret: process.env.JWT_SECRET, expiresIn: 10 }));
    }
    async getRefreshToken(user) {
        const payload = { username: user.nickname, sub: user.id };
        return (this.jwtService.sign(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: 100 }));
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map