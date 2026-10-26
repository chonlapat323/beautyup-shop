import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import heicConvert from 'heic-convert';
import { randomUUID } from 'node:crypto';
import { readFile, unlink, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { diskStorage } from 'multer';
import { AdminGuard } from '../auth/auth.guard.js';

export const UPLOAD_DIR = 'uploads';
const ALLOWED = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/avif', '.avif'],
  ['application/pdf', '.pdf'],
]);

const HEIC_MIMES = new Set(['image/heic', 'image/heif', 'image/heic-sequence', 'image/heif-sequence']);
const HEIC_EXTS = new Set(['.heic', '.heif']);
const HEIC_BRANDS = new Set(['heic', 'heix', 'hevc', 'hevx', 'heim', 'heis', 'hevm', 'hevs', 'mif1', 'msf1']);

function isHeicFile(file: { mimetype: string; originalname: string }) {
  return HEIC_MIMES.has(file.mimetype.toLowerCase()) || HEIC_EXTS.has(extname(file.originalname).toLowerCase());
}

export function isHeicBuffer(buf: Buffer) {
  if (buf.length < 12) return false;
  return buf.toString('ascii', 4, 8) === 'ftyp' && HEIC_BRANDS.has(buf.toString('ascii', 8, 12).toLowerCase());
}

export async function convertHeicToJpg(buf: Buffer): Promise<Buffer> {
  try {
    const out = await heicConvert({ buffer: buf, format: 'JPEG', quality: 0.92 });
    return Buffer.from(out as ArrayBuffer);
  } catch {
    throw new BadRequestException('ไม่สามารถแปลงไฟล์ HEIC/HEIF เป็น JPG ได้');
  }
}

@Controller('admin/uploads')
@UseGuards(AdminGuard)
export class AdminUploadsController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, cb) =>
        ALLOWED.has(file.mimetype) || isHeicFile(file)
          ? cb(null, true)
          : cb(new BadRequestException('รองรับเฉพาะรูปภาพ (jpg, png, webp, avif, heic) และ PDF'), false),
      storage: diskStorage({
        destination: UPLOAD_DIR,
        // Random names: never trust the client's filename
        filename: (_req, file, cb) => {
          const ext = isHeicFile(file) ? '.heic' : (ALLOWED.get(file.mimetype) ?? extname(file.originalname));
          cb(null, `${randomUUID()}${ext}`);
        },
      }),
    }),
  )
  async upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('ไม่พบไฟล์');
    const base = process.env.API_PUBLIC_URL ?? '';

    if (isHeicFile(file)) {
      const heicPath = join(UPLOAD_DIR, file.filename);
      try {
        const raw = await readFile(heicPath);
        const jpgBuf = await convertHeicToJpg(raw);
        const jpgFilename = file.filename.replace(/\.heic$/i, '.jpg');
        await writeFile(join(UPLOAD_DIR, jpgFilename), jpgBuf);
        await unlink(heicPath).catch(() => {});
        return { url: `${base}/uploads/${jpgFilename}`, size: jpgBuf.byteLength, type: 'image/jpeg' };
      } catch (err) {
        await unlink(heicPath).catch(() => {});
        throw err;
      }
    }

    return { url: `${base}/uploads/${file.filename}`, size: file.size, type: file.mimetype };
  }
}
