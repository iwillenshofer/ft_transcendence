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
exports.UserEntity = void 0;
var room_entity_1 = require("../chat/models/room.entity");
var typeorm_1 = require("typeorm");
var UserEntity = /** @class */ (function (_super) {
    __extends(UserEntity, _super);
    function UserEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.PrimaryColumn)({ nullable: false, type: 'integer' })
    ], UserEntity.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)({ nullable: false, type: 'varchar', length: 200 })
    ], UserEntity.prototype, "username");
    __decorate([
        (0, typeorm_1.Column)({ nullable: false, type: 'varchar', length: 200 })
    ], UserEntity.prototype, "fullname");
    __decorate([
        (0, typeorm_1.Column)({ nullable: false, type: 'varchar', length: 2048 })
    ], UserEntity.prototype, "avatar_url");
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, type: 'varchar', length: 200 })
    ], UserEntity.prototype, "refreshtoken");
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, type: 'boolean', "default": false })
    ], UserEntity.prototype, "tfa_enabled");
    __decorate([
        (0, typeorm_1.Column)({ nullable: true, type: 'varchar', length: 200 })
    ], UserEntity.prototype, "tfa_code");
    __decorate([
        (0, typeorm_1.ManyToMany)(function () { return room_entity_1.RoomEntity; }, function (room) { return room.users; })
    ], UserEntity.prototype, "rooms");
    __decorate([
        (0, typeorm_1.CreateDateColumn)()
    ], UserEntity.prototype, "created_at");
    __decorate([
        (0, typeorm_1.UpdateDateColumn)()
    ], UserEntity.prototype, "updated_at");
    __decorate([
        (0, typeorm_1.Column)({ nullable: false, type: 'boolean', "default": false })
    ], UserEntity.prototype, "tfa_fulfilled");
    UserEntity = __decorate([
        (0, typeorm_1.Entity)({ name: 'User' }),
        (0, typeorm_1.Unique)(['id'])
    ], UserEntity);
    return UserEntity;
}(typeorm_1.BaseEntity));
exports.UserEntity = UserEntity;
