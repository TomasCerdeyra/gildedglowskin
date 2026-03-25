"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Producto } from "@/lib/supabase/types";

interface Props {
  productos: (Producto & { categorias?: { nombre: string } | null })[];
}

export default function ProductosAdminList({ productos: initial }: Props) {
  const [productos, setProductos] = useState(initial);

  async function toggleActivo(id: string, current: boolean) {
    const supabase = createClient();
    await supabase.from("productos").update({ activo: !current }).eq("id", id);
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, activo: !current } : p))
    );
  }

  async function handleDelete(id: string, nombre: string) {
    if (!confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`))
      return;
    const supabase = createClient();
    await supabase.from("productos").delete().eq("id", id);
    setProductos((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Producto</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Categoría</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Precio</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Stock</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Activo</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {productos.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      {p.imagen_principal && (
                        <Image
                          src={p.imagen_principal}
                          alt={p.nombre}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      )}
                    </div>
                    <span className="font-medium text-gray-800 line-clamp-1">
                      {p.nombre}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                  {p.categorias?.nombre ?? "—"}
                </td>
                <td className="px-4 py-3 font-semibold text-[#8B1E2D]">
                  ${p.precio.toLocaleString("es-AR")}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span
                    className={`font-medium ${
                      p.stock <= 5 ? "text-red-600" : "text-gray-700"
                    }`}
                  >
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActivo(p.id, p.activo)}
                    aria-label={p.activo ? "Desactivar" : "Activar"}
                    className={`p-1.5 rounded-lg transition-colors ${
                      p.activo
                        ? "text-green-600 hover:bg-green-50"
                        : "text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    {p.activo ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/productos/${p.id}`}
                      className="p-1.5 text-gray-500 hover:text-[#8B1E2D] hover:bg-[#D79A9A]/10 rounded-lg transition-colors"
                      aria-label="Editar"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.nombre)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {productos.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No hay productos. ¡Creá el primero!
          </div>
        )}
      </div>
    </div>
  );
}
