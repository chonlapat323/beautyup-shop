import { existsSync, renameSync } from 'node:fs';
import { extname, join } from 'node:path';
import { UPLOAD_DIR } from '../admin/admin-uploads.controller.js';

/** Fresh uploads keep a random name until a media item claims them. */
const RANDOM_NAME = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[a-z0-9]+$/i;

/** Latin letters and digits only, so names stay readable in URLs and file systems. */
const part = (s: string) => s.normalize('NFKD').replace(/[^A-Za-z0-9]+/g, '').slice(0, 30);

/** e.g. Fanola_Nook_shampoo_20261019 (brands first, then tags, dated in Thai time). */
export function mediaFileBase(brands: string[], tags: string[], date: Date) {
  const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(date).replaceAll('-', '');
  const parts = [...brands, ...tags].map(part).filter(Boolean).slice(0, 4);
  return [...(parts.length ? parts : ['media']), ymd].join('_');
}

/**
 * Renames randomly named uploads to `${base}_${n}.ext` and returns the new URLs.
 * Already-named files and URLs that are not our uploads are left as they are.
 */
export function renameUploads(urls: string[], base: string) {
  let n = 0;
  return urls.map((url) => {
    const name = url.split('/').pop() ?? '';
    if (!url.includes('/uploads/') || !RANDOM_NAME.test(name) || !existsSync(join(UPLOAD_DIR, name))) return url;
    let target: string;
    do target = `${base}_${++n}${extname(name).toLowerCase()}`;
    while (existsSync(join(UPLOAD_DIR, target)));
    renameSync(join(UPLOAD_DIR, name), join(UPLOAD_DIR, target));
    return url.slice(0, -name.length) + target;
  });
}
