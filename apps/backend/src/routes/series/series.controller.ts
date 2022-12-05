import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { Token } from 'src/decorators/token/token.decorator';
import { slugify } from 'src/helpers/slugify';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { VerifyUserService } from 'src/services/verify-user/verify-user.service';
import { DecodedJWT } from 'src/types/jwt';
import {
  AddNewBlogInSeries,
  CreateNewSeries,
} from 'src/validators/series.validator';
import { z } from 'zod';

@Controller('series')
export class SeriesController {
  constructor(
    protected prisma: PrismaService,
    protected verify: VerifyUserService,
  ) {}
  @Post('create')
  async createSeries(
    @Token({ validate: true }) { id }: DecodedJWT,
    @Body() body: z.infer<typeof CreateNewSeries>,
  ) {
    const data = CreateNewSeries.safeParse(body);
    if (!data.success) {
      throw new HttpException(
        (data as any).error.issues[0].message,
        HttpStatus.BAD_REQUEST,
      );
    }
    const userExist = await this.verify.verifyUser(id);
    if (userExist === false)
      throw new HttpException("User doesn't Exist", HttpStatus.NOT_FOUND);

    const series = await this.prisma.prisma.series.create({
      data: {
        author: { connect: { id } },
        slug: `${slugify(body.name)}-${nanoid(10)}`,
      },
      select: {
        slug: true,
      },
    });
    return series;
  }
  @Post(':slug/add')
  async addNewBlogInSeries(
    @Param('slug') slug: string,
    @Token({ validate: true }) { id }: DecodedJWT,
    @Body() body: z.infer<typeof AddNewBlogInSeries>,
  ) {
    const data = AddNewBlogInSeries.safeParse(body);
    if (!data.success) {
      throw new HttpException(
        (data as any).error.issues[0].message,
        HttpStatus.BAD_REQUEST,
      );
    }
    const userExist = await this.verify.verifyUser(id);
    if (userExist === false)
      throw new HttpException("User doesn't Exist", HttpStatus.NOT_FOUND);

    const series = await this.prisma.prisma.series.findFirst({
      where: {
        slug: {
          equals: slugify(slug),
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
      },
    });
    if (!series)
      throw new HttpException('Series not found', HttpStatus.NOT_FOUND);

    // connect series to blog using slug in body
    const blog = await this.prisma.prisma.blog.findFirst({
      where: {
        slug: {
          equals: slugify(body.slug),
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
      },
    });
    if (!blog) throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);

    const seriesBlog = await this.prisma.prisma.series.update({
      where: {
        id: series.id,
      },
      data: {
        blogs: {
          connect: {
            id: blog.id,
          },
        },
      },
      select: {
        slug: true,
        blogs: {
          select: {
            slug: true,
          },
        },
      },
    });
    return seriesBlog;
  }
}
