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
import { ValidationError } from 'joi';
import { Token } from 'src/decorators/token/token.decorator';
import { slugify } from 'src/helpers/slugify';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { DecodedJWT } from 'src/types/jwt';
import { CreatePostValidator } from 'src/validators/forums-post.validator';

type CreateNewPostBody = {
  content: string;
  slug: string;
};

@Controller('forums/posts')
export class ForumsPostController {
  constructor(protected prisma: PrismaService) {}

  @Post(':slug/create')
  async createNewPost(
    @Param('slug') forumSlug: string,
    @Body() body: CreateNewPostBody,
    @Token({ validate: true }) { id }: DecodedJWT,
  ) {
    try {
      await CreatePostValidator.validateAsync(body);
    } catch (error) {
      throw new HttpException(
        (error as ValidationError).details[0].message,
        HttpStatus.BAD_REQUEST,
      );
    }
    const { content, slug } = body;
    const forum = await this.prisma.prisma.forums.findFirst({
      where: {
        urlSlug: slugify(forumSlug),
      },
    });
    if (!forum)
      throw new HttpException(
        'No Forum Found With Provided Slug',
        HttpStatus.NOT_FOUND,
      );
    const postWithSameSlug = await this.prisma.prisma.posts.findFirst({
      where: {
        slug: slugify(slug),
        Forums: {
          id: forum.id,
        },
      },
    });
    if (postWithSameSlug)
      throw new HttpException(
        'This Slug is already taken ',
        HttpStatus.CONFLICT,
      );
    const newPost = await this.prisma.prisma.posts.create({
      data: {
        content,
        slug: slugify(slug),
        author: {
          connect: {
            id,
          },
        },
        Forums: {
          connect: {
            id: forum.id,
          },
        },
      },
      select: {
        slug: true,
      },
    });
    return newPost;
  }
  @Get(':slug/:post')
  async fetchSinglePost(
    @Param('slug') forumSlug: string,
    @Param('post') postSlug: string,
  ) {
    forumSlug = slugify(forumSlug);
    postSlug = slugify(postSlug);

    const postInfo = await this.prisma.prisma.posts.findFirst({
      where: {
        Forums: {
          urlSlug: forumSlug,
        },
        slug: postSlug,
      },
      select: {
        author: {
          select: {
            username: true,
            id: true,
            name: true,
            profileImage: true,
          },
        },
        content: true,
        createdAt: true,
        id: true,
        slug: true,
        Forums: {
          select: {
            name: true,
          },
        },
        likedBy: true,
      },
    });
    const likedBy = postInfo.likedBy.length;

    delete postInfo.likedBy;
    const res: Record<string, any> = { post: postInfo };
    res['post']['likedBy'] = likedBy;

    return res;
  }
  @Delete(':slug/:post')
  async deletePost(
    @Param('slug') forumSlug: string,
    @Param('post') postSlug: string,
    @Token({ validate: true }) { id }: DecodedJWT,
  ) {
    forumSlug = slugify(forumSlug);
    postSlug = slugify(postSlug);
    const member = await this.prisma.prisma.forumMember.findFirst({
      where: {
        user: {
          id,
        },
      },
    });
    if (!member)
      throw new HttpException(
        'You are not a member of this forum',
        HttpStatus.UNAUTHORIZED,
      );
    const post = await this.prisma.prisma.posts.findFirst({
      where: {
        slug: postSlug,
        Forums: {
          urlSlug: forumSlug,
        },
      },
    });
    if (!post)
      throw new HttpException(
        'No Post Found With Provided Slug',
        HttpStatus.NOT_FOUND,
      );
    if (
      post.userId !== id &&
      member.role !== 'ADMIN' &&
      member.role !== 'MODERATOR'
    )
      throw new HttpException(
        'You are not allowed to delete this post',
        HttpStatus.UNAUTHORIZED,
      );
    await this.prisma.prisma.posts.delete({
      where: {
        id: post.id,
      },
    });
    return {
      message: 'Post Deleted Successfully',
    };
  }
}
