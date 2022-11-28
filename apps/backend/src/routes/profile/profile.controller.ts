import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
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
  @Get(':username/network/followers')
  async fetchUserNetwork(
    // @Token({ optional: true }) token: string,
    @Query('take') take: string,
    @Param('username') username: string,
  ) {
    const _take = Number.isNaN(parseInt(take)) ? 5 : parseInt(take);
    const user = await this.prisma.prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
    });
    if (!user) throw new HttpException('No User Found', HttpStatus.NOT_FOUND);
    const followers = await this.prisma.prisma.follows.findMany({
      where: {
        following: {
          id: user.id,
        },
      },
      select: {
        follower: {
          select: {
            username: true,
            profileImage: true,
            verified: true,
            oneLiner: true,
          },
        },
      },

      take: _take,
      skip: _take > 5 ? _take - 5 : undefined,
    });
    const res: Record<any, any> = { followers };
    if (followers.length > 5) res['next'] = take + 5;
    return res;
  }
}
