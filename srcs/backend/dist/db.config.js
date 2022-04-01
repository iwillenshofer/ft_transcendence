"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const dbConfig = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'postgres',
    port: process.env.POSTGRES_PORT || 5432,
    username: process.env.POSTGRES_USER || 'pguser',
    password: process.env.POSTGRES_PASSWORD || 'pgpassword',
    database: process.env.POSTGRES_DB || 'postgres',
    entities: [(0, path_1.join)(__dirname, '**', '*.entity.{ts,js}')],
    synchronize: true,
};
//# sourceMappingURL=db.config.js.map