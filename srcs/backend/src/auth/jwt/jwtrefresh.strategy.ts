import { ExtractJwt, Strategy, JwtFromRequestFunction } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, HttpException, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt'

/*
** In JwtRefreshStrategy, we check for the original token, but ignore its expiration.
** the token (as payload), as well as the request (passReqToCallback) are sent to validate function.
** From the request, we retrieve the refresh token, and check if it has not expired (jwtservice.verify())
** Also, from the original token, we retrieve the user. Then we check if the user from 
** the original token matches to holder of the refresh token on database.
*/
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(
		private userService: UsersService,
		private jwtService: JwtService
		) {
		super({
			ignoreExpiration: true,
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
		let data: any = null;
		let user = null;

		data = req?.cookies['auth'];
		console.log(data);
		console.log(payload);
		if (!payload || !(data?.refreshtoken))
			throw new UnauthorizedException;
		try {
			this.jwtService.verify(data?.refreshtoken, {secret: process.env.JWT_REFRESH_SECRET});
		} catch(err) {
			throw new UnauthorizedException;
		}
		user = await this.userService.getUser(payload.id);
		console.log(user);
		if (!user || user.id != payload.id || user.refreshtoken != data.refreshtoken)
			throw new UnauthorizedException;
		return {id: payload.id, username: payload.username};
	}
}

