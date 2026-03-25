import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://gildedglowskin.com";
  const supabase = await createClient();

  const [{ data: productos }, { data: guias }] = await Promise.all([
    supabase.from("productos").select("slug, updated_at").eq("activo", true),
    supabase.from("guias").select("slug, updated_at"),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/guia`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  const productoPages: MetadataRoute.Sitemap = (productos ?? []).map((p) => ({
    url: `${baseUrl}/productos/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const guiaPages: MetadataRoute.Sitemap = (guias ?? []).map((g) => ({
    url: `${baseUrl}/guia/${g.slug}`,
    lastModified: new Date(g.updated_at),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...productoPages, ...guiaPages];
}
