"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.RoomEntity = void 0;
var typeorm_1 = require("typeorm");
var users_entity_1 = require("../../users/users.entity");
var RoomEntity = /** @class */ (function () {
    function RoomEntity() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], RoomEntity.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)()
    ], RoomEntity.prototype, "name");
    __decorate([
        (0, typeorm_1.Column)({ nullable: true })
    ], RoomEntity.prototype, "description");
    __decorate([
        (0, typeorm_1.ManyToMany)(function () { return users_entity_1.UserEntity; }),
        (0, typeorm_1.JoinTable)()
    ], RoomEntity.prototype, "users");
    __decorate([
        (0, typeorm_1.CreateDateColumn)()
    ], RoomEntity.prototype, "created_at");
    __decorate([
        (0, typeorm_1.CreateDateColumn)()
    ], RoomEntity.prototype, "updated_at");
    RoomEntity = __decorate([
        (0, typeorm_1.Entity)({ name: "Rooms" }),
        (0, typeorm_1.Unique)(['id'])
    ], RoomEntity);
    return RoomEntity;
}());
exports.RoomEntity = RoomEntity;
