import { Controller, Get, Post, UseGuards, Request, Response, Req, Res, Header, Body} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtGuard } from './jwt/jwt.guard';
import { JwtRefreshGuard } from './jwt/jwtrefresh.guard';
import { Intra42Guard } from './intra42/intra42.guard'
import { TfaGuard } from './tfa/tfa.guard';
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
			const tfa_fulfilled = !(await this.userService.getTfaEnabled(req.user.id));
			const auth_cookie = {token: token, refreshtoken: refreshtoken, tfa_fulfilled: tfa_fulfilled};
			res.cookie('auth', auth_cookie, { httpOnly: true });
			console.log("User Json: " + JSON.stringify(req.user));
			await this.userService.updateRefreshToken(req.user.id, refreshtoken);
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
		console.log("finding id: " + req.user.id)
		console.log("profile-cookie" + JSON.stringify(req.cookies['auth']?.tfa_fulfilled));
		let user = await this.userService.getUser(req.user.id);
		const tfa_fulfilled = (!(user.tfa_enabled) || req.cookies['auth']?.tfa_fulfilled);
		user.tfa_fulfilled = tfa_fulfilled;
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
		const refreshtoken = req.cookies['auth']?.refreshtoken;
		const tfa_fulfilled: boolean = req.cookies['auth']?.tfa_fulfilled;
		const auth_cookie = {token: token, refreshtoken: refreshtoken, tfa_fulfilled: tfa_fulfilled};
		res.clearCookie('auth', {httpOnly: true});
		res.cookie('auth', auth_cookie, { httpOnly: true }).send(JSON.stringify({msg:"success"}));
	}

	/*
	** sample of endpoint
	*/
	@UseGuards(TfaGuard)
	@Get('data')
	async getdata(@Request() req) {
		return JSON.stringify({msg:"success"});
	}


	/*
	** 2FA
	*/
	@UseGuards(JwtGuard)
	@Get('tfa_qrcode')
	@Header('content-type', 'image/png')
	async get_qrcode(@Res() res: Response, @Request() req) {
		console.log('tfa qrcode' + JSON.stringify(req.user	));
		return await this.authService.generateQrCode(req.user.id, res);
	}

	@UseGuards(TfaGuard)
	@Post('tfa_disable')
	async activate_tfa(@Request() req) {
		console.log('tfa qrcode' + JSON.stringify(req.user	));
		return await this.authService.disableTwoFactor(req.user.id);
	}

	@UseGuards(JwtGuard)
	@Post('tfa_verify')
	async verify_tfa(@Body() body: any, @Request() req, @Response() res): Promise<any> {
		console.log('tfa verify' + JSON.stringify(req.user));
		console.log('tfa code' + JSON.stringify(body.code));
		const verified: boolean = await this.authService.verifyTwoFactor(req.user.id, body.code);
		console.log("verified " + verified);
		if (verified)
		{
			const auth_cookie = {token: req.cookies['auth']?.token, refreshtoken: req.cookies['auth']?.refreshtoken, tfa_fulfilled: true};
			res.clearCookie('auth', {httpOnly: true});
			res.cookie('auth', auth_cookie, { httpOnly: true });
		}
		res.send(JSON.stringify({msg: verified}));
		return ;
	}
}
