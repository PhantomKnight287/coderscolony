import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TokenExpiredError, verify } from 'jsonwebtoken';
import { Token } from 'src/decorators/token/token.decorator';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Controller('notifications')
export class NotificationsController {
  constructor(protected prisma: PrismaService) {}

  @Get('/get')
  async fetchNotifications(
    @Token() token: string,
    @Query('take') take: string,
  ) {
    let jwt: { id: string };
    try {
      jwt = verify(token, process.env.JWT_SECRET) as unknown as {
        id: string;
      };
    } catch (err) {
      if (err instanceof TokenExpiredError) {
      }
      throw new HttpException(
        'Invalid or Expired Authentication Token',
        HttpStatus.FORBIDDEN,
      );
    }
    const notifications = await this.prisma.prisma.notifications.findMany({
      where: {
        User: {
          id: jwt.id,
        },
        read: false,
      },
      select: {
        content: true,
        createdAt: true,
        id: true,
        title: true,
        urlToVisit: true,
        variant: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: parseInt(take || '5'),
      skip: parseInt(take) > 5 ? parseInt(take) - 5 : undefined,
    });
    if (!notifications) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    const res: Record<string, any> = { notifications };
    if (notifications.length === 5) res['next'] = parseInt(take) + 5;
    return res;
  }
}
