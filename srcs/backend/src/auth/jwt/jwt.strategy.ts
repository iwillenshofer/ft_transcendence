import { ExtractJwt, Strategy, JwtFromRequestFunction } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, HttpException, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor() {
		super({
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET,
			jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => {
				const data = req?.cookies['auth'];
				console.log('cookies: ' + data?.token);
				return (data?.token);
			}]),
		});
	}

	async validate(payload: any) {
		if (!payload || !payload.sub)
			throw new UnauthorizedException;
		console.log(payload.username);
		return {id: payload.sub, nickname: payload.username};
	}
}
