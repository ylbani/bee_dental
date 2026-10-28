"use client";

import React, { useState } from "react";
import { FileText, Search, Plus, Calendar, User, Eye, Lock } from "lucide-react";

export default function RecordsPage() {
  const [search, setSearch] = useState("");

  const records = [
    {
      id: "rec-1",
      patient: "Laura Martínez Gómez",
      recordNumber: "EXP-0142",
      doctor: "Dra. Elena Ruiz",
      date: "27 Octubre 2026",
      reason: "Revisión mensual de alineadores y escaneo 3D",
      status: "CERRADA",
    },
    {
      id: "rec-2",
      patient: "Carlos Henríquez Peña",
      recordNumber: "EXP-0211",
      doctor: "Dr. Michael Chen",
      date: "27 Octubre 2026",
      reason: "Colocación de implante unitario titanio pieza 36",
      status: "EN PROCESO",
    },
    {
      id: "rec-3",
      patient: "Lucía Gómez Rosario",
      recordNumber: "EXP-0089",
      doctor: "Dr. Carlos Morales",
      date: "25 Octubre 2026",
      reason: "Toma de impresión óptica DSD para carillas cerámicas",
      status: "CERRADA",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">
            Expedientes Clínicos Longitudinales
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Historial médico, consultas odontológicas fechadas y adendas inmutables
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-high/80 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Buscar por paciente o expediente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-transparent focus:border-primary focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-3">
        {records.map((r) => (
          <div
            key={r.id}
            className="p-5 bg-surface-container-lowest rounded-2xl border border-surface-container-high/80 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                <FileText size={20} />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-base text-on-surface">{r.patient}</span>
                  <span className="text-xs font-mono font-bold text-primary bg-primary-fixed/30 px-2 py-0.5 rounded">
                    {r.recordNumber}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant">{r.reason}</p>
                <div className="flex items-center gap-3 text-xs text-on-surface-variant/70 mt-1">
                  <span>Atendido por: {r.doctor}</span>
                  <span>•</span>
                  <span>{r.date}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  r.status === "CERRADA"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {r.status}
              </span>
              <button className="px-3 py-1.5 rounded-xl bg-surface-container text-primary font-bold text-xs hover:bg-surface-container-high transition-colors">
                Ver Notas
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

