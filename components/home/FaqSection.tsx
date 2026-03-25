"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import type { Faq } from "@/lib/supabase/types";

const defaultFaqs: Faq[] = [
  {
    id: "1",
    pregunta: "¿Los productos son aptos para piel sensible?",
    respuesta:
      "Sí, nuestras fórmulas están pensadas para todo tipo de piel, incluyendo piel sensible. Siempre recomendamos hacer un test en una pequeña área antes de aplicar el producto completo.",
    orden: 1,
    activa: true,
  },
  {
    id: "2",
    pregunta: "¿Cómo hago un pedido?",
    respuesta:
      "Los pedidos se realizan directamente por WhatsApp al +54 3329 516376. Podés hacer click en cualquier botón 'Pedir por WhatsApp' de nuestra tienda y te vamos a atender personalmente.",
    orden: 2,
    activa: true,
  },
  {
    id: "3",
    pregunta: "¿Hacen envíos? ¿Cuál es el costo?",
    respuesta:
      "Sí, realizamos envíos. Para conocer los costos y disponibilidad según tu zona, consultanos por WhatsApp y te informamos al instante.",
    orden: 3,
    activa: true,
  },
  {
    id: "4",
    pregunta: "¿Cuánto tarda en llegar mi pedido?",
    respuesta:
      "Los tiempos de entrega varían según tu ubicación. En general los envíos locales se realizan en 24-48hs. Consultanos para información específica de tu zona.",
    orden: 4,
    activa: true,
  },
  {
    id: "5",
    pregunta: "¿Tienen política de devoluciones?",
    respuesta:
      "Si tenés algún problema con tu pedido, contactanos por WhatsApp y lo resolvemos juntas. Tu satisfacción es nuestra prioridad.",
    orden: 5,
    activa: true,
  },
];

interface FaqSectionProps {
  faqs?: Faq[];
}

export default function FaqSection({ faqs }: FaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const items = faqs && faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <section id="faq" className="py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#8B1E2D] mb-3">
            Preguntas Frecuentes
          </h2>
          <p className="text-[#4A4A4A]/70">
            Todo lo que necesitás saber antes de tu primera compra.
          </p>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {items.map((faq) => (
            <div
              key={faq.id}
              className="border border-[#D79A9A]/30 rounded-xl overflow-hidden bg-white"
            >
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left"
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                aria-expanded={openId === faq.id}
              >
                <span className="font-medium text-[#4A4A4A] pr-4">
                  {faq.pregunta}
                </span>
                {openId === faq.id ? (
                  <Minus size={18} className="text-[#8B1E2D] shrink-0" />
                ) : (
                  <Plus size={18} className="text-[#8B1E2D] shrink-0" />
                )}
              </button>
              <AnimatePresence initial={false}>
                {openId === faq.id && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-sm text-[#4A4A4A]/80 leading-relaxed border-t border-[#D79A9A]/20 pt-3">
                      {faq.respuesta}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
