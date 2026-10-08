import type { Metadata } from "next";
import type { ReactNode } from "react";
import productsData from "../../../public/data/products.json";

const SITE_URL = "https://3dbadeneon.com";

type Product = {
  id: string;
  title: string;
  description?: string;
  mainImage?: string;
  hoverImages?: string[];
  category?: string;
  price30?: string;
  price40?: string;
  price50?: string;
  specialPrice?: string;
  remoteExtra?: string;
};

async function getProduct(id: string): Promise<Product | null> {
  const products = productsData as Product[];

  return products.find((item) => item.id === id) || null;
}

function cleanText(value?: string) {
  if (!value) return "";

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/Açıklama Başlığı:/gi, " ")
    .replace(/Teknik Özellikler:/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function absoluteUrl(url?: string) {
  if (!url) return undefined;

  if (
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }

  return `${SITE_URL}${
    url.startsWith("/") ? url : `/${url}`
  }`;
}

function createSeoDescription(product: Product) {
  const categoryText = product.category
    ? `${product.category} kategorisinde `
    : "";

  return (
    `${product.title}; ${categoryText}` +
    `özel üretim LED neon dekor. ` +
    `Farklı ölçü seçenekleri, kişiye özel üretim ve ` +
    `ücretsiz kargo avantajıyla 3dBade Neon'da.`
  ).slice(0, 160);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Ürün",
      description:
        "Neon tabela, LED neon, 3D baskı ve kişiye özel tasarım ürünleri.",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const productUrl =
    `${SITE_URL}/urunler/${product.id}`;

  const description =
    createSeoDescription(product);

  const imageUrl =
    absoluteUrl(product.mainImage);

  return {
    title:
      `${product.title} | Neon Tabela ve Özel Tasarım`,

    description,

    alternates: {
      canonical: productUrl,
    },

    openGraph: {
      type: "website",
      url: productUrl,
      siteName: "3dBade Neon",
      title: `${product.title} | 3dBade Neon`,
      description,

      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: product.title,
            },
          ]
        : undefined,
    },

    twitter: {
      card: "summary_large_image",
      title: `${product.title} | 3dBade Neon`,
      description,
      images: imageUrl
        ? [imageUrl]
        : undefined,
    },

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function ProductLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product =
    await getProduct(id);

  if (!product) {
    return children;
  }

  const productUrl =
    `${SITE_URL}/urunler/${product.id}`;

  const description =
    cleanText(product.description) ||
    createSeoDescription(product);

  const images = [
    product.mainImage,
    ...(product.hoverImages || []),
  ]
    .filter(
      (image): image is string =>
        Boolean(image)
    )
    .map((image) =>
      absoluteUrl(image)
    )
    .filter(
      (image): image is string =>
        Boolean(image)
    );

  const price =
    Number(product.price30);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",

    "@id":
      `${productUrl}#product`,

    name:
      product.title,

    url:
      productUrl,

    description:
      description.slice(0, 500),

    image:
      images,

    sku:
      product.id,

    category:
      product.category ||
      "Neon LED Dekor",

    brand: {
      "@type": "Brand",
      name: "3dBade Neon",
    },

    ...(price > 0
      ? {
          offers: {
            "@type": "Offer",

            url:
              productUrl,

            priceCurrency:
              "TRY",

            price:
              price.toString(),

            itemCondition:
              "https://schema.org/NewCondition",

            seller: {
              "@type": "Organization",
              name: "3dBade Neon",
            },
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(productSchema),
        }}
      />

      {children}
    </>
  );
}