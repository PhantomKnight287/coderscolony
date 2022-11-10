import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { DecodedJWT } from 'src/types/jwt';

export const Token = createParamDecorator(
  (
    data: { optional?: boolean; validate?: boolean },
    ctx: ExecutionContext,
  ): string | DecodedJWT => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const token = request.headers['authorization']?.replace('Bearer ', '');
    if (!token && !data?.optional)
      throw new HttpException(
        'Authentication Token is required to access this resource.',
        HttpStatus.UNAUTHORIZED,
      );
    let jwt: DecodedJWT;
    if (data?.validate) {
      try {
        jwt = verify(token, process.env.JWT_SECRET) as unknown as DecodedJWT;
        return jwt;
      } catch (err) {
        throw new HttpException(
          'Invalid or Expired Authentication Token',
          HttpStatus.FORBIDDEN,
        );
      }
    }
    return token;
  },
);
