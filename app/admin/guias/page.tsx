import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";

export default async function AdminGuiasPage() {
  const supabase = await createClient();
  const { data: guias } = await supabase
    .from("guias")
    .select("*, productos!guias_producto_id_fkey(nombre)")
    .order("created_at", { ascending: false });

  return (
    <div className="pt-14 lg:pt-0">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-800">Guías</h1>
        <Link
          href="/admin/guias/nueva"
          className="flex items-center gap-2 bg-[#8B1E2D] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#6e1724] transition-colors"
        >
          <Plus size={16} /> Nueva Guía
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Título</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Producto</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Fecha</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {guias?.map((g) => (
              <tr key={g.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3 font-medium text-gray-800">{g.titulo}</td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                  {g.productos?.nombre ?? "—"}
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">
                  {new Date(g.updated_at).toLocaleDateString("es-AR")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/guias/${g.id}`}
                      className="p-1.5 text-gray-500 hover:text-[#8B1E2D] hover:bg-[#D79A9A]/10 rounded-lg transition-colors"
                      aria-label="Editar"
                    >
                      <Edit size={16} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!guias || guias.length === 0) && (
          <div className="text-center py-12 text-gray-400">
            No hay guías aún.
          </div>
        )}
      </div>
    </div>
  );
}
