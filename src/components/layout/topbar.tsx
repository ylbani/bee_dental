"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell, Plus, Calendar, UserPlus, ExternalLink } from "lucide-react";

export function Topbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/patients`);
    }
  };

  return (
    <header className="h-16 border-b border-surface-container-high bg-surface-container-lowest flex items-center justify-between px-6 z-20">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 w-full max-w-md">
        <div className="relative w-full">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
          />
          <input
            type="text"
            placeholder="Buscar por paciente, cédula, expediente o teléfono..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-surface-container-low rounded-xl text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/60 border border-transparent focus:border-primary focus:bg-surface-container-lowest focus:outline-none transition-all"
          />
        </div>
      </form>

      {/* Right Actions & Status */}
      <div className="flex items-center gap-4">
        {/* Clinic Location Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container text-xs font-semibold text-primary">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>Sede Plaza Balón, Santo Domingo</span>
        </div>

        {/* Quick Actions Dropdown / Buttons */}
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/appointments/new"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-sm hover:bg-primary-container transition-all"
          >
            <Calendar size={15} />
            <span className="hidden sm:inline">Nueva Cita</span>
          </Link>

          <Link
            href="/dashboard/patients/new"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-surface-container text-primary text-xs font-bold rounded-xl hover:bg-surface-container-high transition-all"
          >
            <UserPlus size={15} />
            <span className="hidden sm:inline">Nuevo Paciente</span>
          </Link>
        </div>

        {/* Notifications */}
        <button
          className="relative w-9 h-9 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
          title="Notificaciones"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error" />
        </button>

        {/* View Public Website */}
        <Link
          href="/"
          target="_blank"
          className="hidden md:inline-flex items-center gap-1 text-xs font-medium text-on-surface-variant hover:text-primary transition-colors pl-2 border-l border-surface-container-high"
          title="Abrir página web pública de Bee Dental"
        >
          <span>Ver Web</span>
          <ExternalLink size={13} />
        </Link>
      </div>
    </header>
  );
}

