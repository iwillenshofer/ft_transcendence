import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, Param, Post, Put, Request, Response, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { GameStatsDTO, StatsDTO } from './stats.dto';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {


  constructor(
    private statsService: StatsService
  ) { };
  
  @UseGuards(JwtGuard)
  @Get('/ranking')
  async ranking(@Request() req) {
    // console.log("getting ranking");
    let ret = await this.statsService.getLadderRanking();
    return (JSON.stringify(ret));
  }

  
  @UseGuards(JwtGuard)
  @Get('history/:username')
  async matchHistory(@Param('username') username, @Request() req) {
	  let history = await this.statsService.getHistory(username);
	  return (JSON.stringify(history));
	}
	
	@UseGuards(JwtGuard)
	@Get('userinfo/:username')
	async userInfo(@Param('username') username, @Request() req) {
		let ret = await this.statsService.getUserStats(username);
		return (JSON.stringify(ret));
	}
	
	//@UseGuards(JwtGuard)
	@Get('/gamestats')
	async gameStats(): Promise<GameStatsDTO> {
		let ret = await this.statsService.getGameStats();
		return (ret);
	}
	
	
	// @UseGuards(JwtGuard)
	// @Get('status/:username')
	// async getStatus(@Param('username') username, @Response() res) {
		//   let status = await this.statsService.getStatusByUsername(username);
		//   res.status(200).send({ status: status });
		// }
		
		// @UseGuards(JwtGuard)
		// @Put('status/:username')
		// async setStatus(@Param('username') username: string, @Body() body: any, @Response() res) {
			//   let status = await this.statsService.setStatusByUsername(username, body.status);
			//   res.status(200).send({ status: status });
			// }
			
			@UseGuards(JwtGuard)
			@Get('achievements/:username')
			async getAchievements(@Param('username') username, @Request() req) {
				let ret = await this.statsService.getAchievements(username);
				// console.log('achievement' + JSON.stringify(ret));
				return (JSON.stringify(ret));
			}
			
			@UseGuards(JwtGuard)
			@Get('/:username')
			async stats(@Param('username') username): Promise<StatsDTO> {
			  let userStats = await this.statsService.getUserStats(username);
			  // console.log(JSON.stringify(userStats));
			  return (userStats);
			}
			
		}
		