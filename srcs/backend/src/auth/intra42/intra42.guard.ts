import { CanActivate, ExecutionContext, Injectable, HttpException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class Intra42Guard extends AuthGuard('intra42') {
	constructor() {
		super();
	}

	handleRequest(err: any, user: any, info: any, context: any, status: any) {
		if (err || !user) {
		 	throw new HttpException(err.message, 401);
		}
		return user;
	  }
}