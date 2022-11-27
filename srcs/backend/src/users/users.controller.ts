import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, Param, Post, Request, Response, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Observable, of } from 'rxjs';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { ConnectedUsersService } from 'src/services/connected-user/connected-user.service';
import { v4 as uuidv4 } from 'uuid';
import { UserDTO } from './users.dto';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {

    constructor(
        private UsersService: UsersService,
        private connectedUsersService: ConnectedUsersService
    ) { }

    @UseGuards(JwtGuard)
    @Post('username')
    async updateUsername(@Request() req, @Body() body): Promise<Object> {
        return of({ username: await this.UsersService.updateUsername(req.user.id, body.username) })
    }

    @UseGuards(JwtGuard)
    @Get('username')
    async getUsername(@Request() req) {
        return of({ username: await this.UsersService.getUsername(req.user.id) })
    }

    @UseGuards(JwtGuard)
    @Get('getAllConnectedUser')
    async getAllConnectedUSer(@Request() req) {
        return of({ user: await this.connectedUsersService.getAllConnectedUser() })
    }

    @UseGuards(JwtGuard)
    @Get('get_user_by_id/:id')
    async getUserById(@Param('id') id) {
        let user: UserDTO = UserDTO.from(await this.UsersService.getUser(id));
        return (JSON.stringify(user));
    }


    @UseGuards(JwtGuard)
    @Get('get_my_user')
    async getMyUser(@Request() req) {
        let user: UserDTO = UserDTO.from(await this.UsersService.getUser(req.user.id));
        return (JSON.stringify(user));
    }

    @UseGuards(JwtGuard)
    @Get('get_user_by_username/:username')
    async getUserByUsername(@Param('username') username, @Request() req) {
        return of(await this.UsersService.getUserByUsername(username))
    }

    @Get('is-username-taken/:username')
    async isUsernameTaken(@Param('username') username, @Request() req) {
        return of(await this.UsersService.isUsernameTaken(username))
    }

    @UseGuards(JwtGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/profileimages',
            filename: (req, file, cb) => {
                const ext = '.' + file.originalname.split('.').pop();
                const filename = uuidv4() + ext;
                cb(null, filename)
            }
        })
    }))
    uploadFile(@Request() req, @UploadedFile() file): Observable<Object> {
        const oldAvatar = req.body.oldAvatar.split('/').pop();
        if (oldAvatar) {
            this.UsersService.deleteAvatar(oldAvatar);
        }
        this.UsersService.updateUrlAvatar(req.user.id, 'user/image/' + file.filename);
        return of({ imagePath: 'user/image/' + file.filename })
    }

    @Get('image/:imgpath')
    seeUploadedFile(@Param('imgpath') image, @Response() res) {
        // console.log("HERE")
        return res.sendFile(image, { root: './uploads/profileimages/' });
    }

    @UseGuards(JwtGuard)
    @Get('image-url')
    async getImgUrl(@Request() req, @Response() res) {
        const path: string = await this.UsersService.getUrlAvatar(req.user.id);
        res.status(200).send({ url: path });
    }

    @UseGuards(JwtGuard)
    @Get('get_all_users')
    async getAllUsername(@Request() req, @Response() res) {
        res.status(200).send(await this.UsersService.getAllUSername());
    }

}
