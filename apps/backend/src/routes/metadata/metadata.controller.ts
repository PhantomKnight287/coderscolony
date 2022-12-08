import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const getMetaData = require('metadata-scraper');

@Controller('metadata')
export class MetadataController {
  @Post('/')
  async returnMetaData(@Body() body: { urls: string[] }) {
    if (!body.urls && !Array.isArray(body.urls))
      throw new HttpException('`urls` but be an array', HttpStatus.BAD_REQUEST);
    const data = {};
    for (const url of body.urls) {
      const meta = await getMetaData(url).catch(() => null);
      data[url] = meta;
    }
    return data;
  }
}
