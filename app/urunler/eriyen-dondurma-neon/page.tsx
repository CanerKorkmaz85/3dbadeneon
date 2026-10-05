"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const images = [
  "/api/urun-gorsel/kafe-restoran/dondurma/ana.jpg",
  "/api/urun-gorsel/kafe-restoran/dondurma/hover.jpg",
];
const sizeOptions = ["30 cm", "40 cm", "50 cm", "Özel"];
const defaultBasePrices: Record<string, number | null> = {
  "30 cm": 3400,
  "40 cm": 4100,
  "50 cm": 4900,
  Özel: null,
};
const defaultRemoteControlExtra = 250;

function readSavedPrices() {
  if (typeof window === "undefined")
    return {
      basePrices: defaultBasePrices,
      remoteControlExtra: defaultRemoteControlExtra,
    };
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem("3dbade-dondurma-prices") || "{}",
    ) as {
      basePrices?: Record<string, number | null>;
      remoteControlExtra?: number;
    };
    return {
      basePrices: { ...defaultBasePrices, ...parsed.basePrices },
      remoteControlExtra:
        typeof parsed.remoteControlExtra === "number"
          ? parsed.remoteControlExtra
          : defaultRemoteControlExtra,
    };
  } catch {
    return {
      basePrices: defaultBasePrices,
      remoteControlExtra: defaultRemoteControlExtra,
    };
  }
}

export default function MeltingIceCreamProductPage() {
  const [imageIndex, setImageIndex] = useState(0);
  const [size, setSize] = useState("30 cm");
  const [remote, setRemote] = useState("Kumandalı");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [pricing] = useState(readSavedPrices);
  const { basePrices, remoteControlExtra } = pricing;

  const basePrice = basePrices[size];
  const selectedPrice =
    basePrice === null
      ? null
      : basePrice + (remote === "Kumandalı" ? remoteControlExtra : 0);
  return (
    <main className="product-page">
      <div className="product-breadcrumb">
        <Link href="/">Ana Sayfa</Link>
        <span>›</span>
        <Link href="/magaza">Kafe &amp; Restoran</Link>
        <span>›</span>
        <b>Eriyen Dondurma Neon</b>
      </div>
      <section className="product-main">
        <div className="product-gallery">
          <div className="product-thumbnails">
            {images.map((image, index) => (
              <button
                key={image}
                className={imageIndex === index ? "selected" : ""}
                onClick={() => setImageIndex(index)}
                aria-label={`${index + 1}. görseli göster`}
              >
                <Image
                  unoptimized
                  src={image}
                  alt=""
                  width={130}
                  height={160}
                />
              </button>
            ))}
          </div>
          <div className="product-image">
            <Image
              unoptimized
              src={images[imageIndex]}
              alt="Eriyen Dondurma Neon LED Işıklı Duvar Dekoru"
              width={900}
              height={1100}
              priority
            />
          </div>
        </div>
        <div className="product-details">
          <p>KAFE &amp; RESTORAN</p>
          <h1>Eriyen Dondurma Neon LED Işıklı Duvar Dekoru</h1>
          <div className="product-stars">
            <span>★★★★★</span>
            <small>Yeni ürün · 3Dbade özel seri</small>
          </div>
          <div className="product-price">
            <strong>
              {selectedPrice
                ? `₺${(selectedPrice * quantity).toLocaleString("tr-TR")}`
                : "TEKLİF AL"}
            </strong>
            <small>
              {size === "Özel"
                ? "Özel ölçü için sana özel teklif hazırlanır"
                : "KDV dahil · Ücretsiz kargo"}
            </small>
          </div>
          <div className="product-choice">
            <b>
              Boyut <small>{size}</small>
            </b>
            <div>
              {sizeOptions.map((option) => (
                <button
                  key={option}
                  className={size === option ? "selected" : ""}
                  onClick={() => setSize(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="product-choice">
            <b>
              Kumanda <small>{remote}</small>
            </b>
            <div>
              <button
                className={remote === "Kumandalı" ? "selected" : ""}
                onClick={() => setRemote("Kumandalı")}
              >
                Kumandalı
              </button>
              <button
                className={remote === "Kumandasız" ? "selected" : ""}
                onClick={() => setRemote("Kumandasız")}
              >
                Kumandasız
              </button>
            </div>
            <small className="remote-price-note">
              Kumandalı seçeneği: +₺{remoteControlExtra.toLocaleString("tr-TR")}
            </small>
          </div>
          <div className="product-actions">
            <div className="quantity">
              <button
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                aria-label="Adedi azalt"
              >
                −
              </button>
              <b>{quantity}</b>
              <button
                onClick={() => setQuantity((value) => value + 1)}
                aria-label="Adedi artır"
              >
                +
              </button>
            </div>
            <button className="product-add" onClick={() => setAdded(true)}>
              SEPETE EKLE +
            </button>
          </div>
          {added && (
            <div className="product-added">
              Eriyen Dondurma Neon sepetine eklendi.
            </div>
          )}
          <div className="product-promises">
            <span>✓ 2 yıl garanti</span>
            <span>✓ Güvenli paketleme</span>
            <span>✓ Türkiye&apos;nin her yerine kargo</span>
          </div>
        </div>
      </section>
      <section className="product-description product-description-specs-only">
        <div className="product-specs">
          <h3>Teknik özellikler</h3>
          <dl>
            <div>
              <dt>Ölçü</dt>
              <dd>30, 40, 50 cm veya özel ölçü</dd>
            </div>
            <div>
              <dt>Malzeme</dt>
              <dd>4 mm şeffaf, kontur kesim pleksi</dd>
            </div>
            <div>
              <dt>Aydınlatma</dt>
              <dd>12V esnek silikon neon LED</dd>
            </div>
            <div>
              <dt>Kablo</dt>
              <dd>Yaklaşık 2 metre</dd>
            </div>
            <div>
              <dt>Paket içeriği</dt>
              <dd>Neon dekor ve 12V adaptör</dd>
            </div>
          </dl>
        </div>
      </section>
      <section className="product-content-area product-full-description">
        <p>ÜRÜN AÇIKLAMASI</p>
        <h2>🍦 Eriyen Dondurma Neon LED Işıklı Tabela Duvar Dekoru</h2>
        <h3>
          Mekanına Ferahlık ve Tatlı Bir Işık Kat: Eriyen Dondurma Neon LED
          Tabela! 🍦💖✨
        </h3>
        <div className="product-copy-preview">
          <p>
            Rengarenk dondurma topları ve külahtan süzülen erime efektleriyle
            tasarlanmış <b>Eriyen Dondurma Neon LED Dekoru</b>; canlı pembe, buz
            mavisi ve sıcak turuncu/sarı neon hatlarıyla mekanınıza anında
            neşeli, tatlı ve dikkat çekici bir atmosfer kazandırır.
            Dondurmacılar, waffle ve krep salonları, kafeler, tatlıcılar ve
            çocuk odaları için hem müşteri çeken bir tabela hem de mükemmel bir
            fotoğraf alanı dekorudur.
          </p>
          <p>
            Kırılma riski taşımayan, ısınmayan ve ultra düşük enerji tüketen
            yeni nesil esnek silikon LED teknolojisi ile üretilmiştir.
          </p>
        </div>
        <h3>🛠️ Teknik Özellikler</h3>
        <ul>
          <li>
            <b>Ölçüler:</b> Dükkan camları, tezgah arkaları ve konsept duvarlar
            için ideal dikey boyut.
          </li>
          <li>
            <b>Malzeme Tabanı &amp; Grafik:</b> 4 mm kalınlığında, kontur kesim
            şeffaf pleksiglas üzerine yüksek çözünürlüklü dondurma illüstrasyonu
            baskısı.
          </li>
          <li>
            <b>Aydınlatma Teknolojisi:</b> 12V Esnek Silikon Neon LED; uzun
            ömürlü, parlak pembe, buz mavisi ve turuncu/sarı renk kombinasyonu.
          </li>
          <li>
            <b>Işık Konturu:</b> Dondurma kremasında canlı pembe neon, eriyen
            damla detaylarında buz mavisi neon ve külah hatlarında sıcak
            turuncu/sarı neon vurgular.
          </li>
          <li>
            <b>Çalışma Voltajı:</b> 12V DC; paketteki 220V–12V uyumlu adaptör
            ile tak-çalıştır kullanım.
          </li>
          <li>
            <b>Güvenlik:</b> Isınma yapmaz, cıva veya gaz barındırmaz; cam
            kırılma riski olmadan güvenli kullanım sunar.
          </li>
          <li>
            <b>Kablo Uzunluğu:</b> Yaklaşık 2 metre estetik kablo.
          </li>
        </ul>
        <h3>✨ Neden 3Dbade Özel Serisi?</h3>
        <ul>
          <li>
            <b>Fotojenik &amp; Müşteri Mıknatısı:</b> Canlı renkleri ve
            eğlenceli tasarımıyla sosyal medyada paylaşılacak estetik bir köşe
            oluşturur.
          </li>
          <li>
            <b>Baskı &amp; Neon Birlikteliği:</b> Detaylı illüstrasyon baskısı
            sayesinde ışık kapalıyken bile şık ve renkli bir konsept pano
            görünümünü korur.
          </li>
          <li>
            <b>Düşük Enerji &amp; Yüksek Parlaklık:</b> Dükkan vitrinlerinde
            7/24 kesintisiz ve ekonomik kullanım sağlar.
          </li>
        </ul>
        <h3>📦 Paket İçeriği</h3>
        <ol>
          <li>Eriyen Dondurma Neon LED Dekoru</li>
          <li>12V Güç Adaptörü (Priz Uyumlu)</li>
        </ol>
        <blockquote>
          <b>Hayal Et, Baskıla, Yaşa! 🍦💖✨</b> Dondurmacınızın veya kafenizin
          vitrinine tatlı bir dokunuş yapın. Pembe, buz mavisi ve turuncu neon
          hatlarıyla ışıldayan <b>Eriyen Dondurma Neon LED Dekoru</b> stoklarda!
          <br />
          <br />✨ Mekanınıza ferah, renkli ve fotojenik bir hava katmak için
          tasarlandı!
        </blockquote>
      </section>
    </main>
  );
}
