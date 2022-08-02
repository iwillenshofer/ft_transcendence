"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeIntra42Strategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_strategy_1 = require("passport-strategy");
const auth_service_1 = require("../auth.service");
let FakeIntra42Strategy = class FakeIntra42Strategy extends (0, passport_1.PassportStrategy)(passport_strategy_1.Strategy, 'fake42strategy') {
    constructor(authService) {
        super();
        this.authService = authService;
    }
    async authenticate(req, options) {
        if (req.url == '/auth/login') {
            this.redirect('/auth/callback');
        }
        else {
            this.success(await this.validate());
        }
        return;
    }
    async validate() {
        let user = null;
        try {
            const this_user = [
                { id: 19219, login: 'login1', displayname: 'displayname1', image_url: 'https://i.imgflip.com/19d7hr.jpg' },
                { id: 19220, login: 'login2', displayname: 'displayname2', image_url: 'https://i.imgflip.com/19d7hr.jpg' },
                { id: 19221, login: 'login3', displayname: 'displayname3', image_url: 'https://i.imgflip.com/19d7hr.jpg' },
                { id: 19222, login: 'login4', displayname: 'displayname4', image_url: 'https://i.imgflip.com/19d7hr.jpg' },
                { id: 19223, login: 'login5', displayname: 'displayname5', image_url: 'https://i.imgflip.com/19d7hr.jpg' },
                { id: 19224, login: 'login6', displayname: 'displayname6', image_url: 'https://i.imgflip.com/19d7hr.jpg' }
            ];
            const idx = Math.floor(Math.random() * (this_user.length));
            console.log('IDX:' + idx);
            user = await this.authService.getOrCreateUser(this_user[idx]);
            if (!user)
                throw new common_1.UnauthorizedException();
        }
        catch (error) {
            console.log(error);
            throw new common_1.UnauthorizedException();
        }
        return (user);
    }
};
FakeIntra42Strategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], FakeIntra42Strategy);
exports.FakeIntra42Strategy = FakeIntra42Strategy;
//# sourceMappingURL=fakeintra42.strategy.js.map