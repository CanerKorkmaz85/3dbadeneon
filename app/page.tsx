"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SocialIconLinks from "../components/SocialIconLinks";

// Yeni eklenecek tüm neon ürünleri de bu standart fiyatla tanımlanacak.
const NEON_PRICE = "₺3.950";

const designFonts = [
  "Junkyard",
  "Neoneon",
  "Quinzey",
  "Neontubes",
  "Kıona",
  "Beon",
  "Alexa",
  "Racket",
  "Beachfont",
  "Greenworld",
  "Loveneon",
  "Mayfair",
  "Özel",
];
const designColors = [
  { name: "Pembe", value: "#ff4cbd" },
  { name: "Gök mavisi", value: "#62eaff" },
  { name: "Mavi", value: "#2468ff" },
  { name: "Beyaz", value: "#ffffff" },
  { name: "Gün ışığı", value: "#ffe3a0" },
  { name: "Sarı", value: "#ffe943" },
  { name: "Yeşil", value: "#64e873" },
  { name: "Kırmızı", value: "#ff4b4b" },
  { name: "Turuncu", value: "#ff8845" },
  {
    name: "RGB",
    value: "linear-gradient(135deg,#ff4cbd,#62eaff,#d9ff3c,#ff8845)",
  },
];
const designHeights = ["30 cm", "40 cm", "50 cm", "70 cm", "90 cm", "Özel"];
const designBasePrices: Record<string, number> = {
  "30 cm": 1800,
  "40 cm": 2350,
  "50 cm": 2950,
  "70 cm": 3950,
  "90 cm": 5250,
  Özel: 3950,
};
const designPreviewSizes: Record<string, string> = {
  "30 cm": "clamp(42px,4.5vw,54px)",
  "40 cm": "clamp(48px,5.4vw,66px)",
  "50 cm": "clamp(56px,6.3vw,78px)",
  "70 cm": "clamp(66px,7.5vw,94px)",
  "90 cm": "clamp(78px,9vw,116px)",
  Özel: "clamp(66px,7.5vw,94px)",
};
const products = [
  {
    title: "Hamburger Neon",
    price: NEON_PRICE,
    word: "BURGER",
    color: "#ff3eaa",
    image: "/api/urun-gorsel/kafe-restoran/hamburger/ana.jpg",
    hoverImage: "/api/urun-gorsel/kafe-restoran/hamburger/hover.jpg",
  },
  {
    title: "Dondurma Neon",
    price: NEON_PRICE,
    word: "DONDURMA",
    color: "#ff71bd",
    image: "/api/urun-gorsel/kafe-restoran/dondurma/ana.jpg",
    hoverImage: "/api/urun-gorsel/kafe-restoran/dondurma/hover.jpg",
    href: "/urunler/eriyen-dondurma-neon",
  },
  {
    title: "Pizza Neon",
    price: NEON_PRICE,
    word: "PIZZA",
    color: "#d9ff36",
    image: "/api/urun-gorsel/kafe-restoran/pizza/ana.jpg",
    hoverImage: "/api/urun-gorsel/kafe-restoran/pizza/hover.jpg",
  },
  {
    title: "Açık / Kapalı Neon",
    price: NEON_PRICE,
    word: "AÇIK",
    color: "#57eaff",
    image: "/api/urun-gorsel/kafe-restoran/acik/ana.jpg",
    hoverImage: "/api/urun-gorsel/kafe-restoran/acik/hover.jpg",
  },
];
const burgerFeatureImages = [
  "/products/burger/burger-feature-1.jfif",
  "/products/burger/burger-feature-2.jfif",
  "/products/burger/burger-feature-3.jfif",
];
const teamVideoScenes = [
  {
    src: "/video/teams/fenerbahce-wall.png",
    alt: "Fenerbahçe neon tabelanın gerçek duvar uygulaması",
  },
  {
    src: "/video/teams/fenerbahce-flat.jpg",
    alt: "Fenerbahçe neon tabela yakın ürün görünümü",
  },
  {
    src: "/video/teams/galatasaray-wall.png",
    alt: "Galatasaray neon tabelanın gerçek duvar uygulaması",
  },
  {
    src: "/video/teams/galatasaray-flat.jpg",
    alt: "Galatasaray neon tabela yakın ürün görünümü",
  },
  {
    src: "/api/urun-gorsel/takimlar/besiktas/ana.jpg",
    alt: "Beşiktaş neon tabela yakın ürün görünümü",
  },
  {
    src: "/api/urun-gorsel/takimlar/besiktas/hover.jpg",
    alt: "Beşiktaş neon tabelanın ofis uygulaması",
  },
  {
    src: "/video/teams/trabzonspor-wall.png",
    alt: "Trabzonspor neon tabelanın gerçek duvar uygulaması",
  },
  {
    src: "/video/teams/trabzonspor-flat.jpg",
    alt: "Trabzonspor neon tabela yakın ürün görünümü",
  },
];
const reviews = [
  {
    name: "Elif A.",
    score: 5,
    text: "Tasarım sürecinde her detayı birlikte netleştirdik. Mekanda çok şık durdu.",
  },
  {
    name: "Mert K.",
    score: 4,
    text: "Renk ve ölçü konusunda hızlı destek aldım. Teslim edilen ürün çok kaliteli.",
  },
  {
    name: "Zeynep T.",
    score: 4,
    text: "Kafemiz için yaptırdık; müşterilerimiz sürekli tabelayı soruyor.",
  },
  {
    name: "Can D.",
    score: 5,
    text: "Logomuzun neon halini tam istediğimiz gibi hazırladılar.",
  },
  {
    name: "Seda B.",
    score: 4,
    text: "Kurulumu kolaydı, paketleme de oldukça güvenliydi.",
  },
  {
    name: "Oğuz E.",
    score: 4,
    text: "Ofisimiz için özel tasarım yaptırdık. İletişim çok iyiydi.",
  },
  {
    name: "Büşra Y.",
    score: 4,
    text: "Fotoğraflardakinden daha canlı görünüyor. Çok memnun kaldık.",
  },
  {
    name: "Arda S.",
    score: 4,
    text: "İstediğimiz ölçüye göre çözüm sundular, süreç sorunsuz ilerledi.",
  },
];
const teamCollection = [
  {
    src: "/video/teams/fenerbahce-flat.jpg",
    alt: "Fenerbahçe neon tabela",
    title: "Fenerbahçe Neon",
  },
  {
    src: "/video/teams/galatasaray-flat.jpg",
    alt: "Galatasaray neon tabela",
    title: "Galatasaray Neon",
  },
  {
    src: "/products/catalog/besiktas-logo.jpg",
    alt: "Beşiktaş tek logo neon",
    title: "Beşiktaş Neon",
  },
  {
    src: "/video/teams/trabzonspor-flat.jpg",
    alt: "Trabzonspor neon tabela",
    title: "Trabzonspor Neon",
  },
];
const popArtCollection = [
  {
    src: "/products/catalog/kopek-mc.jpg",
    alt: "Köpek MC pop-art neon",
    title: "Köpek Mc Neon",
  },
  {
    src: "/products/catalog/motorcu-kuru-kafa.jpg",
    alt: "Motorcu kuru kafa pop-art neon",
    title: "Motorcu Kuru Kafa Neon",
  },
  {
    src: "/products/catalog/comic-ouch.jpg",
    alt: "Ouch pop-art neon",
    title: "Ouch Neon",
  },
  {
    src: "/products/catalog/tropikal-kuru-kafa.jpg",
    alt: "Tropikal kuru kafa pop-art neon",
    title: "Tropikal Kuru Kafa Neon",
  },
];
const threeDPrintingCards = [
  {
    src: "/uploads/kardan-adam-fig-r-1792705094255/ana-1792705094289-n2lp9h.jpg",
    hoverSrc:
      "/uploads/kardan-adam-fig-r-1792705094255/galeri-1-1792705094293-6dsowj.jpg",
    alt: "3D baskı kardan adam figürü",
    title: "Kardan Adam Figürü",
  },
  {
    src: "/uploads/noel-baba-fig-r-1792705971665/ana-1792705971679-vc0nr0.jpg",
    hoverSrc:
      "/uploads/noel-baba-fig-r-1792705971665/galeri-1-1792705971681-xd2059.jpg",
    alt: "3D baskı Noel Baba figürü",
    title: "Noel Baba Figürü",
  },
  {
    src: "/uploads/kardan-adam-fig-r-1792705094255/galeri-2-1792705094294-706ccv.jpg",
    hoverSrc:
      "/uploads/kardan-adam-fig-r-1792705094255/galeri-3-1792705094296-l988nz.jpg",
    alt: "Özel ölçü 3D baskı dekoratif figür",
    title: "Özel Ölçü Figürler",
  },
];

const signageCards = [
  {
    title: "Kutu Harf Sistemleri",
    description: "3 boyutlu, ışıklı veya ışıksız tabela çözümleri",
    href: "/tabela-sistemleri/kutu-harf",
    tone: "letter",
    image: "/signage/kutu-harf.jpg",
  },
  {
    title: "Işıklı Tabelalar",
    description: "Gece ve gündüz yüksek görünürlük",
    href: "/tabela-sistemleri",
    tone: "light",
    image: "/signage/isikli-tabela.jpg",
  },
  {
    title: "Cephe Tabelaları",
    description: "Mağaza, restoran ve kurumsal yapılar için",
    href: "/tabela-sistemleri",
    tone: "facade",
    image: "/signage/cephe-tabelasi.jpg",
  },
  {
    title: "Totem & Yönlendirme",
    description: "İç ve dış mekân yönlendirme sistemleri",
    href: "/tabela-sistemleri",
    tone: "totem",
    image: "/signage/totem-yonlendirme.jpg",
  },
];

const metalCards = [
  "Mimari Paslanmaz Uygulamalar",
  "Dekoratif Metal",
  "Özel Metal İmalat",
  "Paslanmaz Kaplama",
  "İç Mekân Metal Uygulamaları",
  "Dış Mekân Metal Uygulamaları",
];

function HeaderIcon({ name }: { name: "search" | "account" | "cart" }) {
  if (name === "search")
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="10.8" cy="10.8" r="5.8" />
        <path d="m15.2 15.2 4.3 4.3" />
      </svg>
    );
  if (name === "account")
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5.2 20c.8-3.4 3.2-5.2 6.8-5.2s6 1.8 6.8 5.2" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.5 4.5h2.1l1.6 10.1h10.4l2-7.4H7" />
      <circle cx="9" cy="19" r="1.1" />
      <circle cx="17" cy="19" r="1.1" />
    </svg>
  );
}

export default function Home() {
  const [activePanel, setActivePanel] = useState<
    "search" | "account" | "cart" | null
  >(null);
  const [cartItems, setCartItems] = useState<
    Array<{ title: string; price: number }>
  >([]);
  const [burgerFeatureFrame, setBurgerFeatureFrame] = useState(0);
  const [isDondurmaHovered, setIsDondurmaHovered] = useState(false);
  const [isPizzaHovered, setIsPizzaHovered] = useState(false);
  const [isOpenClosedHovered, setIsOpenClosedHovered] = useState(false);
  const [designMode, setDesignMode] = useState<"text" | "logo">("text");
  const [designText, setDesignText] = useState("3DbadeNeon");
  const [designColor, setDesignColor] = useState(designColors[0].value);
  const [designHeight, setDesignHeight] = useState("70 cm");
  const [designFont, setDesignFont] = useState("Beachfont");
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">(
    "center",
  );
  const [uploadedLogo, setUploadedLogo] = useState("");
  const [designBackground, setDesignBackground] = useState("studio");
  const [designLedType, setDesignLedType] = useState("Tek renk LED");
  const [plexiCut, setPlexiCut] = useState("Kontur");
  const [plexiColor, setPlexiColor] = useState("Saydam");
  const [usagePlace, setUsagePlace] = useState("İç mekan");
  const [transformer, setTransformer] = useState("Eklensin");
  const [designNotes, setDesignNotes] = useState("");
  const addToCart = (
    title: string,
    price = title.startsWith("Özel")
      ? (designBasePrices[designHeight] || 0) +
        (designLedType === "RGB" ? 850 : 0) +
        (usagePlace === "Dış mekan" ? 1250 : 0) +
        (transformer === "Eklensin" ? 350 : 0)
      : 3950,
  ) => {
    setCartItems((items) => [...items, { title, price }]);
    setActivePanel("cart");
  };
  const designPrice =
    (designBasePrices[designHeight] || 0) +
    (designLedType === "RGB" ? 850 : 0) +
    (usagePlace === "Dış mekan" ? 1250 : 0) +
    (transformer === "Eklensin" ? 350 : 0);
  const previewTextLength = Math.max(
    (designText || "3DbadeNeon").replace(/\n/g, "").length,
    1,
  );
  const plexiTextFitSize = `${Math.max(42, Math.min(120, 560 / previewTextLength))}px`;
  const whatsappOrderLink =
    "https://wa.me/905327079923?text=Merhaba%2C%20Hamburger%20Neon%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.";

  return (
    <main className="storefront">
      <div className="ticker">
        <span>
          ⚡ LOGONU NEON TABELAYA DÖNÜŞTÜR · ÜCRETSİZ TASARIM DESTEĞİ · TÜM
          TÜRKİYE&apos;YE ÜCRETSİZ KARGO ⚡
        </span>
        <span>
          ⚡ LOGONU NEON TABELAYA DÖNÜŞTÜR · ÜCRETSİZ TASARIM DESTEĞİ · TÜM
          TÜRKİYE&apos;YE ÜCRETSİZ KARGO ⚡
        </span>
      </div>
      <header className="store-header">
        <a className="store-brand logo-brand" href="#anasayfa">
          <Image
            src="/brand/3dbade-neon-logo.png"
            alt="3dBade Neon"
            width={240}
            height={133}
            priority
          />
        </a>
        <div className="store-actions">
          <button
            onClick={() =>
              setActivePanel(activePanel === "search" ? null : "search")
            }
            aria-label="Ara"
          >
            <HeaderIcon name="search" />
          </button>
          <button
            onClick={() =>
              setActivePanel(activePanel === "account" ? null : "account")
            }
            aria-label="Kullanıcı girişi"
          >
            <HeaderIcon name="account" />
          </button>
          <button
            onClick={() =>
              setActivePanel(activePanel === "cart" ? null : "cart")
            }
            aria-label="Sepet"
          >
            <HeaderIcon name="cart" />
            <small>{cartItems.length}</small>
          </button>
        </div>
        {activePanel === "search" && (
          <div className="header-panel search-panel">
            <label htmlFor="site-search">Ne arıyorsun?</label>
            <input id="site-search" autoFocus placeholder="Ürün ara..." />
            <span>
              Arama sonuçlarını ürün sayfalarıyla birlikte ekleyeceğiz.
            </span>
          </div>
        )}
        {activePanel === "account" && (
          <div className="header-panel account-panel">
            <strong>3dBade hesabın</strong>
            <span>
              Siparişlerini takip etmek ve tasarım taleplerini görmek için giriş
              yap.
            </span>
            <button className="panel-primary">GİRİŞ YAP</button>
            <button className="panel-secondary">HESAP OLUŞTUR</button>
          </div>
        )}
        {activePanel === "cart" && (
          <div className="header-panel cart-panel">
            <strong>
              Sepetim <small>{cartItems.length} ürün</small>
            </strong>
            {cartItems.length === 0 ? (
              <span>Sepetin henüz boş.</span>
            ) : (
              <>
                <ul>
                  {cartItems.map((item, index) => (
                    <li key={`${item.title}-${index}`}>
                      <span>
                        {item.title}
                        <small>₺{item.price.toLocaleString("tr-TR")}</small>
                      </span>
                      <button
                        onClick={() =>
                          setCartItems((items) =>
                            items.filter((_, itemIndex) => itemIndex !== index),
                          )
                        }
                        aria-label={`${item.title} ürünü sepetten kaldır`}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
                <b>
                  Toplam: ₺
                  {cartItems
                    .reduce((total, item) => total + item.price, 0)
                    .toLocaleString("tr-TR")}
                </b>
                <button className="panel-primary">SEPETE GİT</button>
              </>
            )}
          </div>
        )}
      </header>
      <nav className="collection-nav">
        <a href="/3d-baski">3D Baskı</a>
        <a href="/magaza">Neon LED</a>
        <a href="/tabela-sistemleri">Tabela Sistemleri</a>
        <a href="/paslanmaz-metal">Paslanmaz &amp; Metal</a>
        <a href="#sss">Sık Sorulan Sorular</a>
        <Link href="/iletisim">İletişim</Link>
      </nav>
      <section id="anasayfa" className="shop-hero team-hero">
        <div className="team-video" aria-label="Takım neonları kısa gösterimi">
          {teamVideoScenes.map((scene, index) => (
            <Image
              key={scene.src}
              className="team-video-scene"
              style={{ "--scene": index } as React.CSSProperties}
              src={scene.src}
              alt={scene.alt}
              width={1408}
              height={992}
              priority={index < 2}
            />
          ))}
          <div className="team-video-shade" />
        </div>
        <div className="team-hero-caption">
          <p>Takımının ruhunu, mekanına özel neon tasarımla yansıt.</p>
          <span>Takımını ışığa dönüştür</span>
        </div>
      </section>
      <section id="urunler" className="shop-section featured-section">
        <div className="shop-title-row">
          <div>
            <p>EN ÇOK TERCİH EDİLENLER</p>
            <h2>Öne Çıkan Ürünler</h2>
          </div>
          <a href="/magaza">TÜM ÜRÜNLERİ GÖR →</a>
        </div>
        <div className="shop-product-grid">
          {products.map((product) => {
            const isBurger = product.title === "Hamburger Neon";
            const isDondurma = product.title === "Dondurma Neon";
            const isPizza = product.title === "Pizza Neon";
            const isOpenClosed = product.title === "Açık / Kapalı Neon";
            const productImage = isBurger
              ? burgerFeatureFrame === 0
                ? product.image
                : burgerFeatureFrame === 1
                  ? product.hoverImage
                  : burgerFeatureImages[2]
              : isDondurma
                ? isDondurmaHovered
                  ? product.hoverImage
                  : product.image
                : isPizza
                  ? isPizzaHovered
                    ? product.hoverImage
                    : product.image
                  : isOpenClosed
                    ? isOpenClosedHovered
                      ? product.hoverImage
                      : product.image
                    : product.image;
            return (
              <article className="shop-product" key={product.title}>
                <a
                  href={"href" in product ? product.href : "#ozel-tasarim"}
                  className={`shop-product-image ${product.image ? "real-product" : ""} ${isOpenClosed ? "open-closed-image" : ""}`}
                  style={{ "--neon": product.color } as React.CSSProperties}
                  onMouseEnter={
                    isBurger
                      ? () => setBurgerFeatureFrame(1)
                      : isDondurma
                        ? () => setIsDondurmaHovered(true)
                        : isPizza
                          ? () => setIsPizzaHovered(true)
                          : isOpenClosed
                            ? () => setIsOpenClosedHovered(true)
                            : undefined
                  }
                  onMouseMove={
                    isBurger
                      ? () =>
                          setBurgerFeatureFrame((frame) =>
                            frame === 1 ? 2 : frame,
                          )
                      : undefined
                  }
                  onMouseLeave={
                    isBurger
                      ? () => setBurgerFeatureFrame(0)
                      : isDondurma
                        ? () => setIsDondurmaHovered(false)
                        : isPizza
                          ? () => setIsPizzaHovered(false)
                          : isOpenClosed
                            ? () => setIsOpenClosedHovered(false)
                            : undefined
                  }
                >
                  {product.image ? (
                    <Image
                      unoptimized
                      src={productImage}
                      alt={`${product.title} kullanım örneği`}
                      width={680}
                      height={1024}
                    />
                  ) : (
                    <>
                      <span>{product.word}</span>
                      <b>3DBADE</b>
                    </>
                  )}
                  <em className="discount-badge">-%20</em>
                </a>
                <div className="shop-product-info">
                  <h3>{product.title}</h3>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <section id="tasarla" className="designer-section">
        <div className="designer-heading">
          <h2>Kendin Tasarla.</h2>
          <span>
            Yazını veya logonu seç; seçeneklerini değiştirerek neonunun ilk
            görünümünü oluştur.
          </span>
        </div>
        <div className="designer-layout">
          <div className={`designer-preview preview-${designBackground}`}>
            <div className="preview-note">✦ CANLI ÖNİZLEME</div>
            <div
              className={`neon-preview align-${textAlign} font-${designFont.toLowerCase()} ${designLedType === "RGB" ? "rgb-preview" : ""} ${plexiCut === "Plaka" ? "plexi-plate" : "plexi-contour"} plate-${plexiColor.toLowerCase()}`}
              data-text={
                designMode === "text" ? designText || "3DbadeNeon" : "LOGON"
              }
              style={
                {
                  "--design-color": designColor,
                  "--preview-font-size": designPreviewSizes[designHeight],
                  "--text-fit-size": plexiTextFitSize,
                } as React.CSSProperties
              }
            >
              {designMode === "text" ? (
                <span
                  className="neon-copy"
                  data-text={designText || "3DbadeNeon"}
                >
                  {designText || "3DbadeNeon"}
                </span>
              ) : (
                <>
                  <b className="logo-preview-copy">LOGON</b>
                  <small>{uploadedLogo || "Logo dosyanı yükle"}</small>
                </>
              )}
            </div>
            <div className="preview-background-picker">
              {[
                { id: "gray", label: "Gri duvar" },
                { id: "living", label: "Salon" },
                { id: "office", label: "Ofis" },
                { id: "youth", label: "Genç odası" },
              ].map((background) => (
                <button
                  key={background.id}
                  aria-label={`${background.label} arka planını seç`}
                  className={
                    designBackground === background.id
                      ? `selected bg-${background.id}`
                      : `bg-${background.id}`
                  }
                  onClick={() => setDesignBackground(background.id)}
                >
                  <span>{background.label}</span>
                </button>
              ))}
            </div>
            <div className="preview-size">
              {designHeight} · {plexiCut === "Kontur" ? "Kontör" : plexiCut}{" "}
              kesim · {usagePlace}
            </div>
          </div>
          <div className="designer-controls">
            <div className="designer-tabs">
              <button
                className={designMode === "text" ? "selected" : ""}
                onClick={() => setDesignMode("text")}
              >
                KENDİN TASARLA
              </button>
              <button
                className={designMode === "logo" ? "selected" : ""}
                onClick={() => setDesignMode("logo")}
              >
                ◈ LOGONU YÜKLE
              </button>
            </div>
            {designMode === "text" ? (
              <>
                <label>Ne yazsın?</label>
                <textarea
                  value={designText}
                  maxLength={26}
                  onChange={(event) => setDesignText(event.target.value)}
                  placeholder="Örn. CANER'S BAR"
                />
                <label>1. Yazı Tipi</label>
                <div className="font-options font-grid">
                  {designFonts.map((font) => (
                    <button
                      key={font}
                      className={designFont === font ? "selected" : ""}
                      onClick={() => setDesignFont(font)}
                    >
                      {font}
                    </button>
                  ))}
                </div>
                <label>2. Satır</label>
                <div className="material-options text-align-options">
                  {[
                    { id: "left", label: "Solda" },
                    { id: "center", label: "Ortada" },
                    { id: "right", label: "Sağda" },
                  ].map((align) => (
                    <button
                      key={align.id}
                      className={textAlign === align.id ? "selected" : ""}
                      onClick={() =>
                        setTextAlign(align.id as "left" | "center" | "right")
                      }
                    >
                      {align.label}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <label>Logo veya görselini yükle</label>
                <label className="upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      setUploadedLogo(event.target.files?.[0]?.name || "")
                    }
                  />
                  <b>GÖRSEL SEÇ</b>
                  <span>{uploadedLogo || "PNG, JPG veya logo dosyan"}</span>
                </label>
              </>
            )}
            <label>2. Renk</label>
            <div className="color-options">
              {designColors.map((color) => (
                <button
                  key={color.name}
                  title={color.name}
                  aria-label={`${color.name} rengini seç`}
                  className={designColor === color.value ? "selected" : ""}
                  style={{ background: color.value }}
                  onClick={() => {
                    setDesignColor(color.value);
                    setDesignLedType(
                      color.name === "RGB" ? "RGB" : "Tek renk LED",
                    );
                  }}
                >
                  <span>{color.name}</span>
                </button>
              ))}
            </div>
            <label>3. Harf Yüksekliği</label>
            <div className="size-options height-options">
              {designHeights.map((height) => (
                <button
                  key={height}
                  className={designHeight === height ? "selected" : ""}
                  onClick={() => setDesignHeight(height)}
                >
                  {height}
                </button>
              ))}
            </div>
            <label>4. Pleksi Kesim</label>
            <div className="material-options">
              {["Kontur", "Plaka"].map((option) => (
                <button
                  key={option}
                  className={plexiCut === option ? "selected" : ""}
                  onClick={() => setPlexiCut(option)}
                >
                  {option === "Kontur" ? "Kontör" : option}
                </button>
              ))}
            </div>
            <label>5. Plaka Rengi</label>
            <div className="material-options">
              {["Saydam", "Siyah"].map((option) => (
                <button
                  key={option}
                  className={plexiColor === option ? "selected" : ""}
                  onClick={() => setPlexiColor(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <label>6. Kullanım Yeri</label>
            <div className="material-options">
              {["İç mekan", "Dış mekan"].map((option) => (
                <button
                  key={option}
                  className={usagePlace === option ? "selected" : ""}
                  onClick={() => setUsagePlace(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <label>7. Trafo</label>
            <div className="material-options">
              {["Eklensin", "Eklenmesin"].map((option) => (
                <button
                  key={option}
                  className={transformer === option ? "selected" : ""}
                  onClick={() => setTransformer(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <label>8. Notlar</label>
            <textarea
              className="notes-area"
              value={designNotes}
              maxLength={300}
              onChange={(event) => setDesignNotes(event.target.value)}
              placeholder="Tasarım ile ilgili notunuzu yazın..."
            />
            <div className="designer-price">
              <span>SANA ÖZEL ÜRETİM</span>
              <strong>₺{designPrice.toLocaleString("tr-TR")}</strong>
              <small>
                Seçimlerine göre taslak fiyat · Ücretsiz kargo · 2 yıl garanti
              </small>
            </div>
            <button
              className="designer-add"
              onClick={() =>
                addToCart(
                  designMode === "text"
                    ? `Özel Yazı Neon: ${designText || "3DbadeNeon"}`
                    : `Özel Logo Neon: ${uploadedLogo || "Logo tasarımı"}`,
                )
              }
            >
              TASARIMI SEPETE EKLE +
            </button>
          </div>
        </div>
      </section>
      <section className="trust-strip">
        <div>
          <b>✓</b>
          <span>
            <strong>ÜCRETSİZ KARGO</strong>Tüm Türkiye&apos;ye güvenli gönderim
          </span>
        </div>
        <div>
          <b>✦</b>
          <span>
            <strong>SANA ÖZEL ÜRETİM</strong>Her ürün siparişin için hazırlanır
          </span>
        </div>
        <div>
          <b>▣</b>
          <span>
            <strong>GÜVENLİ ÖDEME</strong>Güvenli ödeme altyapısı
          </span>
        </div>
        <div>
          <b>♥</b>
          <span>
            <strong>2 YIL GARANTİ</strong>Üretici garantisiyle yanında
          </span>
        </div>
      </section>
      <section id="koleksiyonlar" className="collection-section">
        <div className="visual-collection">
          <h2>Takımlar</h2>
          <div className="four-visual-grid">
            {teamCollection.map((item) => (
              <article className="collection-item" key={item.src}>
                <a href="#ozel-tasarim" className="collection-visual">
                  <Image
                    className="collection-image-main"
                    src={item.src}
                    alt={item.alt}
                    width={900}
                    height={1200}
                  />
                  {"hoverSrc" in item && typeof item.hoverSrc === "string" && (
                    <Image
                      className="collection-image-hover"
                      src={item.hoverSrc}
                      alt=""
                      aria-hidden="true"
                      width={900}
                      height={1200}
                    />
                  )}
                </a>
                <span className="collection-visual-title">{item.title}</span>
              </article>
            ))}
          </div>
        </div>
        <div className="visual-collection">
          <h2>Pop-art</h2>
          <div className="four-visual-grid">
            {popArtCollection.map((item) => (
              <article className="collection-item" key={item.src}>
                <a href="#ozel-tasarim" className="collection-visual">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={900}
                    height={1200}
                  />
                </a>
                <span className="collection-visual-title">{item.title}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section id="3d-baski" className="venue-collection-section home-3d-section">
        <p>3D BASKI KOLEKSİYONU</p>
        <div className="venue-collection">
          <div className="venue-title-row">
            <div>
              <h2>Fikrini üç boyutlu üretelim.</h2>
            </div>
            <a href="/3d-baski">3D BASKILARI İNCELE →</a>
          </div>
          <div className="venue-grid">
            {threeDPrintingCards.map((card) => (
              <article className="venue-card-wrap" key={card.src}>
                <a href="/3d-baski" className="venue-card">
                  <Image
                    className="venue-image venue-image-main"
                    src={card.src}
                    alt={card.alt}
                    width={1200}
                    height={900}
                  />
                  <Image
                    className="venue-image venue-image-hover"
                    src={card.hoverSrc}
                    alt=""
                    aria-hidden="true"
                    width={1200}
                    height={900}
                  />
                </a>
                <span className="venue-card-title">{card.title}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section id="tabela-sistemleri" className="home-service-section home-signage-section">
        <div className="home-service-heading">
          <p>TABELA SİSTEMLERİ</p>
          <h2>Markanız için doğru tabela çözümü.</h2>
          <span>
            Malzeme, aydınlatma ve uygulama biçimini mekanınıza göre birlikte
            belirleyelim.
          </span>
        </div>
        <div className="home-signage-grid">
          {signageCards.map((card) => (
            <Link
              href={card.href}
              className={`home-signage-card tone-${card.tone}`}
              key={card.title}
            >
              <Image
                className="signage-card-image"
                src={card.image}
                alt=""
                aria-hidden="true"
                width={1200}
                height={720}
              />
              <div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <b>İncele →</b>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section id="paslanmaz-metal" className="home-service-section home-metal-section">
        <div className="home-service-heading">
          <p>PASLANMAZ &amp; METAL</p>
          <h2>Detayda güçlü, mekânda kalıcı.</h2>
          <span>
            Kutu harften ayrı; mimari, dekoratif ve özel üretim metal
            uygulamalar.
          </span>
        </div>
        <div className="home-metal-grid">
          {metalCards.map((title, index) => (
            <Link
              href="/paslanmaz-metal"
              className={`home-metal-card metal-tone-${index + 1}`}
              key={title}
            >
              <span className="metal-card-number" aria-hidden="true">
                0{index + 1}
              </span>
              <span className="metal-card-shape" aria-hidden="true" />
              <span>
                <b>{title}</b>
                <small>İncele →</small>
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="why-section">
        <h2>Neden 3dBade Neon?</h2>
        <div>
          <article>
            <b>01</b>
            <h3>3D Baskı + Neon</h3>
            <p>Özgün tasarımı, neonun ışığıyla birleştiriyoruz.</p>
          </article>
          <article>
            <b>02</b>
            <h3>Kolay Kurulum</h3>
            <p>Ürünün hazır olsun; kolayca mekanına yerleştir.</p>
          </article>
          <article>
            <b>03</b>
            <h3>İletişimde Yanındayız</h3>
            <p>Tasarım fikrinden teslimata kadar seni dinliyoruz.</p>
          </article>
        </div>
      </section>
      <section className="reviews-section" aria-labelledby="reviews-title">
        <div className="reviews-heading">
          <div>
            <p>MÜŞTERİ DENEYİMLERİ</p>
            <h2 id="reviews-title">Sizden gelen yorumlar</h2>
          </div>
          <div
            className="review-average"
            aria-label="Ortalama puan 4,2 üzerinden 5"
          >
            <strong>4,2</strong>
            <span>★★★★★</span>
            <small>8 değerlendirme</small>
          </div>
        </div>
        <div className="reviews-grid">
          {reviews.map((review) => (
            <article className="review-card" key={review.name}>
              <div>
                <b>{review.name}</b>
                <span aria-label={`${review.score} üzerinden 5 puan`}>
                  {"★".repeat(review.score)}
                  <i>{"★".repeat(5 - review.score)}</i>
                </span>
              </div>
              <p>{review.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="sss" className="faq-section">
        <h2>Sıkça Sorulan Sorular</h2>
        <details open>
          <summary>Kendi logomu veya yazımı neon yaptırabilir miyim?</summary>
          <p>
            Evet. Tasarımını gönder; uygun ölçü ve renk seçenekleriyle sana özel
            teklif hazırlayalım.
          </p>
        </details>
        <details>
          <summary>Ne kadar sürede hazırlanır?</summary>
          <p>
            Üretim süresi tasarımın detayına göre netleşir; sipariş aşamasında
            seni bilgilendiririz.
          </p>
        </details>
        <details>
          <summary>Ürünlerin garantisi var mı?</summary>
          <p>Her ürün üretim hatalarına karşı iki yıl garantilidir.</p>
        </details>
        <details>
          <summary>3D baskıda özel ölçü üretim yapılıyor mu?</summary>
          <p>
            Evet. 10 cm, 12 cm ve 23 cm gibi standart olmayan ölçüler dahil,
            modelinize ve kullanım alanınıza göre özel üretim yapılabilir.
          </p>
        </details>
        <details>
          <summary>Kutu harf ışıklı veya ışıksız yapılabilir mi?</summary>
          <p>
            Evet. Paslanmaz, alüminyum veya pleksi malzemeyle; önden, arkadan
            ışıklı ya da ışıksız olarak üretilebilir.
          </p>
        </details>
        <details>
          <summary>Paslanmaz ve metal uygulamalarda ölçü nasıl belirlenir?</summary>
          <p>
            Bu ürünlerde sabit ölçü seçimi yoktur. Uygulama alanı incelenir ve
            projeye özel ölçülendirme ile teklif hazırlanır.
          </p>
        </details>
        <details>
          <summary>Dış mekân uygulamaları hava koşullarına dayanıklı mı?</summary>
          <p>
            Malzeme ve montaj yöntemi dış mekân şartlarına göre seçilir.
            Projeye uygun paslanmaz, boya ve aydınlatma çözümleri sunulur.
          </p>
        </details>
      </section>
      <footer id="iletisim" className="store-footer">
        <a className="store-brand logo-brand footer-logo" href="#anasayfa">
          <Image
            src="/brand/3dbade-neon-logo.png"
            alt="3dBade Neon"
            width={240}
            height={133}
          />
        </a>
        <div>
          <strong>İletişim</strong>
          <a href="mailto:info@3dbadeneon.com">info@3dbadeneon.com</a>
          <a href={whatsappOrderLink} target="_blank" rel="noreferrer">
            +90 532 707 99 23
          </a>
        </div>
        <div>
          <strong>Alışveriş</strong>
          <a href="/magaza">Tüm Ürünler</a>
          <a href="/tasarla">Neon Tasarla</a>
        </div>
        <div className="footer-policy-links">
          <strong>Politikalar</strong>
          <Link href="/politikalar/gizlilik-kvkk">
            Gizlilik Politikası ve KVKK
          </Link>
          <Link href="/politikalar/iptal-iade">İptal ve İade Şartları</Link>
          <Link href="/politikalar/mesafeli-satis">
            Mesafeli Satış Sözleşmesi
          </Link>
          <Link href="/politikalar/hukum-kosullar">Hüküm ve Koşullar</Link>
          <Link href="/politikalar/sartlar-kosullar">
            Şartlar &amp; Koşullar
          </Link>
        </div>
        <SocialIconLinks />
        <p>© 2026 3dBade Neon</p>
      </footer>
      <a
        className="whatsapp-order"
        href={whatsappOrderLink}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp ile Hamburger Neon hakkında bilgi al"
      >
        ◔ <span>WHATSAPP İLE SİPARİŞ VER</span>
      </a>
    </main>
  );
}
