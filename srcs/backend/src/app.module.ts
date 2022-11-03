import { Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthEntity } from './auth/models/auth.entity';
import { GameModule } from './game/game.module';
import { UserEntity } from './user/user.entity';
import { RoomEntity } from './room/room.entity';
import { RoomModule } from './room/room.module';
import { MessageEntity } from './chat/message/message.entity';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ChatModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'postgres',
      port: +process.env.POSTGRES_PORT || 5432,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgress',
      database: process.env.POSTGRES_DB || 'postgres',
      entities: [UserEntity, RoomEntity, AuthEntity, MessageEntity],
      synchronize: true,
    }),
    GameModule,
    RoomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {

  constructor(private dataSource: DataSource) { }
  configure() { }
}
