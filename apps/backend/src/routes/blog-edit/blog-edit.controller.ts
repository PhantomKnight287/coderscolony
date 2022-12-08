import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { Token } from 'src/decorators/token/token.decorator';
import { slugify } from 'src/helpers/slugify';
import { EditableService } from 'src/services/editable/editable.service';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { EditBlogValidator } from 'src/validators/blog.validator';
import { z } from 'zod';

@Controller('blog-edit')
export class BlogEditController {
  constructor(
    protected prisma: PrismaService,
    protected editable: EditableService,
  ) {}
  @Get(':slug')
  async getBlogDetails(
    @Param('slug') slug: string,
    @Token({ validate: true }) { id },
  ) {
    const blog = await this.prisma.prisma.blog.findFirst({
      where: {
        slug: {
          equals: slugify(slug),
          mode: 'insensitive',
        },
      },
      select: {
        content: true,
        description: true,
        ogImage: true,
        title: true,
      },
    });
    if (!blog)
      throw new HttpException(
        "This Blog Doesn't exist or You don't have permission to edit it.",
        HttpStatus.NOT_FOUND,
      );
    const isBlogEditable = await this.editable.isBlogEditable(id, slug);
    if (!isBlogEditable)
      throw new HttpException(
        "This Blog Doesn't exist or You don't have permission to edit it.",
        HttpStatus.NOT_FOUND,
      );
    return blog;
  }
  @Post(':slug/edit')
  async editBlog(
    @Param('slug') slug: string,
    @Token({ validate: true }) { id },
    @Body() body: z.infer<typeof EditBlogValidator>,
  ) {
    const isBlogEditable = await this.editable.isBlogEditable(id, slug);
    if (!isBlogEditable)
      throw new HttpException(
        "This Blog Doesn't exist or You don't have permission to edit it.",
        HttpStatus.NOT_FOUND,
      );
    // find blog, return error if not found
    const blog = await this.prisma.prisma.blog.findFirst({
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
    if (!blog)
      throw new HttpException(
        "This Blog Doesn't exist or You don't have permission to edit it.",
        HttpStatus.NOT_FOUND,
      );
    const { content, description, ogImage, title } = body;
    const updatedBlog = await this.prisma.prisma.blog.update({
      where: {
        id: blog.id,
      },
      data: {
        title,
        content,
        description,
        ogImage,
      },
    });
    return updatedBlog;
  }
}
