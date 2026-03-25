import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import GuiaForm from "@/components/admin/GuiaForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarGuiaPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: guia }, { data: productos }] = await Promise.all([
    supabase.from("guias").select("*").eq("id", id).single(),
    supabase.from("productos").select("*").eq("activo", true).order("nombre"),
  ]);

  if (!guia) notFound();

  return (
    <div className="pt-14 lg:pt-0">
      <h1 className="font-display text-2xl font-bold text-gray-800 mb-6">
        Editar Guía
      </h1>
      <GuiaForm guia={guia} productos={productos ?? []} />
    </div>
  );
}
