import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Response,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { ValidationError } from 'joi';
import { sign, TokenExpiredError, verify } from 'jsonwebtoken';
import { AuthService } from 'src/services/auth/auth.service';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { LoginBody, SignUpBody } from 'src/types/auth';
import { Login, SignUp } from 'src/validators/auth.validator';
import { config } from 'dotenv';
import { Response as RES } from 'express';
import { Token } from 'src/decorators/token/token.decorator';
import { DecodedJWT } from 'src/types/jwt';
config();

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
    const jwt = sign({ id: user.id }, process.env.JWT_SECRET);
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
    const { email, password, username, name } = body;
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
        name,
        username: username.replace(' ', '').replace(/[^a-zA-Z0-9_ ]/g, ''),
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
        name: true,
        verified: true,
      },
    });
    const token = sign({ id: user.id }, process.env.JWT_SECRET);
    return {
      token,
      user,
    };
  }
  @Get('hydrate')
  async hydrate(@Token() token: string, @Response() res: RES) {
    if (!token)
      throw new HttpException(
        'Authentication Token is required to access this resource.',
        HttpStatus.UNAUTHORIZED,
      );
    let jwt: { id: string };
    try {
      jwt = verify(token, process.env.JWT_SECRET) as unknown as {
        id: string;
      };
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        res.set({ 'X-Error': 'expired' });
      }
      throw new HttpException(
        'Invalid or Expired Authentication Token',
        HttpStatus.FORBIDDEN,
      );
    }
    const user = await this.prisma.prisma.user.findFirst({
      where: {
        id: jwt.id,
      },
      select: {
        bannerColor: true,
        bannerImage: true,
        email: true,
        id: true,
        password: false,
        profileImage: true,
        username: true,
        name: true,
        verified: true,
      },
    });
    if (!user) {
      res.set({ 'X-Error': 'user-not-found' });
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    return res.status(200).json({ ...user });
  }
  @Get('settings')
  async sendProfileInfo(@Token({ validate: true }) { id }: DecodedJWT) {
    const profile = await this.prisma.prisma.user.findFirst({
      where: { id },
      select: {
        email: true,
        bannerColor: true,
        bannerImage: true,
        profileImage: true,
        name: true,
        oneLiner: true,
        tags: true,
        username: true,
      },
    });
    if (!profile)
      throw new HttpException('No Profile Data Found', HttpStatus.NOT_FOUND);
    return profile;
  }
}
