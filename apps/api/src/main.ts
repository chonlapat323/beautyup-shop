import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { UPLOAD_DIR } from './admin/admin-uploads.controller.js';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: (process.env.CORS_ORIGINS ?? '').split(',').filter(Boolean),
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  mkdirSync(UPLOAD_DIR, { recursive: true });
  app.useStaticAssets(resolve(UPLOAD_DIR), {
    prefix: '/uploads',
    maxAge: '30d',
    // Uploaded files are data, never pages
    setHeaders: (res) => res.setHeader('X-Content-Type-Options', 'nosniff'),
  });

  const config = new DocumentBuilder()
    .setTitle('BeautyUp Shop API')
    .setVersion('0.1')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));

  // HOST=127.0.0.1 in production: only reachable through the reverse proxy
  await app.listen(process.env.PORT ?? 4000, process.env.HOST ?? '0.0.0.0');
}
await bootstrap();
