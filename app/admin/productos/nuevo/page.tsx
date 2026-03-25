import { createClient } from "@/lib/supabase/server";
import ProductoForm from "@/components/admin/ProductoForm";
import type { Guia } from "@/lib/supabase/types";

export default async function NuevoProductoPage() {
  const supabase = await createClient();
  const [{ data: categorias }, { data: guias }] = await Promise.all([
    supabase.from("categorias").select("*").order("orden"),
    supabase.from("guias").select("id, titulo").order("titulo"),
  ]);

  return (
    <div className="pt-14 lg:pt-0">
      <h1 className="font-display text-2xl font-bold text-gray-800 mb-6">
        Nuevo Producto
      </h1>
      <ProductoForm categorias={categorias ?? []} guias={(guias ?? []) as Guia[]} />
    </div>
  );
}
