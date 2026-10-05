import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { defaultProducts, type AdminProduct } from "../../../lib/admin-products";

const PRODUCTS_KEY = "products";

async function ensureTable() {
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS app_state (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
  ).run();
}

export async function GET() {
  await ensureTable();
  const row = await env.DB.prepare("SELECT value FROM app_state WHERE key = ?")
    .bind(PRODUCTS_KEY)
    .first<{ value: string }>();

  if (!row?.value) {
    const value = JSON.stringify(defaultProducts);
    await env.DB.prepare(
      `INSERT INTO app_state (key, value, updated_at)
       VALUES (?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`,
    )
      .bind(PRODUCTS_KEY, value)
      .run();
    return NextResponse.json(defaultProducts, { headers: { "Cache-Control": "no-store" } });
  }

  try {
    const products = JSON.parse(row.value) as AdminProduct[];
    return NextResponse.json(products, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(defaultProducts, { headers: { "Cache-Control": "no-store" } });
  }
}

export async function PUT(request: Request) {
  await ensureTable();
  const body = await request.json().catch(() => null);
  const products = Array.isArray(body) ? body : body?.products;

  if (!Array.isArray(products)) {
    return NextResponse.json({ error: "Geçersiz ürün verisi." }, { status: 400 });
  }

  const value = JSON.stringify(products);
  await env.DB.prepare(
    `INSERT INTO app_state (key, value, updated_at)
     VALUES (?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`,
  )
    .bind(PRODUCTS_KEY, value)
    .run();

  return NextResponse.json({ ok: true, count: products.length });
}
