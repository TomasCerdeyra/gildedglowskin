import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Guía Glow | The Glow Bible",
  description:
    "Guías completas sobre los ingredientes activos, modo de uso y beneficios de cada producto.",
};

export const revalidate = 60;

export default async function GuiaIndexPage() {
  const supabase = await createClient();
  const { data: guias } = await supabase
    .from("guias")
    .select("*, productos!guias_producto_id_fkey(nombre, slug, categoria_id, categorias(nombre))")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#FFF9F9]">
      {/* Hero banner */}
      <div className="bg-gradient-to-br from-[#D79A9A]/20 to-[#FFF9F9] pt-24 pb-12 px-4 text-center">
        <span className="text-[#D4AF37] text-sm font-medium tracking-widest uppercase">
          ✦ Educación
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#8B1E2D] mt-2 mb-4">
          The Glow Bible
        </h1>
        <p className="text-[#4A4A4A]/70 max-w-lg mx-auto text-lg">
          Todo lo que necesitás saber sobre cada producto: ingredientes,
          beneficios y rituales de uso.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!guias || guias.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl font-display text-[#D79A9A] mb-3">
              Próximamente
            </p>
            <p className="text-[#4A4A4A]/60">
              Las guías están en preparación. ¡Volvé pronto!
            </p>
            <Link
              href="/#catalogo"
              className="inline-flex items-center gap-2 mt-6 text-[#8B1E2D] font-semibold hover:underline"
            >
              Ver productos <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guias.map((guia) => (
              <article
                key={guia.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-[#D79A9A]/20"
              >
                <div className="relative aspect-video">
                  <Image
                    src={guia.imagen_banner || "/placeholder-guide.jpg"}
                    alt={guia.titulo}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  {guia.productos && (
                    <span className="inline-block bg-[#D79A9A]/20 text-[#8B1E2D] text-xs font-medium px-2 py-1 rounded-full mb-3">
                      {guia.productos.nombre}
                    </span>
                  )}
                  <h2 className="font-display font-semibold text-[#4A4A4A] text-lg mb-2 line-clamp-2">
                    {guia.titulo}
                  </h2>
                  {guia.subtitulo && (
                    <p className="text-sm text-[#4A4A4A]/60 line-clamp-2 mb-4">
                      {guia.subtitulo}
                    </p>
                  )}
                  <Link
                    href={`/guia/${guia.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#8B1E2D] hover:underline"
                  >
                    Leer guía <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
