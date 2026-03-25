import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import ProductosAdminList from "@/components/admin/ProductosAdminList";

export default async function AdminProductosPage() {
  const supabase = await createClient();
  const { data: productos } = await supabase
    .from("productos")
    .select("*, categorias(nombre)")
    .order("orden");

  const { data: categorias } = await supabase
    .from("categorias")
    .select("*")
    .order("orden");

  return (
    <div className="pt-14 lg:pt-0">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-800">
          Productos
        </h1>
        <Link
          href="/admin/productos/nuevo"
          className="flex items-center gap-2 bg-[#8B1E2D] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#6e1724] transition-colors"
        >
          <Plus size={16} /> Nuevo Producto
        </Link>
      </div>
      <ProductosAdminList productos={productos ?? []} />
    </div>
  );
}
