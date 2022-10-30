import {
  Body,
  Controller,
  HttpException,
  Post,
  Request,
  Response,
} from '@nestjs/common';
import { Response as R, Request as RQ } from 'express';
import { getUrlMetadata } from 'src/helpers/metadata';

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
  async returnMetaData(
    @Body() body: { url: string },
    @Response() res: R,
    @Request() req: RQ,
  ) {
    const responseData = {
      request_error: '',
      url_errors: {},
      urls: {},
    };

    const fail = (reason, status) => {
      responseData.request_error = reason;
      throw new HttpException(responseData, status);
    };

    // #45: Server fails if you try passing charset in Content-Type
    if (!/^application\/json/.test(req.headers['content-type'])) {
      fail(errorMessages.headerRequired, 415);
      return;
    }

    if (
      !req.body.urls ||
      !Array.isArray(req.body.urls) ||
      req.body.urls.length <= 0
    ) {
      fail(errorMessages.urlsRequired, 400);
      return;
    }

    const promises = req.body.urls.map((url) => getUrlMetadata(url));

    Promise.all(promises)
      .then((results) => {
        results.forEach((result) => {
          const { url, data, error } = result;
          if (error) {
            responseData.url_errors[url] = error.toString();
          } else {
            responseData.urls[url] = data;
          }
        });
        res.json(responseData);
      })
      .catch((err) => {
        fail(err.message, 500);
      });
  }
}
