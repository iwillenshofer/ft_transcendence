import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-oauth2";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from 'rxjs';

@Injectable()
export class Intra42Strategy extends PassportStrategy(Strategy, "intra42")
{
	constructor ()
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
	
	async validate(accessToken: string): Promise<any> {
		console.log(accessToken);
		let httpservice = new HttpService;
		let header = { Authorization: `Bearer ${ accessToken }` }
		console.log(header);
		try {
			const req = httpservice.get(process.env.BASE_URL + "/v2/me", {
				headers: { Authorization: `Bearer ${accessToken}` },
			  } );
			console.log(req);
			const data = await lastValueFrom(req);
			console.log(data);
			return (data)
		} catch (error) {
			console.log("FUCK");
			console.log(error);
			return (error);
		}
	}
}
