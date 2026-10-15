import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Ip,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  BRAND_TYPES,
  POST_TYPES,
  REGIONS,
  inquiryInput,
  type BrandType,
  type PostType,
  type ResourceName,
} from '@beautyup/types';
import { ResourceService } from '../common/resource.service.js';
import { clientIp, throttle } from '../common/throttle.js';
import { isResource } from '../common/resources.js';
import { parseOrThrow } from '../common/zod-validation.pipe.js';
import type { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

/** Resources the website may read (everything except admin-only data). */
const PUBLIC: ResourceName[] = [
  'menu-items', 'hero-slides', 'brands', 'products', 'videos', 'ambassadors',
  'salons', 'courses', 'posts', 'pages', 'team',
];

@Controller('public')
export class PublicController {
  constructor(
    private readonly resources: ResourceService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('resources/:resource')
  list(
    @Param('resource') resource: string,
    @Query('type') type?: string,
    @Query('brand') brand?: string,
    @Query('brandType') brandType?: string,
  ) {
    const name = check(resource);
    const where: Record<string, unknown> = {};
    if (name === 'brands' && BRAND_TYPES.includes(type as BrandType)) where.type = type;
    if (name === 'posts' && POST_TYPES.includes(type as PostType)) where.type = type;
    if (name === 'products') {
      // Only products whose brand is visible too
      where.brand = {
        isActive: true,
        ...(brand && { slug: brand }),
        ...(BRAND_TYPES.includes(brandType as BrandType) && { type: brandType }),
      };
    }
    return this.resources.list(name, { activeOnly: true, where });
  }

  @Get('resources/:resource/:slug')
  get(@Param('resource') resource: string, @Param('slug') slug: string) {
    return this.resources.getBySlug(check(resource), slug);
  }

  @Get('settings')
  async settings() {
    const rows = await this.prisma.setting.findMany({ where: { key: { in: ['company', 'timeline', 'ppStudio', 'about', 'aboutSlides', 'vipCustomer', 'growVision'] } } });
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  }

  /** Salon counts per region. Uses the `regionCounts` override until the full list is imported. */
  @Get('regions')
  async regions() {
    const [override, grouped] = await Promise.all([
      this.prisma.setting.findUnique({ where: { key: 'regionCounts' } }),
      this.prisma.salon.groupBy({ by: ['region'], where: { isActive: true }, _count: true }),
    ]);
    const counted = Object.fromEntries(grouped.map((g) => [g.region, g._count]));
    const manual = (override?.value ?? {}) as Record<string, number>;
    return REGIONS.map((key) => ({ key, count: manual[key] ?? counted[key] ?? 0 }));
  }

  @Post('inquiries')
  @HttpCode(201)
  async inquiry(
    @Body() body: Record<string, unknown>,
    @Ip() ip: string,
    @Headers('x-forwarded-for') forwarded?: string,
  ) {
    // Honeypot: bots fill every field; real visitors never see this one
    if (typeof body?.website === 'string' && body.website) return { ok: true };
    // The website's server action forwards the visitor's IP
    throttle(`inquiry:${clientIp(forwarded, ip)}`, 5, 10 * 60 * 1000);
    const data = parseOrThrow(inquiryInput, body);
    await this.prisma.inquiry.create({ data: { ...data, data: data.data as Prisma.InputJsonValue } });
    return { ok: true };
  }
}

function check(name: string): ResourceName {
  if (!isResource(name) || !PUBLIC.includes(name)) throw new NotFoundException();
  return name;
}
