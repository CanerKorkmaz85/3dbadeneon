import type { Metadata } from "next";
import "./globals.css";

import SiteChrome from "../components/SiteChrome";
import HomeLinkFixes from "../components/HomeLinkFixes";

export const metadata: Metadata = {
  metadataBase: new URL("https://3dbadeneon.com"),

  title: {
    default: "3dBade Neon | Neon Tabela, 3D Baskı, UV Baskı ve Maket",
    template: "%s | 3dBade Neon",
  },

  description:
    "3dBade Neon; neon tabela, LED neon, 3D baskı, UV baskı, maket, dekoratif ürünler ve kişiye özel tasarımlar üretir. İşletmeler ve bireysel müşteriler için özel üretim çözümler.",

  keywords: [
    "neon tabela",
    "led neon",
    "neon led",
    "ışıklı tabela",
    "özel tasarım tabela",
    "kişiye özel neon",
    "3d baskı",
    "3d printer baskı",
    "uv baskı",
    "maket",
    "mimari maket",
    "dekorasyon",
    "dekoratif ürün",
    "led tabela",
    "pleksi tabela",
    "3d tabela",
    "özel üretim",
    "İstanbul neon tabela",
    "İstanbul 3d baskı",
  ],

  alternates: {
    canonical: "https://3dbadeneon.com/",
  },

  openGraph: {
    type: "website",
    url: "https://3dbadeneon.com/",
    siteName: "3dBade Neon",
    title: "3dBade Neon | Neon Tabela, 3D Baskı, UV Baskı ve Maket",
    description:
      "Neon tabela, LED neon, 3D baskı, UV baskı, maket ve kişiye özel dekoratif ürünler.",
    images: [
      {
        url: "/brand/3dbade-neon-logo.png",
        width: 1200,
        height: 630,
        alt: "3dBade Neon - Neon Tabela ve 3D Baskı",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "3dBade Neon | Neon Tabela, 3D Baskı, UV Baskı ve Maket",
    description:
      "Neon tabela, LED neon, 3D baskı, UV baskı, maket ve kişiye özel dekoratif ürünler.",
    images: ["/brand/3dbade-neon-logo.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  icons: {
    icon: "/icon.png",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://3dbadeneon.com/#organization",
      name: "3dBade Neon",
      url: "https://3dbadeneon.com/",
      logo: {
        "@type": "ImageObject",
        url: "https://3dbadeneon.com/brand/3dbade-neon-logo.png",
      },
      email: "info@3dbadeneon.com",
      telephone: "+90 532 707 99 23",
    },
    {
      "@type": "WebSite",
      "@id": "https://3dbadeneon.com/#website",
      url: "https://3dbadeneon.com/",
      name: "3dBade Neon",
      publisher: {
        "@id": "https://3dbadeneon.com/#organization",
      },
      inLanguage: "tr-TR",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        <SiteChrome>{children}</SiteChrome>

        <HomeLinkFixes />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              function loadScript(a){
                var b=document.getElementsByTagName("head")[0],
                c=document.createElement("script");
                c.type="text/javascript";
                c.src="https://tracker.metricool.com/resources/be.js";
                c.onreadystatechange=a;
                c.onload=a;
                b.appendChild(c)
              }

              loadScript(function(){
                beTracker.t({
                  hash:"18f1189eb1e898fe812bba76d6d5a401"
                })
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
