import { HttpStatus, Injectable } from '@nestjs/common';
import { slugify } from 'src/helpers/slugify';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EditableService {
  constructor(protected prisma: PrismaService) {}
  async isForumEditable(
    id: string,
    forumSlug: string,
  ): Promise<{ editable: boolean; message: string; status: number }> {
    const forum = await this.prisma.prisma.forums.findFirst({
      where: {
        urlSlug: {
          equals: forumSlug,
          mode: 'insensitive',
        },
      },
    });
    if (!forum)
      return {
        editable: false,
        message: 'No Forum Found With Given Slug.',
        status: HttpStatus.NOT_FOUND,
      };
    const forumMember = await this.prisma.prisma.forumMember.findFirst({
      where: {
        forum: {
          id: forum.id,
        },
        user: {
          id,
        },
      },
    });
    if (!forumMember)
      return {
        editable: false,
        message: "You've not joined this Forum",
        status: HttpStatus.UNAUTHORIZED,
      };
    const isEditable =
      forumMember.role === 'ADMIN' || forumMember.role === 'MODERATOR';
    return {
      editable: isEditable,
      message:
        isEditable === false ? "You're not allowed to edit this forum." : '',
      status: isEditable ? 200 : HttpStatus.FORBIDDEN,
    };
  }
  async isBlogEditable(
    id: string,
    slug: string,
  ): Promise<{ editable: boolean; message: string; status: number }> {
    const blog = await this.prisma.prisma.blog.findFirst({
      where: {
        slug: {
          equals: slugify(slug),
          mode: 'insensitive',
        },
      },
      include: { author: true },
    });
    if (!blog)
      return {
        editable: false,
        message: 'No Blog Found With Given Slug.',
        status: HttpStatus.NOT_FOUND,
      };
    const author = await this.prisma.prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (!author)
      return {
        editable: false,
        message: 'No Author Found With Given ID.',
        status: HttpStatus.UNAUTHORIZED,
      };
    const isEditable = author.id === blog.author.id;
    return {
      editable: isEditable,
      message:
        isEditable === false ? "You're not allowed to edit this Blog." : '',
      status: isEditable ? 200 : HttpStatus.FORBIDDEN,
    };
  }
}
