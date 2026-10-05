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

const technicalTemplate = `Ölçü
30, 40, 50 cm veya özel ölçü

Malzeme
4 mm şeffaf, kontur kesim pleksi

Aydınlatma
12V esnek silikon neon LED

Kablo
Yaklaşık 2 metre

Paket içeriği
Neon dekor ve 12V adaptör`;

type Draft = Omit<AdminProduct, "id">;

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
  const [message, setMessage] = useState("");
  const descriptionRef = useRef<HTMLDivElement>(null);

  const update = (field: keyof Draft, value: string | string[]) =>
    setDraft((current) => ({ ...current, [field]: value }));

  function currentDescription() {
    return sanitizeProductHtml(
      descriptionRef.current?.innerHTML || draft.description || "",
    );
  }

  function flash(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 3500);
  }

  function saveDraft() {
    if (!draft.title.trim()) {
      flash("Ürün adı boş olamaz.");
      return;
    }

    const id = selectedId || productId(draft.title);
    const product: AdminProduct = {
      ...draft,
      id,
      title: draft.title.trim(),
      description: currentDescription(),
      hoverImages: draft.hoverImages || [],
    };
    const next = selectedId
      ? products.map((item) => (item.id === id ? product : item))
      : [...products, product];

    try {
      // Eski deneme kayıtları aynı depolama alanını gereksiz yere doldurabiliyor.
      window.localStorage.removeItem("3dbade-product-draft");
      window.localStorage.removeItem("3dbade-product-preview");
      writeAdminProducts(next);
      setProducts(next);
      setSelectedId(id);
      setDraft(product);
      flash("Kaydedildi ✓");
    } catch (error) {
      console.error(error);
      flash("Kaydedilemedi. Tarayıcı depolama alanı dolmuş olabilir.");
    }
  }

  function selectProduct(product: AdminProduct) {
    setSelectedId(product.id);
    setDraft({
      title: product.title,
      category: product.category,
      price30: product.price30,
      price40: product.price40,
      price50: product.price50,
      specialPrice: product.specialPrice,
      remoteExtra: product.remoteExtra,
      description: product.description,
      technical: product.technical,
      mainImage: product.mainImage,
      hoverImages: product.hoverImages || [],
    });
  }

  function newProduct() {
    setSelectedId(null);
    setDraft(emptyDraft);
    if (descriptionRef.current) descriptionRef.current.innerHTML = "";
  }

  function deleteProduct() {
    const product = products.find((item) => item.id === selectedId);
    if (!product || !window.confirm(`“${product.title}” silinsin mi?`)) return;
    const next = products.filter((item) => item.id !== product.id);
    try {
      writeAdminProducts(next);
      setProducts(next);
      newProduct();
      flash("Ürün silindi.");
    } catch (error) {
      console.error(error);
      flash("Ürün silinemedi.");
    }
  }

  function openPreview() {
    const payload = {
      ...draft,
      description: currentDescription(),
      mainPreview: draft.mainImage,
      hoverPreviews: draft.hoverImages,
    };

    try {
      // Önizlemeyi localStorage'a ikinci kez kopyalamak depolama kotasını dolduruyordu.
      // sessionStorage kullanınca kaydetme ile çakışmıyor.
      window.sessionStorage.setItem(
        "3dbade-product-preview",
        JSON.stringify(payload),
      );
      const previewWindow = window.open(
        "/yonetim/urun-onizleme",
        "3dbade-product-preview",
      );
      if (!previewWindow) {
        flash("Tarayıcı önizleme penceresini engelledi.");
        return;
      }
      previewWindow.focus();
    } catch (error) {
      console.error(error);
      flash("Önizleme açılamadı. Görseller çok büyük olabilir.");
    }
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
          // Tarayıcı hafızasını taşırmamak için yüklenen görselleri küçült.
          const limit = 900;
          const scale = Math.min(1, limit / Math.max(image.width, image.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.width * scale));
          canvas.height = Math.max(1, Math.round(image.height * scale));
          const context = canvas.getContext("2d");
          if (!context) return resolve(source);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.68));
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
    try {
      const images = await Promise.all(Array.from(files).map(readImage));
      if (target === "main") {
        update("mainImage", images[0]);
      } else {
        update("hoverImages", [...draft.hoverImages, ...images]);
      }
    } catch (error) {
      console.error(error);
      flash("Görsel okunamadı.");
    }
  }

  function removeMainImage() {
    update("mainImage", "");
  }

  function removeHoverImage(index: number) {
    update(
      "hoverImages",
      draft.hoverImages.filter((_, itemIndex) => itemIndex !== index),
    );
  }

  function makeMainImage(index: number) {
    const selected = draft.hoverImages[index];
    if (!selected) return;
    const remaining = draft.hoverImages.filter((_, itemIndex) => itemIndex !== index);
    update("mainImage", selected);
    update("hoverImages", draft.mainImage ? [draft.mainImage, ...remaining] : remaining);
  }

  function moveHover(index: number, direction: -1 | 1) {
    const next = [...draft.hoverImages];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    update("hoverImages", next);
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
        <span>Ürün ekle, düzenle, görselleri sırala veya sil.</span>
      </section>

      <section className="product-entry-grid product-management-grid">
        <aside className="managed-products">
          <div>
            <b>Mevcut ürünler</b>
            <button type="button" onClick={newProduct}>+ YENİ ÜRÜN</button>
          </div>
          <small>{products.length} ürün kayıtlı</small>
          <div className="managed-products-list">
            {products.map((product) => (
              <button
                type="button"
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
            {selectedId && <button type="button" onClick={deleteProduct}>ÜRÜNÜ SİL</button>}
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: 9, border: "1px solid #ddd", borderBottom: 0, borderRadius: "10px 10px 0 0", background: "#f8f8f8" }}>
              <button type="button" style={toolbarButtonStyle} onMouseDown={(e) => e.preventDefault()} onClick={() => formatText("bold")}>B</button>
              <button type="button" style={{ ...toolbarButtonStyle, fontStyle: "italic" }} onMouseDown={(e) => e.preventDefault()} onClick={() => formatText("italic")}>I</button>
              <button type="button" style={{ ...toolbarButtonStyle, textDecoration: "underline" }} onMouseDown={(e) => e.preventDefault()} onClick={() => formatText("underline")}>U</button>
              <select defaultValue="p" onChange={(e) => formatText("formatBlock", e.target.value)}><option value="p">Normal</option><option value="h2">Başlık</option><option value="h3">Alt başlık</option><option value="blockquote">Alıntı</option></select>
              <select defaultValue="3" onChange={(e) => formatText("fontSize", e.target.value)}><option value="2">Küçük</option><option value="3">Normal</option><option value="4">Büyük</option><option value="5">Çok büyük</option></select>
              <select defaultValue="Arial" onChange={(e) => formatText("fontName", e.target.value)}><option>Arial</option><option>Georgia</option><option>Trebuchet MS</option><option>Verdana</option><option>Times New Roman</option></select>
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
          </div>

          <div className="entry-description-preview product-content-area product-full-description">
            <p>ÜRÜN SAYFASI ÖNİZLEMESİ</p>
            <div className="product-copy-preview">
              <FormattedProductCopy content={draft.description || "Ürün açıklaması burada görünecek."} />
            </div>
          </div>

          <label>Teknik özellikler<textarea value={draft.technical} onChange={(event) => update("technical", event.target.value)} /></label>

          <div className="entry-buttons">
            <button type="button" onClick={saveDraft}>{selectedId ? "DEĞİŞİKLİKLERİ KAYDET" : "ÜRÜNÜ KAYDET"}</button>
            <button type="button" className="entry-preview" onClick={openPreview}>CANLI ÖNİZLEME</button>
          </div>
          {message && <small className="entry-saved">{message}</small>}
        </div>

        <aside className="entry-images">
          <b>Ürün görselleri</b>
          <span><strong>Ana görsel</strong> ilk görünen görseldir. <strong>Ek / hover görseller</strong> galerideki diğer görsellerdir.</span>

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
              <div key={`${image.slice(0, 60)}-${index}`} style={{ borderTop: "1px solid #e5e5e5", paddingTop: 12, marginTop: 12 }}>
                <b>{index + 1}. EK GÖRSEL</b>
                <img src={image} alt={`${index + 1}. ek görsel`} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 8 }}>
                  <button type="button" style={imageButtonStyle} onClick={() => makeMainImage(index)}>ANA GÖRSEL YAP</button>
                  <button type="button" style={imageButtonStyle} onClick={() => removeHoverImage(index)}>SİL</button>
                  <button type="button" style={imageButtonStyle} disabled={index === 0} onClick={() => moveHover(index, -1)}>YUKARI</button>
                  <button type="button" style={imageButtonStyle} disabled={index === draft.hoverImages.length - 1} onClick={() => moveHover(index, 1)}>AŞAĞI</button>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
