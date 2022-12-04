import { HttpStatus, Injectable } from '@nestjs/common';
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
}
