import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Package, BookOpen, AlertTriangle, TrendingDown } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: totalProductos },
    { count: totalGuias },
    { data: sinGuia },
    { data: stockBajo },
  ] = await Promise.all([
    supabase
      .from("productos")
      .select("id", { count: "exact", head: true })
      .eq("activo", true),
    supabase.from("guias").select("id", { count: "exact", head: true }),
    supabase
      .from("productos")
      .select("id, nombre")
      .eq("activo", true)
      .is("guia_id", null),
    supabase
      .from("productos")
      .select("id, nombre, stock")
      .eq("activo", true)
      .lte("stock", 5)
      .gt("stock", 0),
  ]);

  const stats = [
    {
      label: "Productos activos",
      value: totalProductos ?? 0,
      icon: Package,
      href: "/admin/productos",
      color: "bg-[#8B1E2D]",
    },
    {
      label: "Guías publicadas",
      value: totalGuias ?? 0,
      icon: BookOpen,
      href: "/admin/guias",
      color: "bg-[#D79A9A]",
    },
    {
      label: "Sin guía asociada",
      value: sinGuia?.length ?? 0,
      icon: AlertTriangle,
      href: "/admin/productos",
      color: "bg-amber-500",
    },
    {
      label: "Stock bajo (≤ 5)",
      value: stockBajo?.length ?? 0,
      icon: TrendingDown,
      href: "/admin/productos",
      color: "bg-red-500",
    },
  ];

  return (
    <div className="pt-14 lg:pt-0">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Bienvenida al panel de Gilded Glow Skin.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}
            >
              <Icon size={20} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-700 mb-4">Acciones rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/productos/nuevo"
            className="bg-[#8B1E2D] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#6e1724] transition-colors"
          >
            + Nuevo producto
          </Link>
          <Link
            href="/admin/guias/nueva"
            className="bg-[#D79A9A] text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            + Nueva guía
          </Link>
          <Link
            href="/"
            target="_blank"
            className="border border-gray-200 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Ver tienda →
          </Link>
        </div>
      </div>

      {/* Stock bajo warning */}
      {stockBajo && stockBajo.length > 0 && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-5">
          <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
            <TrendingDown size={18} /> Productos con stock bajo
          </h3>
          <ul className="space-y-2">
            {stockBajo.map((p) => (
              <li key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-red-700">{p.nombre}</span>
                <span className="font-semibold text-red-900">
                  {p.stock} unidades
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
