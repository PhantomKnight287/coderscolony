import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

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
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: resultsToFetch,
      skip: resultsToFetch > 5 ? resultsToFetch - 5 : undefined,
    });
    if (!blogs) throw new HttpException('No User Found', HttpStatus.NOT_FOUND);
    const res = { blogs };
    if (blogs.length > 5) {
      res['next'] = resultsToFetch + 5;
    }
    return blogs;
  }
}
