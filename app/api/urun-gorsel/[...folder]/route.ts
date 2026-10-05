import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const imageFiles: Record<string, { ana: string; hover: string }> = {
  "astronot/ay": { ana: "ana.jpg", hover: "hover.jpg" },
  "astronot/cilekli": { ana: "ana.jpg", hover: "hover.jpg" },
  "astronot/savasci": { ana: "ana.jpg", hover: "hover.jpg" },
  "astronot/smac": { ana: "ana.jpg", hover: "hover.jpg" },
  "gamer/gamer-el": { ana: "ana.jpg", hover: "hover.jpg" },
  "gamer/oyun-kolu": { ana: "ana.jfif", hover: "hover.jpg" },
  "kafe-restoran/acik": { ana: "ana.jpg", hover: "hover.jpg" },
  "kafe-restoran/dondurma": { ana: "ana.jpg", hover: "hover.JPG" },
  "kafe-restoran/hamburger": { ana: "ana.jfif", hover: "hover.jpg" },
  "kafe-restoran/kapali": { ana: "ana.jpg", hover: "hover.jpg" },
  "kafe-restoran/pizza": { ana: "ana.jpg", hover: "hover.jpg" },
  "pop-art/dolar-kesesi": { ana: "ana.jpg", hover: "hover.JPG" },
  "pop-art/kopek-kafa": { ana: "ana.jpg", hover: "hover.jpg" },
  "pop-art/kopek-mc": { ana: "ana.jpg", hover: "hover.jpg" },
  "pop-art/kopek-patron": { ana: "ana.jpg", hover: "hover.jpg" },
  "pop-art/kuru-kafa-papatya": { ana: "ana.jpg", hover: "hover.jpg" },
  "pop-art/motorcu-kuru-kafa": { ana: "ana.jpg", hover: "hover.jpg" },
  "pop-art/ouch": { ana: "ana.jpg", hover: "hover.jpg" },
  "pop-art/tropikal-kuru-kafa": { ana: "ana.jpg", hover: "hover.jpg" },
  "takimlar/besiktas": { ana: "ana.jpg", hover: "hover.jpg" },
  "takimlar/fenerbahce": { ana: "ana.png", hover: "hover.jpg" },
  "takimlar/galatasaray": { ana: "ana.jpg", hover: "hover.jpg" },
  "takimlar/trabzonspor": { ana: "ana.jpg", hover: "hover.JPG" },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ folder: string[] }> },
) {
  const { folder: requestedPath } = await params;
  const queriedKind = request.nextUrl.searchParams.get("tur");
  const lastPart = requestedPath.at(-1) ?? "";
  const requestedKind = queriedKind ?? lastPart.replace(/\.[^.]+$/, "");
  const kind = requestedKind.toLowerCase();
  const folderParts = queriedKind ? requestedPath : requestedPath.slice(0, -1);

  if (
    (kind !== "ana" && kind !== "hover") ||
    !folderParts.length ||
    folderParts.some((part) => !/^[a-z0-9-]+$/.test(part))
  ) {
    return new Response("Görsel bulunamadı.", { status: 404 });
  }

  const folderKey = folderParts.join("/");
  const files = imageFiles[folderKey];
  const fileName = files?.[kind as "ana" | "hover"];

  if (!fileName) {
    return new Response("Görsel bulunamadı.", { status: 404 });
  }

  const staticUrl = new URL(
    `/urun-gorselleri/${folderKey}/${fileName}`,
    request.url,
  );
  return Response.redirect(staticUrl, 307);
}
