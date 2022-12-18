import { Injectable } from '@nestjs/common';
import { slugify } from 'src/helpers/slugify';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsServiceService {
  constructor(protected prisma: PrismaService) {}
  async getComments(forumSlug: string, postSlug: string, count: string) {
    return await this.prisma.prisma.comments.findMany({
      where: {
        post: {
          slug: {
            equals: slugify(postSlug),
            mode: 'insensitive',
          },
          Forums: {
            urlSlug: {
              equals: slugify(forumSlug),
              mode: 'insensitive',
            },
          },
        },
      },
      take: parseInt(count || '5'),
      skip: parseInt(count) > 5 ? parseInt(count) - 5 : undefined,
      select: {
        author: {
          select: {
            username: true,
            name: true,
            profileImage: true,
          },
        },
        createdAt: true,
        content: true,
        id: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async createComment(postId: string, userId: string, content: string) {
    return await this.prisma.prisma.comments.create({
      data: {
        content,
        author: {
          connect: { id: userId },
        },
        post: {
          connect: {
            id: postId,
          },
        },
      },
      select: {
        author: {
          select: {
            username: true,
            name: true,
            profileImage: true,
          },
        },
        content: true,
        createdAt: true,
        id: true,
      },
    });
  }
  async getBlogComments(blogId: string, count: string) {
    return await this.prisma.prisma.comments.findMany({
      where: {
        Blog: {
          id: blogId,
        },
      },
      take: parseInt(count || '5'),
      skip: parseInt(count) > 5 ? parseInt(count) - 5 : undefined,
      select: {
        author: {
          select: {
            username: true,
            profileImage: true,
            name: true,
          },
        },
        createdAt: true,
        content: true,
        id: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async createBlogComment(blogId: string, userId: string, content: string) {
    return await this.prisma.prisma.comments.create({
      data: {
        content,
        author: {
          connect: { id: userId },
        },
        Blog: {
          connect: { id: blogId },
        },
      },
    });
  }
}
