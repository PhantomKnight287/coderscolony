import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Token } from 'src/decorators/token/token.decorator';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CreateInterestValidator } from 'src/validators/interests.validator';
import { z } from 'zod';

@Controller('interests')
@SkipThrottle(true)
export class InterestsController {
  constructor(protected prisma: PrismaService) {}

  @Get('')
  async getAllInterests() {
    const interests = await this.prisma.prisma.profileInterests.findMany({
      select: {
        color: true,
        icon: true,
        id: true,
        name: true,
      },
    });
    return interests;
  }
  @Post('')
  async createInterest(
    @Body() body: z.infer<typeof CreateInterestValidator>,
    @Token({ validate: true }) { id },
  ) {
    const data = CreateInterestValidator.safeParse(body);
    if (!data.success) {
      throw new HttpException(
        (data as any).error.issues[0].message,
        HttpStatus.BAD_REQUEST,
      );
    }
    const { color, icon, name } = body;
    const interest = await this.prisma.prisma.profileInterests.create({
      data: {
        icon,
        name,
        color,
        users: { connect: { id } },
      },
    });
    return interest;
  }
}
