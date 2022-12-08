import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Controller('static')
export class StaticController {
  constructor(protected prisma: PrismaService) {}
  @Get('profiles')
  async generateStaticProfiles() {
    const users = await this.prisma.prisma.user.findMany({
      select: {
        username: true,
      },
    });
    return users;
  }
  @Get('forums')
  async generateStaticForums() {
    const forums = await this.prisma.prisma.forums.findMany({
      select: {
        urlSlug: true,
      },
    });
    return forums;
  }
  @Get('posts')
  async generateStaticPosts() {
    return await this.prisma.prisma.posts.findMany({
      select: {
        Forums: {
          select: { urlSlug: true },
        },
        slug: true,
      },
    });
  }
}
