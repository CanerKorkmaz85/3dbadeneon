"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { readAdminProducts, type AdminProduct } from "../../lib/admin-products";

const categories = [
  "Astronot Koleksiyonu",
  "Berber & Kuaför",
  "Etkinlik & Organizasyon",
  "Ev Dekorasyon",
  "Gamer Koleksiyonu",
  "Kafe & Restoranlar",
  "Mağaza & Ofis",
  "Pop-Art",
  "Spor Salonu",
  "Takımlar",
  "Ek Malzemeler",
];
const imageLibrary = "/api/urun-gorsel";
const legacyCatalogProducts = [
  {
    title: "Köpek Mc Neon LED Duvar Dekoru",
    category: "POP-ART NEON",
    image: `${imageLibrary}/pop-art/kopek-mc/ana.jpg`,
    hoverImage: `${imageLibrary}/pop-art/kopek-mc/hover.jpg`,
  },
  {
    title: "Fenerbahçe Özel Seri Neon Logo",
    category: "TAKIM LOGOSU NEON",
    image: `${imageLibrary}/takimlar/fenerbahce/ana.jpg`,
    hoverImage: `${imageLibrary}/takimlar/fenerbahce/hover.jpg`,
  },
  {
    title: "Motorcu Kuru Kafa Neon LED",
    category: "POP-ART NEON",
    image: `${imageLibrary}/pop-art/motorcu-kuru-kafa/ana.jpg`,
    hoverImage: `${imageLibrary}/pop-art/motorcu-kuru-kafa/hover.jpg`,
  },
  {
    title: "Eriyen Dondurma Neon Tabela",
    category: "KAFE & RESTORAN",
    image: `${imageLibrary}/kafe-restoran/dondurma/ana.jpg`,
    hoverImage: `${imageLibrary}/kafe-restoran/dondurma/hover.jpg`,
    href: "/urunler/eriyen-dondurma-neon",
  },
  {
    title: "Hamburger Neon",
    category: "KAFE & RESTORAN",
    image: `${imageLibrary}/kafe-restoran/hamburger/ana.jpg`,
    hoverImage: `${imageLibrary}/kafe-restoran/hamburger/hover.jpg`,
  },
  {
    title: "Trabzonspor Özel Seri Neon Logo",
    category: "TAKIM LOGOSU NEON",
    image: `${imageLibrary}/takimlar/trabzonspor/ana.jpg`,
    hoverImage: `${imageLibrary}/takimlar/trabzonspor/hover.jpg`,
  },
  {
    title: "Beşiktaş Özel Seri Neon Logo",
    category: "TAKIM LOGOSU NEON",
    image: `${imageLibrary}/takimlar/besiktas/ana.jpg`,
    hoverImage: `${imageLibrary}/takimlar/besiktas/hover.jpg`,
  },
  {
    title: "Galatasaray Özel Seri Neon Logo",
    category: "TAKIM LOGOSU NEON",
    image: `${imageLibrary}/takimlar/galatasaray/ana.jpg`,
    hoverImage: `${imageLibrary}/takimlar/galatasaray/hover.jpg`,
  },
  {
    title: "Çilekli Astronot Neon LED",
    category: "ASTRONOT KOLEKSİYONU",
    image: `${imageLibrary}/astronot/cilekli/ana.jpg`,
    hoverImage: `${imageLibrary}/astronot/cilekli/hover.jpg`,
  },
  {
    title: "Astronot Savaşçı Neon LED",
    category: "ASTRONOT KOLEKSİYONU",
    image: `${imageLibrary}/astronot/savasci/ana.jpg`,
    hoverImage: `${imageLibrary}/astronot/savasci/hover.jpg`,
  },
  {
    title: "Astronot Ay Neon LED",
    category: "ASTRONOT KOLEKSİYONU",
    image: `${imageLibrary}/astronot/ay/ana.jpg`,
    hoverImage: `${imageLibrary}/astronot/ay/hover.jpg`,
  },
  {
    title: "Köpek Patron Neon LED",
    category: "POP-ART NEON",
    image: `${imageLibrary}/pop-art/kopek-patron/ana.jpg`,
    hoverImage: `${imageLibrary}/pop-art/kopek-patron/hover.jpg`,
  },
  {
    title: "Tropikal Kuru Kafa Neon LED",
    category: "POP-ART NEON",
    image: `${imageLibrary}/pop-art/tropikal-kuru-kafa/ana.jpg`,
    hoverImage: `${imageLibrary}/pop-art/tropikal-kuru-kafa/hover.jpg`,
  },
  {
    title: "Comic Ouch! Pop-Art Neon",
    category: "POP-ART NEON",
    image: `${imageLibrary}/pop-art/ouch/ana.jpg`,
    hoverImage: `${imageLibrary}/pop-art/ouch/hover.jpg`,
  },
  {
    title: "Dolar Kesesi Neon LED",
    category: "POP-ART NEON",
    image: `${imageLibrary}/pop-art/dolar-kesesi/ana.jpg`,
    hoverImage: `${imageLibrary}/pop-art/dolar-kesesi/hover.jpg`,
  },
  {
    title: "Gamer El & Oyun Kolu Neon",
    category: "GAMER KOLEKSİYONU",
    image: `${imageLibrary}/gamer/gamer-el/ana.jpg`,
    hoverImage: `${imageLibrary}/gamer/gamer-el/hover.jpg`,
  },
  {
    title: "Smaç Basan Astronot Neon LED",
    category: "ASTRONOT KOLEKSİYONU",
    image: `${imageLibrary}/astronot/smac/ana.jpg`,
    hoverImage: `${imageLibrary}/astronot/smac/hover.jpg`,
  },
  {
    title: "Köpek Kafa Neon LED",
    category: "POP-ART NEON",
    image: `${imageLibrary}/pop-art/kopek-kafa/ana.jpg`,
    hoverImage: `${imageLibrary}/pop-art/kopek-kafa/hover.jpg`,
  },
  {
    title: "Pizza Neon LED Tabela",
    category: "KAFE & RESTORAN",
    image: `${imageLibrary}/kafe-restoran/pizza/ana.jpg`,
    hoverImage: `${imageLibrary}/kafe-restoran/pizza/hover.jpg`,
  },
  {
    title: "Kuru Kafa & Papatya Neon",
    category: "POP-ART NEON",
    image: `${imageLibrary}/pop-art/kuru-kafa-papatya/ana.jpg`,
    hoverImage: `${imageLibrary}/pop-art/kuru-kafa-papatya/hover.jpg`,
  },
  {
    title: "Gamer Oyun Kolu Neon",
    category: "GAMER KOLEKSİYONU",
    image: `${imageLibrary}/gamer/oyun-kolu/ana.jpg`,
    hoverImage: `${imageLibrary}/gamer/oyun-kolu/hover.jpg`,
  },
  {
    title: "Açık Neon",
    category: "KAFE & RESTORAN",
    image: `${imageLibrary}/kafe-restoran/acik/ana.jpg`,
    hoverImage: `${imageLibrary}/kafe-restoran/acik/hover.jpg`,
  },
  {
    title: "Kapalı Neon",
    category: "KAFE & RESTORAN",
    image: `${imageLibrary}/kafe-restoran/kapali/ana.jpg`,
    hoverImage: `${imageLibrary}/kafe-restoran/kapali/hover.jpg`,
  },
];

function matchesCategory(
  product: Pick<AdminProduct, "id" | "title" | "category">,
  category: string,
) {
  if (category === "Takımlar") return product.category === "Takımlar";
  if (category === "Astronot Koleksiyonu")
    return /astronot|smac/i.test(product.id);
  if (category === "Gamer Koleksiyonu")
    return /gamer/i.test(product.id);
  if (category === "Kafe & Restoranlar")
    return product.category === "Kafe & Restoranlar";
  if (category === "Pop-Art") return product.category === "Pop-Art";
  if (category === "Ev Dekorasyon")
    return product.category === "Ev Dekorasyon";
  if (category === "Spor Salonu") return /Smaç/.test(product.title);
  if (category === "Mağaza & Ofis")
    return product.category === "Mağaza & Ofis";
  return product.category === category;
}

export default function MagazaPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [, setCartCount] = useState(0);
  const [products, setProducts] = useState<AdminProduct[]>(readAdminProducts);
  useEffect(() => {
    const refreshProducts = () => setProducts(readAdminProducts());
    window.addEventListener("3dbade-products-updated", refreshProducts);
    window.addEventListener("storage", refreshProducts);
    return () => {
      window.removeEventListener("3dbade-products-updated", refreshProducts);
      window.removeEventListener("storage", refreshProducts);
    };
  }, []);
  const catalogProducts = products.map((product) => {
    const legacy = legacyCatalogProducts.find(
      (item) => item.title === product.title,
    );
    return {
      ...product,
      image: product.mainImage || legacy?.image || "/products/catalog/comic-ouch.jpg",
      hoverImage: product.hoverImages[0] || legacy?.hoverImage,
      href:
        product.id === "eriyen-dondurma-neon"
          ? "/urunler/eriyen-dondurma-neon"
          : `/urunler/${product.id}`,
    };
  });
  const visibleProducts =
    selectedCategory === "Tümü"
      ? catalogProducts
      : catalogProducts.filter((product) =>
          matchesCategory(product, selectedCategory),
        );

  return (
    <main className="magaza-page">
      <section className="all-products-section">
        <div className="all-products-heading">
          <span>Kategoriyi seç; ürünleri kolayca incele.</span>
        </div>
        <div className="shop-category-bar">
          <button
            className={selectedCategory === "Tümü" ? "selected" : ""}
            onClick={() => setSelectedCategory("Tümü")}
          >
            Tümü
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={selectedCategory === category ? "selected" : ""}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="all-product-status">
          <span>
            {selectedCategory === "Tümü" ? "Tüm ürünler" : selectedCategory}
          </span>
          <b>{visibleProducts.length} ürün</b>
        </div>
        {visibleProducts.length ? (
          <div className="all-product-grid">
            {visibleProducts.map((product) => (
              <article
                className={`all-product-card ${["Köpek Mc Neon LED Duvar Dekoru", "Fenerbahçe Özel Seri Neon Logo", "Motorcu Kuru Kafa Neon LED"].includes(product.title) ? "dark-card-text" : ""} ${product.category === "KAFE & RESTORAN" ? "cafe-card-text" : ""}`}
                key={product.title}
              >
                <Link
                  href={product.href}
                  className="all-product-image"
                >
                  <Image
                    unoptimized
                    className="catalog-image-main"
                    src={product.image}
                    alt={product.title}
                    width={900}
                    height={1100}
                  />
                  {product.hoverImage && (
                    <Image
                      unoptimized
                      className="catalog-image-hover"
                      src={product.hoverImage}
                      alt=""
                      aria-hidden="true"
                      width={900}
                      height={1100}
                    />
                  )}
                </Link>
                <div>
                  <small>{product.category}</small>
                  <h2>{product.title}</h2>
                  <span className="product-price">
                    <del>₺4.900</del>
                    <b>₺{Number(product.price40 || 4100).toLocaleString("tr-TR")}</b>
                  </span>
                  <button onClick={() => setCartCount((count) => count + 1)}>
                    SEPETE EKLE +
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-category">
            <b>{selectedCategory}</b>
            <span>Bu kategoriye ait ürünleri yakında ekleyeceğiz.</span>
            <button onClick={() => setSelectedCategory("Tümü")}>
              TÜM ÜRÜNLERİ GÖR
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
