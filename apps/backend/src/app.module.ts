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
import { ProfileController } from './routes/profile/profile.controller';
import { UpdateProfileController } from './routes/update-profile/update-profile.controller';
import { VerifyUserService } from './services/verify-user/verify-user.service';
import { BlogsController } from './routes/blogs/blogs.controller';
import { StaticController } from './routes/static/static.controller';
import { EditableController } from './routes/editable/editable.controller';
import { ForumEditController } from './routes/forum-edit/forum-edit.controller';
import { EditableService } from './services/editable/editable.service';
import { SeriesController } from './routes/series/series.controller';
import { UserService } from './services/user/user.service';
import { BlogEditController } from './routes/blog-edit/blog-edit.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    AuthController,
    MetadataController,
    NotificationsController,
    ForumsController,
    UploadController,
    ForumsPostController,
    PostActionsController,
    ProfileController,
    UpdateProfileController,
    BlogsController,
    StaticController,
    EditableController,
    ForumEditController,
    SeriesController,
    BlogEditController,
  ],
  providers: [
    AppService,
    AuthService,
    PrismaService,
    NotificationsGateway,
    NotificationsService,
    ForumsService,
    VerifyUserService,
    EditableService,
    UserService,
  ],
})
export class AppModule {}
