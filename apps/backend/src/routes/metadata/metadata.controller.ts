import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
  Response,
} from '@nestjs/common';
import { Response as R, Request as RQ } from 'express';
import { getUrlMetadata } from 'src/helpers/metadata';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const getMetaData = require('metadata-scraper');

const errorMessages = {
  badPath:
    'This is not a valid path for this service.  Please refer to the documentation: https://github.com/mozilla/page-metadata-service#url-metadata',
  headerRequired: 'The content-type header must be set to application/json.',
  urlsRequired:
    'The post body must be a JSON payload in the following format: {urls: ["http://example.com"]}.',
  maxUrls: 'A maximum of 20 urls can be sent for processing in one call.',
};
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
