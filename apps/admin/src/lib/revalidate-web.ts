import "server-only";

const DEFAULT_SECRET = "beautyup-default-revalidate-secret-2026";

/** Asks the website to refresh cached content. Failures only delay the update, so they are logged, not thrown. */
export async function revalidateWeb() {
  const secret = process.env.REVALIDATE_SECRET || DEFAULT_SECRET;
  const urls = [
    process.env.WEB_URL,
    "http://127.0.0.1:3200",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ].filter(Boolean) as string[];

  // Try the configured WEB_URL first, or local server ports
  for (const url of [...new Set(urls)]) {
    try {
      const res = await fetch(`${url}/api/revalidate`, {
        method: "POST",
        headers: { "x-revalidate-secret": secret },
        cache: "no-store",
      });
      if (res.ok) {
        return; // Revalidation succeeded
      }
    } catch {
      // Continue to next candidate URL
    }
  }
  console.warn("[revalidate] could not reach website revalidate endpoint");
}
