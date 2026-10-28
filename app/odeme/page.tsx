"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { readCart, writeCart, type CartItem } from "../../lib/cart";

type GuestAddress = { name: string; surname: string; email: string; phone: string; address: string; detail: string; city: string; zip: string };
const emptyGuest: GuestAddress = { name: "", surname: "", email: "", phone: "+90 ", address: "", detail: "", city: "", zip: "" };

export default function CheckoutPage() {
  const [payment, setPayment] = useState("whatsapp");
  const [guest, setGuest] = useState(emptyGuest);
  const [items, setItems] = useState<CartItem[]>([]);

useEffect(() => {
  const refresh = () => setItems(readCart());
  refresh();
  window.addEventListener("cart-updated", refresh);
  window.addEventListener("storage", refresh);
  return () => {
    window.removeEventListener("cart-updated", refresh);
    window.removeEventListener("storage", refresh);
  };
}, []);

const cartTotal = items.reduce(
  (sum, item) => sum + (item.unitPrice ?? 0) * item.quantity,
  0
);
const hasQuote = items.some((item) => item.unitPrice === null);

function removeItem(index: number) {
  writeCart(items.filter((_, itemIndex) => itemIndex !== index));
}
  const update = (field: keyof GuestAddress, value: string) => setGuest((current) => ({ ...current, [field]: value }));
const whatsappUrl = useMemo(() => {
  const productLines = items.map((item, index) => {
    const subtotal = item.unitPrice === null
      ? "Teklif Al"
      : `₺${(item.unitPrice * item.quantity).toLocaleString("tr-TR")}`;

    return `${index + 1}. ${item.title}
Ölçü: ${item.size}${item.remote ? `\nKumanda: ${item.remote}` : ""}
Adet: ${item.quantity}
Tutar: ${subtotal}
Ürün: https://3dbadeneon.com/urunler/${encodeURIComponent(item.id)}`;
  }).join("\n\n");

  const message = `Merhaba, sipariş vermek istiyorum.

${productLines}

${hasQuote ? "Fiyatı belli ürünlerin toplamı" : "Toplam"}: ₺${cartTotal.toLocaleString("tr-TR")}${hasQuote ? "\nTeklif gereken ürünler için fiyat rica ederim." : ""}

Ad Soyad: ${guest.name} ${guest.surname}
E-posta: ${guest.email}
Telefon: ${guest.phone}
Adres: ${guest.address}${guest.detail ? `, ${guest.detail}` : ""}
Şehir / Posta Kodu: ${guest.city} / ${guest.zip}

Stok ve ödeme bilgilerini rica ederim.`;

  return `https://wa.me/905327079923?text=${encodeURIComponent(message)}`;
}, [guest, items, cartTotal, hasQuote]);
  return <main className="checkout-page">
    <section className="checkout-heading"><p>GÜVENLİ ÖDEME</p><h1>Siparişini tamamla.</h1><span>Hesap açmadan da teslimat bilgilerini girip WhatsApp&apos;tan sipariş verebilirsin.</span></section>
    <section className="checkout-layout">
      <div className="checkout-form">
        <div className="checkout-step"><b>1</b><div><h2>Teslimat bilgileri</h2><p>Misafir olarak devam edebilirsin. Bu bilgiler sadece sipariş talebinle birlikte WhatsApp mesajına eklenir.</p><div className="guest-address-form"><div className="two-fields"><label>Ad<input required value={guest.name} onChange={(e) => update("name", e.target.value)} /></label><label>Soyad<input required value={guest.surname} onChange={(e) => update("surname", e.target.value)} /></label></div><div className="two-fields"><label>E-posta<input type="email" required value={guest.email} onChange={(e) => update("email", e.target.value)} /></label><label>Telefon<input required value={guest.phone} onChange={(e) => update("phone", e.target.value)} /></label></div><label>Adres<input required value={guest.address} onChange={(e) => update("address", e.target.value)} /></label><label>Apartman, daire vb. (isteğe bağlı)<input value={guest.detail} onChange={(e) => update("detail", e.target.value)} /></label><div className="two-fields"><label>Şehir<input required value={guest.city} onChange={(e) => update("city", e.target.value)} /></label><label>Posta kodu<input value={guest.zip} onChange={(e) => update("zip", e.target.value)} /></label></div></div><Link className="account-address-link" href="/hesabim">HESABIN VARSA ADRESLERİNDEN SEÇ</Link></div></div>
        <div className="checkout-step"><b>2</b><div><h2>Ödeme yöntemi</h2><label className="payment-option payment-disabled"><input type="radio" name="payment" disabled /> Kredi veya banka kartı ile güvenli ödeme <small>Yakında</small></label><label className={payment === "whatsapp" ? "payment-option selected" : "payment-option"}><input type="radio" name="payment" checked={payment === "whatsapp"} onChange={() => setPayment("whatsapp")} /> WhatsApp üzerinden sipariş ve ödeme desteği</label><a className="whatsapp-order" href={whatsappUrl}>WHATSAPP&apos;TAN SİPARİŞİ GÖNDER</a></div></div>
      </div>
<aside className="order-summary">
  <p>SEPETİN</p>
  {items.length === 0 ? (
    <p>Sepetin boş. <Link href="/magaza">Ürünlere dön</Link></p>
  ) : (
    <>
      {items.map((item, index) => (
        <div key={`${item.id}-${item.size}-${item.remote}`}>
          <span>
            {item.title}
            <br />
            <small>
              {item.size}{item.remote ? ` · ${item.remote}` : ""}
              {` · ${item.quantity} adet`}
            </small>
          </span>
          <b>
            {item.unitPrice === null
              ? "Teklif Al"
              : `₺${(item.unitPrice * item.quantity).toLocaleString("tr-TR")}`}
          </b>
          <button type="button" onClick={() => removeItem(index)}>
            Kaldır
          </button>
        </div>
      ))}
      <div><span>Kargo</span><b>Ücretsiz</b></div>
      <hr />
      <div>
        <strong>{hasQuote ? "Fiyatı belli ürünler" : "Toplam"}</strong>
        <strong>₺{cartTotal.toLocaleString("tr-TR")}</strong>
      </div>
      {hasQuote && <p>Teklif gereken ürünlerin fiyatı ayrıca belirlenecek.</p>}
      <Link href="/magaza">ALIŞVERİŞE DEVAM ET</Link>
    </>
  )}
</aside>
    </section>
  </main>;
}
