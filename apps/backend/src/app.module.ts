import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './routes/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { PrismaService } from './services/prisma/prisma.service';
import { MetadataController } from './routes/metadata/metadata.controller';

@Module({
  imports: [],
  controllers: [AppController, AuthController, MetadataController],
  providers: [AppService, AuthService, PrismaService],
})
export class AppModule {}
