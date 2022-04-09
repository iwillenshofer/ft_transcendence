import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from './chat/chat.module';
import { AppMiddleware } from './app.middleware';
import { AuthController } from './auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, UsersModule, ChatModule, 
    JwtModule.register({secret: process.env.JWT_SECRET})
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
    configure() {}
}
