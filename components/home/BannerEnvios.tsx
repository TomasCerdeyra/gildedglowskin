import { Truck } from "lucide-react";

interface BannerEnviosProps {
  texto?: string;
}

export default function BannerEnvios({ texto }: BannerEnviosProps) {
  const defaultText =
    "Realizamos envíos. Consultanos por WhatsApp para más información sobre costos y plazos.";

  return (
    <section className="border-y border-[#D79A9A]/40 bg-[#FFF9F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center gap-3 text-center">
          <Truck size={22} className="text-[#8B1E2D] shrink-0" />
          <p className="text-[#4A4A4A] font-medium">{texto || defaultText}</p>
        </div>
      </div>
    </section>
  );
}
