import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { slugify } from 'src/helpers/slugify';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ForumsService {
  constructor(protected prisma: PrismaService) {}
  async getForumInfo(slug: string) {
    const forumInfo = await this.prisma.prisma.forums.findFirst({
      where: {
        urlSlug: slugify(slug),
      },
      select: {
        bannerImage: true,
        createdAt: true,
        name: true,
        profileImage: true,
        forumMembers: {
          select: {
            role: true,
            user: {
              select: {
                username: true,
                profileImage: true,
                name: true,
              },
            },
          },
        },
        urlSlug: true,
        bannerColor: true,
      },
    });
    if (!forumInfo)
      throw new HttpException(
        'No Forum Found With Given Slug',
        HttpStatus.NOT_FOUND,
      );
    return {
      ...forumInfo,
      forumMembers: forumInfo.forumMembers.length,
      admins: forumInfo.forumMembers.filter((d) => d.role === 'ADMIN'),
      moderators: forumInfo.forumMembers.filter((d) => d.role === 'MODERATOR'),
    };
  }
}
