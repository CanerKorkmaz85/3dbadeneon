"use client";

import { useEffect } from "react";

export default function HomeLinkFixer() {
  useEffect(() => {
    const fixLinks = () => {
      document.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => {
        const text = (link.textContent || "").trim().toLocaleUpperCase("tr-TR");
        if (text.includes("TASARIM TALEBİ OLUŞTUR")) {
          link.setAttribute("href", "/tasarla");
        }
      });
    };

    fixLinks();
    const observer = new MutationObserver(fixLinks);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
