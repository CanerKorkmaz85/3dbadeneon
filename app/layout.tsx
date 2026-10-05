import type { Metadata } from "next";
import SiteChrome from "../components/SiteChrome";
import HomeLinkFixes from "../components/HomeLinkFixes";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://3dbadeneon.com"),
  title: "3dBade Neon | 3D Baskı ve Neon Tasarım",
  description: "İşletmeler için neon tabelalar ve kişiye özel 3D tasarımlar.",
  openGraph: {
    type: "website",
    url: "https://3dbadeneon.com/",
    siteName: "3dBade Neon",
    title: "3dBade Neon | 3D Baskı ve Neon Tasarım",
    description: "İşletmeler için neon tabelalar ve kişiye özel 3D tasarımlar.",
    images: [
      {
        url: "/brand/3dbade-neon-logo.png",
        alt: "3dBade Neon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "3dBade Neon | 3D Baskı ve Neon Tasarım",
    description: "İşletmeler için neon tabelalar ve kişiye özel 3D tasarımlar.",
    images: ["/brand/3dbade-neon-logo.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr">
      <body className="min-h-full flex flex-col">
        <SiteChrome>{children}</SiteChrome>
        <HomeLinkFixes />
      </body>
    </html>
  );
}
