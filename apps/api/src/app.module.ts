import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminInquiriesController } from './admin/admin-inquiries.controller.js';
import { AdminResourcesController } from './admin/admin-resources.controller.js';
import { AdminSettingsController } from './admin/admin-settings.controller.js';
import { AdminUploadsController } from './admin/admin-uploads.controller.js';
import { AdminUsersController } from './admin/admin-users.controller.js';
import { AppController } from './app.controller.js';
import { AuthModule } from './auth/auth.module.js';
import { ResourceService } from './common/resource.service.js';
import { AdminMembersController, MemberGuard, MembersController } from './members/members.controller.js';
import { MembersService } from './members/members.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ForumController } from './public/forum.controller.js';
import { PublicController } from './public/public.controller.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, AuthModule],
  controllers: [
    AppController,
    PublicController,
    ForumController,
    AdminResourcesController,
    AdminInquiriesController,
    AdminSettingsController,
    AdminUsersController,
    AdminUploadsController,
    MembersController,
    AdminMembersController,
  ],
  providers: [ResourceService, MembersService, MemberGuard],
})
export class AppModule {}
