import JSZip from "jszip";
import { getMedia } from "@/lib/data";

/** "attachment" so the browser saves the file instead of opening it (images live on the API's domain). */
const attachment = (name: string) => `attachment; filename="${name.replace(/[^\x20-\x7e]|"/g, "_")}"; filename*=UTF-8''${encodeURIComponent(name)}`;

const fileName = (src: string, i: number) => decodeURIComponent(src.split("?")[0].split("/").pop() || "") || `image-${i + 1}.jpg`;

/**
 * Downloads a media item's images: one image with ?i=<index>, otherwise all of them as a zip.
 * Only images listed on that media item are served.
 */
export async function GET(request: Request, ctx: RouteContext<"/api/media/[slug]/download">) {
  const { slug } = await ctx.params;
  const media = await getMedia("th", slug);
  if (!media?.images.length) return new Response("Not found", { status: 404 });

  const reqUrl = new URL(request.url);
  const load = (src: string) => fetch(new URL(src, reqUrl.origin));

  const index = reqUrl.searchParams.get("i");
  if (index !== null) {
    const i = Number(index);
    const src = Number.isInteger(i) ? media.images[i] : undefined;
    if (!src) return new Response("Not found", { status: 404 });
    const res = await load(src);
    if (!res.ok || !res.body) return new Response("Image unavailable", { status: 502 });
    return new Response(res.body, {
      headers: { "Content-Type": res.headers.get("content-type") ?? "application/octet-stream", "Content-Disposition": attachment(fileName(src, i)) },
    });
  }

  const zip = new JSZip();
  const files = await Promise.all(
    media.images.map(async (src, i) => {
      const res = await load(src);
      return res.ok ? { name: `${String(i + 1).padStart(2, "0")}-${fileName(src, i)}`, data: await res.arrayBuffer() } : null;
    }),
  );
  for (const f of files) if (f) zip.file(f.name, f.data);
  if (!Object.keys(zip.files).length) return new Response("Images unavailable", { status: 502 });

  const body = await zip.generateAsync({ type: "arraybuffer" });
  return new Response(body, { headers: { "Content-Type": "application/zip", "Content-Disposition": attachment(`${slug}.zip`) } });
}
