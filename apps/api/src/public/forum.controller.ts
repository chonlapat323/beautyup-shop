import {
  BadRequestException,
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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FORUM_LIMITS, forumNewReply, forumNewTopic } from '@beautyup/types';
import { randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { memoryStorage } from 'multer';
import { UPLOAD_DIR } from '../admin/admin-uploads.controller.js';
import { clientIp, throttle } from '../common/throttle.js';
import { parseOrThrow } from '../common/zod-validation.pipe.js';
import { PrismaService } from '../prisma/prisma.service.js';

const PAGE_SIZE = 20;
const MAX_LINKS = 3;
const TEN_MINUTES = 10 * 60 * 1000;
const visible = { isActive: true } as const;

type Fields = Record<string, unknown>;

const withImages = FilesInterceptor('images', FORUM_LIMITS.images, {
  storage: memoryStorage(),
  limits: { fileSize: FORUM_LIMITS.imageBytes, files: FORUM_LIMITS.images },
});

/** Real image type from the first bytes; the type the browser sends cannot be trusted. */
function imageExt(buf: Buffer) {
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return '.jpg';
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return '.png';
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return '.webp';
  return null;
}

async function saveImages(files: Express.Multer.File[] = []) {
  const typed = files.map((f) => ({ f, ext: imageExt(f.buffer) }));
  if (typed.some((t) => !t.ext)) throw new BadRequestException('รองรับเฉพาะรูป JPG, PNG หรือ WebP');
  return Promise.all(
    typed.map(async ({ f, ext }) => {
      const name = `forum-${randomUUID()}${ext}`;
      await writeFile(join(UPLOAD_DIR, name), f.buffer);
      return `${process.env.API_PUBLIC_URL ?? ''}/uploads/${name}`;
    }),
  );
}

/** Bots fill the hidden "website" field; real visitors never see it. */
const isBot = (body: Fields) => typeof body?.website === 'string' && body.website !== '';
const tooManyLinks = (text: string) => (text.match(/https?:\/\/|www\./gi) ?? []).length > MAX_LINKS;

@Controller('public/forum')
export class ForumController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('categories')
  categories() {
    return this.prisma.forumCategory.findMany({
      where: visible,
      orderBy: { sortOrder: 'asc' },
      select: { id: true, slug: true, name: true, description: true, _count: { select: { topics: { where: visible } } } },
    });
  }

  /** Pinned first, then by latest activity. */
  @Get('topics')
  async topics(@Query('category') category?: string, @Query('page') page?: string) {
    const current = Math.max(1, Number.parseInt(page ?? '1', 10) || 1);
    const where = { ...visible, category: { ...visible, ...(category && { slug: category }) } };
    const [total, rows] = await Promise.all([
      this.prisma.forumTopic.count({ where }),
      this.prisma.forumTopic.findMany({
        where,
        orderBy: [{ isPinned: 'desc' }, { lastActivityAt: 'desc' }],
        skip: (current - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: {
          id: true,
          title: true,
          body: true,
          authorName: true,
          images: true,
          isPinned: true,
          isLocked: true,
          createdAt: true,
          lastActivityAt: true,
          category: { select: { slug: true, name: true } },
          _count: { select: { replies: { where: visible } } },
        },
      }),
    ]);
    const items = rows.map(({ body, _count, ...t }) => ({ ...t, excerpt: body.slice(0, 160), replyCount: _count.replies }));
    return { items, total, page: current, pageSize: PAGE_SIZE };
  }

  @Get('topics/:id')
  async topic(@Param('id') id: string) {
    const topic = await this.prisma.forumTopic.findFirst({
      where: { id, ...visible, category: visible },
      include: {
        category: { select: { slug: true, name: true } },
        replies: {
          where: visible,
          orderBy: { createdAt: 'asc' },
          select: { id: true, body: true, authorName: true, images: true, createdAt: true },
        },
      },
    });
    if (!topic) throw new NotFoundException();
    return topic;
  }

  /** Every visible topic, for sitemap.xml */
  @Get('sitemap')
  sitemap() {
    return this.prisma.forumTopic.findMany({
      where: { ...visible, category: visible },
      select: { id: true, lastActivityAt: true },
      orderBy: { lastActivityAt: 'desc' },
      take: 5000,
    });
  }

  @Post('topics')
  @HttpCode(201)
  @UseInterceptors(withImages)
  async createTopic(
    @Body() body: Fields,
    @UploadedFiles() files: Express.Multer.File[],
    @Ip() ip: string,
    @Headers('x-forwarded-for') forwarded?: string,
  ) {
    if (isBot(body)) return { id: null };
    throttle(`forum-topic:${clientIp(forwarded, ip)}`, 3, TEN_MINUTES);
    const data = parseOrThrow(forumNewTopic, body);
    if (tooManyLinks(`${data.title} ${data.body}`)) throw new BadRequestException(`ใส่ลิงก์ได้ไม่เกิน ${MAX_LINKS} ลิงก์`);
    const category = await this.prisma.forumCategory.findFirst({ where: { slug: data.category, ...visible } });
    if (!category) throw new BadRequestException({ statusCode: 400, message: 'ข้อมูลไม่ถูกต้อง', errors: { category: ['ไม่พบหมวดหมู่'] } });
    const images = await saveImages(files);
    return this.prisma.forumTopic.create({
      data: { categoryId: category.id, title: data.title, body: data.body, authorName: data.authorName, images },
      select: { id: true },
    });
  }

  @Post('topics/:id/replies')
  @HttpCode(201)
  @UseInterceptors(withImages)
  async createReply(
    @Param('id') id: string,
    @Body() body: Fields,
    @UploadedFiles() files: Express.Multer.File[],
    @Ip() ip: string,
    @Headers('x-forwarded-for') forwarded?: string,
  ) {
    if (isBot(body)) return { id: null };
    throttle(`forum-reply:${clientIp(forwarded, ip)}`, 10, TEN_MINUTES);
    const data = parseOrThrow(forumNewReply, body);
    if (tooManyLinks(data.body)) throw new BadRequestException(`ใส่ลิงก์ได้ไม่เกิน ${MAX_LINKS} ลิงก์`);
    const topic = await this.prisma.forumTopic.findFirst({ where: { id, ...visible, category: visible } });
    if (!topic) throw new NotFoundException();
    if (topic.isLocked) throw new BadRequestException('กระทู้นี้ปิดการตอบแล้ว');
    const images = await saveImages(files);
    const [reply] = await this.prisma.$transaction([
      this.prisma.forumReply.create({ data: { topicId: id, body: data.body, authorName: data.authorName, images }, select: { id: true } }),
      this.prisma.forumTopic.update({ where: { id }, data: { lastActivityAt: new Date() } }),
    ]);
    return reply;
  }
}
