/* eslint-disable prettier/prettier */

import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';

export const Token = createParamDecorator(
  (data: { optional?: boolean }, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const token = request.headers['authorization']?.replace('Bearer ', '');
    if (!token && !data.optional)
      throw new HttpException(
        'Authentication Token is required to access this resource.',
        HttpStatus.UNAUTHORIZED,
      );
    return token;
  },
);
