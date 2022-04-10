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
exports.RoomService = void 0;
const common_1 = require("@nestjs/common");
const room_entity_1 = require("../../models/room.entity");
const app_datasource_1 = require("../../../app.datasource");
let RoomService = class RoomService {
    constructor() { }
    async createRoom(room, creator) {
        const new_room = await this.addCreatorToRoom(room, creator);
        return app_datasource_1.dataSource.getRepository(room_entity_1.RoomEntity).save(new_room);
    }
    async addCreatorToRoom(room, creator) {
        room.users.push(creator);
        return (room);
    }
    async getUserRooms(user_id) {
        const query = app_datasource_1.dataSource.getRepository(room_entity_1.RoomEntity)
            .createQueryBuilder('room')
            .leftJoin('room.users', 'user')
            .where('user.id = :user_id', { user_id });
        return query.getMany();
    }
};
RoomService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RoomService);
exports.RoomService = RoomService;
//# sourceMappingURL=room.service.js.map