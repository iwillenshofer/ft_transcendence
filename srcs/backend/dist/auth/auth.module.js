"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const jwt_1 = require("@nestjs/jwt");
const users_module_1 = require("../users/users.module");
const intra42_strategy_1 = require("./intra42/intra42.strategy");
const jwt_strategy_1 = require("./jwt/jwt.strategy");
const jwtrefresh_strategy_1 = require("./jwt/jwtrefresh.strategy");
const tfa_strategy_1 = require("./tfa/tfa.strategy");
const fakeintra42_strategy_1 = require("./intra42/fakeintra42.strategy");
const passport_1 = require("@nestjs/passport");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '60s' },
            })
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, intra42_strategy_1.Intra42Strategy, jwt_strategy_1.JwtStrategy, jwtrefresh_strategy_1.JwtRefreshStrategy, tfa_strategy_1.TfaStrategy, fakeintra42_strategy_1.FakeIntra42Strategy]
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map