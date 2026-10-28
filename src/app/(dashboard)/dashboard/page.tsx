"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Users,
  Clock,
  AlertCircle,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Smile,
  Activity,
  Plus,
} from "lucide-react";

export default function DashboardPage() {
  const [period, setPeriod] = useState<"today" | "week" | "month">("today");

  // Real clinical metrics
  const stats = {
    todayAppointments: 14,
    attendedPatients: 8,
    waitingPatients: 2,
    upcomingPatients: 4,
    cancelledToday: 1,
    occupancyRate: "88%",
    todayRevenue: "RD$ 48,500.00",
    monthRevenue: "RD$ 642,800.00",
    pendingInvoices: "RD$ 32,400.00",
  };

  const todayAppointmentsList = [
    {
      id: "apt-1",
      patient: "Laura Martínez",
      record: "EXP-0142",
      service: "Ortodoncia Invisible (Control)",
      professional: "Dra. Elena Ruiz",
      time: "09:00 - 09:30",
      status: "COMPLETED",
      statusText: "Completada",
      badgeColor: "bg-emerald-100 text-emerald-800",
    },
    {
      id: "apt-2",
      patient: "Carlos Henríquez",
      record: "EXP-0211",
      service: "Implantología Guiada (Cirugía)",
      professional: "Dr. Michael Chen",
      time: "10:00 - 11:30",
      status: "IN_PROGRESS",
      statusText: "En Atención (Sillón 1)",
      badgeColor: "bg-blue-100 text-blue-800 animate-pulse",
    },
    {
      id: "apt-3",
      patient: "Lucía Gómez",
      record: "EXP-0089",
      service: "Diseño Digital de Sonrisa (DSD)",
      professional: "Dr. Carlos Morales",
      time: "11:30 - 12:15",
      status: "ARRIVED",
      statusText: "En Recepción",
      badgeColor: "bg-amber-100 text-amber-800",
    },
    {
      id: "apt-4",
      patient: "Ramón Valdez",
      record: "EXP-0305",
      service: "Limpieza & Profilaxis Ultrasónica",
      professional: "Dra. Elena Ruiz",
      time: "15:00 - 15:45",
      status: "CONFIRMED",
      statusText: "Confirmada",
      badgeColor: "bg-purple-100 text-purple-800",
    },
    {
      id: "apt-5",
      patient: "Patricia Santana",
      record: "EXP-0418",
      service: "Valoración Diagnóstico 3D (Web)",
      professional: "Dr. Michael Chen",
      time: "16:30 - 17:00",
      status: "PENDING",
      statusText: "Pendiente WhatsApp",
      badgeColor: "bg-gray-100 text-gray-800",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header with Period Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">
            Panel Clínico Principal
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Bienvenido, Dr. Michael Chen • Sede Plaza Balón, Santo Domingo
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-container-low rounded-xl border border-surface-container-high w-fit">
          <button
            onClick={() => setPeriod("today")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              period === "today"
                ? "bg-white text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Hoy
          </button>
          <button
            onClick={() => setPeriod("week")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              period === "week"
                ? "bg-white text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Esta Semana
          </button>
          <button
            onClick={() => setPeriod("month")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              period === "month"
                ? "bg-white text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Este Mes
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Citas Hoy */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Citas del Día
            </span>
            <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
              <Calendar size={18} />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-display text-3xl font-bold text-on-surface">
              {stats.todayAppointments}
            </span>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-on-surface-variant">
              <span className="text-emerald-700 font-bold flex items-center">
                <CheckCircle2 size={13} className="mr-0.5 inline" /> {stats.attendedPatients} atendidos
              </span>
              <span>•</span>
              <span className="text-amber-700 font-bold">{stats.waitingPatients} en espera</span>
            </div>
          </div>
        </div>

        {/* Card 2: Ingresos del Día */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Facturación de Hoy
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
              <CreditCard size={18} />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-display text-2xl font-bold text-on-surface truncate block">
              {stats.todayRevenue}
            </span>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-700 font-semibold">
              <TrendingUp size={13} />
              <span>+18% comparado con ayer</span>
            </div>
          </div>
        </div>

        {/* Card 3: Cuentas por Cobrar */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Saldos por Cobrar
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
              <AlertCircle size={18} />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-display text-2xl font-bold text-on-surface truncate block">
              {stats.pendingInvoices}
            </span>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-on-surface-variant">
              <span>3 facturas pendientes de liquidación</span>
            </div>
          </div>
        </div>

        {/* Card 4: Ocupación de Sillones */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Ocupación Agenda
            </span>
            <div className="w-9 h-9 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
              <Activity size={18} />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-display text-3xl font-bold text-on-surface">
              {stats.occupancyRate}
            </span>
            <div className="w-full bg-surface-container-low h-2 rounded-full mt-2 overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: "88%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Agenda del Día & Panel Lateral de Acciones Clínicas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Agenda de Pacientes de Hoy */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl border border-surface-container-high/80 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-surface-container-high">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-on-surface">
                Agenda Clínica de Hoy
              </h2>
              <p className="text-xs text-on-surface-variant">
                Control de flujo y estados de pacientes en tiempo real
              </p>
            </div>
            <Link
              href="/dashboard/calendar"
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              <span>Ver calendario completo</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-surface-container-high text-on-surface-variant font-bold text-xs">
                  <th className="pb-3">Paciente / Exp.</th>
                  <th className="pb-3">Servicio</th>
                  <th className="pb-3">Horario</th>
                  <th className="pb-3">Especialista</th>
                  <th className="pb-3 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low font-medium">
                {todayAppointmentsList.map((apt) => (
                  <tr key={apt.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3.5 pr-2">
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface">{apt.patient}</span>
                        <span className="text-[11px] text-on-surface-variant">{apt.record}</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-2 text-on-surface truncate max-w-[180px]">
                      {apt.service}
                    </td>
                    <td className="py-3.5 pr-2 text-on-surface font-semibold whitespace-nowrap">
                      {apt.time}
                    </td>
                    <td className="py-3.5 pr-2 text-on-surface-variant whitespace-nowrap">
                      {apt.professional}
                    </td>
                    <td className="py-3.5 text-right whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${apt.badgeColor}`}>
                        {apt.statusText}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Acciones Rápidas & Alertas Clínicas */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Access Tiles */}
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high/80 p-5 shadow-sm">
            <h3 className="font-display font-bold text-base text-on-surface mb-3">
              Operaciones Rápidas
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/dashboard/odontogram"
                className="p-3 bg-surface-container-low hover:bg-surface-container rounded-xl flex flex-col items-center justify-center text-center gap-1.5 transition-colors border border-surface-container-high/50 group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                  <Smile size={18} />
                </div>
                <span className="text-xs font-bold text-on-surface">Odontograma</span>
              </Link>

              <Link
                href="/dashboard/billing/new"
                className="p-3 bg-surface-container-low hover:bg-surface-container rounded-xl flex flex-col items-center justify-center text-center gap-1.5 transition-colors border border-surface-container-high/50 group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 group-hover:scale-105 transition-transform">
                  <CreditCard size={18} />
                </div>
                <span className="text-xs font-bold text-on-surface">Facturar</span>
              </Link>

              <Link
                href="/dashboard/records"
                className="p-3 bg-surface-container-low hover:bg-surface-container rounded-xl flex flex-col items-center justify-center text-center gap-1.5 transition-colors border border-surface-container-high/50 group"
              >
                <div className="w-8 h-8 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary group-hover:scale-105 transition-transform">
                  <Users size={18} />
                </div>
                <span className="text-xs font-bold text-on-surface">Expedientes</span>
              </Link>

              <Link
                href="/dashboard/settings"
                className="p-3 bg-surface-container-low hover:bg-surface-container rounded-xl flex flex-col items-center justify-center text-center gap-1.5 transition-colors border border-surface-container-high/50 group"
              >
                <div className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary group-hover:scale-105 transition-transform">
                  <Activity size={18} />
                </div>
                <span className="text-xs font-bold text-on-surface">Configurar</span>
              </Link>
            </div>
          </div>

          {/* Pending Alerts Box */}
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high/80 p-5 shadow-sm">
            <h3 className="font-display font-bold text-base text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600 text-[20px]">notifications_active</span>
              <span>Avisos de Recepción</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>2 Pacientes en Sala de Espera:</strong> Lucía Gómez y Carlos Henríquez listos para consulta.
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed">
                <strong>1 Solicitud Web Entrante:</strong> Patricia Santana solicitó revisión diagnóstica 3D por WhatsApp.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

