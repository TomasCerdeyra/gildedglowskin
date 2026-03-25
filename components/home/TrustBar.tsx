import { Sparkles, Heart, MessageCircle, Star } from "lucide-react";

const items = [
  { icon: Sparkles, text: "Fórmulas con ingredientes activos" },
  { icon: Heart, text: "Apto todo tipo de piel" },
  { icon: MessageCircle, text: "Pedidos por WhatsApp" },
  { icon: Star, text: "Atención personalizada" },
];

export default function TrustBar() {
  return (
    <section className="bg-[#D79A9A]/15 border-y border-[#D79A9A]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-wrap justify-center md:justify-between gap-4">
          {items.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 text-sm font-medium text-[#4A4A4A]"
            >
              <span className="text-[#D4AF37]">✦</span>
              <Icon size={16} className="text-[#8B1E2D]" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
