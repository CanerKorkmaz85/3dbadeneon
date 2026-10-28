"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { productCopyHtml, sanitizeProductHtml } from "../../../components/FormattedProductCopy";
import {
  defaultSizeOptions,
  normalizeAdminProduct,
  productId,
  productTypes,
  readAdminProducts,
  technicalTemplates,
  type AdminProduct,
  type ProductSizeOption,
  type ProductType,
  writeAdminProducts,
} from "../../../lib/admin-products";

const editorUrl = "http://127.0.0.1:3002";

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
  "3D Maket",
  "Tabela",
  "Paslanmaz",
  "Kutu Harf",
];

type Draft = Omit<AdminProduct, "id">;

const emptyDraft: Draft = {
  title: "",
  category: categories[0],
  productType: "Neon",
  sizesEnabled: true,
  sizeOptions: defaultSizeOptions("Neon"),
  remoteEnabled: true,
  price30: "",
  price40: "",
  price50: "",
  specialPrice: "Teklif Al",
  remoteExtra: "250",
  description: "",
  technical: technicalTemplates.Neon,
  mainImage: "",
  hoverImages: [],
};

export default function ProductEntryPage() {
  const [products, setProducts] = useState<AdminProduct[]>(readAdminProducts);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [localReady, setLocalReady] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  function update<K extends keyof Draft>(field: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function flash(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 5000);
  }

  function currentDescription() {
    return sanitizeProductHtml(descriptionRef.current?.innerHTML || draft.description || "");
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const health = await fetch(`${editorUrl}/health`, { cache: "no-store" });
        if (!health.ok) throw new Error("Yerel editor kapali");
        if (!cancelled) setLocalReady(true);

        const response = await fetch(`${editorUrl}/products?t=${Date.now()}`, { cache: "no-store" });
        const result = await response.json();
        if (!cancelled && Array.isArray(result.products) && result.products.length) {
          const normalizedProducts = result.products.map(normalizeAdminProduct);
          setProducts(normalizedProducts);
          try { writeAdminProducts(normalizedProducts); } catch {}
        }
      } catch {
        if (!cancelled) {
          setLocalReady(false);
          if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
            flash("Yerel editor servisi acik degil. CMD'de proje klasorunde npm run dev calistir.");
          } else {
            flash("Bu paneli duzenleme icin bilgisayarinda localhost:3000 uzerinden kullan.");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  function buildProduct() {
    if (!draft.title.trim()) {
      flash("Ürün adı boş olamaz.");
      return null;
    }

    const id = selectedId || productId(draft.title);
    const sizePrice = (label: string) => draft.sizeOptions.find((option) => option.label === label)?.price || "";
    const product: AdminProduct = {
      ...draft,
      id,
      title: draft.title.trim(),
      description: currentDescription(),
      hoverImages: draft.hoverImages || [],
      price30: sizePrice("30 cm"),
      price40: sizePrice("40 cm"),
      price50: sizePrice("50 cm"),
      specialPrice: sizePrice("Özel ölçü") || draft.specialPrice,
      remoteExtra: draft.remoteEnabled ? draft.remoteExtra : "",
    };

    const next = selectedId
      ? products.map((item) => (item.id === id ? product : item))
      : [...products, product];

    return { id, product, next };
  }

  async function saveLocal(showMessage = true) {
    const built = buildProduct();
    if (!built || saving) return null;
    if (!localReady) {
      flash("Önce bilgisayarında npm run dev ile yerel siteyi aç.");
      return null;
    }

    setSaving(true);
    try {
      const response = await fetch(`${editorUrl}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: built.next }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Kaydedilemedi.");

      const savedProducts = result.products as AdminProduct[];
      const savedProduct = savedProducts.find((item) => item.id === built.id) || built.product;
      setProducts(savedProducts);
      setSelectedId(savedProduct.id);
      setDraft(savedProduct);
      try { writeAdminProducts(savedProducts); } catch {}
      if (showMessage) flash("Bilgisayara kaydedildi ✓");
      return savedProduct.id;
    } catch (error) {
      flash(error instanceof Error ? error.message : "Kaydedilemedi.");
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function saveAndView() {
    const id = await saveLocal(false);
    if (!id) return;
    window.open(`/urunler/${id}?t=${Date.now()}`, "_blank");
    flash("Kaydedildi. Ürün sayfası yeni sekmede açıldı ✓");
  }

  async function publishSite() {
    const id = await saveLocal(false);
    if (!id || publishing) return;
    setPublishing(true);
    try {
      const response = await fetch(`${editorUrl}/publish`, { method: "POST" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Yayınlanamadı.");
      flash(result.message || "GitHub'a gönderildi. Cloudflare otomatik yayınlayacak ✓");
    } catch (error) {
      flash(error instanceof Error ? error.message : "Yayınlanamadı.");
    } finally {
      setPublishing(false);
    }
  }

  function selectProduct(product: AdminProduct) {
    const normalized = normalizeAdminProduct(product);
    setSelectedId(normalized.id);
    setDraft({
      title: normalized.title,
      category: normalized.category,
      productType: normalized.productType,
      sizesEnabled: normalized.sizesEnabled,
      sizeOptions: normalized.sizeOptions,
      remoteEnabled: normalized.remoteEnabled,
      price30: normalized.price30,
      price40: normalized.price40,
      price50: normalized.price50,
      specialPrice: normalized.specialPrice,
      remoteExtra: normalized.remoteExtra,
      description: normalized.description,
      technical: normalized.technical,
      mainImage: normalized.mainImage,
      hoverImages: normalized.hoverImages || [],
    });
  }

  function newProduct() {
    setSelectedId(null);
    setDraft({ ...emptyDraft, sizeOptions: defaultSizeOptions("Neon") });
    if (descriptionRef.current) descriptionRef.current.innerHTML = "";
  }

  function changeProductType(productType: ProductType) {
    const sizesEnabled = productType === "Neon" || productType === "3D Maket";
    const category = productType === "3D Maket"
      ? "3D Maket"
      : productType === "Kutu Harf"
        ? "Kutu Harf"
        : productType === "Paslanmaz"
          ? "Paslanmaz"
          : draft.category;
    setDraft((current) => ({
      ...current,
      productType,
      category,
      sizesEnabled,
      sizeOptions: defaultSizeOptions(productType),
      remoteEnabled: productType === "Neon",
      remoteExtra: productType === "Neon" ? current.remoteExtra || "250" : "",
      technical: technicalTemplates[productType],
    }));
  }

  function updateSize(index: number, field: keyof ProductSizeOption, value: string) {
    update("sizeOptions", draft.sizeOptions.map((option, optionIndex) =>
      optionIndex === index ? { ...option, [field]: value } : option));
  }

  function addSize() {
    update("sizeOptions", [...draft.sizeOptions, { label: "", price: "" }]);
  }

  function removeSize(index: number) {
    update("sizeOptions", draft.sizeOptions.filter((_, optionIndex) => optionIndex !== index));
  }

  async function deleteProduct() {
    const product = products.find((item) => item.id === selectedId);
    if (!product) return;
    if (!window.confirm(`“${product.title}” silinsin mi?`)) return;
    if (!localReady) return flash("Silmek için localhost üzerinde çalış.");

    const next = products.filter((item) => item.id !== product.id);
    setSaving(true);
    try {
      const response = await fetch(`${editorUrl}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: next }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Silinemedi.");
      setProducts(result.products);
      newProduct();
      flash("Ürün silindi. Yayınlamak istediğinde SİTEYİ YAYINLA'ya bas.");
    } catch (error) {
      flash(error instanceof Error ? error.message : "Ürün silinemedi.");
    } finally {
      setSaving(false);
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

  function readImage(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const source = String(reader.result || "");
        const image = new Image();
        image.onload = () => {
          const limit = 1200;
          const scale = Math.min(1, limit / Math.max(image.width, image.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.width * scale));
          canvas.height = Math.max(1, Math.round(image.height * scale));
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

  async function addImages(files: FileList | null, target: "main" | "hover") {
    if (!files?.length) return;
    try {
      flash("Görsel hazırlanıyor...");
      const images = await Promise.all(Array.from(files).map(readImage));
      if (target === "main") update("mainImage", images[0]);
      else update("hoverImages", [...draft.hoverImages, ...images]);
      flash("Görsel hazır. KAYDET dediğinde bilgisayara yazılacak.");
    } catch {
      flash("Görsel okunamadı.");
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
        <h1>Önce gör, sonra yayınla.</h1>
        <span>Bilgisayarında düzenle → hemen kontrol et → hazır olduğunda tek tuşla yayınla.</span>
        <div style={{ marginTop: 12, fontWeight: 800, color: localReady ? "#15803d" : "#b45309" }}>
          {loading ? "Yerel sistem kontrol ediliyor..." : localReady ? "● YEREL SİSTEM HAZIR" : "● YEREL SİSTEM KAPALI"}
        </div>
      </section>

      <section className="product-entry-grid product-management-grid">
        <aside className="managed-products">
          <div><b>Mevcut ürünler</b><button type="button" onClick={newProduct}>+ YENİ ÜRÜN</button></div>
          <small>{products.length} ürün</small>
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
            {selectedId && <button type="button" onClick={deleteProduct} disabled={saving}>ÜRÜNÜ SİL</button>}
          </div>

          <label>Ürün adı<input value={draft.title} onChange={(e) => update("title", e.target.value)} /></label>
          <label>Ürün tipi / teknik şablon
            <select value={draft.productType} onChange={(e) => changeProductType(e.target.value as ProductType)}>
              {productTypes.map((productType) => <option key={productType}>{productType}</option>)}
            </select>
          </label>
          <button type="button" className="entry-template-reset" onClick={() => changeProductType(draft.productType)}>SEÇİLİ ŞABLONU YENİDEN UYGULA</button>
          <small className="entry-help">Ürün tipini değiştirdiğinde veya şablonu yeniden uyguladığında ölçü, kumanda ve teknik özellikler o ürüne göre hazırlanır. Teknik metni aşağıdan istediğin gibi değiştirebilirsin.</small>
          <label>Kategori<select value={draft.category} onChange={(e) => update("category", e.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>

          <div className="entry-option-panel">
            <label className="entry-switch">
              <input type="checkbox" checked={draft.sizesEnabled} onChange={(e) => update("sizesEnabled", e.target.checked)} />
              <span>Ölçü seçeneklerini göster</span>
            </label>
            {draft.sizesEnabled ? (
              <div className="entry-size-editor">
                <div className="entry-size-head"><b>Ölçü adı</b><b>Fiyat / Teklif</b><span /></div>
                {draft.sizeOptions.map((option, index) => (
                  <div className="entry-size-row" key={`${index}-${option.label}`}>
                    <input aria-label={`${index + 1}. ölçü adı`} placeholder="Örn. 10 cm" value={option.label} onChange={(e) => updateSize(index, "label", e.target.value)} />
                    <input aria-label={`${index + 1}. ölçü fiyatı`} placeholder="Örn. 1250 veya Teklif Al" value={option.price} onChange={(e) => updateSize(index, "price", e.target.value)} />
                    <button type="button" onClick={() => removeSize(index)} aria-label={`${option.label || index + 1}. ölçüyü sil`}>SİL</button>
                  </div>
                ))}
                <button type="button" className="entry-add-size" onClick={addSize}>+ YENİ ÖLÇÜ EKLE</button>
              </div>
            ) : (
              <label>Tek fiyat veya teklif metni<input value={draft.specialPrice} placeholder="Örn. 2500 veya Teklif Al" onChange={(e) => update("specialPrice", e.target.value)} /></label>
            )}
          </div>

          <div className="entry-option-panel">
            <label className="entry-switch">
              <input type="checkbox" checked={draft.remoteEnabled} onChange={(e) => update("remoteEnabled", e.target.checked)} />
              <span>Kumanda seçeneğini göster</span>
            </label>
            {draft.remoteEnabled && <label>Kumandalı ek fiyatı<input value={draft.remoteExtra} onChange={(e) => update("remoteExtra", e.target.value)} /></label>}
            {!draft.remoteEnabled && <small className="entry-help">Bu üründe kumanda seçeneği ürün sayfasında gösterilmeyecek.</small>}
          </div>

          <div className="entry-description-editor">
            <label>Ürün açıklaması</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: 9, border: "1px solid #ddd", borderBottom: 0, background: "#f8f8f8" }}>
              <button type="button" style={smallButton} onMouseDown={(e) => e.preventDefault()} onClick={() => formatText("bold")}>B</button>
              <button type="button" style={{ ...smallButton, fontStyle: "italic" }} onMouseDown={(e) => e.preventDefault()} onClick={() => formatText("italic")}>I</button>
              <button type="button" style={{ ...smallButton, textDecoration: "underline" }} onMouseDown={(e) => e.preventDefault()} onClick={() => formatText("underline")}>U</button>
              <select defaultValue="p" onChange={(e) => formatText("formatBlock", e.target.value)}>
                <option value="p">Normal</option><option value="h2">Başlık</option><option value="h3">Alt başlık</option><option value="blockquote">Alıntı</option>
              </select>
              <select defaultValue="3" onChange={(e) => formatText("fontSize", e.target.value)}>
                <option value="2">Küçük</option><option value="3">Normal</option><option value="4">Büyük</option><option value="5">Çok büyük</option>
              </select>
              <select defaultValue="Arial" onChange={(e) => formatText("fontName", e.target.value)}>
                <option>Arial</option><option>Georgia</option><option>Trebuchet MS</option><option>Verdana</option><option>Times New Roman</option>
              </select>
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

          <label>Teknik özellikler — {draft.productType}<textarea value={draft.technical} onChange={(e) => update("technical", e.target.value)} /></label>

          <div className="entry-buttons" style={{ flexWrap: "wrap" }}>
            <button type="button" disabled={saving || publishing} onClick={() => saveLocal()}>{saving ? "KAYDEDİLİYOR..." : "KAYDET"}</button>
            <button type="button" disabled={saving || publishing} className="entry-preview" onClick={saveAndView}>KAYDET VE SİTEDE GÖR</button>
            <button type="button" disabled={saving || publishing} onClick={publishSite} style={{ background: "#111", color: "white", minWidth: 180 }}>
              {publishing ? "YAYINLANIYOR..." : "🚀 SİTEYİ YAYINLA"}
            </button>
          </div>
          {message && <small className="entry-saved">{message}</small>}
        </div>

        <aside className="entry-images">
          <b>Ürün görselleri</b>
          <span>Görseller ürün dosyalarıyla birlikte bilgisayarına kaydedilir.</span>

          <div style={{ border: "2px solid #111", borderRadius: 14, padding: 12, marginTop: 10 }}>
            <b>ANA GÖRSEL</b>
            <label className="entry-upload" style={{ marginTop: 10 }}>
              ANA GÖRSELİ DEĞİŞTİR
              <input type="file" accept="image/*" onChange={(e) => { addImages(e.target.files, "main"); e.currentTarget.value = ""; }} />
            </label>
            {draft.mainImage ? <><img src={draft.mainImage} alt="Ana görsel" /><button type="button" style={{ ...smallButton, width: "100%", marginTop: 8 }} onClick={() => update("mainImage", "")}>ANA GÖRSELİ SİL</button></> : <small>Ana görsel yok.</small>}
          </div>

          <div style={{ border: "1px solid #ccc", borderRadius: 14, padding: 12, marginTop: 14 }}>
            <b>EK / GALERİ GÖRSELLERİ</b>
            <label className="entry-upload" style={{ marginTop: 10 }}>
              YENİ GÖRSEL EKLE
              <input type="file" accept="image/*" multiple onChange={(e) => { addImages(e.target.files, "hover"); e.currentTarget.value = ""; }} />
            </label>
            {draft.hoverImages.length === 0 && <small>Ek görsel yok.</small>}
            {draft.hoverImages.map((image, index) => (
              <div key={`${image.slice(0, 80)}-${index}`} style={{ borderTop: "1px solid #e5e5e5", paddingTop: 12, marginTop: 12 }}>
                <b>{index + 1}. GÖRSEL</b>
                <img src={image} alt={`${index + 1}. ek görsel`} />
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
