"use client";

import React, { useState } from "react";
import { BarChart3, Download, TrendingUp, Calendar, Users, DollarSign, Award, CheckCircle } from "lucide-react";

export default function ReportsPage() {
  const [period, setPeriod] = useState<"month" | "quarter" | "year">("month");
  const [exportNotice, setExportNotice] = useState(false);

  const metrics = {
    month: {
      attendanceRate: "94.2%",
      totalRevenue: "RD$ 642,800.00",
      newPatients: 48,
      treatmentsCompleted: 118,
      leadDoctorRevenue: "RD$ 417,000.00 (65%)",
    },
    quarter: {
      attendanceRate: "92.8%",
      totalRevenue: "RD$ 1,894,500.00",
      newPatients: 142,
      treatmentsCompleted: 356,
      leadDoctorRevenue: "RD$ 1,231,000.00 (65%)",
    },
    year: {
      attendanceRate: "93.5%",
      totalRevenue: "RD$ 7,420,000.00",
      newPatients: 580,
      treatmentsCompleted: 1420,
      leadDoctorRevenue: "RD$ 4,823,000.00 (65%)",
    },
  }[period];

  const handleExport = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3500);
  };

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

        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="flex items-center p-1 bg-surface-container-low rounded-xl border border-surface-container-high text-xs font-bold">
            <button
              onClick={() => setPeriod("month")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                period === "month" ? "bg-white text-primary shadow-xs" : "text-on-surface-variant"
              }`}
            >
              Este Mes
            </button>
            <button
              onClick={() => setPeriod("quarter")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                period === "quarter" ? "bg-white text-primary shadow-xs" : "text-on-surface-variant"
              }`}
            >
              Trimestre
            </button>
            <button
              onClick={() => setPeriod("year")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                period === "year" ? "bg-white text-primary shadow-xs" : "text-on-surface-variant"
              }`}
            >
              Año 2026
            </button>
          </div>

          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:bg-primary-container transition-all"
          >
            <Download size={16} />
            <span>Exportar CSV / PDF</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900 text-xs sm:text-sm font-semibold animate-in fade-in">
          <CheckCircle size={18} className="text-emerald-600" />
          <span>Reporte consolidado generado con éxito. La descarga ha comenzado en formato PDF y CSV.</span>
        </div>
      )}

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high/80 shadow-sm space-y-2">
          <span className="text-xs font-bold text-primary uppercase">Efectividad de Citas</span>
          <h3 className="font-display text-3xl font-bold text-on-surface">{metrics.attendanceRate}</h3>
          <p className="text-xs text-on-surface-variant">Tasa de asistencia confirmada a consulta.</p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high/80 shadow-sm space-y-2">
          <span className="text-xs font-bold text-emerald-700 uppercase">Producción Total</span>
          <h3 className="font-display text-2xl font-bold text-on-surface">{metrics.totalRevenue}</h3>
          <p className="text-xs text-on-surface-variant">Facturación bruta en Pesos Dominicanos.</p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high/80 shadow-sm space-y-2">
          <span className="text-xs font-bold text-secondary uppercase">Nuevos Pacientes</span>
          <h3 className="font-display text-3xl font-bold text-on-surface">{metrics.newPatients}</h3>
          <p className="text-xs text-on-surface-variant">Captación por web y canal WhatsApp.</p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high/80 shadow-sm space-y-2">
          <span className="text-xs font-bold text-amber-700 uppercase">Tratamientos</span>
          <h3 className="font-display text-3xl font-bold text-on-surface">{metrics.treatmentsCompleted}</h3>
          <p className="text-xs text-on-surface-variant">Procedimientos clínicos completados.</p>
        </div>
      </div>

      {/* Production by Specialist Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high/80 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-base text-on-surface flex items-center gap-2">
            <Award size={18} className="text-primary" />
            <span>Producción por Especialista</span>
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-on-surface mb-1">
                <span>Dra. Leticia Bueno (Directora Médica &amp; Cirugía)</span>
                <span className="text-primary font-mono">{metrics.leadDoctorRevenue}</span>
              </div>
              <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "65%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-on-surface mb-1">
                <span>Dra. Elena Ruiz (Ortodoncia Invisible)</span>
                <span className="text-on-surface-variant font-mono">22%</span>
              </div>
              <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "22%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-on-surface mb-1">
                <span>Dr. Carlos Morales (Estética Dental &amp; DSD)</span>
                <span className="text-on-surface-variant font-mono">13%</span>
              </div>
              <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "13%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Most Demanded Services */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high/80 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-base text-on-surface">
            Servicios con Mayor Demanda
          </h3>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-on-surface">Ortodoncia Invisible (Alineadores)</p>
                <p className="text-[11px] text-on-surface-variant">38 citas atendidas</p>
              </div>
              <span className="font-mono font-bold text-primary">RD$ 247,000</span>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-on-surface">Implantología Guiada en 24h</p>
                <p className="text-[11px] text-on-surface-variant">12 cirugías completadas</p>
              </div>
              <span className="font-mono font-bold text-primary">RD$ 225,000</span>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-on-surface">Diseño Digital de Sonrisa (DSD) &amp; Carillas</p>
                <p className="text-[11px] text-on-surface-variant">9 rehabilitaciones</p>
              </div>
              <span className="font-mono font-bold text-primary">RD$ 135,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
