"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

export default function SiteChrome({ children }: { children: ReactNode }) {
  const isHomePage = usePathname() === "/";

  // Ana sayfada aynı üst ve alt alan zaten sayfanın kendi sepet işleviyle yer alıyor.
  // Diğer tüm mevcut ve gelecekteki sayfalar bu ortak iskeleti otomatik kullanır.
  if (isHomePage) return <>{children}</>;

  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
