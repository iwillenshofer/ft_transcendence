import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthEntity } from './auth/models/auth.entity';
import { RoomEntity } from './chat/models/room.entity';
import { UserEntity } from './users/users.entity';

const dbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'postgres',
  port: process.env.POSTGRES_PORT || 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgress',
  database: process.env.POSTGRES_DB || 'postgres',
  entities: [UserEntity, RoomEntity, AuthEntity],
  synchronize: true,
};

export const dataSource = new DataSource(dbConfig);

dataSource.initialize()
  .then(() => {
      console.log("Database has been initialized!")
  })
  .catch((err) => {
      console.error("Error initializing Database", err)
  });
