import { Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, UsersModule, ChatModule,
    JwtModule.register({ secret: process.env.JWT_SECRET })
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure() { }
}
