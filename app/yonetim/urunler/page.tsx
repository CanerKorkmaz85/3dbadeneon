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
  const [draft, setDraft] = useState<Draft>(() => {
    if (typeof window === "undefined") return emptyDraft;
    try {
      const stored = window.localStorage.getItem("3dbade-product-draft");
      return stored ? { ...emptyDraft, ...JSON.parse(stored) } : emptyDraft;
    } catch {
      return emptyDraft;
    }
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mainPreview, setMainPreview] = useState("");
  const [hoverPreviews, setHoverPreviews] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const update = (field: keyof Draft, value: string) =>
    setDraft((current) => ({ ...current, [field]: value }));
  function saveDraft() {
    if (!draft.title.trim()) return;
    const id = selectedId || productId(draft.title);
    const description = sanitizeProductHtml(
      descriptionRef.current?.innerHTML ?? draft.description,
    );
    const product: AdminProduct = {
      ...draft,
      description,
      mainImage: mainPreview || draft.mainImage,
      hoverImages: hoverPreviews.length ? hoverPreviews : draft.hoverImages,
      id,
      title: draft.title.trim(),
    };
    const next = selectedId
      ? products.map((item) => (item.id === id ? product : item))
      : [...products, product];
    setProducts(next);
    setSelectedId(id);
    setDraft(product);
    writeAdminProducts(next);
    window.localStorage.setItem("3dbade-product-draft", JSON.stringify(product));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }
  function selectProduct(product: AdminProduct) {
    setSelectedId(product.id);
    setDraft(product);
    setMainPreview(product.mainImage || "");
    setHoverPreviews(product.hoverImages || []);
  }
  function newProduct() {
    setSelectedId(null);
    setDraft(emptyDraft);
    setMainPreview("");
    setHoverPreviews([]);
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
    const description = sanitizeProductHtml(
      descriptionRef.current?.innerHTML ?? draft.description,
    );
    window.localStorage.setItem(
      "3dbade-product-preview",
      JSON.stringify({ ...draft, description, mainPreview, hoverPreviews }),
    );
    window.open("/yonetim/urun-onizleme", "_blank");
  }
  async function copyDetails() {
    const content = `ÜRÜN ADI: ${draft.title || "-"}\nKATEGORİ: ${draft.category}\n30 CM: ${draft.price30 || "-"}\n40 CM: ${draft.price40 || "-"}\n50 CM: ${draft.price50 || "-"}\nÖZEL ÖLÇÜ: ${draft.specialPrice || "Teklif al"}\nKUMANDALI EK FİYAT: ${draft.remoteExtra || "0"} TL\n\nÜRÜN AÇIKLAMASI\n${draft.description || "-"}\n\nTEKNİK ÖZELLİKLER\n${draft.technical}`;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
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
  function saveSelectedImages(mainImage: string, hoverImages: string[]) {
    if (!selectedId) return;
    const next = products.map((product) =>
      product.id === selectedId ? { ...product, mainImage, hoverImages } : product,
    );
    setProducts(next);
    writeAdminProducts(next);
  }
  async function preview(files: FileList | null, target: "main" | "hover") {
    if (!files?.length) return;
    const images = await Promise.all(Array.from(files).map(readImage));
    if (target === "main") {
      setMainPreview(images[0]);
      saveSelectedImages(images[0], hoverPreviews);
      return;
    }
    setHoverPreviews((current) => {
      const next = [...current, ...images];
      saveSelectedImages(mainPreview, next);
      return next;
    });
  }

  return (
    <main className="product-entry-page">
      <section className="product-entry-heading">
        <p>ÜRÜN YÖNETİMİ</p>
        <h1>Ürünlerini yönet.</h1>
        <span>
          Yeni ürün ekle, mevcut ürünü seçip değiştir veya gerektiğinde sil.
        </span>
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
          <label>
            Ürün adı
            <input
              value={draft.title}
              onChange={(event) => update("title", event.target.value)}
              placeholder="Örn. Hamburger Neon"
            />
          </label>
          <label>
            Kategori
            <select
              value={draft.category}
              onChange={(event) => update("category", event.target.value)}
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <div className="entry-prices">
            <label>
              30 cm fiyatı
              <input
                inputMode="numeric"
                value={draft.price30}
                onChange={(event) => update("price30", event.target.value)}
                placeholder="₺"
              />
            </label>
            <label>
              40 cm fiyatı
              <input
                inputMode="numeric"
                value={draft.price40}
                onChange={(event) => update("price40", event.target.value)}
                placeholder="₺"
              />
            </label>
            <label>
              50 cm fiyatı
              <input
                inputMode="numeric"
                value={draft.price50}
                onChange={(event) => update("price50", event.target.value)}
                placeholder="₺"
              />
            </label>
            <label>
              Özel ölçü
              <input
                value={draft.specialPrice}
                onChange={(event) => update("specialPrice", event.target.value)}
              />
            </label>
          </div>
          <label>
            Kumandalı ek fiyatı
            <input
              inputMode="numeric"
              value={draft.remoteExtra}
              onChange={(event) => update("remoteExtra", event.target.value)}
              placeholder="₺"
            />
          </label>
          <div className="entry-description-editor">
            <label>Ürün açıklaması</label>
            <div
              className="entry-description-field product-full-description"
              contentEditable
              suppressContentEditableWarning
              data-placeholder="Açıklamayı doğrudan buraya yapıştır. Kalın, italik, büyük yazı ve paragraflar korunur."
              dangerouslySetInnerHTML={{
                __html: productCopyHtml(draft.description),
              }}
              ref={descriptionRef}
              onBlur={(event) =>
                update(
                  "description",
                  sanitizeProductHtml(event.currentTarget.innerHTML),
                )
              }
            />
          </div>
          <div
            className="entry-description-preview product-content-area product-full-description"
            aria-live="polite"
          >
            <p>ÜRÜN SAYFASI ÖNİZLEMESİ</p>
            <div className="product-copy-preview">
              <FormattedProductCopy
                content={
                  draft.description ||
                  "Yapıştırdığın ürün açıklaması burada Eriyen Dondurma ürün sayfasındaki yazı düzeniyle görünür."
                }
              />
            </div>
          </div>
          <label>
            Teknik özellikler
            <textarea
              value={draft.technical}
              onChange={(event) => update("technical", event.target.value)}
            />
          </label>
          <div className="entry-buttons">
            <button onClick={saveDraft}>
              {selectedId ? "DEĞİŞİKLİKLERİ KAYDET" : "ÜRÜNÜ KAYDET"}
            </button>
            <button className="entry-preview" onClick={openPreview}>
              CANLI ÖNİZLEME
            </button>
            <button className="entry-copy" onClick={copyDetails}>
              {copied ? "KOPYALANDI ✓" : "BİLGİLERİ KOPYALA"}
            </button>
          </div>
          {saved && (
            <small className="entry-saved">
              Kaydedildi. Fiyatlar sayfasına otomatik eklendi.
            </small>
          )}
        </div>
        <aside className="entry-images">
          <b>Ürün görselleri</b>
          <span>
            Bir ana görsel ve istediğin kadar hover görseli ekle. Hover alanına
            her yeni seçimin önceki görsellere eklenir.
          </span>
          <label className="entry-upload">
            ANA GÖRSEL
            <input
              type="file"
              accept="image/*"
              onChange={(event) => preview(event.target.files, "main")}
            />
          </label>
          {mainPreview && <img src={mainPreview} alt="Ana görsel önizlemesi" />}
          <label className="entry-upload">
            HOVER GÖRSELİ EKLE
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => preview(event.target.files, "hover")}
            />
          </label>
          {hoverPreviews.map((image, index) => (
            <img
              key={image}
              src={image}
              alt={`${index + 1}. hover görseli önizlemesi`}
            />
          ))}
          <small>
            Görselleri sohbetten ayrıca gönder; buradaki önizleme sadece
            hazırlık içindir.
          </small>
        </aside>
      </section>
    </main>
  );
}
