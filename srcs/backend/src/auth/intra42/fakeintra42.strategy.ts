import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-strategy";
import { AuthService } from "../auth.service";
import { UserDTO } from "src/users/users.dto";
import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

/*
** implements a Fake strategy that generates a random User
*/

@Injectable()
export class FakeIntra42Strategy extends PassportStrategy(Strategy, 'fake42strategy')
{
    constructor(private authService: AuthService) {
        super();
    }

    async authenticate(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, options?: any): Promise<void> {
        if (req.url == '/auth/login') {
            this.redirect('/auth/callback');
        }
        else {
            this.success(await this.validate());
        }
        return;
    }

    async validate(): Promise<any> {
        let user: UserDTO | null = null;
        try {
            const this_user = [
                { id: 19219, login: 'login1', displayname: 'displayname1', image_url: 'https://i.imgflip.com/19d7hr.jpg' },
                { id: 19220, login: 'login2', displayname: 'displayname2', image_url: 'https://i.imgflip.com/19d7hr.jpg' },
                { id: 19221, login: 'login3', displayname: 'displayname3', image_url: 'https://i.imgflip.com/19d7hr.jpg' },
                { id: 19222, login: 'login4', displayname: 'displayname4', image_url: 'https://i.imgflip.com/19d7hr.jpg' },
                { id: 19223, login: 'login5', displayname: 'displayname5', image_url: 'https://i.imgflip.com/19d7hr.jpg' },
                { id: 19224, login: 'login6', displayname: 'displayname6', image_url: 'https://i.imgflip.com/19d7hr.jpg' }
            ];
            const idx = Math.floor(Math.random() * (this_user.length));
            console.log('IDX:' + idx);
            user = await this.authService.getOrCreateUser(this_user[idx]);
            if (!user)
                throw new UnauthorizedException();
        } catch (error) {
            console.log(error);
            throw new UnauthorizedException();
        }
        return (user);
    }
}