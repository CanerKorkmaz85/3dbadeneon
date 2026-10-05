"use client";

/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from "react";
import FormattedProductCopy, {
  productCopyHtml,
  sanitizeProductHtml,
} from "../../../components/FormattedProductCopy";
import {
  productId,
  readAdminProducts,
  type AdminProduct,
  writeAdminProducts,
} from "../../../lib/admin-products";

const categories = [
  "Takımlar",
  "İşletme Neonları",
  "Pop-Art",
  "Kafe & Restoranlar",
  "Berber & Kuaför",
  "Mağaza & Ofis",
  "Spor Salonu",
  "Etkinlik & Organizasyon",
  "Ev Dekorasyon",
  "Ek Malzemeler",
];

const technicalTemplate = `Ölçü\n30, 40, 50 cm veya özel ölçü\n\nMalzeme\n4 mm şeffaf, kontur kesim pleksi\n\nAydınlatma\n12V esnek silikon neon LED\n\nKablo\nYaklaşık 2 metre\n\nPaket içeriği\nNeon dekor ve 12V adaptör`;

type Draft = {
  title: string;
  category: string;
  price30: string;
  price40: string;
  price50: string;
  specialPrice: string;
  remoteExtra: string;
  description: string;
  technical: string;
  mainImage: string;
  hoverImages: string[];
};

const emptyDraft: Draft = {
  title: "",
  category: categories[0],
  price30: "",
  price40: "",
  price50: "",
  specialPrice: "Teklif al",
  remoteExtra: "250",
  description: "",
  technical: technicalTemplate,
  mainImage: "",
  hoverImages: [],
};

export default function ProductEntryPage() {
  const [products, setProducts] = useState<AdminProduct[]>(readAdminProducts);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const update = (field: keyof Draft, value: string) =>
    setDraft((current) => ({ ...current, [field]: value }));

  function currentDescription() {
    return sanitizeProductHtml(descriptionRef.current?.innerHTML || draft.description || "");
  }

  function saveDraft() {
    if (!draft.title.trim()) return;
    const id = selectedId || productId(draft.title);
    const product: AdminProduct = {
      ...draft,
      description: currentDescription(),
      id,
      title: draft.title.trim(),
      hoverImages: draft.hoverImages || [],
    };
    const next = selectedId
      ? products.map((item) => (item.id === id ? product : item))
      : [...products, product];
    setProducts(next);
    setSelectedId(id);
    setDraft(product);
    writeAdminProducts(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  function selectProduct(product: AdminProduct) {
    setSelectedId(product.id);
    setDraft({ ...product, hoverImages: product.hoverImages || [] });
  }

  function newProduct() {
    setSelectedId(null);
    setDraft(emptyDraft);
  }

  function deleteProduct() {
    const product = products.find((item) => item.id === selectedId);
    if (!product || !window.confirm(`“${product.title}” silinsin mi?`)) return;
    const next = products.filter((item) => item.id !== product.id);
    setProducts(next);
    writeAdminProducts(next);
    newProduct();
  }

  function openPreview() {
    const description = currentDescription();
    window.localStorage.setItem(
      "3dbade-product-preview",
      JSON.stringify({
        ...draft,
        description,
        mainPreview: draft.mainImage,
        hoverPreviews: draft.hoverImages,
      }),
    );
    window.open("/yonetim/urun-onizleme", "_blank");
  }

  async function copyDetails() {
    const description = descriptionRef.current?.innerText || draft.description || "-";
    const content = `ÜRÜN ADI: ${draft.title || "-"}\nKATEGORİ: ${draft.category}\n30 CM: ${draft.price30 || "-"}\n40 CM: ${draft.price40 || "-"}\n50 CM: ${draft.price50 || "-"}\nÖZEL ÖLÇÜ: ${draft.specialPrice || "Teklif al"}\nKUMANDALI EK FİYAT: ${draft.remoteExtra || "0"} TL\n\nÜRÜN AÇIKLAMASI\n${description}\n\nTEKNİK ÖZELLİKLER\n${draft.technical}`;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }

  function formatText(command: string, value?: string) {
    descriptionRef.current?.focus();
    document.execCommand(command, false, value);
  }

  function readImage(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const source = String(reader.result || "");
        const image = new Image();
        image.onload = () => {
          const limit = 1400;
          const scale = Math.min(1, limit / Math.max(image.width, image.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(image.width * scale);
          canvas.height = Math.round(image.height * scale);
          const context = canvas.getContext("2d");
          if (!context) return resolve(source);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        image.onerror = () => reject(new Error("Görsel okunamadı."));
        image.src = source;
      };
      reader.onerror = () => reject(new Error("Görsel okunamadı."));
      reader.readAsDataURL(file);
    });
  }

  async function preview(files: FileList | null, target: "main" | "hover") {
    if (!files?.length) return;
    const images = await Promise.all(Array.from(files).map(readImage));
    if (target === "main") {
      setDraft((current) => ({ ...current, mainImage: images[0] }));
      return;
    }
    setDraft((current) => ({
      ...current,
      hoverImages: [...(current.hoverImages || []), ...images],
    }));
  }

  function removeMainImage() {
    setDraft((current) => ({ ...current, mainImage: "" }));
  }

  function removeHoverImage(index: number) {
    setDraft((current) => ({
      ...current,
      hoverImages: current.hoverImages.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function makeMainImage(index: number) {
    setDraft((current) => {
      const selected = current.hoverImages[index];
      if (!selected) return current;
      const remaining = current.hoverImages.filter((_, itemIndex) => itemIndex !== index);
      const nextHover = current.mainImage ? [current.mainImage, ...remaining] : remaining;
      return { ...current, mainImage: selected, hoverImages: nextHover };
    });
  }

  function moveHover(index: number, direction: -1 | 1) {
    setDraft((current) => {
      const next = [...current.hoverImages];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...current, hoverImages: next };
    });
  }

  const imageButtonStyle = {
    padding: "8px 10px",
    borderRadius: "8px",
    border: "1px solid #d5d5d5",
    background: "white",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "12px",
  } as const;

  const toolbarButtonStyle = {
    padding: "7px 10px",
    border: "1px solid #ccc",
    borderRadius: 7,
    background: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  } as const;

  return (
    <main className="product-entry-page">
      <section className="product-entry-heading">
        <p>ÜRÜN YÖNETİMİ</p>
        <h1>Ürünlerini yönet.</h1>
        <span>Yeni ürün ekle, mevcut ürünü değiştir, görselleri sırala veya sil.</span>
      </section>

      <section className="product-entry-grid product-management-grid">
        <aside className="managed-products">
          <div>
            <b>Mevcut ürünler</b>
            <button onClick={newProduct}>+ YENİ ÜRÜN</button>
          </div>
          <small>{products.length} ürün kayıtlı</small>
          <div className="managed-products-list">
            {products.map((product) => (
              <button
                className={selectedId === product.id ? "selected" : ""}
                key={product.id}
                onClick={() => selectProduct(product)}
              >
                <b>{product.title}</b>
                <span>{product.category}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="entry-form">
          <div className="entry-form-title">
            <b>{selectedId ? "ÜRÜNÜ DÜZENLİYORSUN" : "YENİ ÜRÜN"}</b>
            {selectedId && <button onClick={deleteProduct}>ÜRÜNÜ SİL</button>}
          </div>

          <label>Ürün adı<input value={draft.title} onChange={(event) => update("title", event.target.value)} /></label>
          <label>Kategori<select value={draft.category} onChange={(event) => update("category", event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>

          <div className="entry-prices">
            <label>30 cm fiyatı<input inputMode="numeric" value={draft.price30} onChange={(event) => update("price30", event.target.value)} /></label>
            <label>40 cm fiyatı<input inputMode="numeric" value={draft.price40} onChange={(event) => update("price40", event.target.value)} /></label>
            <label>50 cm fiyatı<input inputMode="numeric" value={draft.price50} onChange={(event) => update("price50", event.target.value)} /></label>
            <label>Özel ölçü<input value={draft.specialPrice} onChange={(event) => update("specialPrice", event.target.value)} /></label>
          </div>

          <label>Kumandalı ek fiyatı<input inputMode="numeric" value={draft.remoteExtra} onChange={(event) => update("remoteExtra", event.target.value)} /></label>

          <div className="entry-description-editor">
            <label>Ürün açıklaması</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "9px", border: "1px solid #ddd", borderBottom: 0, borderRadius: "10px 10px 0 0", background: "#f8f8f8" }}>
              <button type="button" style={toolbarButtonStyle} onMouseDown={(e) => e.preventDefault()} onClick={() => formatText("bold")}>B</button>
              <button type="button" style={{ ...toolbarButtonStyle, fontStyle: "italic" }} onMouseDown={(e) => e.preventDefault()} onClick={() => formatText("italic")}>I</button>
              <button type="button" style={{ ...toolbarButtonStyle, textDecoration: "underline" }} onMouseDown={(e) => e.preventDefault()} onClick={() => formatText("underline")}>U</button>
              <select defaultValue="p" onChange={(e) => formatText("formatBlock", e.target.value)} style={{ padding: "7px" }}>
                <option value="p">Normal</option><option value="h2">Başlık</option><option value="h3">Alt başlık</option><option value="blockquote">Alıntı</option>
              </select>
              <select defaultValue="3" onChange={(e) => formatText("fontSize", e.target.value)} style={{ padding: "7px" }}>
                <option value="2">Küçük</option><option value="3">Normal</option><option value="4">Büyük</option><option value="5">Çok büyük</option>
              </select>
              <select defaultValue="Arial" onChange={(e) => formatText("fontName", e.target.value)} style={{ padding: "7px" }}>
                <option>Arial</option><option>Georgia</option><option>Trebuchet MS</option><option>Verdana</option><option>Times New Roman</option>
              </select>
              <button type="button" style={toolbarButtonStyle} onMouseDown={(e) => e.preventDefault()} onClick={() => formatText("insertUnorderedList")}>• Liste</button>
              <button type="button" style={toolbarButtonStyle} onMouseDown={(e) => e.preventDefault()} onClick={() => formatText("insertOrderedList")}>1. Liste</button>
              <button type="button" style={toolbarButtonStyle} onMouseDown={(e) => e.preventDefault()} onClick={() => formatText("removeFormat")}>Biçimi temizle</button>
            </div>
            <div
              key={selectedId || "new-product"}
              ref={descriptionRef}
              className="entry-description-field product-full-description"
              contentEditable
              suppressContentEditableWarning
              style={{ minHeight: 340, borderRadius: "0 0 10px 10px", padding: 16, outline: "none", background: "white" }}
              dangerouslySetInnerHTML={{ __html: productCopyHtml(draft.description) }}
              onBlur={(event) => update("description", sanitizeProductHtml(event.currentTarget.innerHTML))}
            />
            <small>Başka bir yerden kopyalayıp yapıştırabilirsin. Kalın, eğik, başlık, yazı boyutu ve yazı tipi mümkün olduğunca korunur; ayrıca üstteki araçlardan elle değiştirebilirsin.</small>
          </div>

          <div className="entry-description-preview product-content-area product-full-description" aria-live="polite">
            <p>ÜRÜN SAYFASI ÖNİZLEMESİ</p>
            <div className="product-copy-preview"><FormattedProductCopy content={draft.description || "Ürün açıklaması burada görünecek."} /></div>
          </div>

          <label>Teknik özellikler<textarea value={draft.technical} onChange={(event) => update("technical", event.target.value)} /></label>

          <div className="entry-buttons">
            <button onClick={saveDraft}>{selectedId ? "DEĞİŞİKLİKLERİ KAYDET" : "ÜRÜNÜ KAYDET"}</button>
            <button className="entry-preview" onClick={openPreview}>CANLI ÖNİZLEME</button>
            <button className="entry-copy" onClick={copyDetails}>{copied ? "KOPYALANDI ✓" : "BİLGİLERİ KOPYALA"}</button>
          </div>
          {saved && <small className="entry-saved">Kaydedildi.</small>}
        </div>

        <aside className="entry-images">
          <b>Ürün görselleri</b>
          <span><strong>Ana görsel</strong> mağaza kartında ilk görünen görseldir. <strong>Ek / hover görseller</strong> ürün galerisindeki diğer görsellerdir.</span>
          <div style={{ border: "2px solid #111", borderRadius: 14, padding: 12, marginTop: 10 }}>
            <b>1. ANA GÖRSEL</b>
            <label className="entry-upload" style={{ marginTop: 10 }}>ANA GÖRSELİ DEĞİŞTİR<input type="file" accept="image/*" onChange={(event) => preview(event.target.files, "main")} /></label>
            {draft.mainImage ? <><img src={draft.mainImage} alt="Ana görsel" /><button type="button" style={{ ...imageButtonStyle, width: "100%", marginTop: 8 }} onClick={removeMainImage}>ANA GÖRSELİ SİL</button></> : <small>Ana görsel yok.</small>}
          </div>
          <div style={{ border: "1px solid #ccc", borderRadius: 14, padding: 12, marginTop: 14 }}>
            <b>2. EK / HOVER GÖRSELLER</b>
            <label className="entry-upload" style={{ marginTop: 10 }}>YENİ GÖRSEL EKLE<input type="file" accept="image/*" multiple onChange={(event) => preview(event.target.files, "hover")} /></label>
            {draft.hoverImages.length === 0 && <small>Ek görsel yok.</small>}
            {draft.hoverImages.map((image, index) => (
              <div key={`${image}-${index}`} style={{ borderTop: "1px solid #e5e5e5", paddingTop: 12, marginTop: 12 }}>
                <b>{index + 1}. EK GÖRSEL</b><img src={image} alt={`${index + 1}. ek görsel`} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 8 }}>
                  <button type="button" style={imageButtonStyle} onClick={() => makeMainImage(index)}>ANA GÖRSEL YAP</button>
                  <button type="button" style={imageButtonStyle} onClick={() => removeHoverImage(index)}>SİL</button>
                  <button type="button" style={imageButtonStyle} disabled={index === 0} onClick={() => moveHover(index, -1)}>YUKARI</button>
                  <button type="button" style={imageButtonStyle} disabled={index === draft.hoverImages.length - 1} onClick={() => moveHover(index, 1)}>AŞAĞI</button>
                </div>
              </div>
            ))}
          </div>
          <small style={{ marginTop: 12 }}>Değişikliklerden sonra mutlaka “DEĞİŞİKLİKLERİ KAYDET” butonuna bas.</small>
        </aside>
      </section>
    </main>
  );
}
