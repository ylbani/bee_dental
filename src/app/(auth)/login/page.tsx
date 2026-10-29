"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("l.bueno@beedental.es");
  const [password, setPassword] = useState("••••••••");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-surface-container-lowest p-8 rounded-3xl border border-surface-container-high/80 shadow-xl space-y-6">
        <div className="text-center space-y-3 flex flex-col items-center">
          <Link href="/">
            <img src="/logo.png" alt="Bee Dental" className="h-14 w-auto object-contain mx-auto" />
          </Link>
          <p className="text-xs text-on-surface-variant">Acceso al Sistema Clínico &amp; Administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface">Correo Electrónico</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface">Contraseña</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-2"
          >
            <span>Iniciar Sesión en el Portal</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="pt-2 text-center border-t border-surface-container-high">
          <Link href="/" className="text-xs text-primary font-semibold hover:underline">
            ← Volver a la página web de Bee Dental
          </Link>
        </div>
      </div>
    </div>
  );
}

