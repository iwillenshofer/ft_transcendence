import { HttpService } from '@nestjs/axios';
import { Controller, Get, NotFoundException, Param, Post, Req, Request, Response, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from './users.service';


@Controller('users')
export class UsersController {

    constructor(
        private userService: UsersService,
        private readonly HttpService: HttpService
    ) { }

    @UseGuards(JwtGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/profileimages',
            filename: (req, file, cb) => {
                const filename = uuidv4() + '-' + file.originalname
                console.log('backend: ' + filename)
                cb(null, filename)
            }
        })
    }))

    uploadFile(@Request() req, @UploadedFile() file): Observable<Object> {
        this.userService.updateUrlAvatar(req.user.id, 'users/image/' + file.filename)
        return of({ imagePath: 'users/image/' + file.filename })
    }

    @Get('image/:imgpath')
    seeUploadedFile(@Param('imgpath') image, @Response() res) {
        return res.sendFile(image, { root: './uploads/profileimages/' });
    }
}
