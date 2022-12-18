import { Controller, Post } from '@nestjs/common';
import { PrismaClient } from 'db';
import { PrismaService } from 'src/services/prisma/prisma.service';
// I created this by mistake
@Controller('blog-stats')
export class BlogStatsController {
  prisma: PrismaClient<
    { errorFormat: 'pretty'; log: ('error' | 'query' | 'info' | 'warn')[] },
    never,
    false
  >;
  constructor(protected p: PrismaService) {
    this.prisma = p.prisma;
  }
}
