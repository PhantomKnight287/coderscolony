import { Injectable } from '@nestjs/common';
import { getClient } from 'db';
@Injectable()
export class PrismaService {
  prisma: ReturnType<typeof getClient> = getClient({
    dev: process.env.NODE_ENV === 'development',
  });
}
