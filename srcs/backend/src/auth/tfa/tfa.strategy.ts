import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, HttpException, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TfaStrategy extends PassportStrategy(Strategy, 'tfa') {
	constructor(
		private userService: UsersService,
		private jwtService: JwtService
	) {
		super({
			ignoreExpiration: false,
			passReqToCallback: true,
			secretOrKey: process.env.JWT_SECRET,
			jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => {
				const data = req?.cookies['auth'];
				console.log('cookies: ' + data?.token);
				return (data?.token);
			}]),
		});
	}

	async validate(req: Request, payload: any) {
		if (!payload || !payload.sub || (!req?.cookies['auth']?.tfa_fulfilled))
			throw new UnauthorizedException;
		console.log(payload.username);
		return {userId: payload.sub, username: payload.username};
	}
}
