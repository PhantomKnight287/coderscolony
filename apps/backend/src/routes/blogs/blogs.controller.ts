import {
  Body,
  Controller,
  Delete,
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
import { readingTime } from 'src/modules/reading-time';
import { URLSearchParams } from 'node:url';

interface CreateBlog {
  title: string;
  content: string;
  tags: string[];
  ogImage: string;
  description: string;
  seriesId?: string | null;
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
    if (!blogs.length)
      throw new HttpException('No Blogs Found', HttpStatus.NOT_FOUND);
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
    try {
      await CreateBlogValidator.validateAsync(body);
    } catch (e) {
      throw new HttpException(
        (e as ValidationError).details[0].message,
        HttpStatus.BAD_REQUEST,
      );
    }
    const { content, ogImage, tags, title, description, seriesId } = body;
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
    const params = new URLSearchParams({
      title,
      username: user.username,
      name: user.name,
      profileImage: user.profileImage,
    });
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
        ogImage: ogImage || `/api/gen/image?${params.toString()}`,
        tags: {
          connect: tags.map((tag) => ({ id: tag })),
        },
        description,
        Series: seriesId
          ? {
              connect: {
                id: seriesId,
              },
            }
          : undefined,
      },
      select: {
        slug: true,
      },
    });
    return blog;
  }
  @Get('')
  async getBlogs(@Query('take') take: string) {
    const resultsToFetch = Number.isNaN(parseInt(take)) ? 5 : parseInt(take);
    const blogs = await this.prisma.prisma.blog.findMany({
      where: {},
      select: {
        author: {
          select: {
            username: true,
            name: true,
            profileImage: true,
          },
        },
        createdAt: true,
        description: true,
        id: true,
        ogImage: true,
        slug: true,
        title: true,
        tags: true,
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      take: resultsToFetch,
      skip: resultsToFetch > 5 ? resultsToFetch - 5 : undefined,
    });
    const res = { blogs };
    if (blogs.length === 5) res['next'] = resultsToFetch + 5;

    return res;
  }
  @Get('generate/static')
  async getBlogList() {
    const blogs = await this.prisma.prisma.blog.findMany({
      select: {
        slug: true,
        author: {
          select: {
            username: true,
          },
        },
      },
    });
    return blogs;
  }
  @Get(':username/blog/:slug')
  async getBlogInfo(
    @Param('username') username: string,
    @Param('slug') slug: string,
  ) {
    slug = slugify(slug);

    const blog = await this.prisma.prisma.blog.findFirst({
      where: {
        author: {
          username: {
            equals: username,
            mode: 'insensitive',
          },
        },
        slug: {
          equals: slug,
          mode: 'insensitive',
        },
      },
      select: {
        content: true,
        author: {
          select: {
            username: true,
            name: true,
            profileImage: true,
          },
        },
        createdAt: true,
        description: true,
        ogImage: true,
        tags: true,
        title: true,
        Series: {
          select: {
            slug: true,
            createdAt: true,
            blogs: {
              select: {
                slug: true,
                title: true,
                createdAt: true,
                description: true,
                id: true,
                author: {
                  select: {
                    username: true,
                  },
                },
              },
            },
            id: true,
            title: true,
          },
        },
      },
    });
    if (!blog) throw new HttpException('No Blog Found', HttpStatus.NOT_FOUND);
    return { ...blog, readTime: readingTime(blog.content).text };
  }
  @Delete(':username/blog/:slug')
  async deleteBlog(
    @Token({ validate: true }) { id }: DecodedJWT,
    @Param('username') username: string,
    @Param('slug') slug: string,
  ) {
    slug = slugify(slug);
    const blog = await this.prisma.prisma.blog.findFirst({
      where: {
        author: {
          id,
        },
        slug: {
          equals: slug,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        Series: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!blog) throw new HttpException('No Blog Found', HttpStatus.NOT_FOUND);
    await this.prisma.prisma.blog.delete({
      where: {
        id: blog.id,
      },
    });
    if (blog.Series) {
      const series = await this.prisma.prisma.series.findFirst({
        where: {
          id: blog.Series.id,
        },
        select: {
          blogs: {
            select: {
              id: true,
            },
          },
          id: true,
        },
      });
      if (series.blogs.length === 0) {
        await this.prisma.prisma.series.delete({
          where: {
            id: series.id,
          },
        });
      }
    }

    return { message: 'Blog Deleted' };
  }
}
