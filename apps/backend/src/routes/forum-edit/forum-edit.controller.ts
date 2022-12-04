import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { Forums } from 'db';
import { Token } from 'src/decorators/token/token.decorator';
import { slugify } from 'src/helpers/slugify';
import { EditableService } from 'src/services/editable/editable.service';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { DecodedJWT } from 'src/types/jwt';

@Controller('forum-edit/:slug')
export class ForumEditController {
  constructor(
    protected prisma: PrismaService,
    protected editable: EditableService,
  ) {}

  @Get('details')
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
  @Post('edit')
  async editForum(
    @Token({ validate: true }) { id }: DecodedJWT,
    @Body() body: Partial<Forums>,
    @Param('slug') slug: string,
  ) {
    const isForumEditable = await this.editable.isForumEditable(
      id,
      slugify(slug),
    );
    if (isForumEditable.editable === false)
      throw new HttpException(isForumEditable.message, isForumEditable.status);

    const { bannerColor, name } = body;
    const forumInfo = await this.prisma.prisma.forums.findFirst({
      where: {
        urlSlug: {
          equals: slugify(slug),
          mode: 'insensitive',
        },
      },
    });
    await this.prisma.prisma.forums.update({
      where: {
        id: forumInfo.id,
      },
      data: {
        name,
        bannerColor,
      },
    });
    return { edited: true };
  }
  @Post('banner-image')
  async changeBannerImage(
    @Token({ validate: true }) { id }: DecodedJWT,
    @Body() body: { url: string },
    @Param('slug') slug: string,
  ) {
    const isForumEditable = await this.editable.isForumEditable(
      id,
      slugify(slug),
    );
    if (isForumEditable.editable === false)
      throw new HttpException(isForumEditable.message, isForumEditable.status);
    const { url } = body;
    const forumInfo = await this.prisma.prisma.forums.findFirst({
      where: {
        urlSlug: {
          equals: slugify(slug),
          mode: 'insensitive',
        },
      },
    });
    await this.prisma.prisma.forums.update({
      where: {
        id: forumInfo.id,
      },
      data: {
        bannerImage: url,
      },
    });
    return { edited: true };
  }
  @Post('profile-image')
  async changeProfileImage(
    @Token({ validate: true }) { id }: DecodedJWT,
    @Body() body: { url: string },
    @Param('slug') slug: string,
  ) {
    const isForumEditable = await this.editable.isForumEditable(
      id,
      slugify(slug),
    );
    if (isForumEditable.editable === false)
      throw new HttpException(isForumEditable.message, isForumEditable.status);
    const { url } = body;
    const forumInfo = await this.prisma.prisma.forums.findFirst({
      where: {
        urlSlug: {
          equals: slugify(slug),
          mode: 'insensitive',
        },
      },
    });
    await this.prisma.prisma.forums.update({
      where: {
        id: forumInfo.id,
      },
      data: {
        profileImage: url,
      },
    });
    return { edited: true };
  }
  @Delete('banner-image/remove')
  async removeBannerImage(
    @Token({ validate: true }) { id }: DecodedJWT,
    @Param('slug') slug: string,
  ) {
    const isForumEditable = await this.editable.isForumEditable(
      id,
      slugify(slug),
    );
    if (isForumEditable.editable === false)
      throw new HttpException(isForumEditable.message, isForumEditable.status);
    const forumInfo = await this.prisma.prisma.forums.findFirst({
      where: {
        urlSlug: {
          equals: slugify(slug),
          mode: 'insensitive',
        },
      },
    });
    await this.prisma.prisma.forums.update({
      where: {
        id: forumInfo.id,
      },
      data: {
        bannerImage: null,
      },
    });
    return { edited: true };
  }
}
