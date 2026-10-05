import { readdir, readFile, stat } from "fs/promises";
import path from "path";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".jfif", ".webp"]);
const contentTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".jfif": "image/jpeg",
  ".webp": "image/webp",
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ folder: string[] }> }) {
  const { folder: requestedPath } = await params;
  const queriedKind = request.nextUrl.searchParams.get("tur");
  const lastPart = requestedPath.at(-1) ?? "";
  const kind = queriedKind ?? path.basename(lastPart, path.extname(lastPart)).toLowerCase();
  const folder = queriedKind ? requestedPath : requestedPath.slice(0, -1);

  if ((kind !== "ana" && kind !== "hover") || !folder.length || folder.some((part) => !/^[a-z0-9-]+$/.test(part))) {
    return new Response("Görsel bulunamadı.", { status: 404 });
  }

  try {
    const targetFolder = path.join(process.cwd(), "public", "urun-gorselleri", ...folder);
    const files = await readdir(targetFolder);
    const candidates = files.filter((file) => {
      const extension = path.extname(file).toLowerCase();
      return path.parse(file).name.toLowerCase() === kind && imageExtensions.has(extension);
    });

    const newest = (await Promise.all(candidates.map(async (file) => ({ file, info: await stat(path.join(targetFolder, file)) }))))
      .sort((first, second) => second.info.mtimeMs - first.info.mtimeMs)[0];

    if (!newest) return new Response("Görsel bulunamadı.", { status: 404 });

    const extension = path.extname(newest.file).toLowerCase();
    const image = await readFile(path.join(targetFolder, newest.file));
    return new Response(image, { headers: { "Content-Type": contentTypes[extension], "Cache-Control": "no-store, max-age=0" } });
  } catch {
    return new Response("Görsel bulunamadı.", { status: 404 });
  }
}
