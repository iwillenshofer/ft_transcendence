import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.service';
import { authenticator } from "otplib";
import { toFileStream } from "qrcode";

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
		if (!user)
			user =  await this.userService.createUser(data.id, data.login, data.displayname);
		return (user);
	}

	async getAccessToken(user: any) {
		const payload = { username: user.username, id: user.id };
		return (this.jwtService.sign(payload, {secret: process.env.JWT_SECRET, expiresIn: 60 * 15 }));
	}

	async getRefreshToken(user: any) {
		const payload = { username: user.username, id: user.id };
		return (this.jwtService.sign(payload, {secret: process.env.JWT_REFRESH_SECRET, expiresIn: 60 * 60 * 24 * 7 }));
	}

	/*
	** 2fa Services
	*/
	async disableTwoFactor(user_id: number) {
		const user_info: User | null = await this.userService.getUser(user_id);
		
		await this.userService.enable2FASecret(user_id, false);
		return true;
    }

	async disableTwoFactor2(user_id: number, code: string) {
		const user_info: User | null = await this.userService.getUser(user_id);

		if (authenticator.verify({ token: code,  secret: user_info.tfa_code }))
		{
			if (user_info.tfa_enabled)
			{
				await this.userService.enable2FASecret(user_id, false);
				await this.userService.set2FASecret(user_id, '');
			}
			return true;
		}
		return false;
    }

	async verifyTwoFactor(user_id: number, code: string) {
		const user_info: User | null = await this.userService.getUser(user_id);
		console.log("tfa user" + JSON.stringify(user_id));
		console.log("code: " + JSON.stringify(code) + ", tfa:" + user_info.tfa_code);
		if (authenticator.verify({ token: code,  secret: user_info.tfa_code }))
		{
			if (!user_info.tfa_enabled)
				await this.userService.enable2FASecret(user_id);
			return true;
		}
		return false;
    }

	public async generateQrCode(user_id: number, stream: Response) {
		console.log("qrcode user " + user_id);
		let user_info: User | null = await this.userService.getUser(user_id);
		if(!user_info.tfa_code)
		{
			const secret = authenticator.generateSecret();
			await this.userService.set2FASecret(user_id, secret);
			user_info.tfa_code = secret;
		}
		const otp_url = authenticator.keyuri(String(user_id), 'ft_transcendence', user_info.tfa_code);
        return toFileStream(stream, otp_url);
    }
}
