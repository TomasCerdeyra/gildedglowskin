"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const whatsappLink = `https://wa.me/5493329516376?text=${encodeURIComponent("Hola! Quisiera más información.")}`;

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/auth")) {
    return null;
  }

  return (
    <footer className="bg-[#4A4A4A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Col 1: Logo + tagline */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="font-display text-xl font-bold">
              Gilded<span className="text-[#D4AF37]">✦</span>Glow Skin
            </Link>
            <p className="text-sm text-white/70 max-w-xs">
              Rituales de skincare de autor. Ingredientes activos, fórmulas
              pensadas para tu piel.
            </p>
            <a
              href="https://instagram.com/gildedglowskin"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white/70 hover:text-[#D4AF37] transition-colors w-fit"
              aria-label="Instagram de Gilded Glow Skin"
            >
              <InstagramIcon size={18} />
              @gildedglowskin
            </a>
          </div>

          {/* Col 2: Links rápidos */}
          <div>
            <h3 className="font-display text-sm font-semibold text-[#D4AF37] uppercase tracking-widest mb-4">
              Navegación
            </h3>
            <nav className="flex flex-col gap-3">
              {[
                { label: "Inicio", href: "/" },
                { label: "Productos", href: "/#catalogo" },
                { label: "Guía Glow", href: "/guia" },
                { label: "FAQ", href: "/#faq" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3: Contacto */}
          <div>
            <h3 className="font-display text-sm font-semibold text-[#D4AF37] uppercase tracking-widest mb-4">
              Contacto
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
              >
                <MessageCircle size={18} />
                +54 3329 516376
              </a>
              <a
                href="https://instagram.com/gildedglowskin"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
              >
                <InstagramIcon size={18} />
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Gilded Glow Skin. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
