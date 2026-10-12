import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
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

@Controller('admin/uploads')
@UseGuards(AdminGuard)
export class AdminUploadsController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, cb) =>
        ALLOWED.has(file.mimetype)
          ? cb(null, true)
          : cb(new BadRequestException('รองรับเฉพาะรูปภาพ (jpg, png, webp, avif) และ PDF'), false),
      storage: diskStorage({
        destination: UPLOAD_DIR,
        // Random names: never trust the client's filename
        filename: (_req, file, cb) =>
          cb(null, `${randomUUID()}${ALLOWED.get(file.mimetype) ?? extname(file.originalname)}`),
      }),
    }),
  )
  upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('ไม่พบไฟล์');
    const base = process.env.API_PUBLIC_URL ?? '';
    return { url: `${base}/uploads/${file.filename}`, size: file.size, type: file.mimetype };
  }
}
