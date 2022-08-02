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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const jwt_guard_1 = require("./jwt/jwt.guard");
const jwtrefresh_guard_1 = require("./jwt/jwtrefresh.guard");
const intra42_guard_1 = require("./intra42/intra42.guard");
const tfa_guard_1 = require("./tfa/tfa.guard");
const users_service_1 = require("../users/users.service");
const PlatformTools_1 = require("typeorm/platform/PlatformTools");
const users_dto_1 = require("../users/users.dto");
let AuthController = class AuthController {
    constructor(authService, userService) {
        this.authService = authService;
        this.userService = userService;
    }
    async login(req, res) {
        return;
    }
    async callback(res, req) {
        console.log(req.user);
        if (req.user) {
            const random_code = await this.authService.generateCallbackCode(req.user.id);
            res.status(200).redirect('/login/callback?code=' + random_code);
        }
        else
            res.sendStatus(401);
    }
    async profile(req) {
        console.log("user-profile:" + JSON.stringify(req.user));
        let user = users_dto_1.UserDTO.from(await this.userService.getUser(req.user.id));
        user.tfa_fulfilled = (!(await this.userService.getTfaEnabled(req.user.id)) || req.user.tfa_fulfilled);
        console.log("user dto:" + JSON.stringify(user));
        return (JSON.stringify(user));
    }
    async token(code, res) {
        const callback_code = await this.authService.retrieveCallbackToken(code);
        if (!(callback_code)) {
            res.sendStatus(401);
            return;
        }
        const refreshtoken = await this.authService.getRefreshToken({ username: callback_code.username, id: callback_code.id });
        const callback_token = await this.authService.getAccessToken({ username: callback_code.username, id: callback_code.id });
        res.cookie('refresh_token', refreshtoken, { httpOnly: true });
        await this.userService.updateRefreshToken(callback_code.id, refreshtoken);
        return { token: callback_token };
    }
    async logout(res) {
        res.clearCookie('refresh_token', { httpOnly: true });
        return { msg: "success" };
    }
    async refreshToken(res, req) {
        const token = await this.authService.getAccessToken(req.user, req.user.tfa_fulfilled);
        res.status(200).send({ token: token });
    }
    async getdata(res) {
        res.status(200).send({ msg: 'success' });
    }
    async get_qrcode(res, req) {
        return await this.authService.generateQrCode(req.user.id, res);
    }
    async activate_tfa(req) {
        return await this.authService.disableTwoFactor(req.user.id);
    }
    async verify_tfa(body, req, res) {
        const verified = await this.authService.verifyTwoFactor(req.user.id, body.code);
        res.send(JSON.stringify({ msg: verified }));
        return;
    }
};
__decorate([
    (0, common_1.UseGuards)(intra42_guard_1.Intra42Guard),
    (0, common_1.Get)("login"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(intra42_guard_1.Intra42Guard),
    (0, common_1.Get)("callback"),
    __param(0, (0, common_1.Response)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "callback", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "profile", null);
__decorate([
    (0, common_1.Get)('token/:code'),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "token", null);
__decorate([
    (0, common_1.Get)('logout'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(jwtrefresh_guard_1.JwtRefreshGuard),
    (0, common_1.Get)('refreshtoken'),
    __param(0, (0, common_1.Response)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.UseGuards)(tfa_guard_1.TfaGuard),
    (0, common_1.Get)('data'),
    __param(0, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getdata", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Get)('tfa_qrcode'),
    (0, common_1.Header)('content-type', 'image/png'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlatformTools_1.Writable, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "get_qrcode", null);
__decorate([
    (0, common_1.UseGuards)(tfa_guard_1.TfaGuard),
    (0, common_1.Post)('tfa_disable'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "activate_tfa", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Post)('tfa_verify'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify_tfa", null);
AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map