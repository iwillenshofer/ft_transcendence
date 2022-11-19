import { RoomInterface } from "../model/room.interface";

export class User {
	id: number;
	username: string;
	fullname: string;
	avatar_url: string;
	rooms: RoomInterface[];
	tfa_enabled: boolean;
	tfa_fulfilled: boolean;

	constructor(id: number, username: string, fullname: string, avatar_url: string, rooms: RoomInterface[], tfa_enabled: boolean = false, tfa_fulfilled: boolean = false) {
		this.id = id;
		this.username = username;
		this.fullname = fullname;
		this.avatar_url = avatar_url;
		this.rooms = rooms;
		this.tfa_enabled = tfa_enabled;
		this.tfa_fulfilled = tfa_fulfilled;
	}
}

/*
** https://jasonwatmore.com/post/2020/07/18/angular-10-user-registration-and-login-example-tutorial
** https://daily-dev-tips.com/posts/angular-authenticating-users-from-an-api/
** https://jasonwatmore.com/post/2020/07/25/angular-10-jwt-authentication-with-refresh-tokens
*/
