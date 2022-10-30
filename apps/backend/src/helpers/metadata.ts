/* eslint-disable prettier/prettier */
import { blacklist } from './blacklist';
import * as domino from 'domino';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fastimage = require('fastimage');
import * as parser from 'page-metadata-parser';
import * as robotsParser from 'robots-parser';
import * as urlparse from 'url';
require('isomorphic-fetch');

// See https://github.com/mozilla/page-metadata-service/issues/89#issuecomment-243931889
fastimage.threshold(-1);

const userAgent =
  'Mozilla Metadata Service https://github.com/mozilla/page-metadata-service';

function blacklistAllowed(url) {
  return new Promise((resolve, reject) => {
    const domain = urlparse.parse(url).hostname;

    if (blacklist.domains.has(domain)) {
      reject('Blacklist disallows this request');
    } else {
      resolve(url);
    }
  });
}

function robotsAllowed(url) {
  return new Promise((resolve, reject) => {
    const robotsUrl = urlparse.resolve(url, '/robots.txt');

    return fetch(robotsUrl, {
      headers: {
        'User-Agent': userAgent,
      },
    })
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          return res;
        } else {
          throw new Error('Unable to find robots.txt');
        }
      })
      .then((res) => res.text())
      .then((robotsText) => {
        const robots = robotsParser.default(robotsUrl, robotsText);

        if (robots.isAllowed(url, userAgent)) {
          resolve('Robots.txt allows this request');
        } else {
          reject('Robots.txt disallows this request');
        }
      })
      .catch(() => {
        resolve('Unable to find robots.txt');
      });
  });
}

function fetchUrlContent(url) {
  return blacklistAllowed(url)
    .then(robotsAllowed)
    .then(() => {
      return fetch(url, {
        headers: {
          'User-Agent': userAgent,
        },
      })
        .then((res) => {
          if (res.status >= 200 && res.status < 300) {
            return res;
          } else {
            throw new Error(`Request Failure: ${res.status} ${res.statusText}`);
          }
        })
        .then((res) => res.text())
        .catch((e) => {
          throw e;
        });
    });
}

function getHtmlDocument(html) {
  return domino.createWindow(html).document;
}

function getImageInfo(imageUrl) {
  return fastimage
    .info(imageUrl)
    .then((info) => {
      return info;
    })
    .catch((e) => {
      throw e;
    });
}

function getDocumentMetadata(url, doc) {
  const parsedMetadata = parser.getMetadata(doc, url);

  const urlMetadata = {
    url: parsedMetadata.url,
    original_url: url,
    provider_name: parsedMetadata.provider,
    title: parsedMetadata.title,
    description: parsedMetadata.description,
    favicon_url: parsedMetadata.icon_url,
    images: [],
  };

  if (parsedMetadata.image_url) {
    return getImageInfo(parsedMetadata.image_url)
      .then((imageInfo) => {
        urlMetadata.images = [
          {
            url: parsedMetadata.image_url,
            width: imageInfo.width,
            height: imageInfo.height,
          },
        ];

        return urlMetadata;
      })
      .catch(() => urlMetadata);
  } else {
    return Promise.resolve(urlMetadata);
  }
}

function getUrlMetadata(url) {
  const result = {
    url,
    data: null,
    error: null,
  };

  return fetchUrlContent(url)
    .then((html) => getDocumentMetadata(url, getHtmlDocument(html)))
    .then((metadata) => {
      result.data = metadata;
      return result;
    })
    .catch((e) => {
      result.error = e;
      return result;
    });
}

export {
  fetchUrlContent,
  getDocumentMetadata,
  getHtmlDocument,
  getImageInfo,
  getUrlMetadata,
};
