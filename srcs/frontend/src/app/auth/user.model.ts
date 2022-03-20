export class User {
	id: number;
	nickname: string;
	fullname: string;

	constructor(id: number, nickname: string, fullname: string) {
		this.id = id;
		this.nickname = nickname;
		this.fullname = fullname;
	}
}

/*
** https://jasonwatmore.com/post/2020/07/18/angular-10-user-registration-and-login-example-tutorial
** https://daily-dev-tips.com/posts/angular-authenticating-users-from-an-api/
** https://jasonwatmore.com/post/2020/07/25/angular-10-jwt-authentication-with-refresh-tokens
*/
