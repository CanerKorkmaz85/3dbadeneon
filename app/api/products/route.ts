import { NextResponse } from "next/server";
import { defaultProducts } from "../../../lib/admin-products";

export async function GET() {
  return NextResponse.json(defaultProducts, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT() {
  return NextResponse.json(
    { error: "Urun duzenleme yalnizca yerel editor uzerinden yapilir." },
    { status: 405 },
  );
}
