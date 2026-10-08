import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neon Tabela ve 3D Baskı Ürünleri",

  description:
    "Neon tabela, LED neon, kişiye özel neon, takım neonları, işletme tabelaları, 3D baskı ve dekoratif ürünleri keşfedin. 3dBade Neon ile özel tasarım ürünler.",

  keywords: [
    "neon tabela",
    "led neon",
    "neon led",
    "neon tabela modelleri",
    "kişiye özel neon",
    "özel tasarım neon",
    "takım neonları",
    "işletme neonları",
    "kafe neon tabela",
    "restoran neon tabela",
    "3d baskı",
    "3d baskı ürünleri",
    "dekoratif ürünler",
    "ışıklı tabela",
    "led tabela",
    "İstanbul neon tabela",
    "İstanbul 3d baskı",
  ],

  alternates: {
    canonical: "https://3dbadeneon.com/magaza",
  },

  openGraph: {
    title: "Neon Tabela ve 3D Baskı Ürünleri | 3dBade Neon",
    description:
      "Neon tabela, LED neon, takım neonları, kişiye özel tasarımlar ve 3D baskı ürünlerini keşfedin.",
    url: "https://3dbadeneon.com/magaza",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function MagazaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}