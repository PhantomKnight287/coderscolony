import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Token } from 'src/decorators/token/token.decorator';
import { slugify } from 'src/helpers/slugify';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { DecodedJWT } from 'src/types/jwt';

@Controller('stats')
export class StatsController {
  constructor(protected prisma: PrismaService) {}

  @Get(':forumSlug/:postSlug')
  async getStats(
    @Param('forumSlug') forumSlug: string,
    @Param('postSlug') postSlug: string,
    @Token({ optional: true }) token?: string,
  ) {
    let jwt: DecodedJWT;
    if (token) {
      try {
        jwt = verify(token, process.env.JWT_SECRET) as DecodedJWT;
      } catch (e) {
        throw new HttpException(
          'Invalid or Expired Token',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }

    const forumPost = await this.prisma.prisma.posts.findFirst({
      where: {
        slug: {
          equals: slugify(postSlug),
          mode: 'insensitive',
        },
        Forums: {
          urlSlug: {
            equals: slugify(forumSlug),
            mode: 'insensitive',
          },
        },
      },
    });
    if (!forumPost)
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    const likes = forumPost.likedBy.length;
    const liked =
      jwt !== undefined ? forumPost.likedBy.includes(jwt.id) : false;

    return { likes, liked };
  }
  @Get('blog/:username/:blogSlug')
  async getBlogStats(
    @Param('blogSlug') blogSlug: string,
    @Param('username') username: string,
    @Token({ optional: true }) token?: string,
  ) {
    let jwt: DecodedJWT;
    if (token) {
      try {
        jwt = verify(token, process.env.JWT_SECRET) as DecodedJWT;
      } catch (e) {
        throw new HttpException(
          'Invalid or Expired Token',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
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
      select: {
        likes: true,
      },
    });
    if (!blog) throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
    const likes = blog.likes.length;
    const liked = jwt !== undefined ? blog.likes.includes(jwt.id) : false;
    return { likes, liked };
  }
}
