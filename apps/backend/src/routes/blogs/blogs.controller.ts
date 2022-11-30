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
import { ValidationError } from 'joi';
import { Token } from 'src/decorators/token/token.decorator';
import { slugify } from 'src/helpers/slugify';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { DecodedJWT } from 'src/types/jwt';
import * as nanoid from 'nanoid';
import { CreateBlogValidator } from 'src/validators/blog.validator';

interface CreateBlog {
  title: string;
  content: string;
  tags: string[];
  ogImage: string;
  description: string;
}

@Controller('blogs')
export class BlogsController {
  constructor(protected prisma: PrismaService) {}

  @Get(':username')
  async fetchBlogsByUsername(
    @Param('username') username: string,
    @Query('take') take: string,
  ) {
    let resultsToFetch = parseInt(take);
    if (Number.isNaN(parseInt(take))) {
      resultsToFetch = 5;
    }
    const blogs = await this.prisma.prisma.blog.findMany({
      where: {
        author: {
          username: {
            equals: username,
            mode: 'insensitive',
          },
        },
      },
      select: {
        author: {
          select: {
            username: true,
            name: true,
            profileImage: true,
          },
        },
        createdAt: true,
        slug: true,
        ogImage: true,
        title: true,
        id: true,
        description: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: resultsToFetch,
      skip: resultsToFetch > 5 ? resultsToFetch - 5 : undefined,
    });
    if (!blogs) throw new HttpException('No User Found', HttpStatus.NOT_FOUND);
    const res = { blogs: blogs };
    if (blogs.length > 5) {
      res['next'] = resultsToFetch + 5;
    }
    return res;
  }
  @Post('create')
  async createBlog(
    @Token({ validate: true }) { id }: DecodedJWT,
    @Body() body: CreateBlog,
  ) {
    console.log(body);
    try {
      await CreateBlogValidator.validateAsync(body);
    } catch (e) {
      throw new HttpException(
        (e as ValidationError).details[0].message,
        HttpStatus.BAD_REQUEST,
      );
    }
    const { content, ogImage, tags, title, description } = body;
    const user = await this.prisma.prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (!user)
      throw new HttpException('No User Found', HttpStatus.UNAUTHORIZED);

    const oldBlog = await this.prisma.prisma.blog.findFirst({
      where: {
        slug: {
          equals: `${slugify(title)}-${nanoid.nanoid(10)}`,
          mode: 'insensitive',
        },
        author: {
          id: user.id,
        },
      },
    });
    if (oldBlog)
      throw new HttpException('Slug is Already Taken', HttpStatus.CONFLICT);
    const blog = await this.prisma.prisma.blog.create({
      data: {
        content,
        slug: `${slugify(title)}-${nanoid.nanoid(10)}`,
        title,
        author: {
          connect: {
            id: user.id,
          },
        },
        ogImage,
        tags,
        description,
      },
      select: {
        slug: true,
      },
    });
    return blog;
  }
}
