import { createHash, createHmac } from 'node:crypto';
import { existsSync, mkdirSync } from 'node:fs';
import { rename, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export const UPLOAD_DIR = 'uploads';

interface S3Config {
  bucket: string;
  region: string;
  endpoint: string;
  publicUrl: string;
  accessKey: string;
  secretKey: string;
}

export function getS3Config(): S3Config | null {
  const accessKey = process.env.S3_ACCESS_KEY?.trim();
  const secretKey = process.env.S3_SECRET_KEY?.trim();
  if (!accessKey || !secretKey) return null;

  const bucket = (process.env.S3_BUCKET || 'beautyup-media').trim();
  const region = (process.env.S3_REGION || 'sgp1').trim();
  const endpoint = (process.env.S3_ENDPOINT || `https://${region}.digitaloceanspaces.com`).trim().replace(/\/$/, '');
  const publicUrl = (
    process.env.S3_PUBLIC_URL || `https://${bucket}.${region}.cdn.digitaloceanspaces.com`
  )
    .trim()
    .replace(/\/$/, '');

  return { bucket, region, endpoint, publicUrl, accessKey, secretKey };
}

const sha256Hex = (data: Buffer | string) => createHash('sha256').update(data).digest('hex');
const hmac = (key: Buffer | string, data: string) => createHmac('sha256', key).update(data).digest();

function encodeS3Path(path: string) {
  return path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

/** Signs and executes an S3-compatible REST request (DigitalOcean Spaces / AWS S3 / Cloudflare R2). */
async function s3Request(
  cfg: S3Config,
  method: 'PUT' | 'HEAD' | 'DELETE',
  key: string,
  body: Buffer = Buffer.alloc(0),
  extraHeaders: Record<string, string> = {},
): Promise<Response> {
  const url = new URL(`${cfg.endpoint}/${cfg.bucket}/${encodeS3Path(key)}`);
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = sha256Hex(body);

  const headers: Record<string, string> = {
    host: url.host,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': amzDate,
    ...extraHeaders,
  };

  const sortedKeys = Object.keys(headers).sort();
  const canonicalHeaders = sortedKeys.map((k) => `${k.toLowerCase()}:${headers[k].trim()}\n`).join('');
  const signedHeaders = sortedKeys.map((k) => k.toLowerCase()).join(';');

  const canonicalRequest = [
    method,
    url.pathname,
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  const credentialScope = `${dateStamp}/${cfg.region}/s3/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join('\n');

  const kDate = hmac(`AWS4${cfg.secretKey}`, dateStamp);
  const kRegion = hmac(kDate, cfg.region);
  const kService = hmac(kRegion, 's3');
  const kSigning = hmac(kService, 'aws4_request');
  const signature = createHmac('sha256', kSigning).update(stringToSign).digest('hex');

  const authorization = `AWS4-HMAC-SHA256 Credential=${cfg.accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return fetch(url, {
    method,
    headers: {
      ...headers,
      Authorization: authorization,
    },
    body: method === 'PUT' && body.byteLength > 0 ? new Uint8Array(body) : undefined,
  });
}

/**
 * Stores an uploaded file buffer.
 * - Always keeps a local copy in `uploads/` for safety.
 * - When DigitalOcean Spaces (`S3_ACCESS_KEY` + `S3_SECRET_KEY`) is configured,
 *   uploads to `uploads/<filename>` with `public-read` ACL and returns its CDN URL.
 */
export async function storeUploadedFile(filename: string, buf: Buffer, contentType: string): Promise<string> {
  mkdirSync(UPLOAD_DIR, { recursive: true });
  await writeFile(join(UPLOAD_DIR, filename), buf);

  const s3 = getS3Config();
  if (!s3) {
    return `${process.env.API_PUBLIC_URL ?? ''}/uploads/${filename}`;
  }

  const key = `uploads/${filename}`;
  const res = await s3Request(s3, 'PUT', key, buf, {
    'content-type': contentType,
    'cache-control': 'public, max-age=31536000',
    'x-amz-acl': 'public-read',
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`DigitalOcean Spaces upload failed (${res.status}): ${errText}`);
  }
  return `${s3.publicUrl}/${key}`;
}

export async function s3ObjectExists(cfg: S3Config, key: string): Promise<boolean> {
  const res = await s3Request(cfg, 'HEAD', key);
  return res.ok;
}

export async function s3RenameObject(cfg: S3Config, fromKey: string, toKey: string): Promise<boolean> {
  const copySource = `/${cfg.bucket}/${encodeS3Path(fromKey)}`;
  const copyRes = await s3Request(cfg, 'PUT', toKey, Buffer.alloc(0), {
    'x-amz-acl': 'public-read',
    'x-amz-copy-source': copySource,
  });
  if (!copyRes.ok) return false;
  await s3Request(cfg, 'DELETE', fromKey).catch(() => {});
  return true;
}

export async function localRenameIfPresent(fromName: string, toName: string) {
  const fromPath = join(UPLOAD_DIR, fromName);
  const toPath = join(UPLOAD_DIR, toName);
  if (existsSync(fromPath)) {
    await rename(fromPath, toPath).catch(() => {});
  }
}

export async function removeLocalFile(path: string) {
  await unlink(path).catch(() => {});
}
