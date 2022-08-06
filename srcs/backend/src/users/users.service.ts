import { Injectable } from '@nestjs/common';
import { UserEntity } from './users.entity';
import { dataSource } from 'src/app.datasource';
import { UserDTO } from './users.dto';
import { HttpService } from '@nestjs/axios';
export { UserEntity }
import { createWriteStream } from 'fs';
import { pipe } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
/*
** This is basically a the Database... We will implement TypeORM.
*/


@Injectable()
export class UsersService {

	constructor(private readonly httpService: HttpService) { }

	async getUser(intra_id: number): Promise<UserDTO | null> {

		const results = await dataSource.getRepository(UserEntity).findOneBy({
			id: intra_id,
		}).then((ret) => {
			if (!ret)
				return (null);
			return (UserDTO.fromEntity(ret));
		});
		return (results);
	}

	async createUser(intra_id: number, login: string, displayname: string, image_url: string): Promise<UserDTO> {

		const ext = '.' + image_url.split('.').pop();
		const writer = createWriteStream('uploads/profileimages/' + uuidv4() + '-' + intra_id.toString() + ext)
		const response = await this.httpService.axiosRef({
			url: image_url,
			method: 'GET',
			responseType: 'stream',
		});

		response.data.pipe(writer);
		image_url = 'users/image/' + intra_id.toString() + ext;

		const user: UserEntity = await dataSource.getRepository(UserEntity).create({
			id: intra_id,
			username: login,
			fullname: displayname,
			avatar_url: image_url
		});
		const results = await dataSource.getRepository(UserEntity).save(user)
			.then((ret) => UserDTO.fromEntity(ret));
		return results;
	}

	async updateRefreshToken(id: number, token: string): Promise<void> {
		let user = await dataSource.getRepository(UserEntity).findOneBy({ id: id });
		user.refreshtoken = token;
		const results = await dataSource.getRepository(UserEntity).save(user);
		return;
	}

	async updateUrlAvatar(id: number, url: string): Promise<void> {
		let user = await dataSource.getRepository(UserEntity).findOneBy({ id: id });
		user.avatar_url = url;
		const results = await dataSource.getRepository(UserEntity).save(user);
		console.log(user.avatar_url)
		return;
	}

	async getRefreshToken(id: number): Promise<string> {
		let user = await dataSource.getRepository(UserEntity).findOneBy({ id: id });
		return (user.refreshtoken);
	}

	async enable2FASecret(id: number, enable: boolean = true): Promise<void> {
		let user = await dataSource.getRepository(UserEntity).findOneBy({ id: id });
		user.tfa_enabled = enable;
		const results = await dataSource.getRepository(UserEntity).save(user);
		return;
	}

	async set2FASecret(id: number, secret: string): Promise<void> {
		let user = await dataSource.getRepository(UserEntity).findOneBy({ id: id });
		user.tfa_code = secret;
		const results = await dataSource.getRepository(UserEntity).save(user);
		return;
	}

	async disable2FASecret(id: number, secret: string): Promise<void> {
		let user = await dataSource.getRepository(UserEntity).findOneBy({ id: id });
		user.tfa_enabled = false;
		const results = await dataSource.getRepository(UserEntity).save(user);
		return;
	}

	async getTfaEnabled(id: number): Promise<boolean> {
		let user = await dataSource.getRepository(UserEntity).findOneBy({ id: id });
		return (user.tfa_enabled);
	}

	async getTfaCode(id: number): Promise<string> {
		let user = await dataSource.getRepository(UserEntity).findOneBy({ id: id });
		return (user.tfa_code);
	}
}
