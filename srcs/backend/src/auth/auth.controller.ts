import { Controller, Get, UseGuards, Request, Response, Req, Res} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtGuard } from './jwt/jwt.guard';
import { JwtRefreshGuard } from './jwt/jwtrefresh.guard';
import { Intra42Guard } from './intra42/intra42.guard'
import { UsersService } from 'src/users/users.service';

@Controller("auth")
export class AuthController {

	constructor (
		private authService: AuthService,
		private userService: UsersService
		) { }


	/*
	** login routed, requested by the frontend (/auth/login)
	** since the user is not logged in yet, only intra42 guard is used
	*/
	@UseGuards(Intra42Guard)
	@Get("login")
	async login(@Request() req)
	{
		console.log ("login attempt", req);
	}

	/*
	** /auth/callback is the intra's return
	*/
    @UseGuards(Intra42Guard)
	@Get("callback")
	async callback(@Response() res, @Request() req)
	{
		console.log(req.user);
		if (req.user)
		{
			/*
			** yey, we have a user, returned by intra42Strategy.
			** let's get the JWT Token.
			** Will have to check for 2FA first probably here.
			*/
			console.log('user:' + JSON.stringify(req.user));
			const token = await this.authService.getAccessToken(req.user);
			const refreshtoken = await this.authService.getRefreshToken(req.user);
			const auth_cookie = {token: token, refreshtoken: refreshtoken};
			res.cookie('auth', auth_cookie, { httpOnly: true });
			console.log("User Json: " + JSON.stringify(req.user));
			this.userService.updateRefreshToken(req.user.id, refreshtoken);
			res.status(200).redirect('/login/callback');
		}
		else
			res.sendStatus(401);
	}

	@UseGuards(JwtGuard)
	@Get('profile')
	async profile(@Request() req){
		console.log(JSON.stringify(req.user));
		console.log('user-list: ' + JSON.stringify(this.userService.users));
		console.log("finding id: " + req.user.userId)
		let user = await this.userService.getUser(req.user.userId);
		console.log("user: " + JSON.stringify(user));
	  	return (JSON.stringify(user));
	}

	/*
	**
	*/
	@Get('logout')
	async logout(@Res({passthrough: true}) res) {
		res.clearCookie('auth', {httpOnly: true});
		return {msg:"success"};
	}

	/*
	** refresh Token
	*/
	@UseGuards(JwtRefreshGuard)
	@Get('refreshtoken')
	async refreshToken(@Response() res, @Request() req) {
		console.log("User Json: " + JSON.stringify(req.user));
		const token = await this.authService.getAccessToken(req.user);
		const refreshtoken = await this.authService.getRefreshToken(req.user);
		const auth_cookie = {token: token, refreshtoken: refreshtoken};
		await this.userService.updateRefreshToken(req.user.userId, refreshtoken);
		res.clearCookie('auth', {httpOnly: true});
		res.cookie('auth', auth_cookie, { httpOnly: true }).send();
	}

	/*
	** sample of endpoint
	*/
	@UseGuards(JwtGuard)
	@Get('data')
	async getdata(@Request() req) {
		return JSON.stringify({msg:"success"});
	}


}
