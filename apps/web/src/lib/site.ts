/** Public origin of the website, for absolute URLs in structured data and feeds. */
export const SITE_URL = (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const absoluteUrl = (path: string) => (/^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`);

/** Thumbnail for a YouTube link, so a video without uploaded images still has a preview image. */
export function youtubeThumbnail(url: string) {
  const id = /(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/.exec(url)?.[1];
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : undefined;
}
