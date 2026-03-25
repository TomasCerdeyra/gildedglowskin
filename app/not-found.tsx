import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFF9F9] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-[#D79A9A] text-8xl font-display font-bold mb-4">404</div>
        <span className="text-[#D4AF37] text-sm font-medium">✦</span>
        <h1 className="font-display text-3xl font-bold text-[#8B1E2D] mt-2 mb-4">
          Página no encontrada
        </h1>
        <p className="text-[#4A4A4A]/70 mb-8">
          La página que buscás no existe o fue movida. Podés explorar nuestra
          colección de productos.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#8B1E2D] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#6e1724] transition-colors"
        >
          <ArrowLeft size={18} />
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
