import {
  BadRequestException,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { readFileSync, unlink } from 'fs';
import { diskStorage } from 'multer';
import { client } from 'src/lib/supbase';
import { randomUUID } from 'crypto';
import { Token } from 'src/decorators/token/token.decorator';
import { DecodedJWT } from 'src/types/jwt';
import { verify } from 'jsonwebtoken';

@Controller('upload')
export class UploadController {
  @Post('')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (_, file, cb) =>
          cb(null, `${Date.now()}-${randomUUID()}-${file.originalname}`),
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Token() token: string,
  ) {
    let jwt: DecodedJWT;
    try {
      jwt = verify(token, process.env.JWT_SECRET) as any as DecodedJWT;
    } catch {
      throw new HttpException(
        token
          ? 'Invalid Auth Token'
          : 'Auth Token is required to access this resource',
        token ? HttpStatus.UNAUTHORIZED : HttpStatus.FORBIDDEN,
      );
    }
    const fileContent = readFileSync(`${process.cwd()}/${file.path}`);
    const { data, error } = await client.storage
      .from('images')
      .upload(
        `assets/${jwt.id}-${randomUUID()}-${file.filename}`,
        fileContent,
        {
          contentType: file.mimetype,
        },
      );
    unlink(
      `${process.cwd()}/${file.path}`,
      (err) => err && console.log(`${err.message}`),
    );
    console.log(error);
    if (error) {
      throw new BadRequestException(undefined, error.message);
    }
    console.log(data);
    return {
      path: data.path,
    };
  }
}
