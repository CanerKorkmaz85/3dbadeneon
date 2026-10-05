"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type GuestAddress = { name: string; surname: string; email: string; phone: string; address: string; detail: string; city: string; zip: string };
const emptyGuest: GuestAddress = { name: "", surname: "", email: "", phone: "+90 ", address: "", detail: "", city: "", zip: "" };

export default function CheckoutPage() {
  const [payment, setPayment] = useState("whatsapp");
  const [guest, setGuest] = useState(emptyGuest);
  const update = (field: keyof GuestAddress, value: string) => setGuest((current) => ({ ...current, [field]: value }));
  const whatsappUrl = useMemo(() => {
    const message = `Merhaba, 3DBADE Neon için sipariş vermek istiyorum.\n\nAd Soyad: ${guest.name} ${guest.surname}\nE-posta: ${guest.email}\nTelefon: ${guest.phone}\nAdres: ${guest.address}${guest.detail ? `, ${guest.detail}` : ""}\nŞehir / Posta Kodu: ${guest.city} / ${guest.zip}\n\nÜrün bilgilerini ve ödeme bağlantısını rica ederim.`;
    return `https://wa.me/905327079923?text=${encodeURIComponent(message)}`;
  }, [guest]);
  return <main className="checkout-page">
    <section className="checkout-heading"><p>GÜVENLİ ÖDEME</p><h1>Siparişini tamamla.</h1><span>Hesap açmadan da teslimat bilgilerini girip WhatsApp&apos;tan sipariş verebilirsin.</span></section>
    <section className="checkout-layout">
      <div className="checkout-form">
        <div className="checkout-step"><b>1</b><div><h2>Teslimat bilgileri</h2><p>Misafir olarak devam edebilirsin. Bu bilgiler sadece sipariş talebinle birlikte WhatsApp mesajına eklenir.</p><div className="guest-address-form"><div className="two-fields"><label>Ad<input required value={guest.name} onChange={(e) => update("name", e.target.value)} /></label><label>Soyad<input required value={guest.surname} onChange={(e) => update("surname", e.target.value)} /></label></div><div className="two-fields"><label>E-posta<input type="email" required value={guest.email} onChange={(e) => update("email", e.target.value)} /></label><label>Telefon<input required value={guest.phone} onChange={(e) => update("phone", e.target.value)} /></label></div><label>Adres<input required value={guest.address} onChange={(e) => update("address", e.target.value)} /></label><label>Apartman, daire vb. (isteğe bağlı)<input value={guest.detail} onChange={(e) => update("detail", e.target.value)} /></label><div className="two-fields"><label>Şehir<input required value={guest.city} onChange={(e) => update("city", e.target.value)} /></label><label>Posta kodu<input value={guest.zip} onChange={(e) => update("zip", e.target.value)} /></label></div></div><Link className="account-address-link" href="/hesabim">HESABIN VARSA ADRESLERİNDEN SEÇ</Link></div></div>
        <div className="checkout-step"><b>2</b><div><h2>Ödeme yöntemi</h2><label className="payment-option payment-disabled"><input type="radio" name="payment" disabled /> Kredi veya banka kartı ile güvenli ödeme <small>Yakında</small></label><label className={payment === "whatsapp" ? "payment-option selected" : "payment-option"}><input type="radio" name="payment" checked={payment === "whatsapp"} onChange={() => setPayment("whatsapp")} /> WhatsApp üzerinden sipariş ve ödeme desteği</label><a className="whatsapp-order" href={whatsappUrl}>WHATSAPP&apos;TAN SİPARİŞİ GÖNDER</a></div></div>
      </div>
      <aside className="order-summary"><p>SİPARİŞ ÖZETİ</p><div><span>Sepetindeki ürünler</span><b>Sepet boş</b></div><div><span>Kargo</span><b>Ücretsiz</b></div><hr /><div><strong>Toplam</strong><strong>₺0</strong></div><button disabled>KARTLA ÖDEME YAKINDA</button><small>Şimdilik sipariş bilgilerini WhatsApp&apos;tan göndererek ödeme bağlantısı talep edebilirsin.</small></aside>
    </section>
  </main>;
}
