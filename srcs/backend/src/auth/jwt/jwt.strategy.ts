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
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
		});
	}

	async validate(payload: any) {
		console.log("JWT Strategy validate payload: " + JSON.stringify(payload));
		if (!payload || !payload.id)
			throw new UnauthorizedException;
		console.log(payload.username);
		return payload;
	}
}
