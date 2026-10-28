import Image from "next/image";
import Link from "next/link";

const letterTypes = [
  {
    title: "Paslanmaz Kutu Harf",
    description: "Prestijli yüzeyler ve uzun ömürlü dış mekân performansı.",
    href: "/tabela-sistemleri/kutu-harf/paslanmaz",
    image:
      "/uploads/paslanmaz-kutu-harf-1792708995313/ana-1792708995324-qewrsy.jpg",
  },
  {
    title: "Alüminyum Kutu Harf",
    description: "Hafif, dayanıklı ve geniş renk seçeneğine sahip çözümler.",
    href: "/iletisim",
    image:
      "/uploads/paslanmaz-kutu-harf-1792708995313/galeri-1-1792708995326-7k08qn.jpg",
  },
  {
    title: "Pleksi Kutu Harf",
    description: "Homojen ışık dağılımı ve canlı renk alternatifleri.",
    href: "/iletisim",
    image:
      "/uploads/paslanmaz-kutu-harf-1792708995313/galeri-2-1792708995329-ixze2w.jpg",
  },
  {
    title: "Işıklı Kutu Harf",
    description: "Gece ve gündüz yüksek görünürlük sağlayan uygulamalar.",
    href: "/iletisim",
    image:
      "/uploads/paslanmaz-kutu-harf-1792708995313/ana-1792708995324-qewrsy.jpg",
  },
  {
    title: "Arkadan Işıklı Kutu Harf",
    description: "Duvara yansıyan halo efektiyle zarif ve seçkin görünüm.",
    href: "/iletisim",
    image:
      "/uploads/paslanmaz-kutu-harf-1792708995313/galeri-1-1792708995326-7k08qn.jpg",
  },
  {
    title: "Önden Işıklı Kutu Harf",
    description: "Ön yüz aydınlatmasıyla uzaktan güçlü okunabilirlik.",
    href: "/iletisim",
    image:
      "/uploads/paslanmaz-kutu-harf-1792708995313/galeri-2-1792708995329-ixze2w.jpg",
  },
];

export default function BoxLettersPage() {
  return (
    <main className="service-page">
      <section className="service-hero service-hero-letters">
        <p>TABELA SİSTEMLERİ</p>
        <h1>Kutu Harf Sistemleri</h1>
        <em>Markanıza üçüncü boyut kazandırın.</em>
        <span>
          Kutu harf; marka adı, logo veya yazıların belirli bir derinlik
          verilerek üç boyutlu üretildiği tabela sistemidir. Işıklı veya
          ışıksız, farklı metal ve pleksi seçenekleriyle uygulanabilir.
        </span>
      </section>
      <section className="service-catalog-section">
        <div className="service-section-heading">
          <p>KUTU HARF ÇEŞİTLERİ</p>
          <h2>Malzeme ve ışık karakterinizi belirler.</h2>
        </div>
        <div className="service-image-grid three-column">
          {letterTypes.map((item) => (
            <article className="service-image-card" key={item.title}>
              <Image
                src={item.image}
                alt={item.title}
                width={900}
                height={700}
              />
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Link href={item.href}>İncele →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
