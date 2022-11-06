import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, Param, Post, Request, Response, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {


    constructor(
        private statsService: StatsService
    ) {};


    @Get('history/:username')
    async matchHistory(@Param('username') username, @Request() req) {
		let history = await this.statsService.getHistory(username);
		return (JSON.stringify(history));    }

    @Get('userinfo/:username')
    async userInfo(@Param('username') username, @Request() req) {
		let history = await this.statsService.getUserinfo(username);
		return (JSON.stringify(history));    }
}
