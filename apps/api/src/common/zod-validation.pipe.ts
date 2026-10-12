import { BadRequestException, type PipeTransform } from '@nestjs/common';
import type { z } from 'zod';

/** Validates a request body with a zod schema from @beautyup/types. */
export class ZodValidationPipe<T extends z.ZodType> implements PipeTransform {
  constructor(private readonly schema: T) {}

  transform(value: unknown): z.output<T> {
    return parseOrThrow(this.schema, value);
  }
}

/** Errors are keyed by dotted path (e.g. "name.th") so forms can show them per field. */
export function parseOrThrow<T extends z.ZodType>(schema: T, value: unknown): z.output<T> {
  const result = schema.safeParse(value);
  if (result.success) return result.data;

  const errors: Record<string, string[]> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join('.') || '_';
    (errors[key] ??= []).push(issue.message);
  }
  throw new BadRequestException({ statusCode: 400, message: 'ข้อมูลไม่ถูกต้อง', errors });
}
