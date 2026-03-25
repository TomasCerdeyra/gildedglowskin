import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { MessageCircle, ArrowRight, Tag } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { Producto as Produto } from "@/lib/supabase/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // ISR cada 60 segundos

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("productos")
    .select("nombre, descripcion_corta, imagen_principal")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "Producto no encontrado" };

  return {
    title: data.nombre,
    description: data.descripcion_corta,
    openGraph: {
      title: `${data.nombre} | Gilded Glow Skin`,
      description: data.descripcion_corta,
      images: data.imagen_principal ? [{ url: data.imagen_principal }] : [],
    },
  };
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: producto } = await supabase
    .from("productos")
    .select("*, categorias(*), guias!productos_guia_id_fkey(id, slug, titulo, subtitulo, imagen_banner)")
    .eq("slug", slug)
    .eq("activo", true)
    .single();

  if (!producto) notFound();

  const waLink = buildWhatsAppLink(producto.nombre, producto.precio);
  const allImages = [
    producto.imagen_principal,
    ...(producto.imagenes_extra ?? []),
  ].filter(Boolean);

  // Related products
  const { data: relacionados } = await supabase
    .from("productos")
    .select("*, categorias(*)")
    .eq("activo", true)
    .eq("categoria_id", producto.categoria_id)
    .neq("id", producto.id)
    .limit(3);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: producto.nombre,
    description: producto.descripcion_corta,
    image: producto.imagen_principal,
    offers: {
      "@type": "Offer",
      price: producto.precio,
      priceCurrency: "ARS",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="min-h-screen bg-[#FFF9F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          {/* Breadcrumb */}
          <nav className="text-sm text-[#4A4A4A]/60 mb-8">
            <Link href="/" className="hover:text-[#8B1E2D]">Inicio</Link>
            {" › "}
            <Link href="/#catalogo" className="hover:text-[#8B1E2D]">Productos</Link>
            {" › "}
            <span className="text-[#4A4A4A]">{producto.nombre}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Gallery */}
            <div className="flex flex-col gap-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-[#D79A9A]/20">
                <Image
                  src={allImages[0] || "/placeholder-product.jpg"}
                  alt={producto.nombre}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {producto.stock > 0 && producto.stock <= 5 && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Últimas {producto.stock} unidades
                  </span>
                )}
                {producto.precio_tachado && (
                  <span className="absolute top-4 right-4 bg-[#D4AF37] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    OFERTA
                  </span>
                )}
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto">
                  {allImages.map((img, i) => (
                    <div
                      key={i}
                      className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border border-[#D79A9A]/30"
                    >
                      <Image
                        src={img}
                        alt={`${producto.nombre} imagen ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="flex flex-col gap-6">
              {producto.categorias && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[#8B1E2D] bg-[#D79A9A]/15 px-3 py-1 rounded-full w-fit">
                  {producto.categorias.nombre}
                </span>
              )}

              <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#8B1E2D] leading-tight">
                {producto.nombre}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-[#8B1E2D]">
                  ${producto.precio.toLocaleString("es-AR")}
                </span>
                {producto.precio_tachado && (
                  <span className="text-xl text-[#4A4A4A]/50 line-through">
                    ${producto.precio_tachado.toLocaleString("es-AR")}
                  </span>
                )}
              </div>

              {/* Description */}
              {producto.descripcion_larga ? (
                <div className="prose prose-sm max-w-none text-[#4A4A4A] leading-relaxed">
                  {producto.descripcion_larga.split("\n").map((p: string, i: number) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              ) : (
                <p className="text-[#4A4A4A]/80 leading-relaxed">
                  {producto.descripcion_corta}
                </p>
              )}

              {/* Tags */}
              {producto.tags && producto.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {producto.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 text-xs bg-[#D79A9A]/15 text-[#4A4A4A] px-3 py-1 rounded-full"
                    >
                      <Tag size={11} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA */}
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-[#8B1E2D] text-white font-semibold text-base py-4 rounded-xl hover:bg-[#6e1724] hover:shadow-lg transition-all"
              >
                <MessageCircle size={20} />
                Pedir por WhatsApp
              </a>

              {/* Guia link */}
              {producto.guias && (
                <div className="p-4 bg-[#D79A9A]/10 rounded-xl border border-[#D79A9A]/30">
                  <p className="text-sm text-[#4A4A4A]/70 mb-2">
                    Guía de uso disponible
                  </p>
                  <h3 className="font-display font-semibold text-[#8B1E2D] mb-3">
                    {producto.guias.titulo}
                  </h3>
                  <Link
                    href={`/guia/${producto.guias.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#8B1E2D] hover:underline"
                  >
                    Ver guía completa <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Related products */}
          {relacionados && relacionados.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display text-2xl font-bold text-[#8B1E2D] mb-6">
                También te puede gustar
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relacionados.map((p: Produto, i: number) => (
                  <ProductCard key={p.id} producto={p} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
