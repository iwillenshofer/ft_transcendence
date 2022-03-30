import { Injectable } from '@nestjs/common';

/*
** This is basically a the Database... We will implement TypeORM.
*/

export class User {	
	id: number;
	username: string;
	fullname: string;
	refreshtoken: string;
	tfa_enabled: boolean;
	tfa_code: string;
	tfa_fulfilled?: boolean
}

@Injectable()
export class UsersService {
	public users: User[] = [
		{
			id: 1,
			username: 'john',
			fullname: '',
			refreshtoken: '',
			tfa_enabled: false,
			tfa_code: '',
		},
		{
			id: 2,
			username: 'john2',
			fullname: '',
			refreshtoken: '',
			tfa_enabled: false,
			tfa_code: '',
		}
	]

	async getUser(intra_id: number): Promise<User |  undefined> {
		return this.users.find(user => user.id == intra_id)
	}

	async createUser(intra_id: number, login: string, displayname: string): Promise<User |  undefined> {
		const user: User = {
			id: intra_id,
			username: login,
			fullname: displayname,
			tfa_enabled: false,
			refreshtoken: '',
			tfa_code: '',
		}
		this.users.push(user);
		return this.users.find(user => user.id == intra_id)
	}

	async updateRefreshToken(id: number, token: string): Promise<void> {
		let user = this.users.findIndex(user => user.id == id);
		this.users[user].refreshtoken = token;
	}

	async enable2FASecret(id: number, enable: boolean = true): Promise<void> {
		let user = this.users.findIndex(user => user.id == id);
		this.users[user].tfa_enabled = enable;
	}

	async set2FASecret(id: number, secret: string): Promise<void> {
		let user = this.users.findIndex(user => user.id == id);
		this.users[user].tfa_code = secret;
	}

	async disable2FASecret(id: number, secret: string): Promise<void> {
		let user = this.users.findIndex(user => user.id == id);
		this.users[user].tfa_enabled = false;
	}

	async getTfaEnabled(id: number): Promise<boolean> {
		let user = await this.getUser(id);
		return (user.tfa_enabled);
	}
}
