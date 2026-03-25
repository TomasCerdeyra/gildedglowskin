import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Guia } from "@/lib/supabase/types";

interface GuiaPreviewSectionProps {
  guias: Guia[];
}

export default function GuiaPreviewSection({ guias }: GuiaPreviewSectionProps) {
  return (
    <section className="py-16 sm:py-20 bg-[#D79A9A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-[#D4AF37] text-sm font-medium tracking-widest uppercase">
            ✦ Educación
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#8B1E2D] mt-2 mb-3">
            The Glow Bible
          </h2>
          <p className="text-[#4A4A4A]/70 max-w-md mx-auto">
            Guías completas para sacar el máximo provecho de cada producto.
          </p>
        </div>

        {guias.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#4A4A4A]/50 text-lg">
              Las guías están en camino. ¡Próximamente!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {guias.slice(0, 3).map((guia) => (
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
                  <h3 className="font-display font-semibold text-[#4A4A4A] text-base mb-2 line-clamp-2">
                    {guia.titulo}
                  </h3>
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

        <div className="text-center">
          <Link
            href="/guia"
            className="inline-flex items-center gap-2 border border-[#8B1E2D] text-[#8B1E2D] font-semibold px-8 py-3 rounded-full hover:bg-[#8B1E2D] hover:text-white transition-colors"
          >
            Ver todas las guías
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
