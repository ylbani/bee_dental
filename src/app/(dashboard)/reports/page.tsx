"use client";

import React from "react";
import { BarChart3, Download, TrendingUp, Calendar, Users, DollarSign } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">
            Reportes Clínicos y Financieros
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Métricas de producción, ocupación de agenda, cobros y tratamientos realizados
          </p>
        </div>

        <button
          onClick={() => alert("Generando reporte completo en PDF y CSV...")}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:bg-primary-container transition-all"
        >
          <Download size={16} />
          <span>Exportar Reporte (CSV / PDF)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high/80 shadow-sm space-y-3">
          <span className="text-xs font-bold text-primary uppercase">Efectividad de Agenda</span>
          <h3 className="font-display text-3xl font-bold text-on-surface">92.4%</h3>
          <p className="text-xs text-on-surface-variant">Tasa de asistencia confirmada en el último mes.</p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high/80 shadow-sm space-y-3">
          <span className="text-xs font-bold text-emerald-700 uppercase">Producción Total</span>
          <h3 className="font-display text-3xl font-bold text-on-surface">RD$ 642,800</h3>
          <p className="text-xs text-on-surface-variant">Ingresos facturados durante el mes en curso.</p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high/80 shadow-sm space-y-3">
          <span className="text-xs font-bold text-secondary uppercase">Nuevos Pacientes</span>
          <h3 className="font-display text-3xl font-bold text-on-surface">48</h3>
          <p className="text-xs text-on-surface-variant">Pacientes captados por la web y WhatsApp.</p>
        </div>
      </div>
    </div>
  );
}

