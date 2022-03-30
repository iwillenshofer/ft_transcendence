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
const otplib_1 = require("otplib");
const qrcode_1 = require("qrcode");
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
        if (!user)
            user = await this.userService.createUser(data.id, data.login, data.displayname);
        return (user);
    }
    async getAccessToken(user) {
        const payload = { username: user.username, id: user.id };
        return (this.jwtService.sign(payload, { secret: process.env.JWT_SECRET, expiresIn: 60 * 15 }));
    }
    async getRefreshToken(user) {
        const payload = { username: user.username, id: user.id };
        return (this.jwtService.sign(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: 60 * 60 * 24 * 7 }));
    }
    async disableTwoFactor(user_id) {
        const user_info = await this.userService.getUser(user_id);
        await this.userService.enable2FASecret(user_id, false);
        return true;
    }
    async disableTwoFactor2(user_id, code) {
        const user_info = await this.userService.getUser(user_id);
        if (otplib_1.authenticator.verify({ token: code, secret: user_info.tfa_code })) {
            if (user_info.tfa_enabled) {
                await this.userService.enable2FASecret(user_id, false);
                await this.userService.set2FASecret(user_id, '');
            }
            return true;
        }
        return false;
    }
    async verifyTwoFactor(user_id, code) {
        const user_info = await this.userService.getUser(user_id);
        console.log("tfa user" + JSON.stringify(user_id));
        console.log("code: " + JSON.stringify(code) + ", tfa:" + user_info.tfa_code);
        if (otplib_1.authenticator.verify({ token: code, secret: user_info.tfa_code })) {
            if (!user_info.tfa_enabled)
                await this.userService.enable2FASecret(user_id);
            return true;
        }
        return false;
    }
    async generateQrCode(user_id, stream) {
        console.log("qrcode user " + user_id);
        let user_info = await this.userService.getUser(user_id);
        if (!user_info.tfa_code) {
            const secret = otplib_1.authenticator.generateSecret();
            await this.userService.set2FASecret(user_id, secret);
            user_info.tfa_code = secret;
        }
        const otp_url = otplib_1.authenticator.keyuri(String(user_id), 'ft_transcendence', user_info.tfa_code);
        return (0, qrcode_1.toFileStream)(stream, otp_url);
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map