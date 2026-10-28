"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useState } from "react";
import FormattedProductCopy from "../../../components/FormattedProductCopy";
import { defaultSizeOptions, technicalTemplates, type ProductSizeOption, type ProductType } from "../../../lib/admin-products";

type ProductPreview = {
  title: string;
  category: string;
  productType: ProductType;
  sizesEnabled: boolean;
  sizeOptions: ProductSizeOption[];
  remoteEnabled: boolean;
  price30: string;
  price40: string;
  price50: string;
  specialPrice: string;
  remoteExtra: string;
  description: string;
  technical?: string;
  mainPreview: string;
  hoverPreviews?: string[];
};

const empty: ProductPreview = {
  title: "Ürün adı",
  category: "Kategorisi",
  productType: "Neon",
  sizesEnabled: true,
  sizeOptions: defaultSizeOptions("Neon"),
  remoteEnabled: true,
  price30: "",
  price40: "",
  price50: "",
  specialPrice: "Teklif al",
  remoteExtra: "250",
  description: "Ürün açıklaması henüz girilmedi.",
  technical: technicalTemplates.Neon,
  mainPreview: "",
};

export default function ProductPreviewPage() {
  const [product] = useState<ProductPreview>(() => {
    if (typeof window === "undefined") return empty;
    try {
      const saved =
        window.sessionStorage.getItem("3dbade-product-preview") ||
        window.localStorage.getItem("3dbade-product-preview");
      if (!saved) return empty;
      const parsed = { ...empty, ...JSON.parse(saved) } as ProductPreview;
      return {
        ...parsed,
        sizeOptions: Array.isArray(parsed.sizeOptions) && parsed.sizeOptions.length
          ? parsed.sizeOptions
          : [
              { label: "30 cm", price: parsed.price30 },
              { label: "40 cm", price: parsed.price40 },
              { label: "50 cm", price: parsed.price50 },
              { label: "Özel ölçü", price: parsed.specialPrice },
            ],
      };
    } catch {
      return empty;
    }
  });

  const images = [product.mainPreview, ...(product.hoverPreviews || [])].filter(Boolean);
  const [imageIndex, setImageIndex] = useState(0);
  const [size, setSize] = useState(product.sizeOptions[0]?.label || "");
  const [remote, setRemote] = useState("Kumandalı");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedSize = product.sizeOptions.find((option) => option.label === size);
  const basePrice = Number(product.sizesEnabled ? selectedSize?.price : product.specialPrice);
  const shownPrice =
    !basePrice
      ? null
      : (basePrice +
          (product.remoteEnabled && remote === "Kumandalı" ? Number(product.remoteExtra || 0) : 0)) *
        quantity;

  const technicalSpecs = (product.technical || "")
    .split("\n\n")
    .filter(Boolean)
    .map((item) => {
      const [heading, ...detail] = item.split("\n");
      return { heading, detail: detail.join(" ") };
    });

  return (
    <main className="product-page">
      <div className="product-breadcrumb">
        <Link href="/">Ana Sayfa</Link><span>›</span>
        <Link href="/magaza">{product.category}</Link><span>›</span>
        <b>{product.title}</b>
      </div>

      <section className="product-main">
        <div className="product-gallery">
          <div className="product-thumbnails">
            {images.length ? images.map((image, index) => (
              <button key={`${image.slice(0, 50)}-${index}`} className={imageIndex === index ? "selected" : ""} onClick={() => setImageIndex(index)} aria-label={`${index + 1}. görseli göster`}>
                <img src={image} alt="" />
              </button>
            )) : <button className="selected">—</button>}
          </div>
          <div className="product-image">
            {images[imageIndex] ? <img src={images[imageIndex]} alt={product.title} /> : <span>Görsel seçilmedi</span>}
          </div>
        </div>

        <div className="product-details">
          <p>{product.category}</p>
          <h1>{product.title}</h1>
          <div className="product-stars"><span>★★★★★</span><small>Yeni ürün · 3Dbade özel seri</small></div>
          <div className="product-price">
            <strong>{shownPrice ? `₺${shownPrice.toLocaleString("tr-TR")}` : "TEKLİF AL"}</strong>
            <small>{!basePrice ? "Bu ürün için sana özel teklif hazırlanır" : "KDV dahil · Ücretsiz kargo"}</small>
          </div>

          {product.sizesEnabled && product.sizeOptions.length > 0 && <div className="product-choice">
            <b>Boyut <small>{size}</small></b>
            <div>{product.sizeOptions.map((option, index) => <button key={`${option.label}-${index}`} className={size === option.label ? "selected" : ""} onClick={() => setSize(option.label)}>{option.label}</button>)}</div>
          </div>}

          {product.remoteEnabled && <div className="product-choice">
            <b>Kumanda <small>{remote}</small></b>
            <div>{["Kumandalı", "Kumandasız"].map((option) => <button key={option} className={remote === option ? "selected" : ""} onClick={() => setRemote(option)}>{option}</button>)}</div>
            <small className="remote-price-note">Kumandalı seçeneği: +₺{Number(product.remoteExtra || 0).toLocaleString("tr-TR")}</small>
          </div>}

          <div className="product-actions">
            <div className="quantity">
              <button onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button>
              <b>{quantity}</b>
              <button onClick={() => setQuantity((value) => value + 1)}>+</button>
            </div>
            <button className="product-add" onClick={() => setAdded(true)}>SEPETE EKLE +</button>
          </div>
          {added && <div className="product-added">{product.title} sepetine eklendi.</div>}
          <div className="product-promises"><span>✓ 2 yıl garanti</span><span>✓ Güvenli paketleme</span><span>✓ Türkiye&apos;nin her yerine kargo</span></div>
        </div>
      </section>

      <section className="product-description product-description-specs-only">
        <div className="product-specs">
          <h3>Teknik özellikler</h3>
          <dl>{technicalSpecs.map((item) => <div key={item.heading}><dt>{item.heading}</dt><dd>{item.detail}</dd></div>)}</dl>
        </div>
      </section>

      <section className="product-content-area product-full-description">
        <div className="product-copy-preview"><FormattedProductCopy content={product.description} /></div>
      </section>
    </main>
  );
}
