"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import FormattedProductCopy from "../../../components/FormattedProductCopy";
import { createEmptyProduct, normalizeAdminProduct, readAdminProducts, type AdminProduct } from "../../../lib/admin-products";
import { addToCart } from "../../../lib/cart";

async function loadProducts(): Promise<AdminProduct[]> {
  try {
    const response = await fetch(`/data/products.json?t=${Date.now()}`, { cache: "no-store" });
    if (response.ok) return ((await response.json()) as AdminProduct[]).map(normalizeAdminProduct);
  } catch {}

  const fallback = await fetch(`/api/products?t=${Date.now()}`, { cache: "no-store" });
  if (!fallback.ok) throw new Error("Ürün verisi alınamadı.");
  return ((await fallback.json()) as AdminProduct[]).map(normalizeAdminProduct);
}

export default function ManagedProductPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [size, setSize] = useState("30 cm");
  const [remote, setRemote] = useState("Kumandalı");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const products = await loadProducts();
        const found = products.find((item) => item.id === params.id) || null;
        if (!cancelled) {
          const normalized = found ? normalizeAdminProduct(found) : null;
          setProduct(normalized);
          setSize(normalized?.sizeOptions[0]?.label || "");
          setRemote(normalized?.remoteEnabled ? "Kumandalı" : "Kumandasız");
        }
      } catch {
        const fallback = readAdminProducts().find((item) => item.id === params.id) || null;
        if (!cancelled) {
          const normalized = fallback ? normalizeAdminProduct(fallback) : null;
          setProduct(normalized);
          setSize(normalized?.sizeOptions[0]?.label || "");
          setRemote(normalized?.remoteEnabled ? "Kumandalı" : "Kumandasız");
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [params.id]);

  const images = useMemo(() => product ? [product.mainImage, ...product.hoverImages].filter(Boolean) : [], [product]);
  const selectedSize = product?.sizeOptions.find((option) => option.label === size);
  const basePrice = Number(product?.sizesEnabled ? selectedSize?.price : product?.specialPrice);
  const remotePrice = product?.remoteEnabled && remote === "Kumandalı" ? Number(product.remoteExtra || 0) : 0;
  const total = basePrice > 0 ? (basePrice + remotePrice) * quantity : null;
  const specs = (product?.technical || createEmptyProduct().technical).split("\n\n").filter(Boolean).map((item) => {
    const [heading, ...detail] = item.split("\n");
    return { heading, detail: detail.join(" ") };
  });
function handleAddToCart() {
  if (!product) return;
  try {
    addToCart({
      id: product.id,
      title: product.title,
      image: product.mainImage,
      size: size || "Standart",
      remote: product.remoteEnabled ? remote : "",
      quantity,
      unitPrice: basePrice > 0 ? basePrice + remotePrice : null,
    });
    window.location.assign("/odeme");
  } catch {
    window.alert("Sepet kaydedilemedi. Tarayıcı depolama izinlerini kontrol et.");
  }
}

  if (!product) return <main className="product-page product-not-found"><h1>Ürün bulunamadı.</h1><Link href="/magaza">TÜM ÜRÜNLERE DÖN</Link></main>;

  return (
    <main className="product-page">
      <div className="product-breadcrumb"><Link href="/">Ana Sayfa</Link><span>›</span><Link href="/magaza">{product.category}</Link><span>›</span><b>{product.title}</b></div>
      <section className="product-main">
        <div className="product-gallery">
          <div className="product-thumbnails">{images.map((image, index) => <button key={`${image}-${index}`} className={imageIndex === index ? "selected" : ""} onClick={() => setImageIndex(index)} aria-label={`${index + 1}. görseli göster`}><img src={image} alt="" /></button>)}</div>
          <div className="product-image">{images[imageIndex] ? <img src={images[imageIndex]} alt={product.title} /> : <span>Görsel eklenmedi</span>}</div>
        </div>
        <div className="product-details">
          <p>{product.category}</p><h1>{product.title}</h1>
          <div className="product-stars"><span>★★★★★</span><small>Yeni ürün · 3Dbade özel seri</small></div>
          <div className="product-price"><strong>{total ? `₺${total.toLocaleString("tr-TR")}` : "TEKLİF AL"}</strong><small>KDV dahil · Ücretsiz kargo</small></div>
          {product.sizesEnabled && product.sizeOptions.length > 0 && <div className="product-choice"><b>Boyut <small>{size}</small></b><div>{product.sizeOptions.map((option, index) => <button key={`${option.label}-${index}`} className={size === option.label ? "selected" : ""} onClick={() => setSize(option.label)}>{option.label}</button>)}</div></div>}
          {product.remoteEnabled && <div className="product-choice"><b>Kumanda <small>{remote}</small></b><div>{["Kumandalı", "Kumandasız"].map((option) => <button key={option} className={remote === option ? "selected" : ""} onClick={() => setRemote(option)}>{option}</button>)}</div><small className="remote-price-note">Kumandalı seçeneği: +₺{Number(product.remoteExtra || 0).toLocaleString("tr-TR")}</small></div>}
          <div className="product-actions">
  <div className="quantity">
    <button onClick={() => setQuantity((value) => Math.max(1, value - 1))}>-</button>
    <b>{quantity}</b>
    <button onClick={() => setQuantity((value) => value + 1)}>+</button>
  </div>
  <button type="button" className="product-add" onClick={handleAddToCart}>
    SEPETE EKLE +
  </button>
</div>
        </div>
      </section>
      <section className="product-description product-description-specs-only"><div className="product-specs"><h3>Teknik özellikler</h3><dl>{specs.map((item) => <div key={item.heading}><dt>{item.heading}</dt><dd>{item.detail}</dd></div>)}</dl></div></section>
      <section className="product-content-area product-full-description"><div className="product-copy-preview"><FormattedProductCopy content={product.description || "Ürün açıklaması yakında eklenecek."} /></div></section>
    </main>
  );
}
