import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Token } from 'src/decorators/token/token.decorator';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { DecodedJWT } from 'src/types/jwt';

@Controller('profile')
export class ProfileController {
  constructor(protected prisma: PrismaService) {}

  @Get(':username')
  async fetchProfile(
    @Token({ optional: true }) token: string,
    @Param('username') username: string,
  ) {
    let jwt: DecodedJWT = undefined;
    if (token) {
      try {
        jwt = (await verify(
          token,
          process.env.JWT_SECRET,
        )) as unknown as DecodedJWT;
      } catch (err) {
        throw new HttpException(
          'Invalid or Expired Authentication Token',
          HttpStatus.FORBIDDEN,
        );
      }
    }
    const profile = await this.prisma.prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
      select: {
        bannerImage: true,
        bannerColor: true,
        name: true,
        profileImage: true,
        username: true,
        verified: true,
        id: true,
        createdAt: true,
        followers: true,
        following: true,
        oneLiner: true,
      },
    });
    if (!profile)
      throw new HttpException('No User Found', HttpStatus.NOT_FOUND);
    (profile as any)['followers'] = profile.followers.length;
    (profile as any)['following'] = profile.following.length;

    if (jwt != undefined && jwt.id === profile.id) {
      profile['edit'] = true;
    }
    return profile;
  }
}
