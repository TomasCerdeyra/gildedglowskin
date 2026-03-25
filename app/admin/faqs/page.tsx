"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Edit, Save, X, Eye, EyeOff } from "lucide-react";
import type { Faq } from "@/lib/supabase/types";

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ pregunta: "", respuesta: "" });
  const [newData, setNewData] = useState({ pregunta: "", respuesta: "" });
  const [showNew, setShowNew] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    supabase.from("faqs").select("*").order("orden").then(({ data }) => {
      setFaqs(data ?? []);
      setLoading(false);
    });
  }, []);

  async function handleAdd() {
    if (!newData.pregunta.trim()) return;
    const orden = faqs.length + 1;
    const { data } = await supabase
      .from("faqs")
      .insert({ ...newData, orden, activa: true })
      .select()
      .single();
    if (data) setFaqs((prev) => [...prev, data]);
    setNewData({ pregunta: "", respuesta: "" });
    setShowNew(false);
  }

  async function handleSave(id: string) {
    await supabase.from("faqs").update(editData).eq("id", id);
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...editData } : f)));
    setEditingId(null);
  }

  async function toggleActiva(id: string, current: boolean) {
    await supabase.from("faqs").update({ activa: !current }).eq("id", id);
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, activa: !current } : f)));
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta FAQ?")) return;
    await supabase.from("faqs").delete().eq("id", id);
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  }

  if (loading) return <div className="pt-14 lg:pt-0 text-gray-400">Cargando...</div>;

  return (
    <div className="pt-14 lg:pt-0">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-800">FAQs</h1>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 bg-[#8B1E2D] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#6e1724] transition-colors"
        >
          <Plus size={16} /> Nueva FAQ
        </button>
      </div>

      {showNew && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 max-w-2xl">
          <h3 className="font-semibold text-gray-700 mb-3">Nueva pregunta</h3>
          <div className="space-y-3">
            <input
              value={newData.pregunta}
              onChange={(e) => setNewData((d) => ({ ...d, pregunta: e.target.value }))}
              placeholder="Pregunta..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E2D]"
            />
            <textarea
              value={newData.respuesta}
              onChange={(e) => setNewData((d) => ({ ...d, respuesta: e.target.value }))}
              placeholder="Respuesta..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E2D] resize-none"
            />
            <div className="flex gap-2">
              <button onClick={handleAdd}
                className="bg-[#8B1E2D] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#6e1724] transition-colors">
                Guardar
              </button>
              <button onClick={() => setShowNew(false)}
                className="border border-gray-200 text-gray-600 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3 max-w-2xl">
        {faqs.map((faq) => (
          <div key={faq.id} className="bg-white rounded-xl border border-gray-100 p-4">
            {editingId === faq.id ? (
              <div className="space-y-2">
                <input
                  value={editData.pregunta}
                  onChange={(e) => setEditData((d) => ({ ...d, pregunta: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E2D]"
                />
                <textarea
                  value={editData.respuesta}
                  onChange={(e) => setEditData((d) => ({ ...d, respuesta: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E2D] resize-none"
                />
                <div className="flex gap-2">
                  <button onClick={() => handleSave(faq.id)} className="text-green-600 hover:text-green-700 flex items-center gap-1 text-sm">
                    <Save size={14} /> Guardar
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm">
                    <X size={14} /> Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${faq.activa ? "text-gray-800" : "text-gray-400"}`}>
                      {faq.pregunta}
                    </p>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{faq.respuesta}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => toggleActiva(faq.id, faq.activa)} className="p-1.5 text-gray-400 hover:text-green-600" aria-label={faq.activa ? "Desactivar" : "Activar"}>
                      {faq.activa ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                    <button onClick={() => { setEditingId(faq.id); setEditData({ pregunta: faq.pregunta, respuesta: faq.respuesta }); }}
                      className="p-1.5 text-gray-400 hover:text-[#8B1E2D]"><Edit size={15} /></button>
                    <button onClick={() => handleDelete(faq.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 size={15} /></button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
