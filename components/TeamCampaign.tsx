"use client";

import { useEffect, useState } from "react";
import { TEAM_CAMPAIGN, campaignPrice, isTeamCampaignActive } from "../lib/team-campaign";

export function useTeamCampaign() {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const update = () => setActive(isTeamCampaignActive());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);
  return active;
}

const box = { background: "#fff3e8", border: "1px solid #ff8a16", borderRadius: 12, padding: 18, margin: "16px 0", color: "#222" };
const money = (value: number) => value.toLocaleString("tr-TR", { style: "currency", currency: "TRY" });

export function TeamCampaignBanner() {
  const active = useTeamCampaign();
  if (!active) return null;
  return <aside style={{ ...box, background: "#ff8a16", border: "2px solid #f47700", color: "#071b49", padding: "22px 24px", fontStyle: "italic", boxShadow: "0 5px 16px #ff8a1633" }}><strong style={{ display: "block", color: "#071b49", fontSize: "clamp(21px, 2.5vw, 28px)", fontWeight: 900, lineHeight: 1.3 }}>Takım Neonlarında GOL20 ile ek %20 indirim!</strong><p style={{ color: "#071b49", fontSize: "clamp(16px, 1.5vw, 19px)", fontWeight: 800, lineHeight: 1.6, margin: "10px 0 0" }}>Mevcut site fiyatları üzerinden uygulanır. Son gün: 8 Kasım 2026, 23:59.</p></aside>;
}

export function TeamCampaignOrder({ title, size, remote, quantity, total, url }: { title: string; size: string; remote: string; quantity: number; total: number | null; url: string }) {
  const active = useTeamCampaign();
  const [customSize, setCustomSize] = useState("");
  const [custom, setCustom] = useState(false);
  if (!active) return null;
  const discounted = total !== null && total > 0 ? campaignPrice(total) : null;
  const valid = !custom || customSize.trim().length > 0;
  const message = ["Merhaba, GOL20 kampanyasından yararlanmak istiyorum.", `Ürün: ${title}`, `Ölçü: ${custom ? customSize.trim() : size || "Standart"}`, remote && `Kumanda: ${remote}`, `Adet: ${quantity}`, !custom && discounted !== null ? `Mevcut toplam: ${money(total!)}\nKampanyalı toplam: ${money(discounted)}` : "Özel ölçü/fiyat teklifi rica ediyorum. Teklifte GOL20 ek %20 indiriminin belirtilmesini istiyorum.", url].filter(Boolean).join("\n");
  return <aside style={box}>
    <strong>GOL20 ile ek %20 indirim</strong>
    {!custom && discounted !== null && <p>Mevcut toplam: {money(total!)}<br /><b style={{ fontSize: 24 }}>Kampanyalı toplam: {money(discounted)}</b></p>}
    <label style={{ display: "block", margin: "12px 0" }}><input type="checkbox" checked={custom} onChange={event => setCustom(event.target.checked)} /> Özel ölçü istiyorum</label>
    {custom && <label>İstediğiniz ölçü<input style={{ display: "block", padding: 10, width: "100%" }} value={customSize} onChange={event => setCustomSize(event.target.value)} placeholder="Örn. 65 × 80 cm" maxLength={120} /></label>}
    {(custom || discounted === null) && <p>Ölçünüze özel fiyat WhatsApp üzerinden netleştirilir; teklif fiyatına GOL20 ile ek %20 indirim uygulanır.</p>}
    <button type="button" disabled={!valid} style={{ background: "#ff8a16", color: "#111", border: 0, borderRadius: 8, padding: "14px 18px", fontWeight: 800, cursor: valid ? "pointer" : "default", opacity: valid ? 1 : 0.5 }} onClick={() => { if (valid && isTeamCampaignActive()) window.location.assign(`https://wa.me/${TEAM_CAMPAIGN.whatsapp}?text=${encodeURIComponent(message)}`); }}>Kampanyalı Sipariş Ver</button>
    <p style={{ fontSize: 12 }}>Son gün: 8 Kasım 2026, 23.59. Kampanya WhatsApp siparişlerinde geçerlidir. Mesajı açtıktan sonra Gönder’e basın.</p>
  </aside>;
}
