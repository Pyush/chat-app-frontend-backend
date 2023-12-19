import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User, UserDTO } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private authService: AuthService,
  ) {}

  async create(newUser: User): Promise<User> {
    try {
      const exists: boolean = await this.mailExists(newUser.email);
      console.log(exists);
      if (!exists) {
        const passwordHash: string = await this.hashPassword(newUser.password);
        newUser.password = passwordHash;
        const user = new this.userModel(newUser);
        return await user.save();
      } else {
        throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
      }
    } catch (e) {
      throw new HttpException(
        JSON.stringify(e),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(user: UserDTO): Promise<string> {
    try {
      const foundUser: User = await this.findByEmail(user.email.toLowerCase());
      console.log(foundUser);
      if (foundUser) {
        const matches: boolean = await this.validatePassword(
          user.password,
          foundUser.password,
        );
        if (matches) {
          console.log(matches);
          console.log(foundUser._id);
          return this.authService.generateJwt(foundUser);
        } else {
          throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
      } else {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    } catch {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  async findAllByUsername(username: string): Promise<User[]> {
    return this.userModel.find({
      username: username,
    });
  }

  // also returns the password
  private async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  private async hashPassword(password: string): Promise<string> {
    return this.authService.hashPassword(password);
  }

  private async validatePassword(
    password: string,
    storedPasswordHash: string,
  ): Promise<any> {
    return this.authService.comparePasswords(password, storedPasswordHash);
  }

  private async findOne(id: Types.ObjectId): Promise<User> {
    return this.userModel.findOne({ id: id });
  }

  public getOne(id: Types.ObjectId): Promise<User> {
    return this.userModel.findOne({ id: id });
  }

  private async mailExists(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email });
    if (user) {
      return true;
    } else {
      return false;
    }
  }
}
