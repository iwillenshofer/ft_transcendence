import { Body, Controller, Get, Param, Post, Request, Response, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {

  constructor(
    private friendsService: FriendsService
  ) { }

  @UseGuards(JwtGuard)
  @Get('getfriends')
  async getFriends(@Request() req) {
    let ret = await this.friendsService.getFriends(req.user?.username);
    return (JSON.stringify(ret));
  }

  @UseGuards(JwtGuard)
  @Get('getrequests')
  async getRequests(@Request() req) {
    let ret = await this.friendsService.getRequests(req.user?.username);
    return (JSON.stringify(ret));
  }

  @UseGuards(JwtGuard)
  @Get('searchusers/:username')
  async getUsers(@Param('username') username, @Request() req) {
    let ret = await this.friendsService.searchUsers(username, req.user.username);
    return (JSON.stringify(ret));
  }

  /*
  ** {
  **     status: 
  **         0 // success;
  **         1 // frienship already requested;
  **         2 // user already requested a friendship
  **         3 // user is already your friend
  **     msg:
  **         description above. 
  ** }
  */
  @UseGuards(JwtGuard)
  @Post('requestfriendship/:username')
  async requestFriendship(@Param('username') username, @Request() req) {
    // console.log('friendship:' + username);
    let ret = await this.friendsService.requestFriendship(username, req.user?.username);
    // console.log('FRIENDSHIPSTATUS:'+ JSON.stringify(ret));
    return ((ret));
  }

  @UseGuards(JwtGuard)
  @Post('acceptfriendship/:username')
  async acceptFriendship(@Param('username') username, @Request() req) {
    let ret = this.friendsService.acceptFriendship(username, req.user?.username);
    return (JSON.stringify(ret));
  }

  @UseGuards(JwtGuard)
  @Post('removefriendship/:username')
  async removeFriendship(@Param('username') username, @Request() req) {
    let ret = await this.friendsService.deleteFriendship(username, req.user?.username);
    return (JSON.stringify(ret));
  }

  /*
  ** {
  **   status: 0 //not friends   
  **   status: 1 //requested by me
  **   status: 2 //requested by user
  **   status: 3 //friends  
  ** }
  */
  @UseGuards(JwtGuard)
  @Get('friendshipstatus/:username')
  async getFriendshipStatus(@Param('username') username, @Request() req) {
    let ret = await this.friendsService.getFriendshipStatus(username, req.user?.username);
    // console.log('FRIENDSHIPSTAUTS:'+ JSON.stringify(ret));
    return (JSON.stringify(ret));
  }



}