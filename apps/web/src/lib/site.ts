/** Public origin of the website, for absolute URLs in structured data and feeds. */
export const SITE_URL = (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const absoluteUrl = (path: string) => (/^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`);

export function langAlternates(path: string, currentLang?: string) {
  const clean = path.replace(/^\/(th|en)(\/|$)/, "/").replace(/\/$/, "");
  const p = clean ? (clean.startsWith("/") ? clean : `/${clean}`) : "";
  const lang = currentLang || (path.startsWith("/en") ? "en" : "th");
  return {
    canonical: `${SITE_URL}/${lang}${p}`,
    languages: {
      th: `${SITE_URL}/th${p}`,
      en: `${SITE_URL}/en${p}`,
      "x-default": `${SITE_URL}/th${p}`,
    },
  };
}

/** Thumbnail for a YouTube link, so a video without uploaded images still has a preview image. */
export function youtubeThumbnail(url: string) {
  const id = /(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/.exec(url)?.[1];
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : undefined;
}
