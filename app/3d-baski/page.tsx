"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  normalizeAdminProduct,
  readAdminProducts,
  type AdminProduct,
} from "../../lib/admin-products";

async function loadProducts(): Promise<AdminProduct[]> {
  try {
    const response = await fetch(`/data/products.json?t=${Date.now()}`, {
      cache: "no-store",
    });
    if (response.ok) {
      return ((await response.json()) as AdminProduct[]).map(normalizeAdminProduct);
    }
  } catch {}
  return readAdminProducts();
}

function startingPrice(product: AdminProduct) {
  const prices = product.sizeOptions.map((option) => Number(option.price));
  const validPrices = prices.filter((price) => price > 0);
  return validPrices.length ? Math.min(...validPrices) : null;
}

export default function ThreeDPrintingPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadProducts().then((items) => {
      if (!cancelled) {
        setProducts(items.filter((item) => item.productType === "3D Maket"));
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="service-page magaza-page">
      <section className="service-hero service-hero-3d">
        <p>3D BASKI</p>
        <h1>Fikirlerinizi üç boyutlu üretelim.</h1>
        <span>
          Figür, dekoratif obje ve özel projeleriniz; ihtiyacınıza göre farklı
          ölçü ve renk seçenekleriyle üretilir.
        </span>
      </section>

      <section className="all-products-section service-catalog-section">
        <div className="all-products-heading">
          <h2>3D Baskı Ürünleri</h2>
          <span>Ürünü seçin, ayrıntılarını inceleyin ve siparişinizi oluşturun.</span>
        </div>
        <div className="all-product-status">
          <span>Tüm 3D Baskı Ürünleri</span>
          <b>{products.length} ürün</b>
        </div>

        {products.length ? (
          <div className="all-product-grid">
            {products.map((product) => {
              const href = `/urunler/${product.id}`;
              const price = startingPrice(product);
              return (
                <article className="all-product-card" key={product.id}>
                  <Link href={href} className="all-product-image">
                    <Image
                      unoptimized
                      className="catalog-image-main"
                      src={product.mainImage}
                      alt={product.title}
                      width={900}
                      height={1100}
                    />
                    {product.hoverImages[0] && (
                      <Image
                        unoptimized
                        className="catalog-image-hover"
                        src={product.hoverImages[0]}
                        alt=""
                        aria-hidden="true"
                        width={900}
                        height={1100}
                      />
                    )}
                  </Link>
                  <div>
                    <small>3D Baskı</small>
                    <h2><Link href={href}>{product.title}</Link></h2>
                    <span className="product-price">
                      <b>{price ? `₺${price.toLocaleString("tr-TR")}` : "TEKLİF AL"}</b>
                    </span>
                    <Link href={href} className="service-primary-link">
                      ÜRÜNÜ İNCELE →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-category">
            <b>3D Baskı Ürünleri</b>
            <span>Ürünler yükleniyor.</span>
          </div>
        )}
      </section>
    </main>
  );
}
