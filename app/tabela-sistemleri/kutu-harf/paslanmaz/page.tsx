"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";

const images = [
  "/uploads/paslanmaz-kutu-harf-1792708995313/ana-1792708995324-qewrsy.jpg",
  "/uploads/paslanmaz-kutu-harf-1792708995313/galeri-1-1792708995326-7k08qn.jpg",
  "/uploads/paslanmaz-kutu-harf-1792708995313/galeri-2-1792708995329-ixze2w.jpg",
];

const surfaces = [
  ["Gold", "Sıcak ve prestijli"],
  ["Gümüş", "Modern ve sade"],
  ["Bronz", "Karakterli ve klasik"],
  ["Siyah", "Güçlü ve çağdaş"],
  ["Parlak", "Yüksek yansıma"],
  ["Satine", "Yumuşak ve mat doku"],
];

export default function StainlessBoxLetterPage() {
  const [sent, setSent] = useState(false);

  function requestQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = [
      "Merhaba, Paslanmaz Kutu Harf için teklif almak istiyorum.",
      `Ad / Firma: ${form.get("name")}`,
      `Telefon: ${form.get("phone")}`,
      `Proje: ${form.get("project")}`,
    ].join("\n");
    window.open(
      `https://wa.me/905327079923?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setSent(true);
  }

  return (
    <main className="service-page stainless-detail-page">
      <section className="stainless-product-hero">
        <div className="stainless-gallery">
          <Image
            className="stainless-gallery-main"
            src={images[0]}
            alt="Paslanmaz kutu harf uygulaması"
            width={1200}
            height={1000}
            priority
          />
          <div>
            {images.slice(1).map((image, index) => (
              <Image
                key={image}
                src={image}
                alt={`Paslanmaz kutu harf uygulama detayı ${index + 1}`}
                width={700}
                height={500}
              />
            ))}
          </div>
        </div>
        <div className="stainless-product-copy">
          <p>KUTU HARF SİSTEMLERİ</p>
          <h1>Paslanmaz Kutu Harf</h1>
          <em>Prestijli, dayanıklı ve zamansız tabela çözümleri.</em>
          <ul>
            <li>Gold / Gümüş / Bronz / Siyah</li>
            <li>Parlak / Satine</li>
            <li>Işıklı / Işıksız</li>
            <li>İç ve dış mekân</li>
            <li>Özel ölçü üretim</li>
          </ul>
          <a href="#teklif-formu" className="service-primary-link">
            TEKLİF AL
          </a>
        </div>
      </section>

      <section className="stainless-story">
        <p>PASLANMAZ KUTU HARF NEDİR?</p>
        <h2>Derinlik, yüzey ve ışığın birlikte tasarlandığı tabela.</h2>
        <span>
          Paslanmaz çelik levhaların kesilip biçimlendirilmesiyle üretilen kutu
          harfler; korozyona dayanıklı yapısı, temiz yüzey kalitesi ve uzun
          ömrüyle iç ve dış mekânda seçkin bir görünüm sağlar. Her proje marka
          yazısına, cepheye ve görüş mesafesine göre özel ölçülendirilir.
        </span>
      </section>

      <section className="detail-content-section">
        <div className="service-section-heading">
          <p>RENK VE YÜZEY SEÇENEKLERİ</p>
          <h2>Markanızın tonunu yüzeye taşıyın.</h2>
        </div>
        <div className="surface-grid">
          {surfaces.map(([title, description], index) => (
            <article className={`surface-card surface-${index + 1}`} key={title}>
              <span />
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="detail-content-section detail-alt-section">
        <div className="service-section-heading">
          <p>AYDINLATMA SEÇENEKLERİ</p>
          <h2>Gündüz form, gece karakter.</h2>
        </div>
        <div className="lighting-grid">
          <article><b>01</b><h3>Işıksız</h3><p>Malzeme ve yüzey etkisini öne çıkaran sade uygulama.</p></article>
          <article><b>02</b><h3>Arkadan Işıklı</h3><p>Duvara yayılan yumuşak halo etkisi.</p></article>
          <article><b>03</b><h3>Önden Işıklı</h3><p>Uzak mesafeden güçlü okunabilirlik.</p></article>
        </div>
      </section>

      <section className="detail-content-section">
        <div className="service-section-heading">
          <p>KULLANIM ALANLARI</p>
          <h2>Her cepheye ve iç mekâna uyarlanabilir.</h2>
        </div>
        <div className="usage-pill-grid">
          {['Mağaza', 'Restoran', 'Hastane', 'Ofis', 'Otel'].map((place) => (
            <span key={place}>{place}</span>
          ))}
        </div>
      </section>

      <section className="detail-content-section detail-alt-section">
        <div className="service-section-heading">
          <p>UYGULAMA ÖRNEKLERİ</p>
          <h2>Gerçek projelerden detaylar.</h2>
        </div>
        <div className="application-grid">
          {images.map((image, index) => (
            <Image
              key={image}
              src={image}
              alt={`Paslanmaz kutu harf uygulama örneği ${index + 1}`}
              width={900}
              height={700}
            />
          ))}
        </div>
      </section>

      <section id="teklif-formu" className="quote-section">
        <div>
          <p>TEKLİF FORMU</p>
          <h2>Projenizi birlikte netleştirelim.</h2>
          <span>
            Sabit ölçü seçmeniz gerekmez. Uygulama yerini ve yaklaşık ihtiyacı
            yazın; size özel ölçülendirme ve fiyat teklifi hazırlayalım.
          </span>
        </div>
        <form onSubmit={requestQuote}>
          <label>AD / FİRMA<input name="name" required placeholder="Adınız veya firma adınız" /></label>
          <label>TELEFON<input name="phone" required inputMode="tel" placeholder="05xx xxx xx xx" /></label>
          <label>PROJE DETAYI<textarea name="project" required placeholder="Yazı, uygulama yeri, renk ve yaklaşık ölçü..." /></label>
          <button type="submit">WHATSAPP İLE TEKLİF AL →</button>
          {sent && <small>WhatsApp açıldı. Mesajınızı kontrol edip gönderebilirsiniz.</small>}
        </form>
      </section>
    </main>
  );
}
