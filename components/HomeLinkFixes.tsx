"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const productLinks: Record<string, string> = {
  "Hamburger Neon": "/urunler/hamburger-neon",
  "Dondurma Neon": "/urunler/eriyen-dondurma-neon",
  "Pizza Neon": "/urunler/pizza-neon",
  "Açık / Kapalı Neon": "/urunler/acik-neon",
  "Fenerbahçe Neon": "/urunler/fenerbahce",
  "Galatasaray Neon": "/urunler/galatasaray",
  "Beşiktaş Neon": "/urunler/besiktas",
  "Trabzonspor Neon": "/urunler/trabzonspor",
  "Köpek Mc Neon": "/urunler/kopek-mc",
  "Motorcu Kuru Kafa Neon": "/urunler/motorcu-kuru-kafa",
  "Ouch Neon": "/urunler/comic-ouch",
  "Tropikal Kuru Kafa Neon": "/urunler/tropikal-kuru-kafa",
  "WC / Açık Neon": "/urunler/acik-neon",
  "Gamer El Neon": "/urunler/gamer-el",
  "Köpek Patron Neon": "/urunler/kopek-patron",
  "Kuru Kafa & Papatya Neon": "/urunler/kuru-kafa-papatya",
};

const categoryLinks: Record<string, string> = {
  "Kafeler & Restoranlar": "Kafe & Restoranlar",
  "Berber & Kuaför": "Berber & Kuaför",
  "Mağaza & Ofis": "Mağaza & Ofis",
  "Spor Salonu": "Spor Salonu",
  "Etkinlik & Organizasyon": "Etkinlik & Organizasyon",
  "Ev Dekorasyonu": "Ev Dekorasyon",
};

function setHref(anchor: Element | null, href: string | undefined) {
  if (anchor instanceof HTMLAnchorElement && href) anchor.href = href;
}

export default function HomeLinkFixes() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    document.querySelectorAll(".shop-product").forEach((card) => {
      const title = card.querySelector(".shop-product-info h3")?.textContent?.trim() || "";
      setHref(card.querySelector(".shop-product-image"), productLinks[title]);
    });

    document.querySelectorAll(".collection-item").forEach((card) => {
      const title = card.querySelector(".collection-visual-title")?.textContent?.trim() || "";
      setHref(card.querySelector(".collection-visual"), productLinks[title]);
    });

    document.querySelectorAll(".venue-card-wrap").forEach((card) => {
      const title = card.querySelector(".venue-card-title")?.textContent?.trim() || "";
      setHref(card.querySelector(".venue-card"), productLinks[title]);
    });

    document.querySelectorAll(".business-card").forEach((card) => {
      const title = card.querySelector("span")?.textContent?.trim() || "";
      const category = categoryLinks[title];
      if (card instanceof HTMLAnchorElement && category) {
        card.href = `/magaza?kategori=${encodeURIComponent(category)}`;
      }
    });

    const designRequest = document.querySelector("#ozel-tasarim .personal-copy a");
    if (designRequest instanceof HTMLAnchorElement) designRequest.href = "/tasarla";

    const hero = document.querySelector(".team-video") as HTMLElement | null;
    const goTeams = () => {
      window.location.href = "/magaza?kategori=Tak%C4%B1mlar";
    };
    const onHeroKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") goTeams();
    };
    if (hero) {
      hero.style.cursor = "pointer";
      hero.setAttribute("role", "link");
      hero.setAttribute("tabindex", "0");
      hero.setAttribute("aria-label", "Takım neon ürünlerini gör");
      hero.addEventListener("click", goTeams);
      hero.addEventListener("keydown", onHeroKey);
    }

    const burgerImages = Array.from(document.querySelectorAll(".burger-gallery .home-gallery-image")) as HTMLElement[];
    const goBurger = () => {
      window.location.href = "/urunler/hamburger-neon";
    };
    const burgerKeyHandlers = new Map<HTMLElement, (event: KeyboardEvent) => void>();
    burgerImages.forEach((image) => {
      image.style.cursor = "pointer";
      image.setAttribute("role", "link");
      image.setAttribute("tabindex", "0");
      image.setAttribute("aria-label", "Hamburger Neon ürününü gör");
      const onKey = (event: KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") goBurger();
      };
      burgerKeyHandlers.set(image, onKey);
      image.addEventListener("click", goBurger);
      image.addEventListener("keydown", onKey);
    });

    return () => {
      if (hero) {
        hero.removeEventListener("click", goTeams);
        hero.removeEventListener("keydown", onHeroKey);
      }
      burgerImages.forEach((image) => {
        image.removeEventListener("click", goBurger);
        const onKey = burgerKeyHandlers.get(image);
        if (onKey) image.removeEventListener("keydown", onKey);
      });
    };
  }, [pathname]);

  return null;
}
