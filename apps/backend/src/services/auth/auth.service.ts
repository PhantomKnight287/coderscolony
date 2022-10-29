import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from 'db';

@Injectable()
export class AuthService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(public service: PrismaService) {}

  async getUserByUsername(username: string): Promise<User | null> {
    const user = await this.service.prisma.user.findFirst({
      where: {
        username,
      },
    });
    return user;
  }
  async getUserByEmail(email: string) {
    return await this.service.prisma.user.findFirst({
      where: { email },
    });
  }
}
