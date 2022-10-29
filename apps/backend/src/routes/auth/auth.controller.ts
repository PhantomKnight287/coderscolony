import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { ValidationError } from 'joi';
import { sign } from 'jsonwebtoken';
import { AuthService } from 'src/services/auth/auth.service';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { LoginBody, SignUpBody } from 'src/types/auth';
import { Login, SignUp } from 'src/validators/auth.validator';

@Controller('auth')
export class AuthController {
  constructor(protected prisma: PrismaService, protected auth: AuthService) {}

  @Post('login')
  async Login(@Body() body: LoginBody) {
    try {
      await Login.validateAsync(body);
    } catch (e) {
      const error = e as ValidationError;
      throw new HttpException(error.details[0].message, HttpStatus.BAD_REQUEST);
    }
    const user = await this.auth.getUserByEmail(body.email);
    if (!user)
      throw new HttpException(
        'No Account Associated With Provided Email Address',
        HttpStatus.BAD_REQUEST,
      );
    const isPasswordSame = await compare(body.password, user.password);
    if (isPasswordSame === false)
      throw new HttpException('Incorrect Password', HttpStatus.UNAUTHORIZED);
    const jwt = sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '10 days',
    });
    delete user.password;
    return {
      token: jwt,
      user,
    };
  }
  @Post('signup')
  async signup(@Body() body: SignUpBody) {
    try {
      await SignUp.validateAsync(body);
    } catch (e) {
      const error = e as ValidationError;
      throw new HttpException(error.details[0].message, HttpStatus.BAD_REQUEST);
    }
    const { email, password, username } = body;
    const userWithEmail = await this.auth.getUserByEmail(email);
    if (userWithEmail)
      throw new HttpException(
        'Email Address is already Taken',
        HttpStatus.CONFLICT,
      );
    const userWithUsername = await this.auth.getUserByUsername(username);
    if (userWithUsername)
      throw new HttpException('Username is already Taken', HttpStatus.CONFLICT);
    const hashedPassowrd = await hash(password, 12);
    const user = await this.prisma.prisma.user.create({
      data: {
        email,
        password: hashedPassowrd,
        username,
        bannerColor: '#' + (((1 << 24) * Math.random()) | 0).toString(16),
        profileImage: `https://avatars.dicebear.com/api/big-smile/${username}.svg`,
      },
      select: {
        bannerColor: true,
        bannerImage: true,
        email: true,
        id: true,
        profileImage: true,
        username: true,
      },
    });
    const token = sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '10 days',
    });
    return {
      token,
      user,
    };
  }
}
