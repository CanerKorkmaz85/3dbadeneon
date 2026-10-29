import Image from "next/image";
import Link from "next/link";

const metalApplications = [
  "Mimari Paslanmaz Uygulamalar",
  "Dekoratif Metal",
  "Özel Metal İmalat",
  "Paslanmaz Kaplama",
  "İç Mekân Metal Uygulamaları",
  "Dış Mekân Metal Uygulamaları",
];

const images = [
  "/uploads/paslanmaz-metal-ma-aza-sistemleri-1792710083034/ana-1792710083051-rqlrzc.jpg",
  "/uploads/paslanmaz-metal-ma-aza-sistemleri-1792710083034/galeri-1-1792710083053-llm68f.jpg",
  "/uploads/paslanmaz-metal-ma-aza-sistemleri-1792710083034/galeri-2-1792710083055-iknmka.jpg",
  "/uploads/paslanmaz-metal-ma-aza-sistemleri-1792710083034/galeri-3-1792710083056-mqluj0.jpg",
  "/uploads/paslanmaz-metal-ma-aza-sistemleri-1792710083034/galeri-4-1792710083058-d0twli.jpg",
  "/uploads/paslanmaz-metal-ma-aza-sistemleri-1792710083034/galeri-5-1792710083060-gsioy8.jpg",
];

export default function StainlessMetalPage() {
  return (
    <main className="service-page">
      <section className="service-hero service-hero-metal">
        <p>PASLANMAZ &amp; METAL</p>
        <h1>Mimariye uyum sağlayan özel metal uygulamalar.</h1>
        <span>
          İç ve dış mekânda; kaplama, dekoratif detay, mağaza sistemi ve özel
          imalat ihtiyaçlarınız için projeye özel çözümler.
        </span>
      </section>
      <section className="service-catalog-section">
        <div className="service-section-heading">
          <p>UYGULAMA ALANLARI</p>
          <h2>Kutu harften ayrı, tamamen metal odaklı.</h2>
        </div>
        <div className="service-image-grid three-column">
          {metalApplications.map((title, index) => (
            <article className="service-image-card" key={title}>
              <Image src={images[index]} alt={title} width={900} height={700} />
              <div>
                <h3>{title}</h3>
                <p>Projeye ve uygulama alanına özel ölçülendirme.</p>
                <Link href="/iletisim">Teklif al →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
