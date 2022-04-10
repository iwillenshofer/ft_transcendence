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
const otplib_1 = require("otplib");
const qrcode_1 = require("qrcode");
const users_service_1 = require("../users/users.service");
const app_datasource_1 = require("../app.datasource");
const crypto = require("crypto");
const auth_entity_1 = require("./models/auth.entity");
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
        console.log(user);
        if (!user)
            user = await this.userService.createUser(data.id, data.login, data.displayname);
        return (user);
    }
    async getAccessToken(user, tfa_fulfilled = false) {
        if (!(tfa_fulfilled))
            tfa_fulfilled = await this.userService.getTfaEnabled(user.id);
        const payload = { username: user.username, id: user.id, tfa_fulfilled: tfa_fulfilled };
        return (this.jwtService.sign(payload, { secret: process.env.JWT_SECRET, expiresIn: 3 }));
    }
    async getRefreshToken(user) {
        const tfa_fulfilled = await this.userService.getTfaEnabled(user.id);
        const payload = { username: user.username, id: user.id, tfa_fulfilled: tfa_fulfilled };
        return (this.jwtService.sign(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: 60 * 60 * 24 * 7 }));
    }
    async generateCallbackCode(user_id) {
        let new_code = new auth_entity_1.AuthEntity;
        var hexstring = crypto.randomBytes(64).toString('hex');
        new_code.user = await this.userService.getUser(user_id);
        console.log(new_code.user);
        if (!(new_code.user))
            return (null);
        new_code.hash = crypto.pbkdf2Sync(hexstring, process.env.JWT_SECRET, 1000, 64, `sha512`).toString(`hex`);
        app_datasource_1.dataSource.getRepository(auth_entity_1.AuthEntity).save(new_code);
        return hexstring;
    }
    async retrieveCallbackToken(code) {
        const hash = crypto.pbkdf2Sync(code, process.env.JWT_SECRET, 1000, 64, `sha512`).toString(`hex`);
        const query = await app_datasource_1.dataSource.getRepository(auth_entity_1.AuthEntity)
            .createQueryBuilder('auth')
            .leftJoinAndSelect('auth.user', 'user')
            .where('auth.hash = :hash', { hash }).getOne();
        console.log("Query:" + JSON.stringify(query));
        const now = new Date(Date.now());
        now.setMinutes(now.getMinutes() - 100);
        if (!(query) || query.created_at < now)
            return (null);
        app_datasource_1.dataSource.getRepository(auth_entity_1.AuthEntity).delete(query.id);
        return { username: query.user.username, id: query.user.id };
    }
    async disableTwoFactor(user_id) {
        await this.userService.enable2FASecret(user_id, false);
        return true;
    }
    async disableTwoFactor2(user_id, code) {
        const user_info = await this.userService.getUser(user_id);
        if (otplib_1.authenticator.verify({ token: code, secret: await this.userService.getTfaCode(user_id) })) {
            if (this.userService.getTfaEnabled(user_id)) {
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
        if (otplib_1.authenticator.verify({ token: code, secret: await this.userService.getTfaCode(user_id) })) {
            console.log("verification passed");
            if (!(await this.userService.getTfaEnabled(user_id))) {
                console.log("tfa not yet enabled");
                await this.userService.enable2FASecret(user_id, true);
            }
            return true;
        }
        return false;
    }
    async generateQrCode(user_id, stream) {
        console.log("qrcode user " + user_id);
        let user_info = await this.userService.getUser(user_id);
        if (this.userService.getTfaEnabled(user_id)) {
            const secret = otplib_1.authenticator.generateSecret();
            await this.userService.set2FASecret(user_id, secret);
        }
        const otp_url = otplib_1.authenticator.keyuri(String(user_id), 'ft_transcendence', await this.userService.getTfaCode(user_id));
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