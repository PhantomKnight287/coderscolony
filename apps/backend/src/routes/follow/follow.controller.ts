import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { Token } from 'src/decorators/token/token.decorator';
import { FollowService } from 'src/services/follow/follow.service';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Controller('follow')
export class FollowController {
  constructor(
    protected prisma: PrismaService,
    protected follow: FollowService,
  ) {}

  @Get('user/:username')
  async isFollowable(
    @Param('username') username: string,
    @Token({ validate: true }) { id },
  ) {
    const data = await this.follow.followable(id, username);
    if ('message' in data) {
      throw new HttpException(data.message, data.status);
    }
    const { followable } = data;
    return {
      followable,
    };
  }
  @Post('user/:username')
  async followUser(
    @Param('username') username: string,
    @Token({ validate: true }) { id },
  ) {
    const data = await this.follow.followable(id, username);
    if ('message' in data) {
      throw new HttpException(data.message, data.status);
    }
    const { followable } = data;
    if (followable === false)
      throw new HttpException(
        'You cannot follow this user.',
        HttpStatus.CONFLICT,
      );
    const user = await this.prisma.prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
    });
    await this.prisma.prisma.follows.create({
      data: {
        follower: {
          connect: {
            id,
          },
        },
        following: {
          connect: {
            username: user.username,
          },
        },
      },
    });
    return {
      followed: true,
    };
  }
  @Delete('user/:username')
  async unfollowUser(
    @Param('username') username: string,
    @Token({ validate: true }) { id },
  ) {
    const data = await this.follow.followable(id, username);
    if ('message' in data) {
      throw new HttpException(data.message, data.status);
    }
    const { followable } = data;
    if (followable === true)
      throw new HttpException(
        'You are not following this user.',
        HttpStatus.CONFLICT,
      );
    const user = await this.prisma.prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
    });
    await this.prisma.prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: id,
          followingId: user.id,
        },
      },
    });
    return {
      followed: false,
    };
  }
}
