import { Injectable, HttpException } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';


@Injectable()
export class Intra42AuthGuard extends AuthGuard('intra42') {
	constructor() {
    	super();
	}

	handleRequest(err: any, user: any, info: any, context: any, status: any) {
		if (err || !user) {
			console.log('Guard', err);
			throw new HttpException("Unauthorized", 403);
		}
		return user;
	}
}