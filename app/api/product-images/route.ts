import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";

function extensionFor(type: string) {
  if (type.includes("png")) return "png";
  if (type.includes("webp")) return "webp";
  if (type.includes("gif")) return "gif";
  return "jpg";
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const productId = String(formData.get("productId") || "urun")
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Görsel bulunamadı." }, { status: 400 });
  }

  const key = `${productId || "urun"}/${crypto.randomUUID()}.${extensionFor(file.type)}`;
  await env.PRODUCT_IMAGES.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || "image/jpeg" },
  });

  return NextResponse.json({ url: `/api/product-images/${key}` });
}
