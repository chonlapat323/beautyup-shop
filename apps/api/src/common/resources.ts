import { resources, type ResourceName } from '@beautyup/types';

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
}

const byOrder = [{ sortOrder: 'asc' as const }];

export const resourceConfig: Record<ResourceName, ResourceConfig> = {
  'menu-items': { model: 'menuItem', orderBy: [{ location: 'asc' }, ...byOrder], hasActive: true },
  'hero-slides': {
    model: 'heroSlide',
    orderBy: byOrder,
    hasActive: true,
    include: { brand: { select: { id: true, slug: true, name: true } } },
  },
  brands: { model: 'brand', orderBy: [{ type: 'asc' }, ...byOrder], slugField: 'slug', hasActive: true, searchFields: ['name', 'slug'] },
  products: {
    model: 'product',
    orderBy: [...byOrder, { createdAt: 'desc' }],
    slugField: 'slug',
    hasActive: true,
    decimals: ['price', 'salePrice'],
    include: { brand: { select: { id: true, slug: true, name: true, type: true } } },
    searchFields: ['slug'],
  },
  videos: { model: 'video', orderBy: byOrder, hasActive: true },
  ambassadors: { model: 'ambassador', orderBy: byOrder, hasActive: true, searchFields: ['name'] },
  salons: { model: 'salon', orderBy: [{ region: 'asc' }, { province: 'asc' }, { name: 'asc' }], hasActive: true, searchFields: ['name', 'province'] },
  courses: { model: 'course', orderBy: byOrder, slugField: 'slug', hasActive: true, searchFields: ['slug'] },
  posts: { model: 'post', orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }], slugField: 'slug', hasActive: false, searchFields: ['slug'] },
  pages: { model: 'page', orderBy: [{ slug: 'asc' }], slugField: 'slug', hasActive: true },
  team: { model: 'teamMember', orderBy: [{ department: 'asc' }, ...byOrder], hasActive: true },
};

export function isResource(name: string): name is ResourceName {
  return Object.hasOwn(resources, name);
}

/** Prisma Decimal -> number for the given fields. */
export function serialize<T extends Record<string, unknown>>(row: T, cfg: ResourceConfig): T {
  if (!cfg.decimals) return row;
  const out: Record<string, unknown> = { ...row };
  for (const f of cfg.decimals) {
    if (out[f] != null) out[f] = Number(out[f]);
  }
  return out as T;
}
