export const productCategories = [
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
] as const;

export type AdminProduct = {
  id: string;
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

export const technicalTemplate = `Ölçü
30, 40, 50 cm veya özel ölçü

Malzeme
4 mm şeffaf, kontur kesim pleksi

Aydınlatma
12V esnek silikon neon LED

Kablo
Yaklaşık 2 metre

Paket içeriği
Neon dekor ve 12V adaptör`;

export const adminProductsKey = "3dbade-admin-products-v1";

const dogPatronDescription = `# Köpek Patron Neon LED Duvar Dekoru

**Açıklama Başlığı: Mekanına Karakterli ve Eğlenceli Bir Neon Dokunuş Kat! 🐶✨**

Kendine özgü tasarımıyla öne çıkan **Köpek Patron Neon LED Dekoru**, bulunduğu alana eğlenceli, modern ve dikkat çekici bir atmosfer kazandırır. Ev dekorasyonunda, çalışma alanlarında, kafelerde ve özgün bir köşe oluşturmak istediğin tüm mekanlarda güçlü bir görsel etki yaratır.

Kırılma riski taşımayan, ısınmayan ve düşük enerji tüketen esnek silikon LED teknolojisi ile üretilmiştir.

### 🛠️ Teknik Özellikler

- **Ölçüler:** 30, 40, 50 cm veya özel ölçü.
- **Malzeme:** 4 mm şeffaf, kontur kesim pleksi.
- **Aydınlatma:** 12V esnek silikon neon LED.
- **Kablo:** Yaklaşık 2 metre.
- **Paket içeriği:** Neon dekor ve 12V adaptör.

> **Hayal Et, Baskıla, Yaşa! 🐶✨** Köpek Patron Neon LED Dekoru, mekanına karakterli bir ışık katmak için hazır.`;

const productNames = [
  ["kopek-mc", "Köpek Mc Neon LED Duvar Dekoru", "Pop-Art"],
  ["fenerbahce", "Fenerbahçe Özel Seri Neon Logo", "Takımlar"],
  ["motorcu-kuru-kafa", "Motorcu Kuru Kafa Neon LED", "Pop-Art"],
  ["eriyen-dondurma-neon", "Eriyen Dondurma Neon Tabela", "Kafe & Restoranlar"],
  ["hamburger-neon", "Hamburger Neon", "Kafe & Restoranlar"],
  ["trabzonspor", "Trabzonspor Özel Seri Neon Logo", "Takımlar"],
  ["besiktas", "Beşiktaş Özel Seri Neon Logo", "Takımlar"],
  ["galatasaray", "Galatasaray Özel Seri Neon Logo", "Takımlar"],
  ["cilekli-astronot", "Çilekli Astronot Neon LED", "Ev Dekorasyon"],
  ["astronot-savasci", "Astronot Savaşçı Neon LED", "Ev Dekorasyon"],
  ["astronot-ay", "Astronot Ay Neon LED", "Ev Dekorasyon"],
  ["kopek-patron", "Köpek Patron Neon LED", "Pop-Art"],
  ["tropikal-kuru-kafa", "Tropikal Kuru Kafa Neon LED", "Pop-Art"],
  ["comic-ouch", "Comic Ouch! Pop-Art Neon", "Pop-Art"],
  ["dolar-kesesi", "Dolar Kesesi Neon LED", "Mağaza & Ofis"],
  ["gamer-el", "Gamer El & Oyun Kolu Neon", "Ev Dekorasyon"],
  ["smac-astronot", "Smaç Basan Astronot Neon LED", "Spor Salonu"],
  ["kopek-kafa", "Köpek Kafa Neon LED", "Pop-Art"],
  ["pizza-neon", "Pizza Neon LED Tabela", "Kafe & Restoranlar"],
  ["kuru-kafa-papatya", "Kuru Kafa & Papatya Neon", "Pop-Art"],
  ["gamer-oyun-kolu", "Gamer Oyun Kolu Neon", "Ev Dekorasyon"],
  ["acik-neon", "Açık Neon", "Kafe & Restoranlar"],
  ["kapali-neon", "Kapalı Neon", "Kafe & Restoranlar"],
] as const;

export const productImageDefaults: Record<
  string,
  { mainImage: string; hoverImages: string[] }
> = {
  "kopek-mc": { mainImage: "/api/urun-gorsel/pop-art/kopek-mc/ana.jpg", hoverImages: ["/api/urun-gorsel/pop-art/kopek-mc/hover.jpg"] },
  fenerbahce: { mainImage: "/api/urun-gorsel/takimlar/fenerbahce/ana.jpg", hoverImages: ["/api/urun-gorsel/takimlar/fenerbahce/hover.jpg"] },
  "motorcu-kuru-kafa": { mainImage: "/api/urun-gorsel/pop-art/motorcu-kuru-kafa/ana.jpg", hoverImages: ["/api/urun-gorsel/pop-art/motorcu-kuru-kafa/hover.jpg"] },
  "eriyen-dondurma-neon": { mainImage: "/api/urun-gorsel/kafe-restoran/dondurma/ana.jpg", hoverImages: ["/api/urun-gorsel/kafe-restoran/dondurma/hover.jpg"] },
  "hamburger-neon": { mainImage: "/api/urun-gorsel/kafe-restoran/hamburger/ana.jpg", hoverImages: ["/api/urun-gorsel/kafe-restoran/hamburger/hover.jpg"] },
  trabzonspor: { mainImage: "/api/urun-gorsel/takimlar/trabzonspor/ana.jpg", hoverImages: ["/api/urun-gorsel/takimlar/trabzonspor/hover.jpg"] },
  besiktas: { mainImage: "/api/urun-gorsel/takimlar/besiktas/ana.jpg", hoverImages: ["/api/urun-gorsel/takimlar/besiktas/hover.jpg"] },
  galatasaray: { mainImage: "/api/urun-gorsel/takimlar/galatasaray/ana.jpg", hoverImages: ["/api/urun-gorsel/takimlar/galatasaray/hover.jpg"] },
  "cilekli-astronot": { mainImage: "/api/urun-gorsel/astronot/cilekli/ana.jpg", hoverImages: ["/api/urun-gorsel/astronot/cilekli/hover.jpg"] },
  "astronot-savasci": { mainImage: "/api/urun-gorsel/astronot/savasci/ana.jpg", hoverImages: ["/api/urun-gorsel/astronot/savasci/hover.jpg"] },
  "astronot-ay": { mainImage: "/api/urun-gorsel/astronot/ay/ana.jpg", hoverImages: ["/api/urun-gorsel/astronot/ay/hover.jpg"] },
  "kopek-patron": { mainImage: "/api/urun-gorsel/pop-art/kopek-patron/ana.jpg", hoverImages: ["/api/urun-gorsel/pop-art/kopek-patron/hover.jpg"] },
  "tropikal-kuru-kafa": { mainImage: "/api/urun-gorsel/pop-art/tropikal-kuru-kafa/ana.jpg", hoverImages: ["/api/urun-gorsel/pop-art/tropikal-kuru-kafa/hover.jpg"] },
  "comic-ouch": { mainImage: "/api/urun-gorsel/pop-art/ouch/ana.jpg", hoverImages: ["/api/urun-gorsel/pop-art/ouch/hover.jpg"] },
  "dolar-kesesi": { mainImage: "/api/urun-gorsel/pop-art/dolar-kesesi/ana.jpg", hoverImages: ["/api/urun-gorsel/pop-art/dolar-kesesi/hover.jpg"] },
  "gamer-el": { mainImage: "/api/urun-gorsel/gamer/gamer-el/ana.jpg", hoverImages: ["/api/urun-gorsel/gamer/gamer-el/hover.jpg"] },
  "smac-astronot": { mainImage: "/api/urun-gorsel/astronot/smac/ana.jpg", hoverImages: ["/api/urun-gorsel/astronot/smac/hover.jpg"] },
  "kopek-kafa": { mainImage: "/api/urun-gorsel/pop-art/kopek-kafa/ana.jpg", hoverImages: ["/api/urun-gorsel/pop-art/kopek-kafa/hover.jpg"] },
  "pizza-neon": { mainImage: "/api/urun-gorsel/kafe-restoran/pizza/ana.jpg", hoverImages: ["/api/urun-gorsel/kafe-restoran/pizza/hover.jpg"] },
  "kuru-kafa-papatya": { mainImage: "/api/urun-gorsel/pop-art/kuru-kafa-papatya/ana.jpg", hoverImages: ["/api/urun-gorsel/pop-art/kuru-kafa-papatya/hover.jpg"] },
  "gamer-oyun-kolu": { mainImage: "/api/urun-gorsel/gamer/oyun-kolu/ana.jpg", hoverImages: ["/api/urun-gorsel/gamer/oyun-kolu/hover.jpg"] },
  "acik-neon": { mainImage: "/api/urun-gorsel/kafe-restoran/acik/ana.jpg", hoverImages: ["/api/urun-gorsel/kafe-restoran/acik/hover.jpg"] },
  "kapali-neon": { mainImage: "/api/urun-gorsel/kafe-restoran/kapali/ana.jpg", hoverImages: ["/api/urun-gorsel/kafe-restoran/kapali/hover.jpg"] },
};

export const defaultProducts: AdminProduct[] = productNames.map(
  ([id, title, category]) => ({
    id,
    title,
    category,
    price30: id === "eriyen-dondurma-neon" ? "3400" : "4100",
    price40: "4100",
    price50: id === "eriyen-dondurma-neon" ? "4900" : "4100",
    specialPrice: "Teklif Al",
    remoteExtra: "250",
    description: id === "kopek-patron" ? dogPatronDescription : "",
    technical: technicalTemplate,
    mainImage: productImageDefaults[id]?.mainImage || "",
    hoverImages: productImageDefaults[id]?.hoverImages || [],
  }),
);

export function createEmptyProduct(): AdminProduct {
  return {
    id: "",
    title: "",
    category: productCategories[0],
    price30: "",
    price40: "",
    price50: "",
    specialPrice: "Teklif Al",
    remoteExtra: "250",
    description: "",
    technical: technicalTemplate,
    mainImage: "",
    hoverImages: [],
  };
}

export function readAdminProducts(): AdminProduct[] {
  if (typeof window === "undefined") return defaultProducts;
  try {
    const saved = JSON.parse(window.localStorage.getItem(adminProductsKey) || "[]");
    if (!Array.isArray(saved) || saved.length === 0) return defaultProducts;
    return saved.map((product) => {
      const fallback = defaultProducts.find((item) => item.id === product.id);
      return {
        ...createEmptyProduct(),
        ...fallback,
        ...product,
        description: product.description || fallback?.description || "",
        mainImage: product.mainImage || fallback?.mainImage || "",
        hoverImages:
          Array.isArray(product.hoverImages) && product.hoverImages.length
            ? product.hoverImages
            : fallback?.hoverImages || [],
        id: String(product.id || ""),
      };
    });
  } catch {
    return defaultProducts;
  }
}

export function writeAdminProducts(products: AdminProduct[]) {
  window.localStorage.setItem(adminProductsKey, JSON.stringify(products));
  window.dispatchEvent(new Event("3dbade-products-updated"));
}

export function productId(title: string) {
  return `${title
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}-${Date.now()}`;
}
