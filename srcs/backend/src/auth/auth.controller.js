"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.AuthController = void 0;
var common_1 = require("@nestjs/common");
var jwt_guard_1 = require("./jwt/jwt.guard");
var jwtrefresh_guard_1 = require("./jwt/jwtrefresh.guard");
var intra42_guard_1 = require("./intra42/intra42.guard");
var tfa_guard_1 = require("./tfa/tfa.guard");
var users_dto_1 = require("../users/users.dto");
var AuthController = /** @class */ (function () {
    function AuthController(authService, userService) {
        this.authService = authService;
        this.userService = userService;
    }
    /*
    ** login routed, requested by the frontend (/auth/login)
    ** since the user is not logged in yet, only intra42 guard is used
    */
    // @UseGuards(FakeIntra42Guard)
    AuthController.prototype.login = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    /*
    ** /auth/callback is the intra's return
    */
    // @UseGuards(FakeIntra42Guard)
    AuthController.prototype.callback = function (res, req) {
        return __awaiter(this, void 0, void 0, function () {
            var random_code;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(req.user);
                        if (!req.user) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.authService.generateCallbackCode(req.user.id)];
                    case 1:
                        random_code = _a.sent();
                        res.status(200).redirect('/login/callback?code=' + random_code);
                        return [3 /*break*/, 3];
                    case 2:
                        res.sendStatus(401);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.profile = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var user, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        console.log("user-profile:" + JSON.stringify(req.user));
                        _b = (_a = users_dto_1.UserDTO).from;
                        return [4 /*yield*/, this.userService.getUser(req.user.id)];
                    case 1:
                        user = _b.apply(_a, [_d.sent()]);
                        _c = user;
                        return [4 /*yield*/, this.userService.getTfaEnabled(req.user.id)];
                    case 2:
                        _c.tfa_fulfilled = (!(_d.sent()) || req.user.tfa_fulfilled);
                        console.log("user dto:" + JSON.stringify(user));
                        return [2 /*return*/, (JSON.stringify(user))];
                }
            });
        });
    };
    AuthController.prototype.token = function (code, res) {
        return __awaiter(this, void 0, void 0, function () {
            var callback_code, refreshtoken, callback_token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.retrieveCallbackToken(code)];
                    case 1:
                        callback_code = _a.sent();
                        if (!(callback_code)) {
                            res.sendStatus(401);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.authService.getRefreshToken({ username: callback_code.username, id: callback_code.id })];
                    case 2:
                        refreshtoken = _a.sent();
                        return [4 /*yield*/, this.authService.getAccessToken({ username: callback_code.username, id: callback_code.id })];
                    case 3:
                        callback_token = _a.sent();
                        res.cookie('refresh_token', refreshtoken, { httpOnly: true });
                        return [4 /*yield*/, this.userService.updateRefreshToken(callback_code.id, refreshtoken)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, { token: callback_token }];
                }
            });
        });
    };
    /*
    **
    */
    AuthController.prototype.logout = function (res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.clearCookie('refresh_token', { httpOnly: true });
                return [2 /*return*/, { msg: "success" }];
            });
        });
    };
    /*
    ** refresh Token
    */
    AuthController.prototype.refreshToken = function (res, req) {
        return __awaiter(this, void 0, void 0, function () {
            var token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.getAccessToken(req.user, req.user.tfa_fulfilled)];
                    case 1:
                        token = _a.sent();
                        res.status(200).send({ token: token });
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
    ** sample of endpoint
    */
    AuthController.prototype.getdata = function (res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.status(200).send({ msg: 'success' });
                return [2 /*return*/];
            });
        });
    };
    /*
    ** 2FA
    */
    AuthController.prototype.get_qrcode = function (res, req) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.generateQrCode(req.user.id, res)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AuthController.prototype.activate_tfa = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.disableTwoFactor(req.user.id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AuthController.prototype.verify_tfa = function (body, req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var verified;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.verifyTwoFactor(req.user.id, body.code)];
                    case 1:
                        verified = _a.sent();
                        res.send(JSON.stringify({ msg: verified }));
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, common_1.UseGuards)(intra42_guard_1.Intra42Guard),
        (0, common_1.Get)("login"),
        __param(0, (0, common_1.Request)()),
        __param(1, (0, common_1.Response)())
    ], AuthController.prototype, "login");
    __decorate([
        (0, common_1.UseGuards)(intra42_guard_1.Intra42Guard),
        (0, common_1.Get)("callback"),
        __param(0, (0, common_1.Response)()),
        __param(1, (0, common_1.Request)())
    ], AuthController.prototype, "callback");
    __decorate([
        (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
        (0, common_1.Get)('profile'),
        __param(0, (0, common_1.Request)())
    ], AuthController.prototype, "profile");
    __decorate([
        (0, common_1.Get)('token/:code'),
        __param(0, (0, common_1.Param)('code')),
        __param(1, (0, common_1.Res)({ passthrough: true }))
    ], AuthController.prototype, "token");
    __decorate([
        (0, common_1.Get)('logout'),
        __param(0, (0, common_1.Res)({ passthrough: true }))
    ], AuthController.prototype, "logout");
    __decorate([
        (0, common_1.UseGuards)(jwtrefresh_guard_1.JwtRefreshGuard),
        (0, common_1.Get)('refreshtoken'),
        __param(0, (0, common_1.Response)()),
        __param(1, (0, common_1.Request)())
    ], AuthController.prototype, "refreshToken");
    __decorate([
        (0, common_1.UseGuards)(tfa_guard_1.TfaGuard),
        (0, common_1.Get)('data'),
        __param(0, (0, common_1.Response)())
    ], AuthController.prototype, "getdata");
    __decorate([
        (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
        (0, common_1.Get)('tfa_qrcode'),
        (0, common_1.Header)('content-type', 'image/png'),
        __param(0, (0, common_1.Res)()),
        __param(1, (0, common_1.Request)())
    ], AuthController.prototype, "get_qrcode");
    __decorate([
        (0, common_1.UseGuards)(tfa_guard_1.TfaGuard),
        (0, common_1.Post)('tfa_disable'),
        __param(0, (0, common_1.Request)())
    ], AuthController.prototype, "activate_tfa");
    __decorate([
        (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
        (0, common_1.Post)('tfa_verify'),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Request)()),
        __param(2, (0, common_1.Response)())
    ], AuthController.prototype, "verify_tfa");
    AuthController = __decorate([
        (0, common_1.Controller)("auth")
    ], AuthController);
    return AuthController;
}());
exports.AuthController = AuthController;
