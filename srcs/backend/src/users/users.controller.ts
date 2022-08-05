import { Controller, Post, Req, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
        private userService: UsersService
    ) { }

    @UseGuards(JwtGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/profileimages',
            filename: (req, file, cb) => {
                const filename = uuidv4() + '.' + file.originalname.split('.').pop();

                cb(null, filename)
            }
        })
    }))

    uploadFile(@Request() req, @UploadedFile() file): Observable<Object> {
        this.userService.updateUrlAvatar(req.user.id, file.destination + '/' + file.filename)
        return of({ imagePath: file.path })
    }

}

