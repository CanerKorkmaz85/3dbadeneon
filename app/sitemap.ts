import type { MetadataRoute } from "next";
import productsData from "../public/data/products.json";

type Product = {
  id: string;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://3dbadeneon.com";

  const products = productsData as Product[];

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/magaza`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tasarla`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/iletisim`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/urunler/${product.id}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}