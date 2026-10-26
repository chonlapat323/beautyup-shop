import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import heicConvert from 'heic-convert';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { memoryStorage } from 'multer';
import { AdminGuard } from '../auth/auth.guard.js';
import { UPLOAD_DIR, storeUploadedFile } from '../common/storage.js';

export { UPLOAD_DIR };
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
      storage: memoryStorage(),
    }),
  )
  async upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('ไม่พบไฟล์');

    if (isHeicFile(file) || isHeicBuffer(file.buffer)) {
      const jpgBuf = await convertHeicToJpg(file.buffer);
      const jpgFilename = `${randomUUID()}.jpg`;
      const url = await storeUploadedFile(jpgFilename, jpgBuf, 'image/jpeg');
      return { url, size: jpgBuf.byteLength, type: 'image/jpeg' };
    }

    const ext = ALLOWED.get(file.mimetype) ?? extname(file.originalname).toLowerCase();
    const filename = `${randomUUID()}${ext}`;
    const url = await storeUploadedFile(filename, file.buffer, file.mimetype);
    return { url, size: file.size, type: file.mimetype };
  }
}
