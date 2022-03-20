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
            const auth_cookie = { token: token, refreshtoken: refreshtoken };
            res.cookie('auth', auth_cookie, { httpOnly: true });
            console.log("User Json: " + JSON.stringify(req.user));
            this.userService.updateRefreshToken(req.user.id, refreshtoken);
            res.status(200).redirect('/login/callback');
        }
        else
            res.sendStatus(401);
    }
    async profile(req) {
        console.log(JSON.stringify(req.user));
        console.log('user-list: ' + JSON.stringify(this.userService.users));
        console.log("finding id: " + req.user.userId);
        let user = await this.userService.getUser(req.user.userId);
        console.log("user: " + JSON.stringify(user));
        return (JSON.stringify(user));
    }
    async logout(res) {
        res.clearCookie('auth', { httpOnly: true });
        return { msg: "success" };
    }
    async refreshToken(res, req) {
        console.log("User Json: " + JSON.stringify(req.user));
        const token = await this.authService.getAccessToken(req.user);
        const refreshtoken = await this.authService.getRefreshToken(req.user);
        const auth_cookie = { token: token, refreshtoken: refreshtoken };
        await this.userService.updateRefreshToken(req.user.userId, refreshtoken);
        res.clearCookie('auth', { httpOnly: true });
        res.cookie('auth', auth_cookie, { httpOnly: true }).send();
    }
    async getdata(req) {
        return JSON.stringify({ msg: "success" });
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
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Get)('data'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getdata", null);
AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map