import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './routes/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { PrismaService } from './services/prisma/prisma.service';
import { MetadataController } from './routes/metadata/metadata.controller';
import { NotificationsGateway } from './gateways/notifications/notifications.gateway';
import { NotificationsController } from './routes/notifications/notifications.controller';
import { NotificationsService } from './services/notifications/notifications.service';
import { ForumsController } from './routes/forums/forums.controller';
import { UploadController } from './routes/upload/upload.controller';
import { ForumsService } from './services/forums/forums.service';
import { ForumsPostController } from './routes/forums-post/forums-post.controller';
import { PostActionsController } from './routes/post-actions/post-actions.controller';

@Module({
  imports: [],
  controllers: [AppController, AuthController, MetadataController, NotificationsController, ForumsController, UploadController, ForumsPostController, PostActionsController],
  providers: [AppService, AuthService, PrismaService, NotificationsGateway, NotificationsService, ForumsService],
})
export class AppModule {}
