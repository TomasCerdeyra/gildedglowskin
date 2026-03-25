"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save } from "lucide-react";

const CAMPOS = [
  {
    clave: "banner_envios_texto",
    label: "Texto del banner de envíos",
    tipo: "textarea",
    placeholder: "Realizamos envíos. Consultanos por WhatsApp...",
  },
  {
    clave: "whatsapp_number",
    label: "Número de WhatsApp",
    tipo: "input",
    placeholder: "5493329516376",
  },
  {
    clave: "hero_cta_texto",
    label: "Texto del CTA del hero",
    tipo: "input",
    placeholder: "Explorar Colección",
  },
];

export default function AdminConfiguracionPage() {
  const [valores, setValores] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    supabase.from("configuracion").select("*").then(({ data }) => {
      const map: Record<string, string> = {};
      data?.forEach(({ clave, valor }) => (map[clave] = valor));
      setValores(map);
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    const upserts = CAMPOS.map(({ clave }) => ({
      clave,
      valor: valores[clave] ?? "",
    }));
    await supabase.from("configuracion").upsert(upserts, { onConflict: "clave" });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return <div className="pt-14 lg:pt-0 text-gray-400">Cargando...</div>;

  return (
    <div className="pt-14 lg:pt-0">
      <h1 className="font-display text-2xl font-bold text-gray-800 mb-6">
        Configuración General
      </h1>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-lg space-y-5">
        {CAMPOS.map(({ clave, label, tipo, placeholder }) => (
          <div key={clave}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {label}
            </label>
            {tipo === "textarea" ? (
              <textarea
                value={valores[clave] ?? ""}
                onChange={(e) =>
                  setValores((v) => ({ ...v, [clave]: e.target.value }))
                }
                placeholder={placeholder}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E2D] resize-none"
              />
            ) : (
              <input
                value={valores[clave] ?? ""}
                onChange={(e) =>
                  setValores((v) => ({ ...v, [clave]: e.target.value }))
                }
                placeholder={placeholder}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E2D]"
              />
            )}
          </div>
        ))}

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#8B1E2D] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[#6e1724] transition-colors disabled:opacity-60"
        >
          <Save size={16} />
          {saved ? "¡Guardado!" : saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
