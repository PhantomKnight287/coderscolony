import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ValidationError } from 'joi';
import { verify } from 'jsonwebtoken';
import { Token } from 'src/decorators/token/token.decorator';
import { slugify } from 'src/helpers/slugify';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { DecodedJWT } from 'src/types/jwt';
import { CreatePostValidator } from 'src/validators/forums-post.controller';

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
    @Token({ optional: true }) token: string,
    @Param('slug') forumSlug: string,
    @Param('post') postSlug: string,
  ) {
    let jwt: DecodedJWT = undefined;
    forumSlug = slugify(forumSlug);
    postSlug = slugify(postSlug);
    if (token) {
      try {
        jwt = (await verify(
          token,
          process.env.JWT_SECRET,
        )) as unknown as DecodedJWT;
      } catch (err) {
        throw new HttpException(
          'Invalid or Expired Authentication Token',
          HttpStatus.FORBIDDEN,
        );
      }
    }
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
      },
    });
    const res: Record<string, any> = { post: postInfo };
    if (jwt !== undefined) {
      const { id } = jwt;
      const user = await this.prisma.prisma.forumMember.findFirst({
        where: {
          user: { id },
        },
        select: {
          role: true,
          id: true,
          user: {
            select: {
              id: true,
            },
          },
        },
      });
      console.log(user);
      res['userInfo'] = {
        isAuthor: user?.user.id === postInfo.author.id,
        isAdmin: user?.role === 'ADMIN',
        isModerator: user?.role === 'MODERATOR',
      };
    }
    return res;
  }
}
