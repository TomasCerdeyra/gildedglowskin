"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Edit, Save, X } from "lucide-react";
import type { Categoria } from "@/lib/supabase/types";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function AdminCategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [newNombre, setNewNombre] = useState("");
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    supabase.from("categorias").select("*").order("orden").then(({ data }) => {
      setCategorias(data ?? []);
      setLoading(false);
    });
  }, []);

  async function handleAdd() {
    if (!newNombre.trim()) return;
    const { data } = await supabase
      .from("categorias")
      .insert({ nombre: newNombre.trim(), slug: slugify(newNombre) })
      .select()
      .single();
    if (data) setCategorias((prev) => [...prev, data]);
    setNewNombre("");
  }

  async function handleSaveEdit(id: string) {
    await supabase
      .from("categorias")
      .update({ nombre: editNombre, slug: slugify(editNombre) })
      .eq("id", id);
    setCategorias((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, nombre: editNombre, slug: slugify(editNombre) } : c
      )
    );
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta categoría?")) return;
    await supabase.from("categorias").delete().eq("id", id);
    setCategorias((prev) => prev.filter((c) => c.id !== id));
  }

  if (loading) return <div className="pt-14 lg:pt-0 text-gray-400">Cargando...</div>;

  return (
    <div className="pt-14 lg:pt-0">
      <h1 className="font-display text-2xl font-bold text-gray-800 mb-6">
        Categorías
      </h1>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-lg">
        {/* Add new */}
        <div className="flex gap-2 mb-6">
          <input
            value={newNombre}
            onChange={(e) => setNewNombre(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Nueva categoría..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E2D]"
          />
          <button
            onClick={handleAdd}
            className="flex items-center gap-1 bg-[#8B1E2D] text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-[#6e1724] transition-colors"
          >
            <Plus size={16} /> Agregar
          </button>
        </div>

        <div className="space-y-2">
          {categorias.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
            >
              {editingId === cat.id ? (
                <>
                  <input
                    value={editNombre}
                    onChange={(e) => setEditNombre(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-[#8B1E2D]"
                  />
                  <button onClick={() => handleSaveEdit(cat.id)} className="text-green-600 hover:text-green-700 p-1">
                    <Save size={16} />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600 p-1">
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{cat.nombre}</p>
                    <p className="text-xs text-gray-400 font-mono">{cat.slug}</p>
                  </div>
                  <button onClick={() => { setEditingId(cat.id); setEditNombre(cat.nombre); }}
                    className="text-gray-400 hover:text-[#8B1E2D] p-1"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(cat.id)}
                    className="text-gray-400 hover:text-red-600 p-1"><Trash2 size={16} /></button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
