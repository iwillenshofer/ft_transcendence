import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { authenticator } from "otplib";
import { toFileStream } from "qrcode";
import { UsersService } from 'src/users/users.service';
import { UserDTO } from 'src/users/users.dto';
import { Writable } from 'typeorm/platform/PlatformTools';
import { dataSource } from 'src/app.datasource';
import { AuthInterface } from './models/auth.interface';
import * as crypto from 'crypto';
import { AuthEntity } from './models/auth.entity';
import { UserInterface } from 'src/users/users.interface';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private userService: UsersService
	) {}

	async getOrCreateUser(data: any): Promise<UserDTO> {
		let user: UserDTO | null;
		
		if (!data || !(data?.id) || !(data?.login) || !(data?.displayname))
			return (null);
		user = await this.userService.getUser(data.id);
		console.log(user);
		if (!user)
			user =  await this.userService.createUser(data.id, data.login, data.displayname);
		return (user);
	}

	async getAccessToken(user: any, tfa_fulfilled: boolean = false) {
		if (!(tfa_fulfilled))
			tfa_fulfilled = !(await this.userService.getTfaEnabled(user.id));
		const payload = { username: user.username, id: user.id, tfa_fulfilled: tfa_fulfilled };
		return (this.jwtService.sign(payload, {secret: process.env.JWT_SECRET, expiresIn: 3 }));
	}

	async getRefreshToken(user: any) {
		const payload = { username: user.username, id: user.id };
		return (this.jwtService.sign(payload, {secret: process.env.JWT_REFRESH_SECRET, expiresIn: 60 * 60 * 24 * 7 }));
	}

	/*
	** callback code
	*/
	async generateCallbackCode(user_id: number): Promise<string> {
		let new_code: AuthInterface = new AuthEntity;
		var hexstring = crypto.randomBytes(64).toString('hex');
		new_code.user = await this.userService.getUser(user_id);
		console.log(new_code.user)
		if (!(new_code.user))
			return (null);
		new_code.hash = crypto.pbkdf2Sync(hexstring, process.env.JWT_SECRET, 1000, 64, `sha512`).toString(`hex`);
		dataSource.getRepository(AuthEntity).save(new_code);
		return hexstring;
	}

	async retrieveCallbackToken(code: string): Promise<{username: string, id: number} | null> {
		const hash = crypto.pbkdf2Sync(code, process.env.JWT_SECRET, 1000, 64, `sha512`).toString(`hex`);
		const query = await dataSource.getRepository(AuthEntity)
			.createQueryBuilder('auth')
			.leftJoinAndSelect('auth.user', 'user')
			.where('auth.hash = :hash', {hash}).getOne();
		console.log("Query:" + JSON.stringify(query));
		const now = new Date(Date.now());
		now.setMinutes(now.getMinutes() - 100);
		if (!(query) || query.created_at < now)
			return (null);
		dataSource.getRepository(AuthEntity).delete(query.id);
		return {username: query.user.username, id: query.user.id};
	}

	/*
	** 2fa Services
	*/
	async disableTwoFactor(user_id: number) {
		await this.userService.enable2FASecret(user_id, false);
		return true;
    }

	async disableTwoFactor2(user_id: number, code: string) {
		const user_info: UserDTO = await this.userService.getUser(user_id);
		if (authenticator.verify({ token: code,  secret: await this.userService.getTfaCode(user_id) }))
		{
			if (this.userService.getTfaEnabled(user_id))
			{
				await this.userService.enable2FASecret(user_id, false);
				await this.userService.set2FASecret(user_id, '');
			}
			return true;
		}
		return false;
    }

	async verifyTwoFactor(user_id: number, code: string) {
		const user_info: UserDTO = await this.userService.getUser(user_id);
		console.log("tfa user" + JSON.stringify(user_id));
		if (authenticator.verify({ token: code,  secret: await this.userService.getTfaCode(user_id)  }))
		{
			console.log("verification passed")
			if (!(await this.userService.getTfaEnabled(user_id)))
			{
				console.log("tfa not yet enabled");
				await this.userService.enable2FASecret(user_id, true);
			}
			return true;
		}
		return false;
    }

	public async generateQrCode(user_id: number, stream: Writable) {
		console.log("qrcode user " + user_id);
		let user_info: UserDTO = await this.userService.getUser(user_id);
		if (this.userService.getTfaEnabled(user_id))
		{
			const secret = authenticator.generateSecret();
			await this.userService.set2FASecret(user_id, secret);
		}
		const otp_url = authenticator.keyuri(String(user_id), 'ft_transcendence', await this.userService.getTfaCode(user_id));
        return toFileStream(stream, otp_url);
    }
}
