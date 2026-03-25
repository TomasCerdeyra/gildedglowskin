import { createClient } from "@/lib/supabase/server";
import { CheckCircle2, XCircle } from "lucide-react";

export default async function AdminResenasPage() {
  const supabase = await createClient();
  const { data: resenas } = await supabase
    .from("reseñas")
    .select("*, productos(nombre)")
    .order("created_at", { ascending: false });

  return (
    <div className="pt-14 lg:pt-0">
      <h1 className="font-display text-2xl font-bold text-gray-800 mb-2">
        Reseñas
      </h1>
      <p className="text-sm text-gray-400 mb-6">
        Moderá las reseñas antes de publicarlas. Próximamente estará disponible
        el formulario público para que los clientes envíen sus opiniones.
      </p>

      {(!resenas || resenas.length === 0) ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          <p className="text-lg">No hay reseñas aún.</p>
          <p className="text-sm mt-2">Cuando los clientes envíen reseñas, aparecerán aquí para que las apruebes.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {resenas.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-800">{r.autor}</p>
                  <p className="text-xs text-gray-400">{r.tipo_piel} · {r.productos?.nombre}</p>
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < r.estrellas ? "text-[#D4AF37]" : "text-gray-200"}>★</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{r.texto}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${r.activa ? "bg-green-100 text-green-700" : "bg-amber-50 text-amber-600"}`}>
                  {r.activa ? "Publicada" : "Pendiente"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
