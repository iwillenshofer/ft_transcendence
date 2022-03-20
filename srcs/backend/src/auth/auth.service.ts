import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { env } from 'process';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.service';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private userService: UsersService
	) {}

	async getOrCreateUser(data: any): Promise<User | undefined> {
		let user: User | null;
		
		if (!data || !(data?.id) || !(data?.login) || !(data?.displayname))
			return (null);
		user = await this.userService.getUser(data.id);
		if (user)
		{
			
			return (user);
		}
		else
			return (await this.userService.createUser(data.id, data.login, data.displayname));
	}

	async getAccessToken(user: any) {
		const payload = { username: user.nickname, sub: user.id };
		return (this.jwtService.sign(payload, {secret: process.env.JWT_SECRET, expiresIn: 10 }));
	}

	async getRefreshToken(user: any) {
		const payload = { username: user.nickname, sub: user.id };
		return (this.jwtService.sign(payload, {secret: process.env.JWT_REFRESH_SECRET, expiresIn: 100 }));
	}
}
