import { Controller, Get, UseGuards, Res, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { get } from 'superagent';
import { Intra42AuthGuard } from './intra42.guard';
import { Intra42Strategy } from './intra42.strategy'

@Controller("auth")
export class AuthController {

	@Get("login")
    @UseGuards(AuthGuard('intra42'))
	login()
	{
		return ;
	}

	@Get("callback")
    @UseGuards(AuthGuard('intra42'))
	callback(@Res() res: Response)
	{
		res.sendStatus(200);
	}
}
