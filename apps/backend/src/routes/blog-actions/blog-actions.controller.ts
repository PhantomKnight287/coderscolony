import {
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { Token } from 'src/decorators/token/token.decorator';
import { slugify } from 'src/helpers/slugify';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { VerifyUserService } from 'src/services/verify-user/verify-user.service';

@Controller('blog-action/:username/:blog')
export class BlogActionsController {
  constructor(
    protected prisma: PrismaService,
    protected verify: VerifyUserService,
  ) {}

  @Post('like')
  async likeBlog(
    @Param('username') username: string,
    @Param('blog') blogSlug: string,
    @Token({ validate: true }) { id },
  ) {
    const isUserValid = await this.verify.verifyUser(id);
    if (isUserValid === false)
      throw new HttpException(
        'No user account associated with provided auth token',
        HttpStatus.NOT_FOUND,
      );
    const user = await this.prisma.prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
    const blog = await this.prisma.prisma.blog.findFirst({
      where: {
        slug: {
          equals: slugify(blogSlug),
          mode: 'insensitive',
        },
        author: {
          username: {
            equals: username,
            mode: 'insensitive',
          },
        },
      },
    });
    if (!blog) throw new HttpException('No Blog Found', HttpStatus.NOT_FOUND);
    const isBlogAlreadyLiked = blog.likes.includes(user.id);
    if (isBlogAlreadyLiked)
      throw new HttpException(
        "You've already liked this blog",
        HttpStatus.CONFLICT,
      );
    await this.prisma.prisma.blog.update({
      where: {
        id: blog.id,
      },
      data: {
        likes: {
          push: user.id,
        },
      },
    });
    return {
      liked: true,
    };
  }
  @Delete('like')
  async dislikeBlog(
    @Param('username') username: string,
    @Param('blog') blogSlug: string,
    @Token({ validate: true }) { id },
  ) {
    const isUserValid = await this.verify.verifyUser(id);
    if (isUserValid === false)
      throw new HttpException(
        'No user account associated with provided auth token',
        HttpStatus.NOT_FOUND,
      );
    const user = await this.prisma.prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
    const blog = await this.prisma.prisma.blog.findFirst({
      where: {
        slug: {
          equals: slugify(blogSlug),
          mode: 'insensitive',
        },
        author: {
          username: {
            equals: username,
            mode: 'insensitive',
          },
        },
      },
    });
    if (!blog) throw new HttpException('No Blog Found', HttpStatus.NOT_FOUND);
    const isBlogAlreadyLiked = blog.likes.includes(user.id);
    if (isBlogAlreadyLiked === false)
      throw new HttpException(
        "You haven't liked this blog",
        HttpStatus.CONFLICT,
      );
    // using raw sql query because prisma can't remove arrays
    await this.prisma.prisma
      .$queryRaw`update "Blog" set "likes" = array_remove("likes",${user.id}) WHERE "Blog"."id"=${blog.id}`;
    return {
      liked: false,
    };
  }
}
