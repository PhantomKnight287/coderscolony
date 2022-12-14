import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VerifyUserService {
  constructor(protected prisma: PrismaService) {}
  async verifyUser(id: string) {
    const user = await this.prisma.prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (!user) return false;
    return true;
  }
  async verifyUserByUsername(username: string) {
    const user = await this.prisma.prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
    });
    if (!user) return false;
    return true;
  }
}
