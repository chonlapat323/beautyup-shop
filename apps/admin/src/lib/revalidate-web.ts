import "server-only";

/** Asks the website to refresh cached content. Failures only delay the update, so they are logged, not thrown. */
export async function revalidateWeb() {
  const url = process.env.WEB_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!url || !secret) return;
  try {
    const res = await fetch(`${url}/api/revalidate`, { method: "POST", headers: { "x-revalidate-secret": secret } });
    if (!res.ok) console.warn(`[revalidate] website responded ${res.status}`);
  } catch (e) {
    console.warn("[revalidate] website not reachable:", (e as Error).message);
  }
}
