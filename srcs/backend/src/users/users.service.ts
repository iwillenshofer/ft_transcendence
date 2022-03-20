import { Injectable } from '@nestjs/common';

/*
** This is basically a the Database... We will implement TypeORM.
*/

export class User {	
	id: number;
	nickname: string;
	fullname: string;
	refreshtoken: string;
}

@Injectable()
export class UsersService {
	public users: User[] = [
		{
			id: 1,
			nickname: 'john',
			fullname: '',
			refreshtoken: ''
		},
		{
			id: 2,
			nickname: 'john2',
			fullname: '',
			refreshtoken: ''
		}
	]

	async getUser(intra_id: number): Promise<User |  undefined> {
		return this.users.find(user => user.id == intra_id)
	}

	async createUser(intra_id: number, login: string, displayname: string): Promise<User |  undefined> {
		const user: User = {
			id: intra_id,
			nickname: login,
			fullname: displayname,
			refreshtoken: ''
		}
		this.users.push(user);
		return this.users.find(user => user.id == intra_id)
	}

	async updateRefreshToken(id: number, token: string): Promise<void> {
		let user = this.users.findIndex(user => user.id == id);
		console.log('finding id:' + id)
		console.log(user);

		this.users[user].refreshtoken = token;
	}
}
