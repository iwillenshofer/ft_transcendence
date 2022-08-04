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
exports.Intra42Strategy = void 0;
var common_1 = require("@nestjs/common");
var passport_1 = require("@nestjs/passport");
var passport_oauth2_1 = require("passport-oauth2");
var axios_1 = require("@nestjs/axios");
var rxjs_1 = require("rxjs");
/*
**
**
**
*/
var Intra42Strategy = /** @class */ (function (_super) {
    __extends(Intra42Strategy, _super);
    function Intra42Strategy(authService) {
        var _this = _super.call(this, {
            passReqToCallback: true,
            clientID: process.env.CLIENT_ID,
            authorizationURL: process.env.BASE_URL + "/oauth/authorize",
            tokenURL: process.env.BASE_URL + "/oauth/token",
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "/auth/callback"
        }) || this;
        _this.authService = authService;
        return _this;
    }
    Intra42Strategy.prototype.validate = function (req, accessToken, refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var user, httpservice, header, req_1, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(accessToken);
                        console.log(refreshToken);
                        console.log(req.url);
                        user = null;
                        httpservice = new axios_1.HttpService;
                        header = { Authorization: "Bearer ".concat(accessToken) };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, httpservice.get(process.env.BASE_URL + "/v2/me", { headers: header })];
                    case 2:
                        req_1 = _a.sent();
                        console.log(req_1);
                        return [4 /*yield*/, (0, rxjs_1.lastValueFrom)(req_1)];
                    case 3:
                        data = _a.sent();
                        console.log(data);
                        return [4 /*yield*/, this.authService.getOrCreateUser(data.data)];
                    case 4:
                        user = _a.sent();
                        if (!user)
                            throw new common_1.UnauthorizedException();
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        throw new common_1.UnauthorizedException();
                    case 6: return [2 /*return*/, (user)];
                }
            });
        });
    };
    Intra42Strategy = __decorate([
        (0, common_1.Injectable)()
    ], Intra42Strategy);
    return Intra42Strategy;
}((0, passport_1.PassportStrategy)(passport_oauth2_1.Strategy, "intra42")));
exports.Intra42Strategy = Intra42Strategy;
