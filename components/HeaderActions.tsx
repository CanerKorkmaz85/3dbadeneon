"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { readCart } from "../lib/cart";

type Profile = { name: string; email: string };

export default function HeaderActions() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function refresh() {
      try {
        const saved = JSON.parse(sessionStorage.getItem("3dbade-account-session") || "null");
        setProfile(saved && typeof saved.email === "string" ? saved : null);
      } catch { setProfile(null); }
      setCount(readCart().reduce((total, item) => total + (Number(item.quantity) || 0), 0));
    }
    refresh();
    setOpen(false);
    window.addEventListener("cart-updated", refresh);
    window.addEventListener("account-updated", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("cart-updated", refresh);
      window.removeEventListener("account-updated", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function close(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  const actionStyle = {
    position: "relative" as const, display: "grid", placeItems: "center",
    padding: 8, color: "#171717", background: "transparent",
    border: 0, cursor: "pointer", textDecoration: "none",
  };
  const linkStyle = {
    display: "block", padding: "12px 8px", fontSize: 14,
    color: "#171717", textDecoration: "none",
  };
  const iconStyle = {
    width: 23, height: 23, fill: "none", stroke: "currentColor", strokeWidth: 1.8,
  };

  return (
    <div className="store-actions" style={{ position: "relative" }}>
      <Link href="/arama" aria-label="Ara" style={actionStyle}>
        <svg viewBox="0 0 24 24" aria-hidden="true" style={iconStyle}>
          <circle cx="10.8" cy="10.8" r="5.8" />
          <path d="m15.2 15.2 4.3 4.3" />
        </svg>
      </Link>
      <button type="button" aria-label={profile ? "Hesabım" : "Giriş yap"}
        aria-expanded={open} onClick={() => setOpen(!open)} style={actionStyle}>
        <svg viewBox="0 0 24 24" aria-hidden="true"
          style={{ ...iconStyle, fill: profile ? "#171717" : "none" }}>
          <circle cx="12" cy="7.5" r="3.5" />
          <path d="M5.2 20c.8-3.4 3.2-5.2 6.8-5.2s6 1.8 6.8 5.2Z" />
        </svg>
      </button>
      <Link href="/odeme" aria-label={`Sepet, ${count} adet ürün`} style={actionStyle}>
        <svg viewBox="0 0 24 24" aria-hidden="true" style={iconStyle}>
          <path d="M4 5h2l1.5 10.3h9.6L19 8H7" />
          <circle cx="9" cy="19" r="1" />
          <circle cx="17" cy="19" r="1" />
        </svg>
        <small aria-live="polite" style={{
          position: "absolute", right: -3, top: -3,
          background: "#087ed5", color: "#fff", borderRadius: 20,
          padding: "3px 6px", fontSize: 11, fontWeight: 700, lineHeight: 1.2,
        }}>{count}</small>
      </Link>
      {open && (
        <div style={{
          position: "absolute", right: 0, top: "calc(100% + 12px)",
          zIndex: 100, width: 240, padding: 16, background: "#fff",
          border: "1px solid #ddd", borderRadius: 10,
          boxShadow: "0 8px 30px #0002", color: "#171717",
        }}>
          {profile ? (
            <>
              <strong style={{ fontSize: 14 }}>Merhaba, {profile.name}</strong>
              <Link href="/hesabim" onClick={() => setOpen(false)} style={linkStyle}>Hesabım / Adreslerim</Link>
              <button type="button" style={{ ...linkStyle, border: 0, background: "transparent", cursor: "pointer" }}
                onClick={() => {
                  sessionStorage.removeItem("3dbade-account-session");
                  setProfile(null);
                  setOpen(false);
                  window.dispatchEvent(new Event("account-updated"));
                  window.location.assign("/");
                }}>Çıkış Yap</button>
            </>
          ) : (
            <>
              <Link href="/hesabim" onClick={() => setOpen(false)} style={linkStyle}>Giriş Yap</Link>
              <Link href="/hesabim?tab=register" onClick={() => setOpen(false)} style={linkStyle}>Hesap Oluştur</Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}