import { HttpException, HttpStatus } from '@nestjs/common';

const hits = new Map<string, number[]>();

/**
 * Simple in-memory rate limit (single API instance).
 * Throws 429 after `limit` calls per `key` within `windowMs`.
 */
export function throttle(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    throw new HttpException('ส่งข้อมูลบ่อยเกินไป กรุณาลองใหม่ภายหลัง', HttpStatus.TOO_MANY_REQUESTS);
  }
  recent.push(now);
  hits.set(key, recent);
}

/** Visitor IP: the website forwards it in X-Forwarded-For. */
export const clientIp = (forwarded: string | undefined, ip: string) => forwarded?.split(',')[0]?.trim() || ip;
