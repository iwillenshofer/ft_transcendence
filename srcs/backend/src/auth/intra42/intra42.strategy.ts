import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-oauth2";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from 'rxjs';
import { AuthService } from "../auth.service";

/*
**
**
**
*/
@Injectable()
export class Intra42Strategy extends PassportStrategy(Strategy, "intra42")
{
	constructor (private authService: AuthService)
	{
		super({
			authorizationURL: process.env.BASE_URL + "/oauth/authorize",
			tokenURL		: process.env.BASE_URL + "/oauth/token",
			clientID		: process.env.CLIENT_ID,
			clientSecret	: process.env.CLIENT_SECRET,
			callbackURL		: "/auth/callback",
			scope			: ['public'],
		})
	}
	
	async validate(accessToken: string, refreshToken: string): Promise<any> {
		console.log(accessToken);
		console.log(refreshToken);
		let user: any = null;
		let httpservice = new HttpService;
		let header = { Authorization: `Bearer ${ accessToken }` }
		try {
			const req = await httpservice.get(process.env.BASE_URL + "/v2/me", {headers: header});
			console.log(req);
			const data = await lastValueFrom(req);
			console.log(data);
			user = await this.authService.getOrCreateUser(data.data);
			if (!user)
				throw new UnauthorizedException();
		} catch (error) {
			throw new UnauthorizedException();
		}
		return (user);
	}
}
