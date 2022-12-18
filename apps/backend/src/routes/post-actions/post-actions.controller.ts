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
import { DecodedJWT } from 'src/types/jwt';

@Controller('forum/:slug/post/:postSlug')
export class PostActionsController {
  constructor(protected prisma: PrismaService) {}

  @Post('like')
  async liked(
    @Param('slug') slug: string,
    @Param('postSlug') postSlug: string,
    @Token({ validate: true }) { id }: DecodedJWT,
  ) {
    slug = slugify(slug);
    postSlug = slugify(postSlug);
    const user = await this.prisma.prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (!user)
      throw new HttpException(
        'No user account associated with provided auth token',
        HttpStatus.NOT_FOUND,
      );
    const post = await this.prisma.prisma.posts.findFirst({
      where: {
        slug: postSlug,
      },
    });
    if (!post)
      throw new HttpException(
        'No post found with provided slug',
        HttpStatus.NOT_FOUND,
      );
    const isPostAlreadyLiked = post.likedBy.includes(user.id);
    if (isPostAlreadyLiked === true)
      throw new HttpException(
        "You've already liked this post.",
        HttpStatus.CONFLICT,
      );
    await this.prisma.prisma.posts.update({
      where: {
        id: post.id,
      },
      data: {
        likedBy: {
          push: user.id,
        },
      },
    });
    return {
      liked: true,
    };
  }
  @Delete('like')
  async dislike(
    @Param('slug') slug: string,
    @Param('postSlug') postSlug: string,
    @Token({ validate: true }) { id }: DecodedJWT,
  ) {
    slug = slugify(slug);
    postSlug = slugify(postSlug);
    const user = await this.prisma.prisma.forumMember.findFirst({
      where: {
        user: {
          id,
        },
        forum: {
          urlSlug: slug,
        },
      },
      select: {
        forum: true,
        user: true,
      },
    });
    if (!user)
      throw new HttpException(
        'No user account associated with provided auth token',
        HttpStatus.NOT_FOUND,
      );
    const post = await this.prisma.prisma.posts.findFirst({
      where: {
        slug: postSlug,
      },
    });
    console.log(post.id);
    if (!post)
      throw new HttpException(
        'No post found with provided slug',
        HttpStatus.NOT_FOUND,
      );
    const isPostAlreadyLiked = post.likedBy.includes(user.user.id);
    if (isPostAlreadyLiked === false)
      throw new HttpException(
        "You've already disliked this post.",
        HttpStatus.CONFLICT,
      );
    // using raw sql query because prisma can't remove arrays
    await this.prisma.prisma
      .$queryRaw`update "Posts" set "likedBy" = array_remove("likedBy",${user.user.id}) WHERE "Posts"."id"=${post.id}`;
    return {
      liked: false,
    };
  }
}
