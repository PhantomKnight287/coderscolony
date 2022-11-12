import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Response,
} from '@nestjs/common';
import { Response as Response_ } from 'express';
import { ValidationError } from 'joi';
import { TokenExpiredError, verify } from 'jsonwebtoken';
import { Token } from 'src/decorators/token/token.decorator';
import { slugify } from 'src/helpers/slugify';
import { ForumsService } from 'src/services/forums/forums.service';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { DecodedJWT } from 'src/types/jwt';
import { CreateForumValidator } from 'src/validators/forums.validator';

@Controller('forums')
export class ForumsController {
  constructor(
    protected prisma: PrismaService,
    protected forums: ForumsService,
  ) {}
  @Get('list')
  async getForums(@Query('take') take: string) {
    const forums = await this.prisma.prisma.forums.findMany({
      where: {},
      select: {
        bannerImage: true,
        id: true,
        name: true,
        profileImage: true,
        forumMembers: {
          where: {},
        },
        createdAt: true,
        urlSlug: true,
        description: true,
      },
      orderBy: [
        {
          createdAt: 'asc',
        },
        {
          forumMembers: { _count: 'desc' },
        },
      ],
      take: parseInt(take || '5'),
      skip: parseInt(take) > 5 ? parseInt(take) - 5 : undefined,
    });
    if (!forums)
      throw new HttpException('No Posts Found', HttpStatus.NOT_FOUND);
    const res: Record<string, any> = {
      forums: forums?.map((f) => ({
        ...f,
        forumMembers: f.forumMembers.length,
      })),
    };
    if (forums.length === 5) res['next'] = parseInt(take) + 5;
    return res;
  }

  @Post('/create')
  async createForum(
    @Token() token: string,
    @Body()
    body: {
      name: string;
      slug: string;
      description: string;
      profileURL: string;
    },
    @Response() res: Response_,
  ) {
    try {
      await CreateForumValidator.validateAsync(body);
    } catch (e) {
      const error = e as ValidationError;
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    const { name, slug, description, profileURL } = body;
    let jwt: DecodedJWT;
    try {
      jwt = verify(token, process.env.JWT_SECRET) as unknown as DecodedJWT;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        res.set({ 'X-Error': 'expired' });
      }
      return res.status(403).json({
        message: 'Invalid or Expired Authentication Token',
      });
    }
    const oldForum = await this.prisma.prisma.forums.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });
    const oldForumWithSameSlug = await this.prisma.prisma.forums.findFirst({
      where: {
        urlSlug: {
          equals: slugify(slug),
          mode: 'insensitive',
        },
      },
    });
    if (oldForum)
      return res.status(409).json({
        message: 'A Forum With This Name Already Exists.',
      });
    if (oldForumWithSameSlug)
      return res.status(409).json({
        message: 'A Forum With This Url Slug Already Exists.',
      });
    const newForum = await this.prisma.prisma.forums.create({
      data: {
        name,
        urlSlug: slugify(slug),
        description,
        profileImage: profileURL,
      },
    });

    const admin = await this.prisma.prisma.forumMember.create({
      data: {
        role: 'ADMIN',
        user: {
          connect: {
            id: jwt.id,
          },
        },
        forum: {
          connect: {
            id: newForum.id,
          },
        },
      },
      select: {
        id: true,
        user: {
          select: {
            name: true,
            profileImage: true,
            verified: true,
          },
        },
      },
    });
    return res.status(200).json({ forum: newForum, admin });
  }
  @Post(':slug/join')
  async JoinForum(@Token() token: string, @Param('slug') slug: string) {
    let jwt: DecodedJWT;
    try {
      jwt = verify(token, process.env.JWT_SECRET) as unknown as DecodedJWT;
    } catch (err) {
      throw new HttpException(
        'Invalid or Expired Authentication Token',
        HttpStatus.FORBIDDEN,
      );
    }
    const forum = await this.prisma.prisma.forums.findFirst({
      where: {
        urlSlug: slugify(slug),
      },
    });
    if (!forum)
      throw new HttpException(
        'No Forum Found with Provided Id',
        HttpStatus.NOT_FOUND,
      );
    const user = await this.prisma.prisma.user.findFirst({
      where: {
        id: jwt.id,
      },
    });
    if (!user)
      throw new HttpException(
        'No User Found With Provided Auth Token',
        HttpStatus.FORBIDDEN,
      );
    const oldForum = await this.prisma.prisma.forumMember.findFirst({
      where: {
        forum: {
          id: forum.id,
        },
        user: {
          id: user.id,
        },
      },
    });
    if (oldForum)
      throw new HttpException(
        "You've Already Joined this Forum",
        HttpStatus.CONFLICT,
      );
    await this.prisma.prisma.forumMember.create({
      data: {
        forum: {
          connect: {
            id: forum.id,
          },
        },
        role: 'USER',
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    return {
      message: "You've Successfully Joined This Forum",
    };
  }
  @Get(':slug')
  async getForumInfo(@Param('slug') slug: string) {
    return this.forums.getForumInfo(slug);
  }
  @Get(':slug/authenticated')
  async getDeepInfo(@Param('slug') slug: string, @Token() token: string) {
    let jwt: DecodedJWT;
    try {
      jwt = verify(token, process.env.JWT_SECRET) as unknown as DecodedJWT;
    } catch (err) {
      throw new HttpException(
        'Invalid or Expired Authentication Token',
        HttpStatus.FORBIDDEN,
      );
    }
    const user = await this.prisma.prisma.user.findFirst({
      where: {
        id: jwt.id,
      },
    });
    if (!user)
      throw new HttpException(
        'No User Account Associated With Provided Authentication Token',
        HttpStatus.FORBIDDEN,
      );
    const hasUserJoinedForum = await this.prisma.prisma.forumMember.findFirst({
      where: {
        user: {
          id: user.id,
        },
      },
    });
    const data = await this.forums.getForumInfo(slug);
    return {
      ...data,
      joined: hasUserJoinedForum ? true : false,
      userRole: hasUserJoinedForum?.role,
    };
  }
  @Get(':slug/posts')
  async getPosts(@Query('take') take: string, @Param('slug') slug: string) {
    const posts = await this.prisma.prisma.posts.findMany({
      where: {
        Forums: {
          urlSlug: slugify(slug),
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
        slug: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: parseInt(take || '5'),
      skip: parseInt(take) > 5 ? parseInt(take) - 5 : undefined,
    });
    const res: Record<string, any> = { posts };
    if (posts.length === 5) res['next'] = parseInt(take) + 5;
    return res;
  }
  @Post(':slug/leave')
  async leave(
    @Param('slug') slug: string,
    @Token({ validate: true }) { id }: DecodedJWT,
  ) {
    const user = await this.prisma.prisma.forumMember.findFirst({
      where: {
        user: {
          id,
        },
        forum: {
          urlSlug: slugify(slug),
        },
      },
    });
    if (!user)
      throw new HttpException(
        "You've not joined this forum.",
        HttpStatus.NOT_FOUND,
      );
    const isUserAdmin = user.role === 'ADMIN';
    let shouldForumBeDeleted = false;

    const otherAdmins = await this.prisma.prisma.forumMember.findMany({
      where: {
        forum: {
          urlSlug: slugify(slug),
        },
        role: 'ADMIN',
        user: {
          NOT: {
            id,
          },
        },
      },
    });
    if (otherAdmins.length === 0 && isUserAdmin) {
      shouldForumBeDeleted = true;
    }
    await this.prisma.prisma.forumMember.delete({
      where: {
        id: user.id,
      },
    });
    if (shouldForumBeDeleted === true) {
      await this.prisma.prisma.forums.delete({
        where: {
          urlSlug: slugify(slug),
        },
      });
    }
    const res: Record<string, boolean> = {};
    if (shouldForumBeDeleted) res['goBack'] = true;
    return res;
  }
}
