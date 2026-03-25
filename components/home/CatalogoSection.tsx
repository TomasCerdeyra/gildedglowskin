"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Categoria, Producto } from "@/lib/supabase/types";

interface CatalogoSectionProps {
  productos: Producto[];
  categorias: Categoria[];
}

export default function CatalogoSection({
  productos,
  categorias,
}: CatalogoSectionProps) {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  const filtered = selectedCat
    ? productos.filter((p) => p.categoria_id === selectedCat)
    : productos;

  return (
    <section id="catalogo" className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#8B1E2D] mb-3">
            Nuestra Colección
          </h2>
          <p className="text-[#4A4A4A]/70 max-w-md mx-auto">
            Elegí el ritual perfecto para tu piel.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide justify-start md:justify-center">
          <button
            onClick={() => setSelectedCat(null)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCat === null
                ? "bg-[#8B1E2D] text-white"
                : "bg-white border border-[#D79A9A]/40 text-[#4A4A4A] hover:border-[#8B1E2D]"
            }`}
          >
            Todos
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCat === cat.id
                  ? "bg-[#8B1E2D] text-white"
                  : "bg-white border border-[#D79A9A]/40 text-[#4A4A4A] hover:border-[#8B1E2D]"
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[#4A4A4A]/50">
            <p className="text-lg">No hay productos en esta categoría aún.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((producto, i) => (
              <ProductCard key={producto.id} producto={producto} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
