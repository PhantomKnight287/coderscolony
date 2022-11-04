import { Injectable } from '@nestjs/common';
import { getClient } from 'db';
@Injectable()
export class PrismaService {
  prisma: ReturnType<typeof getClient> = getClient({
    dev: process.env.NODE_ENV === 'development',
  });
  constructor() {
    this.prisma
      .$connect()
      .then(() => console.log('Connected To Database'))
      .catch((err) => console.log('Unable to Connect To database', err));
  }
}
