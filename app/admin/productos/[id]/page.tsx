import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductoForm from "@/components/admin/ProductoForm";
import type { Guia } from "@/lib/supabase/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarProductoPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: producto }, { data: categorias }, { data: guias }] =
    await Promise.all([
      supabase.from("productos").select("*").eq("id", id).single(),
      supabase.from("categorias").select("*").order("orden"),
      supabase.from("guias").select("id, titulo").order("titulo"),
    ]);

  if (!producto) notFound();

  return (
    <div className="pt-14 lg:pt-0">
      <h1 className="font-display text-2xl font-bold text-gray-800 mb-6">
        Editar Producto
      </h1>
      <ProductoForm
        producto={producto}
        categorias={categorias ?? []}
        guias={(guias ?? []) as Guia[]}
      />
    </div>
  );
}
