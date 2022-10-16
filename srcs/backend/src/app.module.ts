import { Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { JwtModule } from '@nestjs/jwt';
import { HealthModule } from './health/health.module';
import { EncryptService } from './services/encrypt.service';

@Module({
  imports: [AuthModule, UsersModule, ChatModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    HealthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure() { }
}
