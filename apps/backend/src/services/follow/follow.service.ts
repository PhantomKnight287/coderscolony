import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FollowService {
  constructor(protected prisma: PrismaService) {}

  async followable(id: string, username: string) {
    const user = await this.prisma.prisma.user.findFirst({
      where: { id },
    });
    if (!user)
      return {
        message: 'No user account found with associated authentication token.',
        status: HttpStatus.UNAUTHORIZED,
      };

    const requestedUser = await this.prisma.prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
    });

    if (!requestedUser)
      return {
        message: 'No user found with provided username',
        status: HttpStatus.NOT_FOUND,
      };
    if (user.id === requestedUser.id)
      return {
        message: "You can't follow yourself.",
        status: HttpStatus.CONFLICT,
      };
    const follower = await this.prisma.prisma.follows.findFirst({
      where: {
        AND: [
          {
            follower: {
              id: user.id,
            },
          },
          {
            following: {
              id: requestedUser.id,
            },
          },
        ],
      },
    });
    if (follower)
      return {
        followable: false,
      };
    return {
      followable: true,
    };
  }
}
