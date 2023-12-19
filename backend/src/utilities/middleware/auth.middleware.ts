import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';

export interface RequestModel extends Request {
  user: User;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async use(req: RequestModel, res: Response, next: NextFunction) {
    try {
      console.log(req.headers);
      const tokenArray: string[] = req.headers['authorization'].split(' ');
      console.log(tokenArray);
      const decodedToken = await this.authService.verifyJwt(tokenArray[1]);
      console.log(decodedToken);
      // make sure that the user is not deleted, or that props or rights changed compared to the time when the jwt was issued
      const user: User = await this.userService.getOne(decodedToken.user.id);
      if (user) {
        // add the user to our req object, so that we can access it later when we need it
        // if it would be here, we would like overwrite
        req.user = user;
        next();
      } else {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    } catch (e) {
      console.log(e);
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
