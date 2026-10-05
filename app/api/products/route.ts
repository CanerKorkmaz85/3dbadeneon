import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { defaultProducts, type AdminProduct } from "../../../lib/admin-products";

const runtime = env as unknown as {
  DB: typeof env.DB;
  ADMIN_PASSWORD?: string;
};

async function ensureTable() {
  await runtime.DB.prepare(
    `CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      price30 TEXT NOT NULL,
      price40 TEXT NOT NULL,
      price50 TEXT NOT NULL,
      special_price TEXT NOT NULL,
      remote_extra TEXT NOT NULL,
      description TEXT NOT NULL,
      technical TEXT NOT NULL,
      main_image TEXT NOT NULL,
      hover_images TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
  ).run();
}

function insertStatement(product: AdminProduct) {
  return runtime.DB.prepare(
    `INSERT INTO products (
      id, title, category, price30, price40, price50, special_price,
      remote_extra, description, technical, main_image, hover_images, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      category = excluded.category,
      price30 = excluded.price30,
      price40 = excluded.price40,
      price50 = excluded.price50,
      special_price = excluded.special_price,
      remote_extra = excluded.remote_extra,
      description = excluded.description,
      technical = excluded.technical,
      main_image = excluded.main_image,
      hover_images = excluded.hover_images,
      updated_at = CURRENT_TIMESTAMP`,
  ).bind(
    product.id,
    product.title,
    product.category,
    product.price30,
    product.price40,
    product.price50,
    product.specialPrice,
    product.remoteExtra,
    product.description,
    product.technical,
    product.mainImage,
    JSON.stringify(product.hoverImages || []),
  );
}

function rowToProduct(row: Record<string, unknown>): AdminProduct {
  let hoverImages: string[] = [];
  try {
    const parsed = JSON.parse(String(row.hover_images || "[]"));
    if (Array.isArray(parsed)) hoverImages = parsed.map(String);
  } catch {
    hoverImages = [];
  }

  return {
    id: String(row.id || ""),
    title: String(row.title || ""),
    category: String(row.category || ""),
    price30: String(row.price30 || ""),
    price40: String(row.price40 || ""),
    price50: String(row.price50 || ""),
    specialPrice: String(row.special_price || "Teklif Al"),
    remoteExtra: String(row.remote_extra || "250"),
    description: String(row.description || ""),
    technical: String(row.technical || ""),
    mainImage: String(row.main_image || ""),
    hoverImages,
  };
}

export async function GET() {
  await ensureTable();
  const result = await runtime.DB.prepare("SELECT * FROM products ORDER BY rowid ASC").all<Record<string, unknown>>();
  const rows = result.results || [];

  if (rows.length === 0) {
    await runtime.DB.batch(defaultProducts.map(insertStatement));
    return NextResponse.json(defaultProducts, {
      headers: { "Cache-Control": "no-store" },
    });
  }

  return NextResponse.json(rows.map(rowToProduct), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT(request: Request) {
  await ensureTable();

  if (!runtime.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Yönetim şifresi Cloudflare üzerinde tanımlı değil." },
      { status: 503 },
    );
  }

  if (request.headers.get("x-admin-password") !== runtime.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Yönetim şifresi hatalı." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const products = (Array.isArray(body) ? body : body?.products) as AdminProduct[] | undefined;

  if (!Array.isArray(products) || products.length > 250) {
    return NextResponse.json({ error: "Geçersiz ürün verisi." }, { status: 400 });
  }

  const validProducts = products.filter(
    (product) => product && typeof product.id === "string" && typeof product.title === "string",
  );

  await runtime.DB.prepare("DELETE FROM products").run();
  if (validProducts.length) await runtime.DB.batch(validProducts.map(insertStatement));

  return NextResponse.json({ ok: true, count: validProducts.length });
}
