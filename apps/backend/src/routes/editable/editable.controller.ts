import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { Token } from 'src/decorators/token/token.decorator';
import { slugify } from 'src/helpers/slugify';
import { EditableService } from 'src/services/editable/editable.service';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { DecodedJWT } from 'src/types/jwt';
@Controller('editable')
export class EditableController {
  constructor(
    protected prisma: PrismaService,
    protected editable: EditableService,
  ) {}

  @Get('forum/:slug')
  async isForumEditable(
    @Token({ validate: true }) { id }: DecodedJWT,
    @Param('slug') slug: string,
  ) {
    slug = slugify(slug);
    const forum = await this.prisma.prisma.forums.findFirst({
      where: {
        urlSlug: {
          mode: 'insensitive',
          equals: slug,
        },
      },
    });

    if (!forum)
      throw new HttpException(
        'No forum found with given slug',
        HttpStatus.NOT_FOUND,
      );
    const forumMember = await this.prisma.prisma.forumMember.findFirst({
      where: {
        forum: {
          id: forum.id,
        },
        user: {
          id,
        },
      },
      select: {
        role: true,
      },
    });
    if (!forumMember)
      return {
        editable: false,
        joined: false,
      };
    return {
      editable:
        forumMember.role === 'ADMIN' || forumMember.role === 'MODERATOR',
      joined: true,
    };
  }
  @Get('blog/:slug')
  async isBlogEditable(
    @Token({ validate: true }) { id }: DecodedJWT,
    @Param('slug') slug: string,
  ) {
    const { editable, message, status } = await this.editable.isBlogEditable(
      id,
      slug,
    );
    if (editable === false) throw new HttpException(message, status);
    return { editable };
  }
}
