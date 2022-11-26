import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Token } from 'src/decorators/token/token.decorator';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { VerifyUserService } from 'src/services/verify-user/verify-user.service';
import { DecodedJWT } from 'src/types/jwt';

@Controller('profile/:username/update')
export class UpdateProfileController {
  constructor(
    protected prisma: PrismaService,
    protected user: VerifyUserService,
  ) {}
  @Post('banner-image')
  async updateBannerImage(
    @Token({ validate: true }) { id }: DecodedJWT,
    @Body()
    {
      url,
    }: {
      url: string;
    },
  ) {
    if (!url)
      throw new HttpException('Url is Required', HttpStatus.BAD_REQUEST);
    const user = await this.user.verifyUser(id);
    if (!user) throw new HttpException('No User Found', HttpStatus.NOT_FOUND);
    await this.prisma.prisma.user.update({
      where: {
        id,
      },
      data: {
        bannerImage: url,
      },
    });
    return {
      message: 'Banner Image Updated',
    };
  }
  @Post('banner-color')
  async updateBannerColor(
    @Token({ validate: true }) { id }: DecodedJWT,
    @Body()
    {
      color,
    }: {
      color: string;
    },
  ) {
    if (!color)
      throw new HttpException('Color is Required', HttpStatus.BAD_REQUEST);
    const user = await this.user.verifyUser(id);
    if (!user) throw new HttpException('No User Found', HttpStatus.NOT_FOUND);
    await this.prisma.prisma.user.update({
      where: {
        id,
      },
      data: {
        bannerColor: color,
      },
    });
    return {
      message: 'Banner Color Updated',
    };
  }
  @Post('profile-image')
  async updateProfileImage(
    @Token({ validate: true }) { id }: DecodedJWT,
    @Body()
    {
      url,
    }: {
      url: string;
    },
  ) {
    if (!url)
      throw new HttpException('Url is Required', HttpStatus.BAD_REQUEST);
    const user = await this.user.verifyUser(id);
    if (!user) throw new HttpException('No User Found', HttpStatus.NOT_FOUND);
    await this.prisma.prisma.user.update({
      where: {
        id,
      },
      data: {
        profileImage: url,
      },
    });
    return {
      message: 'Profile Image Updated',
    };
  }
  @Post('one-liner')
  async updateOneLiner(
    @Token({ validate: true }) { id }: DecodedJWT,
    @Body()
    {
      oneLiner,
    }: {
      oneLiner: string;
    },
  ) {
    if (!oneLiner)
      throw new HttpException('Url is Required', HttpStatus.BAD_REQUEST);
    const user = await this.user.verifyUser(id);
    if (!user) throw new HttpException('No User Found', HttpStatus.NOT_FOUND);
    await this.prisma.prisma.user.update({
      where: {
        id,
      },
      data: {
        oneLiner,
      },
    });
    return {
      message: 'OneLiner Updated',
    };
  }
  @Post('name')
  async updateName(
    @Token({ validate: true }) { id }: DecodedJWT,
    @Body()
    {
      name,
    }: {
      name: string;
    },
  ) {
    if (!name)
      throw new HttpException('Name is Required', HttpStatus.BAD_REQUEST);
    const user = await this.user.verifyUser(id);
    if (!user) throw new HttpException('No User Found', HttpStatus.NOT_FOUND);
    await this.prisma.prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
    return {
      message: 'Name Updated',
    };
  }
  @Post('banner-image/remove')
  async removeBannerImage(@Token({ validate: true }) { id }: DecodedJWT) {
    const user = await this.user.verifyUser(id);
    if (!user) throw new HttpException('No User Found', HttpStatus.NOT_FOUND);
    await this.prisma.prisma.user.update({
      where: {
        id,
      },
      data: {
        bannerImage: null,
      },
    });
    return {
      message: 'Profile Image Updated',
    };
  }
}
