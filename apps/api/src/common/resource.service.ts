import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { resources, type ResourceName } from '@beautyup/types';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { parseOrThrow } from './zod-validation.pipe.js';
import { resourceConfig, serialize } from './resources.js';

type Row = Record<string, unknown>;

/** Minimal shape shared by the Prisma model delegates we use generically. */
interface Delegate {
  findMany(args: object): Promise<Row[]>;
  findFirst(args: object): Promise<Row | null>;
  findUnique(args: object): Promise<Row | null>;
  count(args: object): Promise<number>;
  create(args: object): Promise<Row>;
  update(args: object): Promise<Row>;
  delete(args: object): Promise<Row>;
}

@Injectable()
export class ResourceService {
  constructor(private readonly prisma: PrismaService) {}

  private delegate(name: ResourceName): Delegate {
    return (this.prisma as unknown as Record<string, Delegate>)[resourceConfig[name].model];
  }

  async list(name: ResourceName, opts: { activeOnly?: boolean; q?: string; where?: Row } = {}) {
    const cfg = resourceConfig[name];
    const where: Row = { ...opts.where };
    if (opts.activeOnly && cfg.hasActive) where.isActive = true;
    if (opts.activeOnly && name === 'posts') where.publishedAt = { not: null, lte: new Date() };
    if (opts.q && cfg.searchFields?.length) {
      where.OR = cfg.searchFields.map((f) => ({ [f]: { contains: opts.q, mode: 'insensitive' } }));
    }
    const rows = await this.delegate(name).findMany({ where, orderBy: cfg.orderBy, include: cfg.include });
    return rows.map((r) => serialize(r, cfg));
  }

  async get(name: ResourceName, id: string) {
    const cfg = resourceConfig[name];
    const row = await this.delegate(name).findUnique({ where: { id }, include: cfg.include });
    if (!row) throw new NotFoundException();
    return serialize(row, cfg);
  }

  async getBySlug(name: ResourceName, slug: string, activeOnly = true) {
    const cfg = resourceConfig[name];
    if (!cfg.slugField) throw new NotFoundException();
    const where: Row = { [cfg.slugField]: slug };
    if (activeOnly && cfg.hasActive) where.isActive = true;
    // Drafts and scheduled posts are not public
    if (activeOnly && name === 'posts') where.publishedAt = { not: null, lte: new Date() };
    // A hidden brand hides its products too (same rule as the public product list)
    if (activeOnly && name === 'products') where.brand = { isActive: true };
    const row = await this.delegate(name).findFirst({ where, include: cfg.include });
    if (!row) throw new NotFoundException();
    return serialize(row, cfg);
  }

  async create(name: ResourceName, body: unknown) {
    const data = parseOrThrow(resources[name].schema, body);
    return this.write(name, () => this.delegate(name).create({ data, include: resourceConfig[name].include }));
  }

  async update(name: ResourceName, id: string, body: unknown) {
    const data = parseOrThrow(resources[name].schema, body);
    return this.write(name, () =>
      this.delegate(name).update({ where: { id }, data, include: resourceConfig[name].include }),
    );
  }

  async remove(name: ResourceName, id: string) {
    await this.write(name, () => this.delegate(name).delete({ where: { id } }));
    return { ok: true };
  }

  /** Turns common Prisma errors into 4xx responses the admin UI can show. */
  private async write(name: ResourceName, fn: () => Promise<Row>) {
    try {
      return serialize(await fn(), resourceConfig[name]);
    } catch (e) {
      if (!(e instanceof Prisma.PrismaClientKnownRequestError)) throw e;
      if (e.code === 'P2025') throw new NotFoundException();
      if (e.code === 'P2002') {
        // The pg driver adapter does not always report the column; slug is the usual culprit
        const target = e.meta?.target as string[] | undefined;
        const slugField = resourceConfig[name].slugField;
        const fields = target?.length ? target : slugField ? [slugField] : [];
        throw new ConflictException({
          statusCode: 409,
          message: 'ข้อมูลซ้ำกับที่มีอยู่แล้ว',
          errors: Object.fromEntries(fields.map((f) => [f, ['ค่านี้ถูกใช้แล้ว']])),
        });
      }
      if (e.code === 'P2003') {
        throw new ConflictException('ลบไม่ได้ เพราะมีข้อมูลอื่นอ้างอิงอยู่ (เช่น สินค้าที่ใช้แบรนด์นี้)');
      }
      throw e;
    }
  }
}
