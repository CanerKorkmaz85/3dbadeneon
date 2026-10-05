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

function defaultDescription(title: string, category: string) {
  if (title === "Köpek Patron Neon LED") return dogPatronDescription;
  return `# ${title}\n\n**Mekanına güçlü, modern ve dikkat çekici bir ışık dokunuşu kat.**\n\n**${title}**, 3Dbade Neon özel serisinde ${category.toLocaleLowerCase("tr-TR")} için tasarlanmış dekoratif bir neon LED üründür. Canlı ışık etkisiyle duvar, vitrin, çalışma alanı veya konsept köşelerde güçlü bir odak noktası oluşturur.\n\nYeni nesil esnek silikon neon LED teknolojisi sayesinde klasik cam neona göre daha dayanıklı, düşük enerji tüketimli ve güvenli kullanım sunar. Şeffaf pleksi taşıyıcı ile temiz ve modern bir görünüm elde edilir.\n\n### 🛠️ Teknik Özellikler\n\n- **Ölçüler:** 30, 40, 50 cm veya özel ölçü.\n- **Malzeme:** 4 mm şeffaf, kontur kesim pleksi.\n- **Aydınlatma:** 12V esnek silikon neon LED.\n- **Kablo:** Yaklaşık 2 metre.\n- **Paket içeriği:** Neon dekor ve 12V adaptör.\n\n### ✨ Neden 3Dbade Neon?\n\n- Fotojenik ve dikkat çekici tasarım\n- İç mekan kullanımı için güvenli LED teknolojisi\n- Düşük enerji tüketimi\n- Özel ölçü seçeneği\n- Güvenli paketleme ve Türkiye geneli gönderim\n\n> **Hayal Et, Baskıla, Yaşa! ✨** ${title}, mekanına karakter katmak için hazır.`;
}

export const productImageDefaults: Record<
  string,
  { mainImage: string; hoverImages: string[] }
> = {
  "kopek-mc": { mainImage: "/urun-gorselleri/pop-art/kopek-mc/ana.jpg", hoverImages: ["/urun-gorselleri/pop-art/kopek-mc/hover.jpg"] },
  fenerbahce: { mainImage: "/urun-gorselleri/takimlar/fenerbahce/ana.png", hoverImages: ["/urun-gorselleri/takimlar/fenerbahce/hover.jpg"] },
  "motorcu-kuru-kafa": { mainImage: "/urun-gorselleri/pop-art/motorcu-kuru-kafa/ana.jpg", hoverImages: ["/urun-gorselleri/pop-art/motorcu-kuru-kafa/hover.jpg"] },
  "eriyen-dondurma-neon": { mainImage: "/urun-gorselleri/kafe-restoran/dondurma/ana.jpg", hoverImages: ["/urun-gorselleri/kafe-restoran/dondurma/hover.JPG"] },
  "hamburger-neon": { mainImage: "/urun-gorselleri/kafe-restoran/hamburger/ana.jfif", hoverImages: ["/urun-gorselleri/kafe-restoran/hamburger/hover.jpg"] },
  trabzonspor: { mainImage: "/urun-gorselleri/takimlar/trabzonspor/ana.jpg", hoverImages: ["/urun-gorselleri/takimlar/trabzonspor/hover.JPG"] },
  besiktas: { mainImage: "/urun-gorselleri/takimlar/besiktas/ana.jpg", hoverImages: ["/urun-gorselleri/takimlar/besiktas/hover.jpg"] },
  galatasaray: { mainImage: "/urun-gorselleri/takimlar/galatasaray/ana.jpg", hoverImages: ["/urun-gorselleri/takimlar/galatasaray/hover.jpg"] },
  "cilekli-astronot": { mainImage: "/urun-gorselleri/astronot/cilekli/ana.jpg", hoverImages: ["/urun-gorselleri/astronot/cilekli/hover.jpg"] },
  "astronot-savasci": { mainImage: "/urun-gorselleri/astronot/savasci/ana.jpg", hoverImages: ["/urun-gorselleri/astronot/savasci/hover.jpg"] },
  "astronot-ay": { mainImage: "/urun-gorselleri/astronot/ay/ana.jpg", hoverImages: ["/urun-gorselleri/astronot/ay/hover.jpg"] },
  "kopek-patron": { mainImage: "/urun-gorselleri/pop-art/kopek-patron/ana.jpg", hoverImages: ["/urun-gorselleri/pop-art/kopek-patron/hover.jpg"] },
  "tropikal-kuru-kafa": { mainImage: "/urun-gorselleri/pop-art/tropikal-kuru-kafa/ana.jpg", hoverImages: ["/urun-gorselleri/pop-art/tropikal-kuru-kafa/hover.jpg"] },
  "comic-ouch": { mainImage: "/urun-gorselleri/pop-art/ouch/ana.jpg", hoverImages: ["/urun-gorselleri/pop-art/ouch/hover.jpg"] },
  "dolar-kesesi": { mainImage: "/urun-gorselleri/pop-art/dolar-kesesi/ana.jpg", hoverImages: ["/urun-gorselleri/pop-art/dolar-kesesi/hover.JPG"] },
  "gamer-el": { mainImage: "/urun-gorselleri/gamer/gamer-el/ana.jpg", hoverImages: ["/urun-gorselleri/gamer/gamer-el/hover.jpg"] },
  "smac-astronot": { mainImage: "/urun-gorselleri/astronot/smac/ana.jpg", hoverImages: ["/urun-gorselleri/astronot/smac/hover.jpg"] },
  "kopek-kafa": { mainImage: "/urun-gorselleri/pop-art/kopek-kafa/ana.jpg", hoverImages: ["/urun-gorselleri/pop-art/kopek-kafa/hover.jpg"] },
  "pizza-neon": { mainImage: "/urun-gorselleri/kafe-restoran/pizza/ana.jpg", hoverImages: ["/urun-gorselleri/kafe-restoran/pizza/hover.jpg"] },
  "kuru-kafa-papatya": { mainImage: "/urun-gorselleri/pop-art/kuru-kafa-papatya/ana.jpg", hoverImages: ["/urun-gorselleri/pop-art/kuru-kafa-papatya/hover.jpg"] },
  "gamer-oyun-kolu": { mainImage: "/urun-gorselleri/gamer/oyun-kolu/ana.jfif", hoverImages: ["/urun-gorselleri/gamer/oyun-kolu/hover.jpg"] },
  "acik-neon": { mainImage: "/urun-gorselleri/kafe-restoran/acik/ana.jpg", hoverImages: ["/urun-gorselleri/kafe-restoran/acik/hover.jpg"] },
  "kapali-neon": { mainImage: "/urun-gorselleri/kafe-restoran/kapali/ana.jpg", hoverImages: ["/urun-gorselleri/kafe-restoran/kapali/hover.jpg"] },
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
    description: defaultDescription(title, category),
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
