import type { Metadata } from "next";
import SiteChrome from "../components/SiteChrome";
import "./globals.css";

export const metadata: Metadata = {
  title: "3dBade Neon | 3D Baskı ve Neon Tasarım",
  description: "İşletmeler için neon tabelalar ve kişiye özel 3D tasarımlar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr">
      <body className="min-h-full flex flex-col">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
