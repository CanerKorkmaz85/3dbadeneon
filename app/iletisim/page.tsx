"use client";

import { useState, type FormEvent } from "react";

const address =
  "Veliefendi Mahallesi, Ahmet Yesevi Sokak No: 106/B, Zeytinburnu / İstanbul";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const sendWhatsApp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = `Merhaba, 3Dbade Neon ile iletişime geçmek istiyorum.\n\nAd Soyad: ${name}\nTelefon: ${phone}\nMesaj: ${message}`;
    window.open(
      `https://wa.me/905327079923?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setSent(true);
  };

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <p>İLETİŞİM</p>
        <h1>
          Fikrinizi ışığa
          <br />
          dönüştürelim.
        </h1>
        <span>
          Tasarım, fiyat teklifi veya sipariş süreciyle ilgili her konuda bize
          yazabilirsiniz.
        </span>
      </section>
      <section className="contact-layout">
        <div className="contact-details">
          <p>3DBADE NEON</p>
          <h2>Bizimle iletişime geçin.</h2>
          <span>
            Özel tasarım fikrinizi paylaşın; ölçü, renk ve uygulama
            seçeneklerini birlikte netleştirelim.
          </span>
          <div className="contact-method">
            <b>WHATSAPP &amp; TELEFON</b>
            <a
              href="https://wa.me/905327079923"
              target="_blank"
              rel="noreferrer"
            >
              +90 532 707 99 23
            </a>
          </div>
          <div className="contact-method">
            <b>E-POSTA</b>
            <a href="mailto:info@3dbadeneon.com">info@3dbadeneon.com</a>
          </div>
          <div className="contact-method">
            <b>ADRES</b>
            <address>{address}</address>
          </div>
        </div>
        <form className="contact-form" onSubmit={sendWhatsApp}>
          <label>
            ADINIZ SOYADINIZ
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Adınız ve soyadınız"
            />
          </label>
          <label>
            TELEFON NUMARANIZ
            <input
              required
              inputMode="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="05xx xxx xx xx"
            />
          </label>
          <label>
            MESAJINIZ
            <textarea
              required
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Size nasıl yardımcı olabiliriz?"
            />
          </label>
          <button type="submit">WHATSAPP İLE GÖNDER →</button>
          {sent && (
            <small>
              WhatsApp açıldı. Mesajınızı kontrol edip gönderebilirsiniz.
            </small>
          )}
        </form>
      </section>
      <section className="contact-map">
        <div>
          <p>MAĞAZA &amp; ATÖLYE</p>
          <h2>Bizi ziyaret edin.</h2>
          <span>{address}</span>
        </div>
        <iframe
          title="3Dbade Neon konumu"
          src="https://www.google.com/maps?q=Veliefendi+Mahallesi,+Ahmet+Yesevi+Sokak+No:+106%2FB,+Zeytinburnu,+%C4%B0stanbul&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </main>
  );
}
