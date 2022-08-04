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
exports.UsersService = exports.UserEntity = void 0;
var common_1 = require("@nestjs/common");
var users_entity_1 = require("./users.entity");
exports.UserEntity = users_entity_1.UserEntity;
var app_datasource_1 = require("../app.datasource");
var users_dto_1 = require("./users.dto");
/*
** This is basically a the Database... We will implement TypeORM.
*/
var UsersService = /** @class */ (function () {
    function UsersService() {
    }
    UsersService.prototype.getUser = function (intra_id) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('we are here');
                        return [4 /*yield*/, app_datasource_1.dataSource.getRepository(users_entity_1.UserEntity).findOneBy({
                                id: intra_id
                            }).then(function (ret) {
                                if (!ret)
                                    return (null);
                                return (users_dto_1.UserDTO.fromEntity(ret));
                            })];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, (results)];
                }
            });
        });
    };
    UsersService.prototype.createUser = function (intra_id, login, displayname, image_url) {
        return __awaiter(this, void 0, void 0, function () {
            var user, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_datasource_1.dataSource.getRepository(users_entity_1.UserEntity).create({
                            id: intra_id,
                            username: login,
                            fullname: displayname,
                            avatar_url: image_url
                        })];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, app_datasource_1.dataSource.getRepository(users_entity_1.UserEntity).save(user)
                                .then(function (ret) { return users_dto_1.UserDTO.fromEntity(ret); })];
                    case 2:
                        results = _a.sent();
                        return [2 /*return*/, results];
                }
            });
        });
    };
    UsersService.prototype.updateRefreshToken = function (id, token) {
        return __awaiter(this, void 0, void 0, function () {
            var user, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_datasource_1.dataSource.getRepository(users_entity_1.UserEntity).findOneBy({ id: id })];
                    case 1:
                        user = _a.sent();
                        user.refreshtoken = token;
                        return [4 /*yield*/, app_datasource_1.dataSource.getRepository(users_entity_1.UserEntity).save(user)];
                    case 2:
                        results = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.getRefreshToken = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_datasource_1.dataSource.getRepository(users_entity_1.UserEntity).findOneBy({ id: id })];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, (user.refreshtoken)];
                }
            });
        });
    };
    UsersService.prototype.enable2FASecret = function (id, enable) {
        if (enable === void 0) { enable = true; }
        return __awaiter(this, void 0, void 0, function () {
            var user, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_datasource_1.dataSource.getRepository(users_entity_1.UserEntity).findOneBy({ id: id })];
                    case 1:
                        user = _a.sent();
                        user.tfa_enabled = enable;
                        return [4 /*yield*/, app_datasource_1.dataSource.getRepository(users_entity_1.UserEntity).save(user)];
                    case 2:
                        results = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.set2FASecret = function (id, secret) {
        return __awaiter(this, void 0, void 0, function () {
            var user, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_datasource_1.dataSource.getRepository(users_entity_1.UserEntity).findOneBy({ id: id })];
                    case 1:
                        user = _a.sent();
                        user.tfa_code = secret;
                        return [4 /*yield*/, app_datasource_1.dataSource.getRepository(users_entity_1.UserEntity).save(user)];
                    case 2:
                        results = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.disable2FASecret = function (id, secret) {
        return __awaiter(this, void 0, void 0, function () {
            var user, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_datasource_1.dataSource.getRepository(users_entity_1.UserEntity).findOneBy({ id: id })];
                    case 1:
                        user = _a.sent();
                        user.tfa_enabled = false;
                        return [4 /*yield*/, app_datasource_1.dataSource.getRepository(users_entity_1.UserEntity).save(user)];
                    case 2:
                        results = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.getTfaEnabled = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_datasource_1.dataSource.getRepository(users_entity_1.UserEntity).findOneBy({ id: id })];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, (user.tfa_enabled)];
                }
            });
        });
    };
    UsersService.prototype.getTfaCode = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_datasource_1.dataSource.getRepository(users_entity_1.UserEntity).findOneBy({ id: id })];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, (user.tfa_code)];
                }
            });
        });
    };
    UsersService = __decorate([
        (0, common_1.Injectable)()
    ], UsersService);
    return UsersService;
}());
exports.UsersService = UsersService;
