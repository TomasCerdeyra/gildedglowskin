import { createClient } from "@/lib/supabase/server";
import GuiaForm from "@/components/admin/GuiaForm";

export default async function NuevaGuiaPage() {
  const supabase = await createClient();
  const { data: productos } = await supabase
    .from("productos")
    .select("*")
    .eq("activo", true)
    .order("nombre");

  return (
    <div className="pt-14 lg:pt-0">
      <h1 className="font-display text-2xl font-bold text-gray-800 mb-6">
        Nueva Guía
      </h1>
      <GuiaForm productos={productos ?? []} />
    </div>
  );
}
