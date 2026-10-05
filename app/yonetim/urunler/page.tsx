"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { productCopyHtml, sanitizeProductHtml } from "../../../components/FormattedProductCopy";
import {
  adminProductsKey,
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

function dataUrlToFile(dataUrl: string, name: string) {
  const [header, body] = dataUrl.split(",");
  const type = header.match(/data:(.*?);base64/)?.[1] || "image/jpeg";
  const bytes = atob(body || "");
  const array = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i += 1) array[i] = bytes.charCodeAt(i);
  return new File([array], name, { type });
}

export default function ProductEntryPage() {
  const [products, setProducts] = useState<AdminProduct[]>(readAdminProducts);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  function update(field: keyof Draft, value: string | string[]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function flash(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 3500);
  }

  function currentDescription() {
    return sanitizeProductHtml(descriptionRef.current?.innerHTML || draft.description || "");
  }

  async function uploadFile(file: File, id: string) {
    const form = new FormData();
    form.set("file", file);
    form.set("productId", id || "urun");
    const response = await fetch("/api/product-images", { method: "POST", body: form });
    if (!response.ok) throw new Error("Görsel yüklenemedi.");
    const result = await response.json();
    return String(result.url || "");
  }

  async function migrateDataImages(product: AdminProduct) {
    const convert = async (source: string, suffix: string) => {
      if (!source?.startsWith("data:image/")) return source;
      return uploadFile(dataUrlToFile(source, `${suffix}.jpg`), product.id);
    };
    return {
      ...product,
      mainImage: await convert(product.mainImage, "ana"),
      hoverImages: await Promise.all(
        (product.hoverImages || []).map((image, index) => convert(image, `ek-${index + 1}`)),
      ),
    };
  }

  async function saveProductsOnline(next: AdminProduct[]) {
    const response = await fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products: next }),
    });
    if (!response.ok) throw new Error("Ürünler internete kaydedilemedi.");
    writeAdminProducts(next);
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const rawLocal = window.localStorage.getItem(adminProductsKey);
        const migrated = window.localStorage.getItem("3dbade-cloud-migrated-v1");
        if (rawLocal && !migrated) {
          const localProducts = readAdminProducts();
          const uploaded = [] as AdminProduct[];
          for (const product of localProducts) uploaded.push(await migrateDataImages(product));
          await saveProductsOnline(uploaded);
          window.localStorage.setItem("3dbade-cloud-migrated-v1", "1");
          if (!cancelled) {
            setProducts(uploaded);
            flash("Mevcut çalışmaların internete aktarıldı ✓");
          }
          return;
        }

        const response = await fetch("/api/products", { cache: "no-store" });
        if (!response.ok) throw new Error("Ürün verisi alınamadı.");
        const online = (await response.json()) as AdminProduct[];
        if (!cancelled && Array.isArray(online)) {
          setProducts(online);
          writeAdminProducts(online);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) flash("İnternet veritabanına bağlanılamadı. Cloudflare kurulumu tamamlanmalı.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  function buildProduct() {
    if (!draft.title.trim()) {
      flash("Ürün adı boş olamaz.");
      return null;
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
    return { id, product, next };
  }

  async function persist(showMessage = true) {
    const built = buildProduct();
    if (!built || saving) return null;
    setSaving(true);
    try {
      await saveProductsOnline(built.next);
      setProducts(built.next);
      setSelectedId(built.id);
      setDraft(built.product);
      if (showMessage) flash("İnternete kaydedildi ✓");
      return built.id;
    } catch (error) {
      console.error(error);
      flash("Kaydedilemedi. Cloudflare veritabanı bağlantısını kontrol et.");
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function saveAndView() {
    const id = await persist(false);
    if (!id) return;
    window.location.href = `/urunler/${id}?t=${Date.now()}`;
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

  async function deleteProduct() {
    const product = products.find((item) => item.id === selectedId);
    if (!product || !window.confirm(`“${product.title}” silinsin mi?`)) return;
    const next = products.filter((item) => item.id !== product.id);
    try {
      await saveProductsOnline(next);
      setProducts(next);
      newProduct();
      flash("Ürün internetten silindi.");
    } catch {
      flash("Ürün silinemedi.");
    }
  }

  function formatText(command: string, value?: string) {
    descriptionRef.current?.focus();
    document.execCommand(command, false, value);
  }

  function handlePaste(event: React.ClipboardEvent<HTMLDivElement>) {
    event.preventDefault();
    const html = event.clipboardData.getData("text/html");
    const text = event.clipboardData.getData("text/plain");
    const content = html ? sanitizeProductHtml(html) : productCopyHtml(text);
    document.execCommand("insertHTML", false, content);
  }

  async function addImages(files: FileList | null, target: "main" | "hover") {
    if (!files?.length) return;
    const id = selectedId || productId(draft.title || "urun");
    try {
      flash("Görseller internete yükleniyor...");
      const urls: string[] = [];
      for (const file of Array.from(files)) urls.push(await uploadFile(file, id));
      if (target === "main") update("mainImage", urls[0]);
      else update("hoverImages", [...draft.hoverImages, ...urls]);
      flash("Görseller yüklendi. Şimdi kaydet.");
    } catch (error) {
      console.error(error);
      flash("Görsel yüklenemedi.");
    }
  }

  function removeHover(index: number) {
    update("hoverImages", draft.hoverImages.filter((_, itemIndex) => itemIndex !== index));
  }

  function makeMain(index: number) {
    const selected = draft.hoverImages[index];
    if (!selected) return;
    const remaining = draft.hoverImages.filter((_, itemIndex) => itemIndex !== index);
    update("hoverImages", draft.mainImage ? [draft.mainImage, ...remaining] : remaining);
    update("mainImage", selected);
  }

  function moveHover(index: number, direction: -1 | 1) {
    const next = [...draft.hoverImages];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    update("hoverImages", next);
  }

  const smallButton = {
    padding: "8px 10px",
    border: "1px solid #d5d5d5",
    borderRadius: 8,
    background: "white",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 12,
  } as const;

  return (
    <main className="product-entry-page">
      <section className="product-entry-heading">
        <p>ÜRÜN YÖNETİMİ</p>
        <h1>Ürünlerini yönet.</h1>
        <span>Kaydettiğin değişiklikler artık doğrudan internet sitesine yayınlanır.</span>
      </section>

      <section className="product-entry-grid product-management-grid">
        <aside className="managed-products">
          <div><b>Mevcut ürünler</b><button type="button" onClick={newProduct}>+ YENİ ÜRÜN</button></div>
          <small>{loading ? "Yükleniyor..." : `${products.length} ürün kayıtlı`}</small>
          <div className="managed-products-list">
            {products.map((product) => (
              <button type="button" key={product.id} className={selectedId === product.id ? "selected" : ""} onClick={() => selectProduct(product)}>
                <b>{product.title}</b><span>{product.category}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="entry-form">
          <div className="entry-form-title">
            <b>{selectedId ? "ÜRÜNÜ DÜZENLİYORSUN" : "YENİ ÜRÜN"}</b>
            {selectedId && <button type="button" onClick={deleteProduct}>ÜRÜNÜ SİL</button>}
          </div>

          <label>Ürün adı<input value={draft.title} onChange={(e) => update("title", e.target.value)} /></label>
          <label>Kategori<select value={draft.category} onChange={(e) => update("category", e.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
          <div className="entry-prices">
            <label>30 cm fiyatı<input value={draft.price30} onChange={(e) => update("price30", e.target.value)} /></label>
            <label>40 cm fiyatı<input value={draft.price40} onChange={(e) => update("price40", e.target.value)} /></label>
            <label>50 cm fiyatı<input value={draft.price50} onChange={(e) => update("price50", e.target.value)} /></label>
            <label>Özel ölçü<input value={draft.specialPrice} onChange={(e) => update("specialPrice", e.target.value)} /></label>
          </div>
          <label>Kumandalı ek fiyatı<input value={draft.remoteExtra} onChange={(e) => update("remoteExtra", e.target.value)} /></label>

          <div className="entry-description-editor">
            <label>Ürün açıklaması</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: 9, border: "1px solid #ddd", borderBottom: 0, background: "#f8f8f8" }}>
              <button type="button" style={smallButton} onMouseDown={(e) => e.preventDefault()} onClick={() => formatText("bold")}>B</button>
              <button type="button" style={{ ...smallButton, fontStyle: "italic" }} onMouseDown={(e) => e.preventDefault()} onClick={() => formatText("italic")}>I</button>
              <button type="button" style={{ ...smallButton, textDecoration: "underline" }} onMouseDown={(e) => e.preventDefault()} onClick={() => formatText("underline")}>U</button>
              <select defaultValue="p" onChange={(e) => formatText("formatBlock", e.target.value)}><option value="p">Normal</option><option value="h2">Başlık</option><option value="h3">Alt başlık</option><option value="blockquote">Alıntı</option></select>
              <select defaultValue="3" onChange={(e) => formatText("fontSize", e.target.value)}><option value="2">Küçük</option><option value="3">Normal</option><option value="4">Büyük</option><option value="5">Çok büyük</option></select>
              <button type="button" style={smallButton} onMouseDown={(e) => e.preventDefault()} onClick={() => formatText("insertUnorderedList")}>• Liste</button>
              <button type="button" style={smallButton} onMouseDown={(e) => e.preventDefault()} onClick={() => formatText("insertOrderedList")}>1. Liste</button>
              <button type="button" style={smallButton} onMouseDown={(e) => e.preventDefault()} onClick={() => formatText("removeFormat")}>Biçimi temizle</button>
            </div>
            <div
              key={selectedId || "new"}
              ref={descriptionRef}
              className="entry-description-field product-full-description"
              contentEditable
              suppressContentEditableWarning
              style={{ minHeight: 340, padding: 16, outline: "none", background: "white" }}
              dangerouslySetInnerHTML={{ __html: productCopyHtml(draft.description) }}
              onPaste={handlePaste}
              onBlur={(e) => update("description", sanitizeProductHtml(e.currentTarget.innerHTML))}
            />
          </div>

          <label>Teknik özellikler<textarea value={draft.technical} onChange={(e) => update("technical", e.target.value)} /></label>
          <div className="entry-buttons">
            <button type="button" disabled={saving} onClick={() => persist()}>{saving ? "KAYDEDİLİYOR..." : selectedId ? "DEĞİŞİKLİKLERİ YAYINLA" : "ÜRÜNÜ YAYINLA"}</button>
            <button type="button" disabled={saving} className="entry-preview" onClick={saveAndView}>YAYINLA VE SİTEDE GÖR</button>
          </div>
          {message && <small className="entry-saved">{message}</small>}
        </div>

        <aside className="entry-images">
          <b>Ürün görselleri</b>
          <span>Ana görsel ve galeri görsellerini buradan yönet.</span>
          <div style={{ border: "2px solid #111", borderRadius: 14, padding: 12, marginTop: 10 }}>
            <b>ANA GÖRSEL</b>
            <label className="entry-upload" style={{ marginTop: 10 }}>ANA GÖRSELİ DEĞİŞTİR<input type="file" accept="image/*" onChange={(e) => addImages(e.target.files, "main")} /></label>
            {draft.mainImage ? <><img src={draft.mainImage} alt="Ana görsel" /><button type="button" style={{ ...smallButton, width: "100%", marginTop: 8 }} onClick={() => update("mainImage", "")}>ANA GÖRSELİ SİL</button></> : <small>Ana görsel yok.</small>}
          </div>
          <div style={{ border: "1px solid #ccc", borderRadius: 14, padding: 12, marginTop: 14 }}>
            <b>EK / GALERİ GÖRSELLERİ</b>
            <label className="entry-upload" style={{ marginTop: 10 }}>YENİ GÖRSEL EKLE<input type="file" accept="image/*" multiple onChange={(e) => addImages(e.target.files, "hover")} /></label>
            {draft.hoverImages.map((image, index) => (
              <div key={`${image}-${index}`} style={{ borderTop: "1px solid #e5e5e5", paddingTop: 12, marginTop: 12 }}>
                <b>{index + 1}. GÖRSEL</b><img src={image} alt={`${index + 1}. ek görsel`} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 8 }}>
                  <button type="button" style={smallButton} onClick={() => makeMain(index)}>ANA GÖRSEL YAP</button>
                  <button type="button" style={smallButton} onClick={() => removeHover(index)}>SİL</button>
                  <button type="button" style={smallButton} disabled={index === 0} onClick={() => moveHover(index, -1)}>YUKARI</button>
                  <button type="button" style={smallButton} disabled={index === draft.hoverImages.length - 1} onClick={() => moveHover(index, 1)}>AŞAĞI</button>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
