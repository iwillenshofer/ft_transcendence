"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ChatGateway = void 0;
var common_1 = require("@nestjs/common");
var websockets_1 = require("@nestjs/websockets");
var tfa_guard_1 = require("../../auth/tfa/tfa.guard");
var ChatGateway = /** @class */ (function () {
    function ChatGateway() {
        this.messages = [];
    }
    //@UseGuards(TfaGuard)
    ChatGateway.prototype.handleMessage = function (client, payload) {
        console.log('message' + JSON.stringify(payload));
        this.messages.push(JSON.stringify(payload));
        this.server.emit('message', this.messages);
    };
    ChatGateway.prototype.afterInit = function (server) {
        console.log('init');
    };
    ChatGateway.prototype.handleConnection = function (client) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log('on connect');
        console.log(JSON.stringify(client.id));
    };
    ChatGateway.prototype.handleDisconnect = function (client) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log('on disconnect');
    };
    __decorate([
        (0, websockets_1.WebSocketServer)()
    ], ChatGateway.prototype, "server");
    __decorate([
        (0, websockets_1.SubscribeMessage)('message')
    ], ChatGateway.prototype, "handleMessage");
    __decorate([
        (0, common_1.UseGuards)(tfa_guard_1.TfaGuard)
    ], ChatGateway.prototype, "handleConnection");
    ChatGateway = __decorate([
        (0, websockets_1.WebSocketGateway)({ cors: true })
    ], ChatGateway);
    return ChatGateway;
}());
exports.ChatGateway = ChatGateway;
