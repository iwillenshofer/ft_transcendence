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
exports.Intra42AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
let Intra42AuthGuard = class Intra42AuthGuard extends (0, passport_1.AuthGuard)('intra42') {
    constructor() {
        super();
    }
    handleRequest(err, user, info, context, status) {
        if (err || !user) {
            console.log('Guard', err);
            throw new common_1.HttpException("Unauthorized", 403);
        }
        return user;
    }
};
Intra42AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], Intra42AuthGuard);
exports.Intra42AuthGuard = Intra42AuthGuard;
//# sourceMappingURL=intra42.guard.js.map