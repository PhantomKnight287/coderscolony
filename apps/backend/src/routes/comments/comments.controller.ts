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
import { Token } from 'src/decorators/token/token.decorator';
import { slugify } from 'src/helpers/slugify';
import { CommentsServiceService } from 'src/services/comments-service/comments-service.service';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CreateCommentValidator } from 'src/validators/comments.validator';
import { z } from 'zod';

@Controller('comments')
export class CommentsController {
  constructor(
    protected commentsService: CommentsServiceService,
    protected prisma: PrismaService,
  ) {}

  @Get(':forumSlug/:postSlug')
  async getComments(
    @Param('forumSlug') forumSlug: string,
    @Param('postSlug') postSlug: string,
    @Query('take') take: string,
  ) {
    const comments = await this.commentsService.getComments(
      forumSlug,
      postSlug,
      Number.isNaN(parseInt(take)) ? '5' : take,
    );
    if (comments.length > 5)
      return {
        comments,
        next: Number.isNaN(parseInt(take)) ? 10 : parseInt(take) + 5,
      };
    return { comments };
  }
  @Post(':forumSlug/:postSlug')
  async createComment(
    @Param('forumSlug') forumSlug: string,
    @Param('postSlug') postSlug: string,
    @Token({ validate: true }) { id },
    @Body() body: z.infer<typeof CreateCommentValidator>,
  ) {
    const data = CreateCommentValidator.safeParse(body);
    if (!data.success) {
      throw new HttpException(
        (data as any).error.issues[0].message,
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.prisma.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) throw new HttpException('User not found', 404);
    // check if post exist
    const post = await this.prisma.prisma.posts.findFirst({
      where: {
        slug: postSlug,
      },
      select: {
        id: true,
      },
    });
    if (!post) throw new HttpException('Post not found', 404);
    return await this.commentsService.createComment(post.id, id, body.content);
  }
  @Get('blog/:username/:slug')
  async getBlogComments(
    @Param('username') username: string,
    @Param('slug') slug: string,
    @Query('take') take: string,
  ) {
    // check if blog exist
    const blog = await this.prisma.prisma.blog.findFirst({
      where: {
        slug: {
          equals: slugify(slug),
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
        id: true,
      },
    });

    const comments = await this.commentsService.getBlogComments(
      blog.id,
      Number.isNaN(parseInt(take)) ? '5' : take,
    );
    if (comments.length > 5)
      return {
        comments,
        next: Number.isNaN(parseInt(take)) ? 10 : parseInt(take) + 5,
      };
    return { comments };
  }
  @Post('blog/:username/:slug')
  async createBlogComment(
    @Param('username') username: string,
    @Param('slug') slug: string,
    @Token({ validate: true }) { id },
    @Body() body: z.infer<typeof CreateCommentValidator>,
  ) {
    const data = CreateCommentValidator.safeParse(body);
    if (!data.success) {
      throw new HttpException(
        (data as any).error.issues[0].message,
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.prisma.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) throw new HttpException('User not found', 404);
    // check if blog exist
    const blog = await this.prisma.prisma.blog.findFirst({
      where: {
        slug: {
          equals: slugify(slug),
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
      },
    });
    if (!blog) throw new HttpException('Blog not found', 404);
    return await this.commentsService.createBlogComment(
      blog.id,
      id,
      body.content,
    );
  }
}
