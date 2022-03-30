"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = exports.User = void 0;
const common_1 = require("@nestjs/common");
class User {
}
exports.User = User;
let UsersService = class UsersService {
    constructor() {
        this.users = [
            {
                id: 1,
                username: 'john',
                fullname: '',
                refreshtoken: '',
                tfa_enabled: false,
                tfa_code: '',
            },
            {
                id: 2,
                username: 'john2',
                fullname: '',
                refreshtoken: '',
                tfa_enabled: false,
                tfa_code: '',
            }
        ];
    }
    async getUser(intra_id) {
        return this.users.find(user => user.id == intra_id);
    }
    async createUser(intra_id, login, displayname) {
        const user = {
            id: intra_id,
            username: login,
            fullname: displayname,
            tfa_enabled: false,
            refreshtoken: '',
            tfa_code: '',
        };
        this.users.push(user);
        return this.users.find(user => user.id == intra_id);
    }
    async updateRefreshToken(id, token) {
        let user = this.users.findIndex(user => user.id == id);
        this.users[user].refreshtoken = token;
    }
    async enable2FASecret(id, enable = true) {
        let user = this.users.findIndex(user => user.id == id);
        this.users[user].tfa_enabled = enable;
    }
    async set2FASecret(id, secret) {
        let user = this.users.findIndex(user => user.id == id);
        this.users[user].tfa_code = secret;
    }
    async disable2FASecret(id, secret) {
        let user = this.users.findIndex(user => user.id == id);
        this.users[user].tfa_enabled = false;
    }
    async getTfaEnabled(id) {
        let user = await this.getUser(id);
        return (user.tfa_enabled);
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map