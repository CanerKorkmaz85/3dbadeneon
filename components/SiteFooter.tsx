import Image from "next/image";
import Link from "next/link";

const whatsappLink =
  "https://wa.me/905327079923?text=Merhaba%2C%203Dbade%20Neon%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.";

export default function SiteFooter() {
  return (
    <footer className="store-footer">
      <Link
        href="/"
        className="footer-logo logo-brand"
        aria-label="3dBade Neon ana sayfa"
      >
        <Image
          src="/brand/3dbade-neon-logo.png"
          alt="3dBade Neon"
          width={240}
          height={133}
        />
      </Link>

      <div>
        <strong>İletişim</strong>
        <a href={whatsappLink} target="_blank" rel="noreferrer">
          WhatsApp
        </a>
        <Link href="/iletisim">İletişim Sayfası</Link>
      </div>

      <div>
        <strong>Alışveriş</strong>
        <Link href="/magaza">Tüm Ürünler</Link>
        <Link href="/tasarla">Kendin Tasarla</Link>
      </div>

      <div className="footer-policy-links">
        <strong>Politikalar</strong>
        <Link href="/politikalar/gizlilik-kvkk">
          Gizlilik Politikası ve KVKK
        </Link>
        <Link href="/politikalar/iptal-iade">İptal ve İade Şartları</Link>
        <Link href="/politikalar/mesafeli-satis">
          Mesafeli Satış Sözleşmesi
        </Link>
        <Link href="/politikalar/hukum-kosullar">Hüküm ve Koşullar</Link>
      </div>

      <small>© 2026 3dBade Neon. Tüm hakları saklıdır.</small>
    </footer>
  );
}
