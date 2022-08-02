"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = exports.UserEntity = void 0;
const common_1 = require("@nestjs/common");
const users_entity_1 = require("./users.entity");
Object.defineProperty(exports, "UserEntity", { enumerable: true, get: function () { return users_entity_1.UserEntity; } });
const app_datasource_1 = require("../app.datasource");
const users_dto_1 = require("./users.dto");
let UsersService = class UsersService {
    async getUser(intra_id) {
        console.log('we are here');
        const results = await app_datasource_1.dataSource.getRepository(users_entity_1.UserEntity).findOneBy({
            id: intra_id,
        }).then((ret) => {
            if (!ret)
                return (null);
            return (users_dto_1.UserDTO.fromEntity(ret));
        });
        return (results);
    }
    async createUser(intra_id, login, displayname, image_url) {
        const user = await app_datasource_1.dataSource.getRepository(users_entity_1.UserEntity).create({
            id: intra_id,
            username: login,
            fullname: displayname,
            avatar_url: image_url
        });
        const results = await app_datasource_1.dataSource.getRepository(users_entity_1.UserEntity).save(user)
            .then((ret) => users_dto_1.UserDTO.fromEntity(ret));
        return results;
    }
    async updateRefreshToken(id, token) {
        let user = await app_datasource_1.dataSource.getRepository(users_entity_1.UserEntity).findOneBy({ id: id });
        user.refreshtoken = token;
        const results = await app_datasource_1.dataSource.getRepository(users_entity_1.UserEntity).save(user);
        return;
    }
    async getRefreshToken(id) {
        let user = await app_datasource_1.dataSource.getRepository(users_entity_1.UserEntity).findOneBy({ id: id });
        return (user.refreshtoken);
    }
    async enable2FASecret(id, enable = true) {
        let user = await app_datasource_1.dataSource.getRepository(users_entity_1.UserEntity).findOneBy({ id: id });
        user.tfa_enabled = enable;
        const results = await app_datasource_1.dataSource.getRepository(users_entity_1.UserEntity).save(user);
        return;
    }
    async set2FASecret(id, secret) {
        let user = await app_datasource_1.dataSource.getRepository(users_entity_1.UserEntity).findOneBy({ id: id });
        user.tfa_code = secret;
        const results = await app_datasource_1.dataSource.getRepository(users_entity_1.UserEntity).save(user);
        return;
    }
    async disable2FASecret(id, secret) {
        let user = await app_datasource_1.dataSource.getRepository(users_entity_1.UserEntity).findOneBy({ id: id });
        user.tfa_enabled = false;
        const results = await app_datasource_1.dataSource.getRepository(users_entity_1.UserEntity).save(user);
        return;
    }
    async getTfaEnabled(id) {
        let user = await app_datasource_1.dataSource.getRepository(users_entity_1.UserEntity).findOneBy({ id: id });
        return (user.tfa_enabled);
    }
    async getTfaCode(id) {
        let user = await app_datasource_1.dataSource.getRepository(users_entity_1.UserEntity).findOneBy({ id: id });
        return (user.tfa_code);
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map