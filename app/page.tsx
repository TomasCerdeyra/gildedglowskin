import { createClient } from "@/lib/supabase/server";
import HeroSection from "@/components/home/HeroSection";
import TrustBar from "@/components/home/TrustBar";
import CatalogoSection from "@/components/home/CatalogoSection";
import GuiaPreviewSection from "@/components/home/GuiaPreviewSection";
import BannerEnvios from "@/components/home/BannerEnvios";
import FaqSection from "@/components/home/FaqSection";

export const revalidate = 60; // ISR cada 60 segundos

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: productos }, { data: categorias }, { data: guias }, { data: faqs }, { data: config }] =
    await Promise.all([
      supabase
        .from("productos")
        .select("*, categorias(*)")
        .eq("activo", true)
        .order("orden"),
      supabase.from("categorias").select("*").order("orden"),
      supabase
        .from("guias")
        .select("*, productos!guias_producto_id_fkey(nombre, slug)")
        .order("created_at", { ascending: false })
        .limit(3),
      supabase.from("faqs").select("*").eq("activa", true).order("orden"),
      supabase
        .from("configuracion")
        .select("*")
        .eq("clave", "banner_envios_texto")
        .maybeSingle(),
    ]);

  const bannerTexto = config?.valor;

  return (
    <>
      <HeroSection />
      <TrustBar />
      <CatalogoSection
        productos={productos ?? []}
        categorias={categorias ?? []}
      />
      <GuiaPreviewSection guias={guias ?? []} />
      <BannerEnvios texto={bannerTexto} />
      <FaqSection faqs={faqs ?? []} />
    </>
  );
}
