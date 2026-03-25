"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  const [guiaHover, setGuiaHover] = useState(false);
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FFF9F9]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D79A9A]/20 via-[#FFF9F9] to-[#FFF9F9]" />

      {/* Decorative golden shape */}
      <div className="absolute top-24 right-8 md:right-24 w-32 h-32 md:w-48 md:h-48 rounded-full border border-[#D4AF37]/30 opacity-60" />
      <div className="absolute top-32 right-16 md:right-32 w-16 h-16 md:w-24 md:h-24 rounded-full border border-[#D4AF37]/50 opacity-40" />
      <div className="absolute bottom-24 left-4 md:left-16 w-4 h-4 rounded-full bg-[#D4AF37] opacity-60" />
      <div className="absolute bottom-40 left-12 md:left-28 w-2 h-2 rounded-full bg-[#D79A9A] opacity-80" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-2xl">
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 text-[#D79A9A] text-sm font-medium mb-6"
          >
            <span className="text-[#D4AF37]">✦</span>
            Skincare de autor
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#8B1E2D] leading-tight mb-6"
          >
            Tu piel merece el ritual que siempre soñó.
          </motion.h1>

          {/* Bajada */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-[#4A4A4A] mb-8 max-w-lg"
          >
            Fórmulas con ingredientes activos pensadas para transformar tu
            rutina. Apto todo tipo de piel.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#catalogo"
              className="inline-flex items-center justify-center gap-2 bg-[#8B1E2D] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#6e1724] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-base"
            >
              Explorar Colección
            </a>
            <Link
              href="/guia"
              onMouseEnter={() => setGuiaHover(true)}
              onMouseLeave={() => setGuiaHover(false)}
              style={{
                border: "2px solid #8B1E2D",
                backgroundColor: guiaHover ? "#8B1E2D" : "transparent",
                color: guiaHover ? "#ffffff" : "#8B1E2D",
              }}
              className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-full transition-colors text-base"
            >
              Ver Guía Glow
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D79A9A]/40 to-transparent" />
    </section>
  );
}
