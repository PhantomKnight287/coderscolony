import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { Token } from 'src/decorators/token/token.decorator';
import { slugify } from 'src/helpers/slugify';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { DecodedJWT } from 'src/types/jwt';

@Controller('forum-edit')
export class ForumEditController {
  constructor(protected prisma: PrismaService) {}

  @Get(':slug/details')
  async getForumDetails(
    @Token({ validate: true }) { id }: DecodedJWT,
    @Param('slug') slug: string,
  ) {
    slug = slugify(slug);
    const forum = await this.prisma.prisma.forums.findFirst({
      where: {
        urlSlug: {
          equals: slug,
          mode: 'insensitive',
        },
      },
    });
    if (!forum)
      throw new HttpException(
        'No Forum Found with Provided Slug',
        HttpStatus.NOT_FOUND,
      );
    const userInfo = await this.prisma.prisma.forumMember.findFirst({
      where: {
        user: {
          id,
        },
        forum: {
          id: forum.id,
        },
      },
    });
    if (!userInfo)
      throw new HttpException(
        "You've not joined this Forum",
        HttpStatus.UNAUTHORIZED,
      );
    const isForumEditable =
      userInfo.role === 'ADMIN' || userInfo.role === 'MODERATOR';
    if (isForumEditable === false)
      throw new HttpException(
        "You're not allowed to edit this forum",
        HttpStatus.FORBIDDEN,
      );
    delete forum.id;
    delete forum.createdAt;
    delete forum.urlSlug;
    return forum;
  }
}
