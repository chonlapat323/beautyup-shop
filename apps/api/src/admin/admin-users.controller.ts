import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { userCreateInput, userUpdateInput } from '@beautyup/types';
import type { z } from 'zod';
import { AdminGuard, CurrentUser, Roles } from '../auth/auth.guard.js';
import { hashPassword, type AuthUser } from '../auth/auth.service.js';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';
import { PrismaService } from '../prisma/prisma.service.js';

const publicFields = { id: true, email: true, name: true, role: true, isActive: true, createdAt: true } as const;

@Controller('admin/users')
@UseGuards(AdminGuard)
@Roles('ADMIN')
export class AdminUsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  list() {
    return this.prisma.user.findMany({ select: publicFields, orderBy: { createdAt: 'asc' } });
  }

  @Post()
  async create(@Body(new ZodValidationPipe(userCreateInput)) body: z.output<typeof userCreateInput>) {
    const { password, ...rest } = body;
    return this.prisma.user.create({
      data: { ...rest, email: rest.email.toLowerCase(), passwordHash: await hashPassword(password) },
      select: publicFields,
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser() me: AuthUser,
    @Body(new ZodValidationPipe(userUpdateInput)) body: z.output<typeof userUpdateInput>,
  ) {
    const { password, ...rest } = body;
    if (id === me.id && (rest.isActive === false || (rest.role && rest.role !== 'ADMIN'))) {
      throw new BadRequestException('ไม่สามารถปิดใช้งานหรือลดสิทธิ์บัญชีของตัวเองได้');
    }
    return this.prisma.user.update({
      where: { id },
      data: {
        ...rest,
        ...(rest.email && { email: rest.email.toLowerCase() }),
        ...(password && { passwordHash: await hashPassword(password) }),
      },
      select: publicFields,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() me: AuthUser) {
    if (id === me.id) throw new BadRequestException('ไม่สามารถลบบัญชีของตัวเองได้');
    await this.prisma.user.delete({ where: { id } });
    return { ok: true };
  }
}
