"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Categoria, Guia, Producto } from "@/lib/supabase/types";
import { X, Upload } from "lucide-react";

const schema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  slug: z.string().min(1, "El slug es requerido").regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones. No introduzcas URLs aquí."),
  descripcion_corta: z
    .string()
    .min(1, "La descripción corta es requerida")
    .max(120, "Máximo 120 caracteres"),
  descripcion_larga: z.string().optional(),
  precio: z.coerce.number().positive("El precio debe ser mayor a 0"),
  precio_tachado: z.coerce.number().optional().nullable(),
  categoria_id: z.string().optional().nullable(),
  stock: z.coerce.number().int().min(0),
  activo: z.boolean(),
  destacado: z.boolean(),
  orden: z.coerce.number().int().min(0),
  guia_id: z.string().optional().nullable(),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  producto?: Producto;
  categorias: Categoria[];
  guias: Guia[];
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function ProductoForm({ producto, categorias, guias }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imagenPrincipal, setImagenPrincipal] = useState(
    producto?.imagen_principal ?? ""
  );
  const [imagenesExtra, setImagenesExtra] = useState<string[]>(
    producto?.imagenes_extra ?? []
  );
  const [nuevaExtraUrl, setNuevaExtraUrl] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      nombre: producto?.nombre ?? "",
      slug: producto?.slug ?? "",
      descripcion_corta: producto?.descripcion_corta ?? "",
      descripcion_larga: producto?.descripcion_larga ?? "",
      precio: producto?.precio ?? 0,
      precio_tachado: producto?.precio_tachado ?? null,
      categoria_id: producto?.categoria_id ?? null,
      stock: producto?.stock ?? 0,
      activo: producto?.activo ?? true,
      destacado: producto?.destacado ?? false,
      orden: producto?.orden ?? 0,
      guia_id: producto?.guia_id ?? null,
      tags: producto?.tags?.join(", ") ?? "",
    },
  });

  const descCorta = watch("descripcion_corta");

  function handleNombreChange(e: React.ChangeEvent<HTMLInputElement>) {
    const nombre = e.target.value;
    setValue("nombre", nombre);
    if (!producto) {
      setValue("slug", slugify(nombre));
    }
  }

  function handleAddExtraImage() {
    if (!nuevaExtraUrl.trim()) return;
    setImagenesExtra((prev) => [...prev, nuevaExtraUrl.trim()]);
    setNuevaExtraUrl("");
  }

  async function onSubmit(values: FormValues) {
    setSaving(true);
    setError("");
    const supabase = createClient();

    const payload = {
      ...values,
      imagen_principal: imagenPrincipal,
      imagenes_extra: imagenesExtra,
      precio_tachado: values.precio_tachado || null,
      categoria_id: values.categoria_id || null,
      guia_id: values.guia_id || null,
      tags: values.tags
        ? values.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      updated_at: new Date().toISOString(),
    };

    let err;
    if (producto) {
      ({ error: err } = await supabase
        .from("productos")
        .update(payload)
        .eq("id", producto.id));
    } else {
      ({ error: err } = await supabase.from("productos").insert(payload));
    }

    if (err) {
      setError(err.message);
      setSaving(false);
      return;
    }

    router.push("/admin/productos");
    router.refresh();
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <form onSubmit={handleSubmit(onSubmit as any)} className="max-w-3xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-700 mb-4">Información básica</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              {...register("nombre")}
              onChange={handleNombreChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E2D]"
            />
            {errors.nombre && (
              <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug (URL)
            </label>
            <input
              {...register("slug")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E2D] font-mono"
            />
            {errors.slug && (
              <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              {...register("categoria_id")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E2D]"
            >
              <option value="">Sin categoría</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción corta{" "}
              <span className="text-gray-400">
                ({descCorta?.length ?? 0}/120)
              </span>
            </label>
            <textarea
              {...register("descripcion_corta")}
              rows={2}
              maxLength={120}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E2D] resize-none"
            />
            {errors.descripcion_corta && (
              <p className="text-red-500 text-xs mt-1">
                {errors.descripcion_corta.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción larga
            </label>
            <textarea
              {...register("descripcion_larga")}
              rows={5}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E2D] resize-y"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-700 mb-4">Precio y stock</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio ($)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("precio")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E2D]"
            />
            {errors.precio && (
              <p className="text-red-500 text-xs mt-1">{errors.precio.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio tachado ($)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("precio_tachado")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E2D]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock
            </label>
            <input
              type="number"
              {...register("stock")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E2D]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Orden
            </label>
            <input
              type="number"
              {...register("orden")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E2D]"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-700 mb-4">Imágenes</h2>

        {/* Imagen principal */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen principal
          </label>
          <div className="flex items-start gap-4">
            {imagenPrincipal && (
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                <Image
                  src={imagenPrincipal}
                  alt="Preview"
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            )}
          <div className="flex-1">
            <input
              type="url"
              placeholder="https://res.cloudinary.com/.../image.jpg"
              value={imagenPrincipal}
              onChange={(e) => setImagenPrincipal(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E2D]"
            />
            <p className="text-xs text-gray-500 mt-1">Pegá la URL de la imagen principal desde Cloudinary u otro servicio.</p>
          </div>
        </div>
      </div>

      {/* Imágenes extra */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imágenes adicionales
          </label>
          <div className="flex flex-wrap gap-3 mb-3">
            {imagenesExtra.map((url, i) => (
              <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200">
                <Image src={url} alt={`Extra ${i}`} fill className="object-cover" sizes="64px" />
                <button
                  type="button"
                  onClick={() => setImagenesExtra((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70"
                  aria-label="Eliminar imagen"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 mb-3">
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://res.cloudinary.com/.../extra.jpg"
                value={nuevaExtraUrl}
                onChange={(e) => setNuevaExtraUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddExtraImage())}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E2D]"
              />
              <button
                type="button"
                onClick={handleAddExtraImage}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 rounded-lg text-sm font-medium transition-colors"
                disabled={!nuevaExtraUrl.trim()}
              >
                Agregar
              </button>
            </div>
            <p className="text-xs text-gray-500">Añadí más URLs de imágenes si querés formato carrusel.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-700 mb-4">Extras</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (separados por coma)
            </label>
            <input
              {...register("tags")}
              placeholder="piel seca, anti-edad, hidratante"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E2D]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Guía asociada
            </label>
            <select
              {...register("guia_id")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E2D]"
            >
              <option value="">Sin guía</option>
              {guias.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.titulo}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="activo"
              {...register("activo")}
              className="w-4 h-4 accent-[#8B1E2D]"
            />
            <label htmlFor="activo" className="text-sm font-medium text-gray-700">
              Activo (visible en la tienda)
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="destacado"
              {...register("destacado")}
              className="w-4 h-4 accent-[#8B1E2D]"
            />
            <label htmlFor="destacado" className="text-sm font-medium text-gray-700">
              Destacado
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#8B1E2D] text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-[#6e1724] transition-colors disabled:opacity-60"
        >
          {saving ? "Guardando..." : producto ? "Guardar cambios" : "Crear producto"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-gray-200 text-gray-600 font-medium px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
