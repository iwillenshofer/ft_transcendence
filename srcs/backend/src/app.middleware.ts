import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AppMiddleware implements NestMiddleware {
  constructor (		private jwtService: JwtService ) { }
  async use(req: any, res: any, next: () => void) {
  try {
    console.log('middleware');
    const data = req?.cookies['auth'];
    const decodedToken = await this.jwtService.verify(data.token, {secret: process.env.JWT_SECRET});
    console.log(data);
    console.log(decodedToken);
  }
    catch (err) { 
      console.log(err);
      throw new UnauthorizedException;
  }
    next();
  }
}
