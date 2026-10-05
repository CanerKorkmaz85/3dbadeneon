"use client";

import Image from "next/image";
import Link from "next/link";

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
      <path d="M4 5h2l1.5 10.3h9.6L19 8H7" />
      <circle cx="9" cy="19" r="1" />
      <circle cx="17" cy="19" r="1" />
    </svg>
  );
}

export default function SiteHeader() {
  return (
    <>
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
        <Link
          href="/"
          className="store-brand logo-brand"
          aria-label="3dBade Neon ana sayfa"
        >
          <Image
            src="/brand/3dbade-neon-logo.png"
            alt="3dBade Neon"
            width={240}
            height={133}
            priority
          />
        </Link>
        <div className="store-actions" aria-label="Site işlemleri">
          <button aria-label="Ara">
            <HeaderIcon name="search" />
          </button>
          <Link href="/hesabim" aria-label="Kullanıcı girişi">
            <HeaderIcon name="account" />
          </Link>
          <Link href="/odeme" aria-label="Sepet">
            <HeaderIcon name="cart" />
            <small>0</small>
          </Link>
        </div>
      </header>
      <nav className="collection-nav" aria-label="Ana menü">
        <Link href="/tasarla">Neon Tasarla</Link>
        <Link href="/#urunler">Çok Satanlar</Link>
        <Link href="/#isletmeler">Kafe &amp; Restoranlar</Link>
        <Link href="/magaza">Tüm Ürünler</Link>
        <Link href="/#sss">Sık Sorulan Sorular</Link>
        <Link href="/iletisim">İletişim</Link>
      </nav>
    </>
  );
}
