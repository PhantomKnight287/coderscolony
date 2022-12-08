FROM node:16.18.0-alpine

ARG API_URL
ARG STORAGE_BUCKET_URL

ENV API_URL=${API_URL}
ENV STORAGE_BUCKET_URL=${STORAGE_BUCKET_URL}

WORKDIR /app
COPY . /app/

RUN corepack prepare pnpm@7.14.0 --activate

RUN pnpm i

RUN pnpm build

EXPOSE 3000
CMD [ "pnpm" ,"start"]