"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (err) {
      setError("Email o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#FFF9F9] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-display text-2xl font-bold text-[#8B1E2D]">
            Gilded<span className="text-[#D4AF37]">✦</span>Glow
          </span>
          <p className="text-[#4A4A4A]/60 mt-2 text-sm flex items-center justify-center gap-2">
            <Lock size={14} /> Panel de administración
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#D79A9A]/30 rounded-2xl p-8 shadow-sm"
        >
          <h1 className="font-display text-xl font-bold text-[#4A4A4A] mb-6 text-center">
            Iniciar sesión
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-[#D79A9A]/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8B1E2D] transition-colors"
                placeholder="admin@gildedglowskin.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-[#D79A9A]/40 rounded-xl px-4 py-2.5 text-sm pr-10 focus:outline-none focus:border-[#8B1E2D] transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A4A4A]/40 hover:text-[#4A4A4A]"
                  aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-[#8B1E2D] text-white font-semibold py-3 rounded-xl hover:bg-[#6e1724] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
