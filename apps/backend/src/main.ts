import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { config } from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });
  app.enableCors();
  app.use(helmet());
  app.use(morgan(':method :url :status :response-time ms'));
  console.log('Server Starter');
  await app.listen(5000);
}
config();
bootstrap();
