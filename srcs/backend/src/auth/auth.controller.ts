import { Controller, Get, Post, UseGuards, Request, Response, Req, Res, Header, Body, Param, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtGuard } from './jwt/jwt.guard';
import { JwtRefreshGuard } from './jwt/jwtrefresh.guard';
import { Intra42Guard } from './intra42/intra42.guard';
import { TfaGuard } from './tfa/tfa.guard';
import { UsersService } from 'src/users/users.service';
import { Writable } from 'typeorm/platform/PlatformTools';
import { UserDTO } from 'src/users/users.dto';
import { AuthGuard } from '@nestjs/passport';
import { FakeIntra42Guard } from './intra42/fakeintra42.guard';

@Controller("auth")
export class AuthController {

	constructor(
		private authService: AuthService,
		private userService: UsersService
	) { }


	/*
	** login routed, requested by the frontend (/auth/login)
	** since the user is not logged in yet, only intra42 guard is used
	*/

	// @UseGuards(FakeIntra42Guard)
	@UseGuards(Intra42Guard)
	@Get("login")
	async login(@Request() req, @Response() res) {
		return;
	}

	/*
	** /auth/callback is the intra's return
	*/

	// @UseGuards(FakeIntra42Guard)
	@UseGuards(Intra42Guard)
	@Get("callback")
	async callback(@Response() res, @Request() req) {
		console.log(req.user);
		if (req.user) {
			/*
			** yey, we have a user, returned by intra42Strategy.
			** let's get the JWT Token.
			** Will have to check for 2FA first probably here.
			*/
			const random_code: string = await this.authService.generateCallbackCode(req.user.id)
			res.status(200).redirect('/login/callback?code=' + random_code);
		}
		else {
			res.sendStatus(401);
		}
	}

	@UseGuards(JwtGuard)
	@Get('profile')
	async profile(@Request() req) {
		console.log("user-profile:" + JSON.stringify(req.user));
		let user: UserDTO = UserDTO.from(await this.userService.getUser(req.user.id));
		user.tfa_fulfilled = (!(await this.userService.getTfaEnabled(req.user.id)) || req.user.tfa_fulfilled);
		console.log("user dto:" + JSON.stringify(user));
		return (JSON.stringify(user));
	}

	@Get('token/:code')
	async token(@Param('code') code, @Res({ passthrough: true }) res) {
		const callback_code: { username: string, id: number } | null = await this.authService.retrieveCallbackToken(code);
		if (!(callback_code)) {
			res.sendStatus(401);
			return;
		}
		const refreshtoken = await this.authService.getRefreshToken({ username: callback_code.username, id: callback_code.id });
		const callback_token: string = await this.authService.getAccessToken({ username: callback_code.username, id: callback_code.id });

		res.cookie('refresh_token', refreshtoken, { httpOnly: true });
		await this.userService.updateRefreshToken(callback_code.id, refreshtoken);
		return { token: callback_token };
	}

	/*
	**
	*/
	@Get('logout')
	async logout(@Res({ passthrough: true }) res) {
		res.clearCookie('refresh_token', { httpOnly: true });
		return { msg: "success" };
	}

	/*
	** refresh Token
	*/
	@UseGuards(JwtRefreshGuard)
	@Get('refreshtoken')
	async refreshToken(@Response() res, @Request() req) {
		const token: string = await this.authService.getAccessToken(req.user, req.user.tfa_fulfilled);
		res.status(200).send({ token: token });
	}

	/*
	** sample of endpoint
	*/
	@UseGuards(TfaGuard)
	@Get('data')
	async getdata(@Response() res) {
		res.status(200).send({ msg: 'success' });
	}

	/*
	** 2FA
	*/
	@UseGuards(JwtGuard)
	@Get('tfa_qrcode')
	@Header('content-type', 'image/png')
	async get_qrcode(@Res() res: Writable, @Request() req) {
		return await this.authService.generateQrCode(req.user.id, res);
	}

	@UseGuards(TfaGuard)
	@Post('tfa_disable')
	async activate_tfa(@Request() req) {
		return await this.authService.disableTwoFactor(req.user.id);
	}

	@UseGuards(JwtGuard)
	@Post('tfa_verify')
	async verify_tfa(@Body() body: any, @Request() req, @Response() res): Promise<any> {
		const verified: boolean = await this.authService.verifyTwoFactor(req.user.id, body.code);
		res.send(JSON.stringify({ msg: verified }));
		return;
	}
}
