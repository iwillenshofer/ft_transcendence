"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
const typeorm_1 = require("typeorm");
const users_entity_1 = require("./users/users.entity");
const dbConfig = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'postgres',
    port: process.env.POSTGRES_PORT || 5432,
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgress',
    database: process.env.POSTGRES_DB || 'postgres',
    entities: [users_entity_1.User],
    synchronize: true,
};
exports.dataSource = new typeorm_1.DataSource(dbConfig);
exports.dataSource.initialize()
    .then(() => {
    console.log("Database has been initialized!");
})
    .catch((err) => {
    console.error("Error initializing Database", err);
});
//# sourceMappingURL=app.datasource.js.map