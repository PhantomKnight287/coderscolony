import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Token } from 'src/decorators/token/token.decorator';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { DecodedJWT } from 'src/types/jwt';
import { UpdateProfileValidator } from 'src/validators/update.validator';
import { z } from 'zod';

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
  @Post('update')
  async updateProfile(
    @Token({ validate: true }) { id }: DecodedJWT,
    @Body() body: z.infer<typeof UpdateProfileValidator>,
  ) {
    const data = UpdateProfileValidator.safeParse(body);
    if (!data.success) {
      throw new HttpException(
        (data as any).error.issues[0].message,
        HttpStatus.BAD_REQUEST,
      );
    }
    const { color, email, name, oneLiner, username } = body;
    await this.prisma.prisma.user.update({
      where: { id },
      data: {
        bannerColor: color,
        email,
        name,
        oneLiner,
        username,
      },
    });
    return 'ok';
  }
  @Post(':username')
  async updateProfileViews(
    @Param('username') username: string,
    @Token({ validate: true }) { id },
  ) {
    const user = await this.prisma.prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (!user)
      throw new HttpException(
        'No user account associated with provided authentication credentials.',
        HttpStatus.NOT_FOUND,
      );
    const userAccount = await this.prisma.prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
    });
    if (!userAccount)
      throw new HttpException('No User Account Found', HttpStatus.NOT_FOUND);
    if (user.id === userAccount.id)
      throw new HttpException(
        "You can't add view on your own profile.",
        HttpStatus.FORBIDDEN,
      );
    const isViewAlreadyAdded = userAccount.views.includes(user.id);
    if (isViewAlreadyAdded)
      throw new HttpException('View Already Added.', HttpStatus.CONFLICT);
    await this.prisma.prisma.user.update({
      where: {
        id: userAccount.email,
      },
      data: {
        views: {
          push: user.id,
        },
      },
    });
    return { viewed: true };
  }
}
