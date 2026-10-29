import Image from "next/image";
import Link from "next/link";

const signageSystems = [
  {
    title: "Kutu Harf Sistemleri",
    description: "3 boyutlu, ışıklı veya ışıksız tabela çözümleri",
    href: "/tabela-sistemleri/kutu-harf",
    tone: "letter",
    image: "/signage/kutu-harf.jpg",
  },
  {
    title: "Işıklı Tabelalar",
    description: "Gece ve gündüz yüksek görünürlük",
    href: "/iletisim",
    tone: "light",
    image: "/signage/isikli-tabela.jpg",
  },
  {
    title: "Cephe Tabelaları",
    description: "Mağaza, restoran ve kurumsal yapılar için",
    href: "/iletisim",
    tone: "facade",
    image: "/signage/cephe-tabelasi.jpg",
  },
  {
    title: "Totem & Yönlendirme",
    description: "İç ve dış mekân yönlendirme sistemleri",
    href: "/iletisim",
    tone: "totem",
    image: "/signage/totem-yonlendirme.jpg",
  },
];

export default function SignageSystemsPage() {
  return (
    <main className="service-page">
      <section className="service-hero service-hero-signage">
        <p>TABELA SİSTEMLERİ</p>
        <h1>Markanız, doğru malzeme ve ışıkla görünür olsun.</h1>
        <span>
          Mağaza cephesinden iç mekân yönlendirmesine kadar, işletmenize özel
          tabela çözümleri tasarlayıp üretiyoruz.
        </span>
      </section>
      <section className="service-catalog-section">
        <div className="service-section-heading">
          <p>ÇÖZÜMLER</p>
          <h2>İhtiyacınıza uygun sistemi seçin.</h2>
        </div>
        <div className="service-option-grid four-column">
          {signageSystems.map((item) => (
            <Link
              href={item.href}
              className={`service-option-card tone-${item.tone}`}
              key={item.title}
            >
              <Image
                className="signage-card-image"
                src={item.image}
                alt=""
                aria-hidden="true"
                width={1200}
                height={720}
              />
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <b>İncele →</b>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
