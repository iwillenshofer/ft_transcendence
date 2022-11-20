import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, Param, Post, Put, Request, Response, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {


  constructor(
    private statsService: StatsService
  ) { };


  @Get('history/:username')
  async matchHistory(@Param('username') username, @Request() req) {
    let history = await this.statsService.getHistory(username);
    return (JSON.stringify(history));
  }

  @Get('userinfo/:username')
  async userInfo(@Param('username') username, @Request() req) {
    let ret = await this.statsService.getUserStats(username);
    return (JSON.stringify(ret));
  }

  @Get('status/:username')
  async getStatus(@Param('username') username, @Response() res) {
    let status = await this.statsService.getStatusByUsername(username);
    res.status(200).send({ status: status });
  }

  @Put('status/:username')
  async setStatus(@Param('username') username: string, @Body() body: any, @Response() res) {
    let status = await this.statsService.setStatusByUsername(username, body.status);
    res.status(200).send({ status: status });
  }

  @Get('achievements/:username')
  async getAchievements(@Param('username') username, @Request() req) {
    let ret = await this.statsService.getAchievements(username);
    console.log('achievement' + JSON.stringify(ret));
    return (JSON.stringify(ret));
  }
}
