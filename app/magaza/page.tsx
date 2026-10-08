"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { readAdminProducts, type AdminProduct } from "../../lib/admin-products";
import { originalPriceForDiscount } from "../../lib/pricing";

const categories = [
  "Astronot Koleksiyonu",
  "Berber & Kuaför",
  "Etkinlik & Organizasyon",
  "Ev Dekorasyon",
  "Gamer Koleksiyonu",
  "Kafe & Restoranlar",
  "Mağaza & Ofis",
  "Pop-Art",
  "Spor Salonu",
  "Takımlar",
  "Ek Malzemeler",
];

function matchesCategory(product: Pick<AdminProduct, "id" | "title" | "category">, category: string) {
  if (category === "Takımlar") return product.category === "Takımlar";
  if (category === "Astronot Koleksiyonu") return /astronot|smac/i.test(product.id);
  if (category === "Gamer Koleksiyonu") return /gamer/i.test(product.id);
  if (category === "Kafe & Restoranlar") return product.category === "Kafe & Restoranlar";
  if (category === "Pop-Art") return product.category === "Pop-Art";
  if (category === "Ev Dekorasyon") return product.category === "Ev Dekorasyon";
  if (category === "Spor Salonu") return /Smaç/.test(product.title) || product.category === "Spor Salonu";
  if (category === "Mağaza & Ofis") return product.category === "Mağaza & Ofis";
  return product.category === category;
}

async function loadProducts(): Promise<AdminProduct[]> {
  try {
    const response = await fetch(`/data/products.json?t=${Date.now()}`, { cache: "no-store" });
    if (response.ok) return (await response.json()) as AdminProduct[];
  } catch {}

  const fallback = await fetch(`/api/products?t=${Date.now()}`, { cache: "no-store" });
  if (!fallback.ok) throw new Error("Ürünler alınamadı.");
  return (await fallback.json()) as AdminProduct[];
}

export default function MagazaPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [, setCartCount] = useState(0);
  const [products, setProducts] = useState<AdminProduct[]>(readAdminProducts);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("kategori");
    if (requested && categories.includes(requested)) setSelectedCategory(requested);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const online = await loadProducts();
        if (!cancelled && Array.isArray(online)) setProducts(online);
      } catch {
        if (!cancelled) setProducts(readAdminProducts());
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const catalogProducts = products.map((product) => ({
    ...product,
    image: product.mainImage || "/products/catalog/comic-ouch.jpg",
    hoverImage: product.hoverImages?.[0] || "",
    href: `/urunler/${product.id}`,
  }));

  const visibleProducts = selectedCategory === "Tümü"
    ? catalogProducts
    : catalogProducts.filter((product) => matchesCategory(product, selectedCategory));

  return (
    <main className="magaza-page">
      <section className="all-products-section">
        <div className="all-products-heading"><span>Kategoriyi seç; ürünleri kolayca incele.</span></div>
        <div className="shop-category-bar">
          <button className={selectedCategory === "Tümü" ? "selected" : ""} onClick={() => setSelectedCategory("Tümü")}>Tümü</button>
          {categories.map((category) => (
            <button key={category} className={selectedCategory === category ? "selected" : ""} onClick={() => setSelectedCategory(category)}>{category}</button>
          ))}
        </div>
        <div className="all-product-status"><span>{selectedCategory === "Tümü" ? "Tüm ürünler" : selectedCategory}</span><b>{visibleProducts.length} ürün</b></div>
        {visibleProducts.length ? (
          <div className="all-product-grid">
            {visibleProducts.map((product) => {
              const salePrice = Number(product.price40 || 0);
              const originalPrice = originalPriceForDiscount(salePrice);

              return (
                <article className={`all-product-card ${["Köpek Mc Neon LED Duvar Dekoru", "Fenerbahçe Özel Seri Neon Logo", "Motorcu Kuru Kafa Neon LED"].includes(product.title) ? "dark-card-text" : ""}`} key={product.id}>
                  <Link href={product.href} className="all-product-image">
                    <Image unoptimized className="catalog-image-main" src={product.image} alt={product.title} width={900} height={1100} />
                    {product.hoverImage && <Image unoptimized className="catalog-image-hover" src={product.hoverImage} alt="" aria-hidden="true" width={900} height={1100} />}
                    <em className="discount-badge">-%20</em>
                  </Link>
                  <div>
                    <small>{product.category}</small>
                    <h2>{product.title}</h2>
                    <span className="product-price">
                      {originalPrice > 0 && <del>₺{originalPrice.toLocaleString("tr-TR")}</del>}
                      <b>{salePrice > 0 ? `₺${salePrice.toLocaleString("tr-TR")}` : "TEKLİF AL"}</b>
                    </span>
                    <button onClick={() => setCartCount((count) => count + 1)}>SEPETE EKLE +</button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-category"><b>{selectedCategory}</b><span>Bu kategoriye ait ürünleri yakında ekleyeceğiz.</span><button onClick={() => setSelectedCategory("Tümü")}>TÜM ÜRÜNLERİ GÖR</button></div>
        )}
      </section>
    </main>
  );
}
