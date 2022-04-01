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
let AuthController = class AuthController {
    constructor(authService, userService) {
        this.authService = authService;
        this.userService = userService;
    }
    async login(req) {
        console.log("login attempt", req);
    }
    async callback(res, req) {
        console.log(req.user);
        if (req.user) {
            console.log('user:' + JSON.stringify(req.user));
            const token = await this.authService.getAccessToken(req.user);
            const refreshtoken = await this.authService.getRefreshToken(req.user);
            const tfa_fulfilled = !(await this.userService.getTfaEnabled(req.user.id));
            const auth_cookie = { token: token, refreshtoken: refreshtoken, tfa_fulfilled: tfa_fulfilled };
            res.cookie('auth', auth_cookie, { httpOnly: true });
            console.log("User Json: " + JSON.stringify(req.user));
            await this.userService.updateRefreshToken(req.user.id, refreshtoken);
            res.status(200).redirect('/login/callback');
        }
        else
            res.sendStatus(401);
    }
    async profile(req) {
        var _a, _b;
        console.log(JSON.stringify(req.user));
        console.log("finding id: " + req.user.id);
        console.log("profile-cookie" + JSON.stringify((_a = req.cookies['auth']) === null || _a === void 0 ? void 0 : _a.tfa_fulfilled));
        let user = await this.userService.getUser(req.user.id);
        const tfa_fulfilled = (!(this.userService.getTfaEnabled(req.user.id)) || ((_b = req.cookies['auth']) === null || _b === void 0 ? void 0 : _b.tfa_fulfilled));
        user.tfa_fulfilled = tfa_fulfilled;
        console.log("user: " + JSON.stringify(user));
        return (JSON.stringify(user));
    }
    async logout(res) {
        res.clearCookie('auth', { httpOnly: true });
        return { msg: "success" };
    }
    async refreshToken(res, req) {
        var _a, _b;
        console.log("User Json: " + JSON.stringify(req.user));
        const token = await this.authService.getAccessToken(req.user);
        const refreshtoken = (_a = req.cookies['auth']) === null || _a === void 0 ? void 0 : _a.refreshtoken;
        const tfa_fulfilled = (_b = req.cookies['auth']) === null || _b === void 0 ? void 0 : _b.tfa_fulfilled;
        const auth_cookie = { token: token, refreshtoken: refreshtoken, tfa_fulfilled: tfa_fulfilled };
        res.clearCookie('auth', { httpOnly: true });
        res.cookie('auth', auth_cookie, { httpOnly: true }).send(JSON.stringify({ msg: "success" }));
    }
    async getdata(req) {
        return JSON.stringify({ msg: "success" });
    }
    async get_qrcode(res, req) {
        console.log('tfa qrcode' + JSON.stringify(req.user));
        return await this.authService.generateQrCode(req.user.id, res);
    }
    async activate_tfa(req) {
        console.log('tfa qrcode' + JSON.stringify(req.user));
        return await this.authService.disableTwoFactor(req.user.id);
    }
    async verify_tfa(body, req, res) {
        var _a, _b;
        console.log('tfa verify' + JSON.stringify(req.user));
        console.log('tfa code' + JSON.stringify(body.code));
        const verified = await this.authService.verifyTwoFactor(req.user.id, body.code);
        console.log("verified " + verified);
        if (verified) {
            const auth_cookie = { token: (_a = req.cookies['auth']) === null || _a === void 0 ? void 0 : _a.token, refreshtoken: (_b = req.cookies['auth']) === null || _b === void 0 ? void 0 : _b.refreshtoken, tfa_fulfilled: true };
            res.clearCookie('auth', { httpOnly: true });
            res.cookie('auth', auth_cookie, { httpOnly: true });
        }
        res.send(JSON.stringify({ msg: verified }));
        return;
    }
};
__decorate([
    (0, common_1.UseGuards)(intra42_guard_1.Intra42Guard),
    (0, common_1.Get)("login"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
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
    __param(0, (0, common_1.Request)()),
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
    __metadata("design:paramtypes", [Object, Object]),
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