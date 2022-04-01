"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDTO = void 0;
const users_entity_1 = require("./users.entity");
class UserDTO {
    constructor(id = 0, username = '', fullname = '') {
        this.tfa_fulfilled = false;
        this.tfa_enabled = false;
        this.id = id;
        this.username = username;
        this.fullname = fullname;
    }
    static from(dto) {
        const user = new UserDTO();
        user.id = dto.id;
        user.username = dto.username;
        user.fullname = dto.fullname;
        return (user);
    }
    static fromEntity(entity) {
        const user = new UserDTO();
        user.id = entity.id;
        user.username = entity.username;
        user.fullname = entity.fullname;
        user.tfa_enabled = entity.tfa_enabled;
        return (user);
    }
    toEntity() {
        const user = new users_entity_1.User();
        user.id = this.id;
        user.username = this.username;
        user.fullname = this.fullname;
        return (user);
    }
}
exports.UserDTO = UserDTO;
//# sourceMappingURL=users.dto.js.map