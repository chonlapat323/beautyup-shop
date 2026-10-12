import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { INQUIRY_STATUSES, INQUIRY_TYPES, inquiryUpdateInput, type InquiryStatus, type InquiryType } from '@beautyup/types';
import type { z } from 'zod';
import { AdminGuard } from '../auth/auth.guard.js';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Controller('admin/inquiries')
@UseGuards(AdminGuard)
export class AdminInquiriesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list(
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('q') q?: string,
    @Query('page') pageParam = '1',
  ) {
    const page = Math.max(1, Number(pageParam) || 1);
    const pageSize = 30;
    const where = {
      ...(INQUIRY_STATUSES.includes(status as InquiryStatus) && { status: status as InquiryStatus }),
      ...(INQUIRY_TYPES.includes(type as InquiryType) && { type: type as InquiryType }),
      ...(q && {
        OR: ['name', 'phone', 'email', 'shopName', 'message'].map((f) => ({
          [f]: { contains: q, mode: 'insensitive' as const },
        })),
      }),
    };
    const [items, total, counts] = await Promise.all([
      this.prisma.inquiry.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * pageSize, take: pageSize }),
      this.prisma.inquiry.count({ where }),
      this.prisma.inquiry.groupBy({ by: ['status'], _count: true }),
    ]);
    return {
      items,
      total,
      page,
      pageSize,
      counts: Object.fromEntries(counts.map((c) => [c.status, c._count])),
    };
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.prisma.inquiry.findUniqueOrThrow({ where: { id } });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(inquiryUpdateInput)) body: z.output<typeof inquiryUpdateInput>,
  ) {
    return this.prisma.inquiry.update({ where: { id }, data: body });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.prisma.inquiry.delete({ where: { id } });
    return { ok: true };
  }
}
