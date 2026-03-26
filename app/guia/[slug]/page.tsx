import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { MessageCircle, CheckCircle2, ArrowRight } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("guias")
    .select("titulo, subtitulo, imagen_banner")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "Guía no encontrada" };

  return {
    title: `${data.titulo} | The Glow Bible`,
    description: data.subtitulo ?? undefined,
    openGraph: {
      images: data.imagen_banner ? [{ url: data.imagen_banner }] : [],
    },
  };
}

export default async function GuiaPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: guia } = await supabase
    .from("guias")
    .select("*, productos!guias_producto_id_fkey(id, nombre, slug, precio, imagen_principal, descripcion_corta)")
    .eq("slug", slug)
    .single();

  if (!guia) notFound();

  // Related guias
  const { data: relacionadas } = await supabase
    .from("guias")
    .select("id, slug, titulo, subtitulo, imagen_banner, productos!guias_producto_id_fkey(nombre)")
    .neq("id", guia.id)
    .limit(3);

  const waLink = guia.productos
    ? buildWhatsAppLink(guia.productos.nombre, guia.productos.precio)
    : `https://wa.me/5493329516376?text=${encodeURIComponent("Hola! Quisiera información sobre sus productos.")}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guia.titulo,
    description: guia.subtitulo,
    image: guia.imagen_banner,
    datePublished: guia.created_at,
    dateModified: guia.updated_at,
    author: { "@type": "Organization", name: "Gilded Glow Skin" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="min-h-screen bg-[#FFF9F9]">
        {/* Banner */}
        <div className="relative min-h-[320px] sm:min-h-[400px] flex flex-col justify-end mt-0">
          <Image
            src={guia.imagen_banner || "/placeholder-guide.jpg"}
            alt={guia.titulo}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#8B1E2D]/80 via-transparent to-transparent" />
          <div className="relative z-10 w-full p-6 pt-24 sm:p-10 sm:pt-32">
            <div className="max-w-4xl mx-auto">
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {guia.titulo}
              </h1>
              {guia.subtitulo && (
                <p className="text-white/90 mt-3 text-base sm:text-lg">{guia.subtitulo}</p>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <nav className="text-sm text-[#4A4A4A]/60 mb-8">
            <Link href="/" className="hover:text-[#8B1E2D]">Inicio</Link>
            {" › "}
            <Link href="/guia" className="hover:text-[#8B1E2D]">Guía Glow</Link>
            {" › "}
            <span className="text-[#4A4A4A]">{guia.titulo}</span>
          </nav>

          {/* Para quién es */}
          {guia.para_quien_es && (
            <div className="bg-[#D79A9A]/15 border border-[#D79A9A]/40 rounded-2xl p-6 mb-8">
              <h2 className="font-display text-xl font-bold text-[#8B1E2D] mb-2">
                ¿Para quién es?
              </h2>
              <p className="text-[#4A4A4A] leading-relaxed">{guia.para_quien_es}</p>
            </div>
          )}

          {/* Ingredientes */}
          {guia.ingredientes && guia.ingredientes.length > 0 && (
            <div className="mb-10">
              <h2 className="font-display text-2xl font-bold text-[#8B1E2D] mb-6">
                Ingredientes Clave
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {guia.ingredientes.map(
                  (
                    ing: { nombre: string; descripcion: string; beneficio: string },
                    i: number
                  ) => (
                    <div
                      key={i}
                      className="bg-white border border-[#D79A9A]/20 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[#D4AF37] font-bold">✦</span>
                        <h3 className="font-semibold text-[#4A4A4A]">{ing.nombre}</h3>
                      </div>
                      <p className="text-sm text-[#4A4A4A]/70 mb-1">{ing.descripcion}</p>
                      <p className="text-xs font-medium text-[#8B1E2D]">
                        {ing.beneficio}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Pasos de uso */}
          {guia.pasos_uso && guia.pasos_uso.length > 0 && (
            <div className="mb-10">
              <h2 className="font-display text-2xl font-bold text-[#8B1E2D] mb-6">
                Modo de Uso
              </h2>
              <div className="flex flex-col gap-4">
                {guia.pasos_uso.map(
                  (
                    paso: { numero: number; titulo: string; descripcion: string },
                    i: number
                  ) => (
                    <div key={i} className="flex gap-4">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-[#8B1E2D] text-white flex items-center justify-center text-sm font-bold">
                        {paso.numero || i + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#4A4A4A] mb-1">
                          {paso.titulo}
                        </h3>
                        <p className="text-sm text-[#4A4A4A]/70">{paso.descripcion}</p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Beneficios */}
          {guia.beneficios && guia.beneficios.length > 0 && (
            <div className="mb-10">
              <h2 className="font-display text-2xl font-bold text-[#8B1E2D] mb-4">
                Beneficios
              </h2>
              <ul className="flex flex-col gap-3">
                {guia.beneficios.map((b: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-[#8B1E2D] mt-0.5 shrink-0" />
                    <span className="text-[#4A4A4A]">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tips */}
          {guia.tips && (
            <div className="bg-[#D79A9A]/20 border border-[#D79A9A]/40 rounded-2xl p-6 mb-10">
              <h2 className="font-display text-xl font-bold text-[#8B1E2D] mb-3">
                💡 Tips Extra
              </h2>
              <p className="text-[#4A4A4A] leading-relaxed">{guia.tips}</p>
            </div>
          )}

          {/* Contenido rico */}
          {guia.contenido_rico && (
            <div
              className="prose prose-sm sm:prose max-w-none mb-10 text-[#4A4A4A]"
              dangerouslySetInnerHTML={{ __html: guia.contenido_rico }}
            />
          )}

          {/* CTA producto */}
          {guia.productos && (
            <div className="bg-white border border-[#D79A9A]/30 rounded-2xl p-6 mb-10 flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden">
                <Image
                  src={guia.productos.imagen_principal || "/placeholder-product.jpg"}
                  alt={guia.productos.nombre}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-xs text-[#4A4A4A]/60 mb-1">Producto asociado</p>
                <h3 className="font-display font-bold text-[#8B1E2D] mb-1">
                  {guia.productos.nombre}
                </h3>
                <p className="text-sm text-[#4A4A4A]/70 line-clamp-2">
                  {guia.productos.descripcion_corta}
                </p>
              </div>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-2 bg-[#8B1E2D] text-white font-semibold px-5 py-3 rounded-xl hover:bg-[#6e1724] transition-colors"
              >
                <MessageCircle size={18} />
                Pedir ahora
              </a>
            </div>
          )}

          {/* Guías relacionadas */}
          {relacionadas && relacionadas.length > 0 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-[#8B1E2D] mb-6">
                Otras guías
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relacionadas.map((g) => (
                  <Link
                    key={g.id}
                    href={`/guia/${g.slug}`}
                    className="bg-white border border-[#D79A9A]/20 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-video">
                      <Image
                        src={g.imagen_banner || "/placeholder-guide.jpg"}
                        alt={g.titulo}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-[#4A4A4A] line-clamp-2 mb-1">
                        {g.titulo}
                      </h3>
                      <span className="text-xs text-[#8B1E2D] flex items-center gap-1">
                        Leer <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
