"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Producto } from "@/lib/supabase/types";

interface ProductCardProps {
  producto: Producto;
  index?: number;
}

export default function ProductCard({ producto, index = 0 }: ProductCardProps) {
  const waLink = buildWhatsAppLink(producto.nombre, producto.precio);
  const lowStock = producto.stock > 0 && producto.stock <= 5;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-[#D79A9A]/20 flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-square">
        <Image
          src={producto.imagen_principal || "/placeholder-product.jpg"}
          alt={producto.nombre}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {lowStock && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Últimas {producto.stock} unidades
            </span>
          )}
          {producto.precio_tachado && (
            <span className="bg-[#D4AF37] text-white text-xs font-semibold px-2 py-1 rounded-full">
              OFERTA
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="font-display font-bold text-gray-900 text-base leading-snug line-clamp-2">
          {producto.nombre}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 flex-1">
          {producto.descripcion_corta}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-[#8B1E2D]">
            ${producto.precio.toLocaleString("es-AR")}
          </span>
          {producto.precio_tachado && (
            <span className="text-sm text-[#4A4A4A]/50 line-through">
              ${producto.precio_tachado.toLocaleString("es-AR")}
            </span>
          )}
        </div>

        {/* CTA */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#8B1E2D] text-white text-sm font-semibold py-3 rounded-xl hover:bg-[#6e1724] transition-colors"
        >
          <MessageCircle size={16} />
          Pedir por WhatsApp
        </a>

        <Link
          href={`/productos/${producto.slug}`}
          className="flex items-center justify-center gap-1 text-sm text-[#8B1E2D] font-medium hover:underline"
        >
          Ver detalles <ArrowRight size={14} />
        </Link>
      </div>
    </motion.article>
  );
}
