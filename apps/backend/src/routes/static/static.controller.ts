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
}
