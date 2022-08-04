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
exports.__esModule = true;
exports.Intra42Guard = void 0;
var common_1 = require("@nestjs/common");
var passport_1 = require("@nestjs/passport");
var Intra42Guard = /** @class */ (function (_super) {
    __extends(Intra42Guard, _super);
    function Intra42Guard() {
        return _super.call(this) || this;
    }
    Intra42Guard.prototype.handleRequest = function (err, user, info, context, status) {
        if (err || !user) {
            throw new common_1.HttpException(err.message, 401);
        }
        return user;
    };
    Intra42Guard = __decorate([
        (0, common_1.Injectable)()
    ], Intra42Guard);
    return Intra42Guard;
}((0, passport_1.AuthGuard)('intra42')));
exports.Intra42Guard = Intra42Guard;
