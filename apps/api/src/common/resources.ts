import { resources, type ResourceName } from '@beautyup/types';
import { mediaFileBase, renameUploads } from './media-files.js';

type Row = Record<string, unknown>;

/**
 * How each admin resource maps onto Prisma. Drives the generic admin CRUD
 * controller and the public read endpoints.
 */
export interface ResourceConfig {
  model: string;
  orderBy: Record<string, 'asc' | 'desc'>[];
  /** Field used for public lookups by slug */
  slugField?: string;
  /** Only rows with isActive=true are public */
  hasActive: boolean;
  /** Decimal columns, returned as numbers */
  decimals?: string[];
  include?: Record<string, unknown>;
  /** Fields matched by the admin search box */
  searchFields?: string[];
  /** Only rows with publishedAt in the past are public (drafts and scheduled items are hidden) */
  publishedOnly?: boolean;
  /** Input id-array field -> many-to-many relation, e.g. brandIds -> brands */
  manyToMany?: Record<string, string>;
  /** Runs after a successful create/update; returns fields to write back, if any */
  afterSave?: (row: Row) => Promise<Row | undefined> | Row | undefined;
}

const byOrder = [{ sortOrder: 'asc' as const }];

export const resourceConfig: Record<ResourceName, ResourceConfig> = {
  'menu-items': {
    model: 'menuItem',
    orderBy: [{ location: 'asc' }, ...byOrder],
    hasActive: true,
    include: { brand: { select: { id: true, slug: true, name: true } }, parent: { select: { id: true, label: true } } },
  },
  'hero-slides': {
    model: 'heroSlide',
    orderBy: byOrder,
    hasActive: true,
    include: { brand: { select: { id: true, slug: true, name: true } } },
  },
  brands: { model: 'brand', orderBy: [{ type: 'asc' }, ...byOrder], slugField: 'slug', hasActive: true, searchFields: ['name', 'slug'] },
  'main-categories': {
    model: 'mainCategory',
    orderBy: byOrder,
    slugField: 'slug',
    hasActive: true,
    include: { brand: { select: { id: true, slug: true, name: true } } },
    searchFields: ['slug'],
  },
  categories: {
    model: 'category',
    orderBy: byOrder,
    slugField: 'slug',
    hasActive: true,
    include: {
      brand: { select: { id: true, slug: true, name: true, type: true } },
      mainCategory: { select: { id: true, slug: true, name: true } },
    },
    searchFields: ['slug'],
  },
  products: {
    model: 'product',
    orderBy: [...byOrder, { createdAt: 'desc' }],
    slugField: 'slug',
    hasActive: true,
    decimals: ['price', 'salePrice'],
    include: {
      brand: { select: { id: true, slug: true, name: true, type: true } },
      mainCategory: { select: { id: true, slug: true, name: true } },
      categoryRel: { select: { id: true, slug: true, name: true } },
    },
    searchFields: ['slug'],
    afterSave: async (row) => {
      const imageUrl = (row.imageUrl as string | null) ?? '';
      if (!imageUrl) return undefined;
      const brandName = (row.brand as { name?: string } | undefined)?.name;
      const mainCategorySlug = (row.mainCategory as { slug?: string } | undefined)?.slug;
      const collectionSlug = (row.categoryRel as { slug?: string } | undefined)?.slug;
      const tags = [
        ...(mainCategorySlug ? [mainCategorySlug] : []),
        ...(collectionSlug ? [collectionSlug] : []),
        ...((row.tags as string[] | null) ?? []),
        ...((row.badges as string[] | null) ?? []),
      ];
      const base = mediaFileBase(
        brandName ? [brandName] : [],
        String(row.slug),
        tags,
        (row.updatedAt as Date | null) ?? (row.createdAt as Date | null) ?? new Date(),
      );
      const [renamed] = await renameUploads([imageUrl], base);
      return renamed && renamed !== imageUrl ? { imageUrl: renamed } : undefined;
    },
  },
  videos: { model: 'video', orderBy: byOrder, hasActive: true },
  ambassadors: { model: 'ambassador', orderBy: byOrder, hasActive: true, searchFields: ['name'] },
  salons: { model: 'salon', orderBy: [{ region: 'asc' }, { province: 'asc' }, { name: 'asc' }], hasActive: true, searchFields: ['name', 'province'] },
  courses: { model: 'course', orderBy: byOrder, slugField: 'slug', hasActive: true, searchFields: ['slug'] },
  posts: { model: 'post', orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }], slugField: 'slug', hasActive: false, publishedOnly: true, searchFields: ['slug'] },
  media: {
    model: 'media',
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    slugField: 'slug',
    hasActive: false,
    publishedOnly: true,
    include: {
      brands: { select: { id: true, slug: true, name: true, type: true }, orderBy: { sortOrder: 'asc' } },
      category: { select: { id: true, slug: true, name: true } },
    },
    searchFields: ['slug'],
    manyToMany: { brandIds: 'brands' },
    afterSave: async (row) => {
      const images = (row.images as string[] | null) ?? [];
      const brands = ((row.brands as { name: string }[] | undefined) ?? []).map((b) => b.name);
      const base = mediaFileBase(brands, String(row.slug), (row.tags as string[] | null) ?? [], (row.publishedAt as Date | null) ?? new Date());
      const renamed = await renameUploads(images, base);
      return renamed.some((u, i) => u !== images[i]) ? { images: renamed } : undefined;
    },
  },
  'media-categories': { model: 'mediaCategory', orderBy: byOrder, slugField: 'slug', hasActive: true, searchFields: ['slug'] },
  'forum-categories': { model: 'forumCategory', orderBy: byOrder, slugField: 'slug', hasActive: true, searchFields: ['slug'] },
  'forum-topics': {
    model: 'forumTopic',
    orderBy: [{ createdAt: 'desc' }],
    hasActive: true,
    include: { category: { select: { id: true, slug: true, name: true } } },
    searchFields: ['title', 'authorName', 'body'],
  },
  'forum-replies': {
    model: 'forumReply',
    orderBy: [{ createdAt: 'desc' }],
    hasActive: true,
    include: { topic: { select: { id: true, title: true } } },
    searchFields: ['body', 'authorName'],
  },
  pages: { model: 'page', orderBy: [{ slug: 'asc' }], slugField: 'slug', hasActive: true },
  team: { model: 'teamMember', orderBy: [{ department: 'asc' }, ...byOrder], hasActive: true },
};

export function isResource(name: string): name is ResourceName {
  return Object.hasOwn(resources, name);
}

/** Prisma Decimal -> number, and many-to-many relations -> id arrays the admin form can edit. */
export function serialize<T extends Row>(row: T, cfg: ResourceConfig): T {
  if (!cfg.decimals && !cfg.manyToMany) return row;
  const out: Row = { ...row };
  for (const f of cfg.decimals ?? []) {
    if (out[f] != null) out[f] = Number(out[f]);
  }
  for (const [key, rel] of Object.entries(cfg.manyToMany ?? {})) {
    if (Array.isArray(out[rel])) out[key] = (out[rel] as { id: string }[]).map((r) => r.id);
  }
  return out as T;
}

/** Turns id-array input fields into Prisma connect/set writes. */
export function toPrismaData(data: Row, cfg: ResourceConfig, mode: 'create' | 'update'): Row {
  if (!cfg.manyToMany) return data;
  const out: Row = { ...data };
  for (const [key, rel] of Object.entries(cfg.manyToMany)) {
    const ids = (out[key] as string[] | undefined) ?? [];
    delete out[key];
    out[rel] = { [mode === 'create' ? 'connect' : 'set']: ids.map((id) => ({ id })) };
  }
  return out;
}
