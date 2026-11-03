"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { AdminProduct } from "../../lib/admin-products";

function normalize(value: string) {
  return value.toLocaleLowerCase("tr-TR").replace(/ı/g, "i")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const pages = [
  { title: "3D Baskı", href: "/3d-baski", text: "3d maket kişiye özel üretim" },
  { title: "Neon LED", href: "/magaza", text: "neon led dekor tabela" },
  { title: "Tabela Sistemleri", href: "/tabela-sistemleri", text: "kutu harf tabela" },
  { title: "Paslanmaz & Metal", href: "/paslanmaz-metal", text: "paslanmaz metal" },
  { title: "Kendin Tasarla", href: "/tasarla", text: "özel tasarım neon yazı" },
  { title: "İletişim", href: "/iletisim", text: "iletişim teklif sipariş" },
  { title: "Sık Sorulan Sorular", href: "/#sss", text: "kargo garanti montaj teslimat" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    setQuery(new URLSearchParams(window.location.search).get("q") || "");
    async function load() {
      for (const url of ["/data/products.json", "/api/products"]) {
        try {
          const response = await fetch(url, { cache: "no-store" });
          if (!response.ok) throw new Error();
          const data = await response.json();
          if (!Array.isArray(data)) throw new Error();
          if (!cancelled) {
            setProducts(data);
            setStatus("ready");
          }
          return;
        } catch {}
      }
      if (!cancelled) setStatus("error");
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const words = normalize(query.trim()).split(/\s+/).filter(Boolean);
  const matches = (value: string) =>
    words.every((word) => normalize(value).includes(word));

  const results = words.length ? products.filter((product) =>
    matches([
      product.title, product.category, product.productType,
      product.productType === "3D Maket" ? "3D Baskı" : "",
      product.description, product.technical,
    ].filter(Boolean).join(" "))
  ) : [];

  const pageResults = words.length
    ? pages.filter((page) => matches(page.title + " " + page.text))
    : [];

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "35px 20px 60px" }}>
      <h1>Sitede Ara</h1>
      <form action="/arama" role="search" style={{ display: "flex", gap: 8, margin: "24px 0" }}>
        <input name="q" aria-label="Ürün veya sayfa ara"
          placeholder="Ürün veya kategori yaz..." value={query}
          onChange={(event) => setQuery(event.target.value)} autoFocus
          style={{ flex: 1, minWidth: 0, padding: 14, border: "1px solid #ccc", borderRadius: 8, fontSize: 16 }} />
        <button type="submit" style={{ padding: "12px 22px", background: "#087ed5", color: "#fff", border: 0, borderRadius: 8, cursor: "pointer" }}>Ara</button>
      </form>
      {!words.length && <p>Neon, 3D baskı, tabela ve paslanmaz ürünlerde arama yapabilirsin.</p>}
      {status === "loading" && <p role="status">Ürünler yükleniyor...</p>}
      {status === "error" && <p role="alert">Ürünler yüklenemedi. Sayfayı yenileyerek tekrar dene.</p>}
      {pageResults.length > 0 && (
        <nav aria-label="Bulunan sayfalar" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
          {pageResults.map((page) => (
            <Link key={page.href} href={page.href} style={{ padding: "10px 14px", border: "1px solid #087ed5", borderRadius: 8 }}>{page.title}</Link>
          ))}
        </nav>
      )}
      {words.length > 0 && status === "ready" && (
        <p aria-live="polite">{results.length ? `${results.length} ürün bulundu.` : "Aramana uygun ürün bulunamadı."}</p>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: 20 }}>
        {results.map((product) => (
          <Link key={product.id} href={`/urunler/${product.id}`} style={{ color: "inherit", textDecoration: "none", border: "1px solid #ddd", borderRadius: 12, overflow: "hidden" }}>
            {product.mainImage && (
              <img src={product.mainImage} alt={product.title} loading="lazy" style={{ width: "100%", height: 220, objectFit: "contain", background: "#fff" }} />
            )}
            <div style={{ padding: 16 }}>
              <small>{product.category}</small>
              <h2 style={{ fontSize: 17, margin: "8px 0" }}>{product.title}</h2>
              <span style={{ color: "#087ed5" }}>Ürünü incele →</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}