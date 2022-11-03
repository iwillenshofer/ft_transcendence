// import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { DataSource, DataSourceOptions } from 'typeorm';
// import { AuthEntity } from './auth/models/auth.entity';
// import { RoomEntity } from './chat/models/room.entity';
// import { UserEntity } from './user/user.entity';

// const dbConfig: TypeOrmModuleOptions = {
//   type: 'postgres',
//   host: process.env.POSTGRES_HOST || 'postgres',
//   port: +process.env.POSTGRES_PORT || 5432,
//   username: process.env.POSTGRES_USER || 'postgres',
//   password: process.env.POSTGRES_PASSWORD || 'postgress',
//   database: process.env.POSTGRES_DB || 'postgres',
//   entities: [UserEntity, RoomEntity, AuthEntity],
//   synchronize: true,
// };

// // const dbConfig: DataSourceOptions = {
// //   type: 'postgres',
// //   host: process.env.POSTGRES_HOST || 'postgres',
// //   port: +process.env.POSTGRES_PORT || 5432,
// //   username: process.env.POSTGRES_USER || 'postgres',
// //   password: process.env.POSTGRES_PASSWORD || 'postgres',
// //   database: process.env.POSTGRES_DB || 'postgres',
// //   entities: [UserEntity, RoomEntity, AuthEntity],
// //   synchronize: true, // TO REMOVE FOR PRODUCTION!!!!
// //   dropSchema: true // TO REMOVE FOR PRODUCTION!!!!
// // }

// export const dataSource = new (dbConfig);

// dataSource.initialize()
//   .then(() => {
//     console.log("Database has been initialized!")
//   })
//   .catch((err) => {
//     console.error("Error initializing Database", err)
//   });
