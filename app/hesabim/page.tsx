"use client";

import { FormEvent, useState } from "react";

type Address = {
  name: string;
  surname: string;
  company: string;
  address: string;
  detail: string;
  zip: string;
  city: string;
  phone: string;
};
type Profile = { name: string; email: string };

const emptyAddress: Address = {
  name: "", surname: "", company: "", address: "", detail: "", zip: "", city: "", phone: "+90 ",
};

export default function AccountPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [profile, setProfile] = useState<Profile | null>(() => {
    if (typeof window === "undefined") return null;
    try { return JSON.parse(sessionStorage.getItem("3dbade-account-session") || "null"); } catch { return null; }
  });
  const [showAddress, setShowAddress] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("3dbade-addresses") || "[]"); } catch { return []; }
  });
  const [address, setAddress] = useState(emptyAddress);
  const [notice, setNotice] = useState("");

  function submitAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next = { name: String(form.get("name") || "3DBADE müşterisi"), email: String(form.get("email") || "") };
    sessionStorage.setItem("3dbade-account-session", JSON.stringify(next));
    setProfile(next);
    setNotice("");
  }
  function saveAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = [...addresses, address];
    setAddresses(next);
    localStorage.setItem("3dbade-addresses", JSON.stringify(next));
    setAddress(emptyAddress);
    setShowAddress(false);
  }
  const changeAddress = (field: keyof Address, value: string) => setAddress((current) => ({ ...current, [field]: value }));

  return <main className="account-page">
    <section className="account-heading"><p>HESABIM</p><h1>Hesabına hoş geldin.</h1><span>Siparişlerini ve teslimat adreslerini buradan yönetebilirsin.</span></section>
    <section className="account-layout">
      <div className="account-card">
        {profile ? <div className="signed-in"><b>Merhaba, {profile.name}</b><span>{profile.email}</span><button onClick={() => { sessionStorage.removeItem("3dbade-account-session"); setProfile(null); }}>ÇIKIŞ YAP</button></div> : <>
        <div className="account-tabs"><button className={tab === "login" ? "selected" : ""} onClick={() => setTab("login")}>GİRİŞ YAP</button><button className={tab === "register" ? "selected" : ""} onClick={() => setTab("register")}>HESAP OLUŞTUR</button></div>
        <form onSubmit={submitAccount} className="account-form">
          {tab === "register" && <label>Adın soyadın<input name="name" required placeholder="Adın ve soyadın" /></label>}
          <label>E-posta adresin<input name="email" type="email" required placeholder="ornek@mail.com" /></label>
          <label>Şifre<input type="password" required minLength={8} placeholder="En az 8 karakter" /></label>
          {tab === "register" && <label>Şifre tekrar<input type="password" required minLength={8} placeholder="Şifreni tekrar yaz" /></label>}
          <button type="submit">{tab === "login" ? "GİRİŞ YAP" : "HESAP OLUŞTUR"}</button>
          {notice && <small className="account-notice">{notice}</small>}
        </form>
      </>}</div>
      <div className="address-card"><div><p>TESLİMAT ADRESLERİ</p><h2>Adreslerin</h2>{profile && <button onClick={() => setShowAddress(true)}>+ ADRES EKLE</button>}</div>{profile ? (addresses.length ? <ul>{addresses.map((item, index) => <li key={`${item.address}-${index}`}><b>{item.name} {item.surname}</b><span>{item.address}, {item.city}</span><small>{item.phone}</small></li>)}</ul> : <span className="address-empty">Henüz kayıtlı bir adresin yok.</span>) : <span className="address-empty">Adres eklemek için önce hesabına giriş yap veya Hesap Oluştur bölümünü kullan.</span>}</div>
    </section>
    {showAddress && <div className="address-modal-backdrop" role="presentation"><form className="address-modal" onSubmit={saveAddress}><div><h2>Adres ekleyin</h2><button type="button" onClick={() => setShowAddress(false)} aria-label="Kapat">×</button></div><label>Ülke/bölge<select defaultValue="Türkiye"><option>Türkiye</option></select></label><div className="two-fields"><label>Ad<input required value={address.name} onChange={(e) => changeAddress("name", e.target.value)} /></label><label>Soyadı<input required value={address.surname} onChange={(e) => changeAddress("surname", e.target.value)} /></label></div><label>Şirket<input value={address.company} onChange={(e) => changeAddress("company", e.target.value)} /></label><label>Adres<input required value={address.address} onChange={(e) => changeAddress("address", e.target.value)} /></label><label>Apartman, daire vb. (isteğe bağlı)<input value={address.detail} onChange={(e) => changeAddress("detail", e.target.value)} /></label><div className="two-fields"><label>Posta kodu<input value={address.zip} onChange={(e) => changeAddress("zip", e.target.value)} /></label><label>Şehir<input required value={address.city} onChange={(e) => changeAddress("city", e.target.value)} /></label></div><label>Telefon<input required value={address.phone} onChange={(e) => changeAddress("phone", e.target.value)} /></label><label className="default-address"><input type="checkbox" /> Bu benim varsayılan adresim</label><div className="address-actions"><button type="button" onClick={() => setShowAddress(false)}>İptal et</button><button type="submit">Kaydet</button></div></form></div>}
  </main>;
}
