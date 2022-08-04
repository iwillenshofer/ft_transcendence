"use strict";
exports.__esModule = true;
exports.dataSource = void 0;
var typeorm_1 = require("typeorm");
var auth_entity_1 = require("./auth/models/auth.entity");
var room_entity_1 = require("./chat/models/room.entity");
var users_entity_1 = require("./users/users.entity");
var dbConfig = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'postgres',
    port: process.env.POSTGRES_PORT || 5432,
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgress',
    database: process.env.POSTGRES_DB || 'postgres',
    entities: [users_entity_1.UserEntity, room_entity_1.RoomEntity, auth_entity_1.AuthEntity],
    synchronize: true
};
exports.dataSource = new typeorm_1.DataSource(dbConfig);
exports.dataSource.initialize()
    .then(function () {
    console.log("Database has been initialized!");
})["catch"](function (err) {
    console.error("Error initializing Database", err);
});
