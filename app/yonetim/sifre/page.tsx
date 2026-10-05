"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = password.trim();
    if (!value) return;
    window.sessionStorage.setItem("3dbade-admin-password", value);
    router.replace("/yonetim/urunler");
  }

  return (
    <main style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: 24 }}>
      <form onSubmit={submit} style={{ width: "100%", maxWidth: 460, display: "grid", gap: 14, padding: 24, border: "1px solid #ddd", borderRadius: 16, background: "white" }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 800, letterSpacing: 1 }}>3DBADE NEON</p>
          <h1 style={{ margin: "8px 0 4px", fontSize: 28 }}>Yönetim şifresi</h1>
          <p style={{ margin: 0, color: "#666" }}>Cloudflare'a eklediğin ADMIN_PASSWORD değerini gir. Şifre yalnızca bu tarayıcı oturumunda tutulur.</p>
        </div>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Yönetim şifresi"
          autoFocus
          style={{ width: "100%", padding: "14px 16px", border: "1px solid #bbb", borderRadius: 10, fontSize: 16, boxSizing: "border-box" }}
        />
        <button type="submit" disabled={!password.trim()} style={{ padding: "14px 16px", border: 0, borderRadius: 10, background: "#111", color: "white", fontWeight: 800, cursor: "pointer" }}>
          DEVAM ET
        </button>
      </form>
    </main>
  );
}
