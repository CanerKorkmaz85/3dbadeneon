"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isStandalonePage = pathname === "/" || pathname === "/takip";

  // Ana sayfa kendi site iskeletini içerir; takip sayfası ise tek amaçlı bir bağlantı sayfasıdır.
  if (isStandalonePage) return <>{children}</>;

  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
