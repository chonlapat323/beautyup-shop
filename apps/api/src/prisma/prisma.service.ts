import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger('Database');

  constructor() {
    super({
      adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
    });
  }

  async onModuleInit() {
    // Fail fast with one readable line instead of a stack trace on every request
    try {
      await this.$queryRaw`SELECT 1`;
    } catch (e) {
      const where = (process.env.DATABASE_URL ?? '').replace(/\/\/[^@]*@/, '//***@');
      this.logger.error(
        `Cannot connect to PostgreSQL at ${where} (${(e as Error).message.split('\n')[0]}). ` +
          'Is the database running? Local: open Docker Desktop and run `pnpm db:up`.',
      );
      process.exit(1);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
