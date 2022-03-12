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
const intra42_guard_1 = require("./intra42.guard");
let AuthController = class AuthController {
    login() {
        return;
    }
    status() {
    }
    logout() {
    }
    callback(res) {
        res.sendStatus(200);
    }
};
__decorate([
    (0, common_1.Get)("login"),
    (0, common_1.UseGuards)(intra42_guard_1.Intra42AuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)("status"),
    (0, common_1.UseGuards)(intra42_guard_1.Intra42AuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "status", null);
__decorate([
    (0, common_1.Get)("logout"),
    (0, common_1.UseGuards)(intra42_guard_1.Intra42AuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)("callback"),
    (0, common_1.UseGuards)(intra42_guard_1.Intra42AuthGuard),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "callback", null);
AuthController = __decorate([
    (0, common_1.Controller)("auth")
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map