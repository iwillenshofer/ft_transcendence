import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Intra42Strategy } from './intra42.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, Intra42Strategy]
})

export class AuthModule {}
