"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import FormattedProductCopy from "../../../components/FormattedProductCopy";
import { createEmptyProduct, readAdminProducts, type AdminProduct } from "../../../lib/admin-products";

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
        const response = await fetch(`/api/products?t=${Date.now()}`, { cache: "no-store" });
        if (!response.ok) throw new Error("Ürün verisi alınamadı.");
        const products = (await response.json()) as AdminProduct[];
        const found = products.find((item) => item.id === params.id) || null;
        if (!cancelled) setProduct(found);
      } catch {
        const fallback = readAdminProducts().find((item) => item.id === params.id) || null;
        if (!cancelled) setProduct(fallback);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const images = useMemo(() => product ? [product.mainImage, ...product.hoverImages].filter(Boolean) : [], [product]);
  const prices = product ? { "30 cm": product.price30, "40 cm": product.price40, "50 cm": product.price50 } : {};
  const basePrice = Number(prices[size as keyof typeof prices]);
  const total = basePrice > 0 ? (basePrice + (remote === "Kumandalı" ? Number(product?.remoteExtra || 0) : 0)) * quantity : null;
  const specs = (product?.technical || createEmptyProduct().technical).split("\n\n").filter(Boolean).map((item) => {
    const [heading, ...detail] = item.split("\n");
    return { heading, detail: detail.join(" ") };
  });

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
          <div className="product-choice"><b>Boyut <small>{size}</small></b><div>{["30 cm", "40 cm", "50 cm", "Özel"].map((option) => <button key={option} className={size === option ? "selected" : ""} onClick={() => setSize(option)}>{option}</button>)}</div></div>
          <div className="product-choice"><b>Kumanda <small>{remote}</small></b><div>{["Kumandalı", "Kumandasız"].map((option) => <button key={option} className={remote === option ? "selected" : ""} onClick={() => setRemote(option)}>{option}</button>)}</div><small className="remote-price-note">Kumandalı seçeneği: +₺{Number(product.remoteExtra || 0).toLocaleString("tr-TR")}</small></div>
          <div className="product-actions"><div className="quantity"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button><b>{quantity}</b><button onClick={() => setQuantity((value) => value + 1)}>+</button></div><button className="product-add">SEPETE EKLE +</button></div>
        </div>
      </section>
      <section className="product-description product-description-specs-only"><div className="product-specs"><h3>Teknik özellikler</h3><dl>{specs.map((item) => <div key={item.heading}><dt>{item.heading}</dt><dd>{item.detail}</dd></div>)}</dl></div></section>
      <section className="product-content-area product-full-description"><div className="product-copy-preview"><FormattedProductCopy content={product.description || "Ürün açıklaması yakında eklenecek."} /></div></section>
    </main>
  );
}
