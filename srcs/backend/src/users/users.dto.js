"use strict";
exports.__esModule = true;
exports.UserDTO = void 0;
var users_entity_1 = require("./users.entity");
var UserDTO = /** @class */ (function () {
    function UserDTO(id, username, fullname, avatar_url) {
        if (id === void 0) { id = 0; }
        if (username === void 0) { username = ''; }
        if (fullname === void 0) { fullname = ''; }
        if (avatar_url === void 0) { avatar_url = ''; }
        this.tfa_fulfilled = false;
        this.tfa_enabled = false;
        this.id = id;
        this.username = username;
        this.fullname = fullname;
        this.avatar_url = avatar_url;
    }
    UserDTO.from = function (dto) {
        var user = new UserDTO();
        user.id = dto.id;
        user.username = dto.username;
        user.fullname = dto.fullname;
        user.avatar_url = dto.avatar_url;
        user.tfa_fulfilled = dto.tfa_fulfilled;
        user.tfa_enabled = dto.tfa_enabled;
        return (user);
    };
    UserDTO.fromEntity = function (entity) {
        var user = new UserDTO();
        user.id = entity.id;
        user.username = entity.username;
        user.fullname = entity.fullname;
        user.avatar_url = entity.avatar_url;
        user.tfa_enabled = entity.tfa_enabled;
        return (user);
    };
    UserDTO.prototype.toEntity = function () {
        var user = new users_entity_1.UserEntity();
        user.id = this.id;
        user.username = this.username;
        user.fullname = this.fullname;
        user.avatar_url = this.avatar_url;
        return (user);
    };
    return UserDTO;
}());
exports.UserDTO = UserDTO;
