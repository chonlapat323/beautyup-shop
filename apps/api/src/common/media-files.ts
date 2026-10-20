import { existsSync, renameSync } from 'node:fs';
import { extname, join } from 'node:path';
import { UPLOAD_DIR } from '../admin/admin-uploads.controller.js';

/** Fresh uploads keep a random name until a media item claims them. */
const RANDOM_NAME = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[a-z0-9]+$/i;

/**
 * Lowercase latin words joined by hyphens. Search engines and AI crawlers read a hyphen as a
 * space but an underscore as part of the word, so "fanola-shampoo" is two words, "fanola_shampoo" one.
 */
const words = (s: string) =>
  s.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/**
 * Describes the media in its file name: brands, what it is (the slug), tags, date in Thai time.
 * e.g. fanola-20-years-of-fanola-campaign-20261019
 */
export function mediaFileBase(brands: string[], slug: string, tags: string[], date: Date) {
  const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(date).replaceAll('-', '');
  let base = '';
  for (const part of new Set([...brands, slug, ...tags].map(words).filter(Boolean))) {
    const next = base ? `${base}-${part}` : part;
    if (next.length > 80) break;
    base = next;
  }
  return `${base || 'media'}-${ymd}`;
}

/**
 * Renames randomly named uploads to `${base}-${n}.ext` and returns the new URLs.
 * Already-named files and URLs that are not our uploads are left as they are.
 */
export function renameUploads(urls: string[], base: string) {
  let n = 0;
  return urls.map((url) => {
    const name = url.split('/').pop() ?? '';
    if (!url.includes('/uploads/') || !RANDOM_NAME.test(name) || !existsSync(join(UPLOAD_DIR, name))) return url;
    let target: string;
    do target = `${base}-${++n}${extname(name).toLowerCase()}`;
    while (existsSync(join(UPLOAD_DIR, target)));
    renameSync(join(UPLOAD_DIR, name), join(UPLOAD_DIR, target));
    return url.slice(0, -name.length) + target;
  });
}
