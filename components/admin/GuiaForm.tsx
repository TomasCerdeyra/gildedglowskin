"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import type { Producto, Guia } from "@/lib/supabase/types";
import { Plus, Trash2, Upload } from "lucide-react";

const schema = z.object({
  titulo: z.string().min(1, "El título es requerido"),
  slug: z.string().min(1, "El slug es requerido").regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones. No introuzcas URLs aquí."),
  subtitulo: z.string().optional(),
  producto_id: z.string().optional().nullable(),
  para_quien_es: z.string().optional(),
  beneficios: z.string().optional(),
  tips: z.string().optional(),
  contenido_rico: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

interface Props {
  guia?: Guia;
  productos: Producto[];
}

type Ingrediente = { nombre: string; descripcion: string; beneficio: string };
type Paso = { numero: number; titulo: string; descripcion: string };

export default function GuiaForm({ guia, productos }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imagenBanner, setImagenBanner] = useState(guia?.imagen_banner ?? "");
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>(
    (guia?.ingredientes as Ingrediente[]) ?? []
  );
  const [pasos, setPasos] = useState<Paso[]>(
    (guia?.pasos_uso as Paso[]) ?? []
  );

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      titulo: guia?.titulo ?? "",
      slug: guia?.slug ?? "",
      subtitulo: guia?.subtitulo ?? "",
      producto_id: guia?.producto_id ?? null,
      para_quien_es: guia?.para_quien_es ?? "",
      beneficios: guia?.beneficios?.join("\n") ?? "",
      tips: guia?.tips ?? "",
      contenido_rico: guia?.contenido_rico ?? "",
    },
  });

  function handleTituloChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue("titulo", e.target.value);
    if (!guia) setValue("slug", slugify(e.target.value));
  }

  // Eliminado la función de subida de banner con API, ahora es texto directo

  function addIngrediente() {
    setIngredientes((prev) => [...prev, { nombre: "", descripcion: "", beneficio: "" }]);
  }

  function updateIngrediente(i: number, field: keyof Ingrediente, value: string) {
    setIngredientes((prev) => prev.map((ing, idx) => idx === i ? { ...ing, [field]: value } : ing));
  }

  function removeIngrediente(i: number) {
    setIngredientes((prev) => prev.filter((_, idx) => idx !== i));
  }

  function addPaso() {
    setPasos((prev) => [...prev, { numero: prev.length + 1, titulo: "", descripcion: "" }]);
  }

  function updatePaso(i: number, field: keyof Paso, value: string | number) {
    setPasos((prev) => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p));
  }

  function removePaso(i: number) {
    setPasos((prev) => prev.filter((_, idx) => idx !== i).map((p, idx) => ({ ...p, numero: idx + 1 })));
  }

  async function onSubmit(values: FormValues) {
    setSaving(true);
    setError("");
    const supabase = createClient();

    const payload = {
      ...values,
      imagen_banner: imagenBanner || null,
      ingredientes,
      pasos_uso: pasos,
      beneficios: values.beneficios?.split("\n").map(b => b.trim()).filter(Boolean) ?? [],
      producto_id: values.producto_id || null,
      updated_at: new Date().toISOString(),
    };

    let err;
    if (guia) {
      ({ error: err } = await supabase.from("guias").update(payload).eq("id", guia.id));
    } else {
      ({ error: err } = await supabase.from("guias").insert(payload));
    }

    if (err) {
      setError(err.message);
      setSaving(false);
      return;
    }

    router.push("/admin/guias");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Básico */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-700 mb-4">Información básica</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input {...register("titulo")} onChange={handleTituloChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E2D]" />
            {errors.titulo && <p className="text-red-500 text-xs mt-1">{errors.titulo.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input {...register("slug")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E2D] font-mono" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Producto asociado</label>
            <select {...register("producto_id")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E2D]">
              <option value="">Ninguno</option>
              {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
            <input {...register("subtitulo")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E2D]" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Para quién es</label>
            <textarea {...register("para_quien_es")} rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E2D] resize-none" />
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-700 mb-4">Imagen banner</h2>
        {imagenBanner && (
          <div className="relative w-full h-32 rounded-xl overflow-hidden mb-3">
            <img src={imagenBanner} alt="Banner" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <input 
            type="url" 
            placeholder="https://res.cloudinary.com/.../banner.jpg"
            value={imagenBanner}
            onChange={(e) => setImagenBanner(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E2D]"
          />
          <p className="text-xs text-gray-500">Pegá la URL del banner aquí.</p>
        </div>
      </div>

      {/* Ingredientes */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-700">Ingredientes clave</h2>
          <button type="button" onClick={addIngrediente}
            className="flex items-center gap-1 text-sm text-[#8B1E2D] font-medium hover:underline">
            <Plus size={14} /> Agregar
          </button>
        </div>
        <div className="space-y-3">
          {ingredientes.map((ing, i) => (
            <div key={i} className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-xl">
              <input value={ing.nombre} onChange={e => updateIngrediente(i, "nombre", e.target.value)}
                placeholder="Nombre" className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#8B1E2D]" />
              <input value={ing.descripcion} onChange={e => updateIngrediente(i, "descripcion", e.target.value)}
                placeholder="Descripción" className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#8B1E2D]" />
              <div className="flex gap-2">
                <input value={ing.beneficio} onChange={e => updateIngrediente(i, "beneficio", e.target.value)}
                  placeholder="Beneficio" className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#8B1E2D]" />
                <button type="button" onClick={() => removeIngrediente(i)}
                  className="text-red-400 hover:text-red-600 p-1"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pasos */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-700">Pasos de uso</h2>
          <button type="button" onClick={addPaso}
            className="flex items-center gap-1 text-sm text-[#8B1E2D] font-medium hover:underline">
            <Plus size={14} /> Agregar paso
          </button>
        </div>
        <div className="space-y-3">
          {pasos.map((paso, i) => (
            <div key={i} className="flex gap-3 items-start p-3 bg-gray-50 rounded-xl">
              <span className="w-7 h-7 shrink-0 rounded-full bg-[#8B1E2D] text-white flex items-center justify-center text-xs font-bold mt-0.5">
                {i + 1}
              </span>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input value={paso.titulo} onChange={e => updatePaso(i, "titulo", e.target.value)}
                  placeholder="Título del paso" className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#8B1E2D]" />
                <input value={paso.descripcion} onChange={e => updatePaso(i, "descripcion", e.target.value)}
                  placeholder="Descripción" className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#8B1E2D]" />
              </div>
              <button type="button" onClick={() => removePaso(i)}
                className="text-red-400 hover:text-red-600 p-1 mt-0.5"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Beneficios y Tips */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-700 mb-4">Beneficios y Tips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Beneficios (uno por línea)
            </label>
            <textarea {...register("beneficios")} rows={4}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E2D] resize-y"
              placeholder="Hidratación profunda&#10;Reduce poros&#10;Piel más luminosa" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tips extra</label>
            <textarea {...register("tips")} rows={4}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E2D] resize-y"
              placeholder="Consejos adicionales de uso..." />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button type="submit" disabled={saving}
          className="bg-[#8B1E2D] text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-[#6e1724] transition-colors disabled:opacity-60">
          {saving ? "Guardando..." : guia ? "Guardar cambios" : "Crear guía"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="border border-gray-200 text-gray-600 font-medium px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  );
}
