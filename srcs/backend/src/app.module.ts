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
import { GameEntity } from './game/game.entity';
import { ConnectedUserEntity } from './chat/entities/connected-user.entity';
import { MessageEntity } from './chat/entities/message.entity';
import { RoomEntity } from './chat/entities/room.entity';
import { MemberEntity } from './chat/entities/member.entity';

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
      entities: [UserEntity, RoomEntity, AuthEntity, MessageEntity, GameEntity, ConnectedUserEntity, MemberEntity],
      synchronize: true,
    }),
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {

  constructor(private dataSource: DataSource) { }
  configure() { }
}
