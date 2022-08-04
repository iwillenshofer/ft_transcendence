"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var otplib_1 = require("otplib");
var qrcode_1 = require("qrcode");
var app_datasource_1 = require("../app.datasource");
var crypto = require("crypto");
var auth_entity_1 = require("./models/auth.entity");
var AuthService = /** @class */ (function () {
    function AuthService(jwtService, userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }
    AuthService.prototype.getOrCreateUser = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!data || !(data === null || data === void 0 ? void 0 : data.id) || !(data === null || data === void 0 ? void 0 : data.login) || !(data === null || data === void 0 ? void 0 : data.displayname))
                            return [2 /*return*/, (null)];
                        return [4 /*yield*/, this.userService.getUser(data.id)];
                    case 1:
                        user = _a.sent();
                        console.log(user);
                        if (!!user) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.userService.createUser(data.id, data.login, data.displayname, data.image_url)];
                    case 2:
                        user = _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, (user)];
                }
            });
        });
    };
    AuthService.prototype.getAccessToken = function (user, tfa_fulfilled) {
        if (tfa_fulfilled === void 0) { tfa_fulfilled = false; }
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!(tfa_fulfilled)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.userService.getTfaEnabled(user.id)];
                    case 1:
                        tfa_fulfilled = !(_a.sent());
                        _a.label = 2;
                    case 2:
                        payload = { username: user.username, id: user.id, tfa_fulfilled: tfa_fulfilled };
                        return [2 /*return*/, (this.jwtService.sign(payload, { secret: process.env.JWT_SECRET, expiresIn: 3 }))];
                }
            });
        });
    };
    AuthService.prototype.getRefreshToken = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                payload = { username: user.username, id: user.id };
                return [2 /*return*/, (this.jwtService.sign(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: 60 * 60 * 24 * 7 }))];
            });
        });
    };
    /*
    ** callback code
    */
    AuthService.prototype.generateCallbackCode = function (user_id) {
        return __awaiter(this, void 0, void 0, function () {
            var new_code, hexstring, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        new_code = new auth_entity_1.AuthEntity;
                        hexstring = crypto.randomBytes(64).toString('hex');
                        _a = new_code;
                        return [4 /*yield*/, this.userService.getUser(user_id)];
                    case 1:
                        _a.user = _b.sent();
                        console.log(new_code.user);
                        if (!(new_code.user))
                            return [2 /*return*/, (null)];
                        new_code.hash = crypto.pbkdf2Sync(hexstring, process.env.JWT_SECRET, 1000, 64, "sha512").toString("hex");
                        app_datasource_1.dataSource.getRepository(auth_entity_1.AuthEntity).save(new_code);
                        return [2 /*return*/, hexstring];
                }
            });
        });
    };
    AuthService.prototype.retrieveCallbackToken = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var hash, query, now;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hash = crypto.pbkdf2Sync(code, process.env.JWT_SECRET, 1000, 64, "sha512").toString("hex");
                        return [4 /*yield*/, app_datasource_1.dataSource.getRepository(auth_entity_1.AuthEntity)
                                .createQueryBuilder('auth')
                                .leftJoinAndSelect('auth.user', 'user')
                                .where('auth.hash = :hash', { hash: hash }).getOne()];
                    case 1:
                        query = _a.sent();
                        console.log("Query:" + JSON.stringify(query));
                        now = new Date(Date.now());
                        now.setMinutes(now.getMinutes() - 100);
                        if (!(query) || query.created_at < now)
                            return [2 /*return*/, (null)];
                        app_datasource_1.dataSource.getRepository(auth_entity_1.AuthEntity)["delete"](query.id);
                        return [2 /*return*/, { username: query.user.username, id: query.user.id }];
                }
            });
        });
    };
    /*
    ** 2fa Services
    */
    AuthService.prototype.disableTwoFactor = function (user_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.enable2FASecret(user_id, false)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    AuthService.prototype.disableTwoFactor2 = function (user_id, code) {
        return __awaiter(this, void 0, void 0, function () {
            var user_info, _a, _b;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.userService.getUser(user_id)];
                    case 1:
                        user_info = _d.sent();
                        _b = (_a = otplib_1.authenticator).verify;
                        _c = { token: code };
                        return [4 /*yield*/, this.userService.getTfaCode(user_id)];
                    case 2:
                        if (!_b.apply(_a, [(_c.secret = _d.sent(), _c)])) return [3 /*break*/, 6];
                        if (!this.userService.getTfaEnabled(user_id)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.userService.enable2FASecret(user_id, false)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, this.userService.set2FASecret(user_id, '')];
                    case 4:
                        _d.sent();
                        _d.label = 5;
                    case 5: return [2 /*return*/, true];
                    case 6: return [2 /*return*/, false];
                }
            });
        });
    };
    AuthService.prototype.verifyTwoFactor = function (user_id, code) {
        return __awaiter(this, void 0, void 0, function () {
            var user_info, _a, _b;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.userService.getUser(user_id)];
                    case 1:
                        user_info = _d.sent();
                        console.log("tfa user" + JSON.stringify(user_id));
                        _b = (_a = otplib_1.authenticator).verify;
                        _c = { token: code };
                        return [4 /*yield*/, this.userService.getTfaCode(user_id)];
                    case 2:
                        if (!_b.apply(_a, [(_c.secret = _d.sent(), _c)])) return [3 /*break*/, 6];
                        console.log("verification passed");
                        return [4 /*yield*/, this.userService.getTfaEnabled(user_id)];
                    case 3:
                        if (!!(_d.sent())) return [3 /*break*/, 5];
                        console.log("tfa not yet enabled");
                        return [4 /*yield*/, this.userService.enable2FASecret(user_id, true)];
                    case 4:
                        _d.sent();
                        _d.label = 5;
                    case 5: return [2 /*return*/, true];
                    case 6: return [2 /*return*/, false];
                }
            });
        });
    };
    AuthService.prototype.generateQrCode = function (user_id, stream) {
        return __awaiter(this, void 0, void 0, function () {
            var user_info, secret, otp_url, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        console.log("qrcode user " + user_id);
                        return [4 /*yield*/, this.userService.getUser(user_id)];
                    case 1:
                        user_info = _d.sent();
                        if (!this.userService.getTfaEnabled(user_id)) return [3 /*break*/, 3];
                        secret = otplib_1.authenticator.generateSecret();
                        return [4 /*yield*/, this.userService.set2FASecret(user_id, secret)];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        _b = (_a = otplib_1.authenticator).keyuri;
                        _c = [String(user_id), 'ft_transcendence'];
                        return [4 /*yield*/, this.userService.getTfaCode(user_id)];
                    case 4:
                        otp_url = _b.apply(_a, _c.concat([_d.sent()]));
                        return [2 /*return*/, (0, qrcode_1.toFileStream)(stream, otp_url)];
                }
            });
        });
    };
    AuthService = __decorate([
        (0, common_1.Injectable)()
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
