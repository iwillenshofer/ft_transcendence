"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthModule = void 0;
var fakeintra42_strategy_1 = require("./intra42/fakeintra42.strategy");
var common_1 = require("@nestjs/common");
var auth_controller_1 = require("./auth.controller");
var auth_service_1 = require("./auth.service");
var jwt_1 = require("@nestjs/jwt");
var users_module_1 = require("../users/users.module");
var intra42_strategy_1 = require("./intra42/intra42.strategy");
var jwt_strategy_1 = require("./jwt/jwt.strategy");
var jwtrefresh_strategy_1 = require("./jwt/jwtrefresh.strategy");
var tfa_strategy_1 = require("./tfa/tfa.strategy");
var passport_1 = require("@nestjs/passport");
var AuthModule = /** @class */ (function () {
    function AuthModule() {
    }
    AuthModule = __decorate([
        (0, common_1.Module)({
            imports: [
                users_module_1.UsersModule,
                passport_1.PassportModule,
                jwt_1.JwtModule.register({
                    secret: process.env.JWT_SECRET,
                    signOptions: { expiresIn: '60s' }
                })
            ],
            controllers: [auth_controller_1.AuthController],
            providers: [auth_service_1.AuthService, intra42_strategy_1.Intra42Strategy, jwt_strategy_1.JwtStrategy, jwtrefresh_strategy_1.JwtRefreshStrategy, tfa_strategy_1.TfaStrategy, fakeintra42_strategy_1.FakeIntra42Strategy]
        })
    ], AuthModule);
    return AuthModule;
}());
exports.AuthModule = AuthModule;
