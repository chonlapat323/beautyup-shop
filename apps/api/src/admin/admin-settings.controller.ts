import { Body, Controller, Get, NotFoundException, Param, Put, UseGuards } from '@nestjs/common';
import { SETTING_KEYS, settingSchemas, type SettingKey } from '@beautyup/types';
import { AdminGuard, Roles } from '../auth/auth.guard.js';
import { parseOrThrow } from '../common/zod-validation.pipe.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { Prisma } from '../generated/prisma/client.js';

@Controller('admin/settings')
@UseGuards(AdminGuard)
export class AdminSettingsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async all() {
    const rows = await this.prisma.setting.findMany();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  }

  @Put(':key')
  @Roles('ADMIN')
  async put(@Param('key') key: string, @Body() body: unknown) {
    if (!SETTING_KEYS.includes(key as SettingKey)) throw new NotFoundException();
    const value = parseOrThrow(settingSchemas[key as SettingKey], body) as Prisma.InputJsonValue;
    const row = await this.prisma.setting.upsert({ where: { key }, create: { key, value }, update: { value } });
    return row.value;
  }
}
