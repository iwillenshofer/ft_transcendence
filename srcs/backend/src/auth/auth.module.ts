import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { Intra42Strategy } from './intra42/intra42.strategy';
import { JwtStrategy } from './jwt/jwt.strategy';
import { JwtRefreshStrategy } from './jwt/jwtrefresh.strategy';

@Module({
	imports: [
		UsersModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: {expiresIn: '60s'},
		})
	],
	controllers: [AuthController],
	providers: [AuthService, Intra42Strategy, JwtStrategy, JwtRefreshStrategy]
})

export class AuthModule {}
