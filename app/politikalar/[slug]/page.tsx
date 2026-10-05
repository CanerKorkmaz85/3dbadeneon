import Link from "next/link";
import { notFound } from "next/navigation";

const policies: Record<
  string,
  {
    title: string;
    intro: string;
    sections: Array<{ heading: string; text: string }>;
  }
> = {
  "gizlilik-kvkk": {
    title: "Gizlilik Politikası ve KVKK",
    intro:
      "3Dbade Neon, talep ve sipariş süreçlerinde paylaşılan kişisel verileri yalnızca hizmetin sunulması, iletişim ve yasal yükümlülüklerin yerine getirilmesi amacıyla işler.",
    sections: [
      {
        heading: "İşlenen bilgiler",
        text: "Ad, soyad, telefon, e-posta, teslimat ve fatura bilgileri ile tasarım talebiniz kapsamında ilettiğiniz dosyalar işlenebilir.",
      },
      {
        heading: "Kullanım amacı",
        text: "Bilgiler teklif oluşturma, sipariş ve teslimat işlemleri, destek talepleri ve mevzuattan doğan yükümlülüklerin yerine getirilmesi için kullanılır.",
      },
      {
        heading: "Haklarınız",
        text: "Kişisel verilerinizle ilgili bilgi talep etme, düzeltme, silme veya işleme faaliyetlerine itiraz etme taleplerinizi info@3dbadeneon.com adresine iletebilirsiniz.",
      },
    ],
  },
  "iptal-iade": {
    title: "İptal ve İade Şartları",
    intro:
      "Her neon ürün, müşterinin seçtiği ölçü, renk ve tasarım doğrultusunda üretilir. Siparişinizle ilgili talebinizi bize en kısa sürede iletmenizi rica ederiz.",
    sections: [
      {
        heading: "Sipariş iptali",
        text: "Üretime başlanmamış siparişler için iptal talebinizi iletişim kanallarımızdan iletebilirsiniz. Talebiniz sipariş durumuna göre değerlendirilir.",
      },
      {
        heading: "Hasarlı veya hatalı ürün",
        text: "Teslimatta görülen hasar veya üretim hatası için ürünü teslim alırken kayıt tutmanızı ve durumu gecikmeden bizimle paylaşmanızı rica ederiz.",
      },
      {
        heading: "Kişiye özel üretim",
        text: "Kişiselleştirilmiş tasarım, ölçü veya renk seçimleri içeren ürünlerde iade ve cayma hakları ilgili mevzuat ve siparişin niteliğine göre değerlendirilir.",
      },
    ],
  },
  "mesafeli-satis": {
    title: "Mesafeli Satış Sözleşmesi",
    intro:
      "Bu sayfa, online ödeme altyapısı devreye alındığında kullanılacak mesafeli satış sözleşmesinin bilgilendirme taslağıdır.",
    sections: [
      {
        heading: "Taraflar",
        text: "Satıcı: 3Dbade Neon. Alıcı: Sipariş sırasında bilgileri paylaşılan müşteri. Satıcının ticari unvan, adres, vergi ve MERSİS bilgileri online ödeme açılmadan önce bu alana eklenecektir.",
      },
      {
        heading: "Sipariş ve teslimat",
        text: "Ürün özellikleri, toplam bedel, ödeme yöntemi ve teslimat bilgileri sipariş aşamasında müşteriye açıkça sunulur. Üretim ve teslimat süresi seçilen tasarıma göre bildirilir.",
      },
      {
        heading: "Cayma ve uyuşmazlık",
        text: "Cayma hakkı, istisnaları ve başvuru yolları yürürlükteki tüketici mevzuatına göre uygulanır. Uyuşmazlıklarda yetkili tüketici hakem heyetleri ve tüketici mahkemeleri görevli olabilir.",
      },
    ],
  },
  "hukum-kosullar": {
    title: "Hüküm ve Koşullar",
    intro:
      "Bu siteyi kullanan ziyaretçiler aşağıdaki kullanım ilkelerini kabul eder.",
    sections: [
      {
        heading: "Site kullanımı",
        text: "Sitedeki ürün görselleri, tasarımlar, marka öğeleri ve içerikler 3Dbade Neon veya ilgili hak sahiplerine aittir. İzinsiz çoğaltılamaz veya ticari amaçla kullanılamaz.",
      },
      {
        heading: "Ürün bilgileri",
        text: "Görseller temsilî olabilir. Özel üretimde ölçü, renk ve uygulama detayları teklif ve sipariş onayı sırasında netleştirilir.",
      },
      {
        heading: "Değişiklikler",
        text: "3Dbade Neon; içerik, ürün bilgileri, fiyatlar ve bu koşullarda yürürlükteki mevzuata uygun şekilde değişiklik yapabilir.",
      },
    ],
  },
  "sartlar-kosullar": {
    title: "Şartlar & Koşullar",
    intro:
      "Tasarım talebi ve sipariş süreçlerinin sağlıklı ilerlemesi için aşağıdaki esaslar uygulanır.",
    sections: [
      {
        heading: "Tasarım onayı",
        text: "Kişiye özel işlerde üretim, müşterinin tasarım, ölçü, renk ve yazım bilgisini onaylamasından sonra başlar.",
      },
      {
        heading: "Teklif geçerliliği",
        text: "Tekliflerdeki fiyat, kapsam ve üretim süresi belirtilen koşullar için geçerlidir. Sonradan yapılacak değişiklikler teklifi etkileyebilir.",
      },
      {
        heading: "İletişim",
        text: "Sorularınız ve talepleriniz için info@3dbadeneon.com veya WhatsApp iletişim hattımız üzerinden bize ulaşabilirsiniz.",
      },
    ],
  },
};

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = policies[slug];
  if (!policy) notFound();
  return (
    <main className="policy-page">
      <article className="policy-content">
        <p>3DBADE NEON · POLİTİKALAR</p>
        <h1>{policy.title}</h1>
        <div className="policy-notice">
          Bu metin, şirket bilgileri ve satış altyapısı tamamlandığında hukuk
          uzmanınız tarafından son kez gözden geçirilmelidir.
        </div>
        <span>{policy.intro}</span>
        {policy.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.text}</p>
          </section>
        ))}
        <Link href="/" className="policy-back">
          ← Ana sayfaya dön
        </Link>
      </article>
    </main>
  );
}
