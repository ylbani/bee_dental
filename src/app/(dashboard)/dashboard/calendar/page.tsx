"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Filter,
  X,
  Stethoscope,
  Sparkles,
} from "lucide-react";

type ViewMode = "day" | "week" | "month" | "list";

export interface CalendarEvent {
  id: string;
  patientName: string;
  service: string;
  professional: string;
  chair: string;
  startTime: string;
  durationMinutes: number;
  status: "CONFIRMED" | "IN_PROGRESS" | "ARRIVED" | "PENDING" | "COMPLETED";
  color: string;
  date?: string;
}

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [selectedProfessional, setSelectedProfessional] = useState<string>("ALL");
  const [showNewAptModal, setShowNewAptModal] = useState(false);
  const [prefilledSlot, setPrefilledSlot] = useState("10:00");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const defaultEvents: CalendarEvent[] = [
    {
      id: "e-1",
      patientName: "Laura Martínez",
      service: "Ortodoncia Invisible (Control)",
      professional: "Dra. Leticia Bueno",
      chair: "Sillón 1 - Principal",
      startTime: "09:00",
      durationMinutes: 30,
      status: "COMPLETED",
      color: "border-l-4 border-emerald-600 bg-emerald-50 text-emerald-950",
    },
    {
      id: "e-2",
      patientName: "Carlos Henríquez",
      service: "Implantología Guiada en 24h",
      professional: "Dra. Leticia Bueno",
      chair: "Gabinete Quirúrgico 1",
      startTime: "10:00",
      durationMinutes: 90,
      status: "IN_PROGRESS",
      color: "border-l-4 border-blue-600 bg-blue-50 text-blue-950",
    },
    {
      id: "e-3",
      patientName: "Lucía Gómez",
      service: "Diseño Digital de Sonrisa (DSD)",
      professional: "Dra. Leticia Bueno",
      chair: "Sillón Estética 3",
      startTime: "11:30",
      durationMinutes: 45,
      status: "ARRIVED",
      color: "border-l-4 border-amber-600 bg-amber-50 text-amber-950",
    },
    {
      id: "e-4",
      patientName: "Ramón Valdez",
      service: "Profilaxis y Limpieza Ultrasonido",
      professional: "Dra. Leticia Bueno",
      chair: "Sillón 2",
      startTime: "15:00",
      durationMinutes: 45,
      status: "CONFIRMED",
      color: "border-l-4 border-purple-600 bg-purple-50 text-purple-950",
    },
    {
      id: "e-5",
      patientName: "Patricia Santana",
      service: "Valoración Diagnóstico 3D (Web)",
      professional: "Dra. Leticia Bueno",
      chair: "Sillón 1",
      startTime: "16:30",
      durationMinutes: 30,
      status: "PENDING",
      color: "border-l-4 border-teal-600 bg-teal-50 text-teal-950",
    },
  ];

  const [events, setEvents] = useState<CalendarEvent[]>(defaultEvents);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bee_appointments");
      if (stored) {
        const parsed: CalendarEvent[] = JSON.parse(stored);
        setEvents([...parsed, ...defaultEvents]);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const [formPatient, setFormPatient] = useState("");
  const [formService, setFormService] = useState("Ortodoncia Invisible (Control)");
  const [formDoctor, setFormDoctor] = useState("Dra. Leticia Bueno");
  const [formChair, setFormChair] = useState("Sillón 1 - Principal");
  const [formDuration, setFormDuration] = useState(30);

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const created: CalendarEvent = {
      id: `e-${Date.now()}`,
      patientName: formPatient,
      service: formService,
      professional: formDoctor,
      chair: formChair,
      startTime: prefilledSlot,
      durationMinutes: Number(formDuration),
      status: "CONFIRMED",
      color: "border-l-4 border-emerald-600 bg-emerald-50 text-emerald-950",
    };

    const nextEvents = [created, ...events];
    setEvents(nextEvents);

    try {
      const stored = JSON.parse(localStorage.getItem("bee_appointments") || "[]");
      localStorage.setItem("bee_appointments", JSON.stringify([created, ...stored]));
    } catch (err) {
      console.error(err);
    }

    setShowNewAptModal(false);
    setFormPatient("");
  };

  const handleUpdateEventStatus = (
    id: string,
    newStatus: "CONFIRMED" | "IN_PROGRESS" | "ARRIVED" | "PENDING" | "COMPLETED"
  ) => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, status: newStatus } : ev))
    );
    setSelectedEvent(null);
  };

  const filteredEvents =
    selectedProfessional === "ALL"
      ? events
      : events.filter((e) => e.professional.includes(selectedProfessional));

  const timeSlots = [
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
  ];

  return (
    <div className="space-y-6">
      {/* Top Controls & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">
            Agenda Clínica &amp; Citas
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Gestión de sillones, citas de Dra. Leticia Bueno y control de flujo de pacientes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/appointments/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:bg-primary-container transition-all"
          >
            <Plus size={16} />
            <span>Nueva Cita</span>
          </Link>
        </div>
      </div>

      {/* Filter and View Bar */}
      <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-high/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Date Selector Navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-surface-container-low rounded-xl p-1 border border-surface-container-high">
            <button className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant">
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 text-xs sm:text-sm font-bold text-on-surface whitespace-nowrap">
              Hoy, 29 de Octubre 2026
            </span>
            <button className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Professional & View mode filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Filter size={15} className="text-on-surface-variant" />
            <select
              value={selectedProfessional}
              onChange={(e) => setSelectedProfessional(e.target.value)}
              className="h-9 px-3 bg-surface-container-low rounded-xl text-xs font-bold text-on-surface border border-surface-container-high focus:outline-none"
            >
              <option value="ALL">Todos los Especialistas</option>
              <option value="Leticia Bueno">Dra. Leticia Bueno</option>
              <option value="Elena Ruiz">Dra. Elena Ruiz</option>
              <option value="Carlos Morales">Dr. Carlos Morales</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-surface-container-high text-xs font-bold">
            <button
              onClick={() => setViewMode("day")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === "day"
                  ? "bg-white text-primary shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Día
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-white text-primary shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Lista
            </button>
          </div>
        </div>
      </div>

      {/* Main Agenda Grid */}
      {viewMode === "day" ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high/80 p-5 shadow-sm overflow-hidden">
          <div className="space-y-2">
            {timeSlots.map((slot) => {
              const matchedEvents = filteredEvents.filter((ev) => ev.startTime === slot);

              return (
                <div
                  key={slot}
                  className="flex items-start gap-4 py-2 border-b border-surface-container-low min-h-[56px] group hover:bg-surface-container-low/30 rounded-lg px-2 transition-colors"
                >
                  {/* Time Column */}
                  <div className="w-16 shrink-0 text-xs font-bold text-on-surface-variant pt-1 font-mono">
                    {slot}
                  </div>

                  {/* Slot Events Area */}
                  <div className="flex-1 flex flex-wrap gap-3">
                    {matchedEvents.length > 0 ? (
                      matchedEvents.map((ev) => (
                        <div
                          key={ev.id}
                          onClick={() => setSelectedEvent(ev)}
                          className={`p-3 rounded-xl shadow-sm text-xs flex-1 min-w-[260px] flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow ${ev.color}`}
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                              {ev.patientName}
                              <span className="text-[11px] font-normal text-on-surface-variant">
                                ({ev.chair})
                              </span>
                            </span>
                            <span className="font-medium text-on-surface-variant">
                              {ev.service}
                            </span>
                            <span className="text-[11px] text-on-surface-variant/80">
                              {ev.professional} • {ev.durationMinutes} min
                            </span>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/70 shadow-2xs">
                            {ev.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div
                        onClick={() => {
                          setPrefilledSlot(slot);
                          setShowNewAptModal(true);
                        }}
                        className="w-full text-transparent group-hover:text-primary text-xs font-semibold py-1 cursor-pointer flex items-center gap-1 transition-colors"
                      >
                        <Plus size={14} />
                        <span>Disponible — Clic para agendar a las {slot}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high/80 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-surface-container-high bg-surface-container-low/50 text-on-surface-variant font-bold text-xs">
                <th className="py-3 px-4">Hora</th>
                <th className="py-3 px-4">Paciente</th>
                <th className="py-3 px-4">Servicio</th>
                <th className="py-3 px-4">Especialista</th>
                <th className="py-3 px-4">Gabinete</th>
                <th className="py-3 px-4 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filteredEvents.map((ev) => (
                <tr
                  key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  className="hover:bg-surface-container-low/40 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-primary">{ev.startTime}</td>
                  <td className="py-3 px-4 font-bold text-on-surface">{ev.patientName}</td>
                  <td className="py-3 px-4 text-on-surface-variant">{ev.service}</td>
                  <td className="py-3 px-4 text-on-surface-variant">{ev.professional}</td>
                  <td className="py-3 px-4 text-on-surface-variant">{ev.chair}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-surface-container text-on-surface">
                      {ev.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Appointment Detail / Status Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <h3 className="font-display font-bold text-lg text-on-surface">Detalle de Consulta</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 bg-surface-container-low p-4 rounded-xl text-xs">
              <p><strong>Paciente:</strong> {selectedEvent.patientName}</p>
              <p><strong>Servicio:</strong> {selectedEvent.service}</p>
              <p><strong>Especialista:</strong> {selectedEvent.professional}</p>
              <p><strong>Gabinete:</strong> {selectedEvent.chair}</p>
              <p><strong>Horario:</strong> {selectedEvent.startTime} ({selectedEvent.durationMinutes} min)</p>
              <p><strong>Estado Actual:</strong> <span className="font-bold uppercase text-primary">{selectedEvent.status}</span></p>
            </div>

            <div className="space-y-2 pt-1">
              <p className="text-xs font-bold text-on-surface">Cambiar Estado:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleUpdateEventStatus(selectedEvent.id, "ARRIVED")}
                  className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold"
                >
                  🟡 En Recepción
                </button>
                <button
                  onClick={() => handleUpdateEventStatus(selectedEvent.id, "IN_PROGRESS")}
                  className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 text-xs font-bold"
                >
                  🔵 En Consulta
                </button>
                <button
                  onClick={() => handleUpdateEventStatus(selectedEvent.id, "COMPLETED")}
                  className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold"
                >
                  🟢 Completada
                </button>
                <button
                  onClick={() => handleUpdateEventStatus(selectedEvent.id, "CONFIRMED")}
                  className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-xs font-bold"
                >
                  🟣 Confirmada
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-xl bg-surface-container text-xs font-bold text-on-surface-variant hover:bg-surface-container-high"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick New Appointment Slot Modal */}
      {showNewAptModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <div>
                <h3 className="font-display font-bold text-lg text-on-surface">Agendar Cita Rápida</h3>
                <p className="text-xs text-on-surface-variant">Para hoy a las {prefilledSlot}</p>
              </div>
              <button
                onClick={() => setShowNewAptModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Nombre del Paciente *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Laura Martínez"
                  value={formPatient}
                  onChange={(e) => setFormPatient(e.target.value)}
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Servicio Dental</label>
                <select
                  value={formService}
                  onChange={(e) => setFormService(e.target.value)}
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Ortodoncia Invisible (Control)">Ortodoncia Invisible (Control)</option>
                  <option value="Implantología Guiada en 24h">Implantología Guiada en 24h</option>
                  <option value="Diseño Digital de Sonrisa (DSD)">Diseño Digital de Sonrisa (DSD)</option>
                  <option value="Profilaxis y Limpieza Ultrasonido">Profilaxis y Limpieza Ultrasonido</option>
                  <option value="Valoración Diagnóstica 3D">Valoración Diagnóstica 3D</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Especialista</label>
                  <select
                    value={formDoctor}
                    onChange={(e) => setFormDoctor(e.target.value)}
                    className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Dra. Leticia Bueno">Dra. Leticia Bueno</option>
                    <option value="Dra. Elena Ruiz">Dra. Elena Ruiz</option>
                    <option value="Dr. Carlos Morales">Dr. Carlos Morales</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Duración</label>
                  <select
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value={30}>30 min</option>
                    <option value={45}>45 min</option>
                    <option value={60}>60 min</option>
                    <option value={90}>90 min</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewAptModal(false)}
                  className="px-4 py-2 rounded-xl border border-surface-container-high text-xs font-bold text-on-surface-variant hover:bg-surface-container"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:bg-primary-container flex items-center gap-1.5"
                >
                  <Sparkles size={14} />
                  <span>Guardar Cita</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
