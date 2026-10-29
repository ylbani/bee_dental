"use client";

import React, { useState, useEffect } from "react";
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
  const [appointmentsList, setAppointmentsList] = useState<any[]>([]);
  const [patientCount, setPatientCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    try {
      const storedApts = localStorage.getItem("bee_appointments");
      if (storedApts) {
        setAppointmentsList(JSON.parse(storedApts));
      }
      const storedPatients = localStorage.getItem("bee_custom_patients");
      if (storedPatients) {
        setPatientCount(JSON.parse(storedPatients).length);
      }
      const storedInvoices = localStorage.getItem("bee_custom_invoices");
      if (storedInvoices) {
        const invs = JSON.parse(storedInvoices);
        const sum = invs.reduce((acc: number, item: any) => acc + (item.paidAmountDop || 0), 0);
        setTotalRevenue(sum);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const [selectedApt, setSelectedApt] = useState<any | null>(null);

  const handleUpdateStatus = (id: string, newStatus: string, newStatusText: string, newBadge: string) => {
    const updated = appointmentsList.map((a) =>
      a.id === id ? { ...a, status: newStatus, statusText: newStatusText, badgeColor: newBadge } : a
    );
    setAppointmentsList(updated);
    try {
      localStorage.setItem("bee_appointments", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setSelectedApt(null);
  };

  const attended = appointmentsList.filter((a) => a.status === "COMPLETED").length;
  const inProgress = appointmentsList.filter((a) => a.status === "IN_PROGRESS" || a.status === "ARRIVED").length;

  return (
    <div className="space-y-6">
      {/* Top Header with Period Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">
            Panel Clínico Principal
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Bienvenido, Dra. Leticia Bueno • Directora Médica &amp; Especialista Dental
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
        {/* Card 1: Citas */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Citas Agendadas
            </span>
            <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
              <Calendar size={18} />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-display text-3xl font-bold text-on-surface">
              {appointmentsList.length}
            </span>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-on-surface-variant">
              <span className="text-emerald-700 font-bold flex items-center">
                <CheckCircle2 size={13} className="mr-0.5 inline" /> {attended} atendidos
              </span>
              <span>•</span>
              <span className="text-amber-700 font-bold">{inProgress} en curso</span>
            </div>
          </div>
        </div>

        {/* Card 2: Ingresos */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Cobrado en Caja
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
              <CreditCard size={18} />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-display text-2xl font-bold text-on-surface truncate block">
              RD$ {totalRevenue.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
            </span>
            <p className="text-xs text-on-surface-variant mt-1.5">
              Liquidado en tiempo real
            </p>
          </div>
        </div>

        {/* Card 3: Pacientes */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Pacientes Registrados
            </span>
            <div className="w-9 h-9 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-display text-3xl font-bold text-on-surface">
              {patientCount}
            </span>
            <p className="text-xs text-on-surface-variant mt-1.5">
              Expedientes clínicos activos
            </p>
          </div>
        </div>

        {/* Card 4: WhatsApp Bot */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Canal WhatsApp
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Activity size={18} />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-display text-lg font-bold text-emerald-800 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Evolution API</span>
            </span>
            <p className="text-xs text-on-surface-variant mt-1.5">
              Docker en DigitalOcean (8080)
            </p>
          </div>
        </div>
      </div>

      {/* Main Clinical Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tabla de Citas del Día */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl border border-surface-container-high/80 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-surface-container-high">
            <div>
              <h2 className="font-display text-lg font-bold text-on-surface">
                Agenda de Pacientes
              </h2>
              <p className="text-xs text-on-surface-variant">
                Control de flujo y estados de atención en tiempo real
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
            {appointmentsList.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <Calendar size={28} className="mx-auto text-on-surface-variant/40" />
                <p className="font-bold text-xs sm:text-sm text-on-surface">No hay citas registradas en la agenda</p>
                <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                  La agenda se encuentra limpia. Agendar una cita creará el turno en tiempo real.
                </p>
                <Link
                  href="/dashboard/appointments/new"
                  className="inline-flex items-center gap-1 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-container"
                >
                  <Plus size={14} />
                  <span>Agendar Cita</span>
                </Link>
              </div>
            ) : (
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-surface-container-high text-on-surface-variant font-bold text-xs">
                    <th className="pb-3">Paciente</th>
                    <th className="pb-3">Servicio</th>
                    <th className="pb-3">Horario</th>
                    <th className="pb-3">Especialista</th>
                    <th className="pb-3 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low font-medium">
                  {appointmentsList.map((apt) => (
                    <tr
                      key={apt.id}
                      onClick={() => setSelectedApt(apt)}
                      className="hover:bg-surface-container-low/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 pr-2">
                        <span className="font-bold text-on-surface">{apt.patientName || apt.patient}</span>
                      </td>
                      <td className="py-3.5 pr-2 text-on-surface truncate max-w-[180px]">
                        {apt.service}
                      </td>
                      <td className="py-3.5 pr-2 text-on-surface font-semibold whitespace-nowrap">
                        {apt.startTime || apt.time}
                      </td>
                      <td className="py-3.5 pr-2 text-on-surface-variant whitespace-nowrap">
                        {apt.professional}
                      </td>
                      <td className="py-3.5 text-right whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${apt.badgeColor || "bg-emerald-100 text-emerald-800"}`}>
                          {apt.status || "CONFIRMED"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
              <span className="material-symbols-outlined text-emerald-600 text-[20px]">mark_chat_unread</span>
              <span>Canal WhatsApp DigitalOcean</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                <strong>Evolution API Activa:</strong> Contenedor <code className="font-mono bg-white/70 px-1 py-0.5 rounded">97f72e3ca98c</code> listo para vincular por código QR desde Configuración.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Status Modal */}
      {selectedApt && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <div>
                <h3 className="font-display font-bold text-lg text-on-surface">Gestión de Turno Clínico</h3>
                <p className="text-xs text-on-surface-variant">{selectedApt.patientName || selectedApt.patient}</p>
              </div>
              <button
                onClick={() => setSelectedApt(null)}
                className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs bg-surface-container-low p-3.5 rounded-xl">
              <p><strong>Servicio:</strong> {selectedApt.service}</p>
              <p><strong>Especialista:</strong> {selectedApt.professional}</p>
              <p><strong>Horario:</strong> {selectedApt.startTime || selectedApt.time}</p>
              <p><strong>Estado Actual:</strong> <span className="font-bold">{selectedApt.status || "CONFIRMED"}</span></p>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold text-on-surface">Cambiar Estado de Atención:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    handleUpdateStatus(
                      selectedApt.id,
                      "ARRIVED",
                      "En Recepción",
                      "bg-amber-100 text-amber-800"
                    )
                  }
                  className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition-colors"
                >
                  🟡 En Recepción
                </button>
                <button
                  onClick={() =>
                    handleUpdateStatus(
                      selectedApt.id,
                      "IN_PROGRESS",
                      "En Atención",
                      "bg-blue-100 text-blue-800 animate-pulse"
                    )
                  }
                  className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 text-xs font-bold transition-colors"
                >
                  🔵 En Sillón
                </button>
                <button
                  onClick={() =>
                    handleUpdateStatus(
                      selectedApt.id,
                      "COMPLETED",
                      "Completada",
                      "bg-emerald-100 text-emerald-800"
                    )
                  }
                  className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold transition-colors"
                >
                  🟢 Completada
                </button>
                <button
                  onClick={() =>
                    handleUpdateStatus(
                      selectedApt.id,
                      "CANCELLED",
                      "Cancelada",
                      "bg-rose-100 text-rose-800"
                    )
                  }
                  className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 text-xs font-bold transition-colors"
                >
                  🔴 Cancelada
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedApt(null)}
                className="px-4 py-2 rounded-xl bg-surface-container text-xs font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
