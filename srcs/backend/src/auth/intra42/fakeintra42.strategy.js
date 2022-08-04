"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.FakeIntra42Strategy = void 0;
var common_1 = require("@nestjs/common");
var passport_1 = require("@nestjs/passport");
var passport_strategy_1 = require("passport-strategy");
/*
** implements a Fake strategy that generates a random User
*/
var FakeIntra42Strategy = /** @class */ (function (_super) {
    __extends(FakeIntra42Strategy, _super);
    function FakeIntra42Strategy(authService) {
        var _this = _super.call(this) || this;
        _this.authService = authService;
        return _this;
    }
    FakeIntra42Strategy.prototype.authenticate = function (req, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(req.url == '/auth/login')) return [3 /*break*/, 1];
                        this.redirect('/auth/callback');
                        return [3 /*break*/, 3];
                    case 1:
                        _a = this.success;
                        return [4 /*yield*/, this.validate()];
                    case 2:
                        _a.apply(this, [_b.sent()]);
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FakeIntra42Strategy.prototype.validate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var user, this_user, idx, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        this_user = [
                            { id: 19219, login: 'login1', displayname: 'displayname1', image_url: 'https://i.imgflip.com/19d7hr.jpg' },
                            { id: 19220, login: 'login2', displayname: 'displayname2', image_url: 'https://i.imgflip.com/19d7hr.jpg' },
                            { id: 19221, login: 'login3', displayname: 'displayname3', image_url: 'https://i.imgflip.com/19d7hr.jpg' },
                            { id: 19222, login: 'login4', displayname: 'displayname4', image_url: 'https://i.imgflip.com/19d7hr.jpg' },
                            { id: 19223, login: 'login5', displayname: 'displayname5', image_url: 'https://i.imgflip.com/19d7hr.jpg' },
                            { id: 19224, login: 'login6', displayname: 'displayname6', image_url: 'https://i.imgflip.com/19d7hr.jpg' }
                        ];
                        idx = Math.floor(Math.random() * (this_user.length));
                        console.log('IDX:' + idx);
                        return [4 /*yield*/, this.authService.getOrCreateUser(this_user[idx])];
                    case 2:
                        user = _a.sent();
                        if (!user)
                            throw new common_1.UnauthorizedException();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.log(error_1);
                        throw new common_1.UnauthorizedException();
                    case 4: return [2 /*return*/, (user)];
                }
            });
        });
    };
    FakeIntra42Strategy = __decorate([
        (0, common_1.Injectable)()
    ], FakeIntra42Strategy);
    return FakeIntra42Strategy;
}((0, passport_1.PassportStrategy)(passport_strategy_1.Strategy, 'fake42strategy')));
exports.FakeIntra42Strategy = FakeIntra42Strategy;
