import { FakeIntra42Strategy } from './intra42/fakeintra42.strategy';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { Intra42Strategy } from './intra42/intra42.strategy';
import { JwtStrategy } from './jwt/jwt.strategy';
import { JwtRefreshStrategy } from './jwt/jwtrefresh.strategy';
import { TfaStrategy } from './tfa/tfa.strategy';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from './models/auth.entity';

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '60s' },
        }),
        TypeOrmModule.forFeature([AuthEntity])
    ],
    controllers: [AuthController],
    providers: [AuthService, Intra42Strategy, JwtStrategy, JwtRefreshStrategy, TfaStrategy, FakeIntra42Strategy,]
})

export class AuthModule { }
