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
  Trash2,
} from "lucide-react";

type ViewMode = "day" | "month" | "list";

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
  date: string; // YYYY-MM-DD
}

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedProfessional, setSelectedProfessional] = useState<string>("ALL");
  const [showNewAptModal, setShowNewAptModal] = useState(false);
  const [prefilledSlot, setPrefilledSlot] = useState("10:00");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Current calendar navigation date
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 29)); // Oct 2026

  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bee_appointments");
      if (stored) {
        setEvents(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const [formPatient, setFormPatient] = useState("");
  const [formService, setFormService] = useState("Ortodoncia Invisible (Control)");
  const [formDoctor, setFormDoctor] = useState("Dra. Leticia Bueno");
  const [formChair, setFormChair] = useState("Sillón 1 - Principal");
  const [formDate, setFormDate] = useState("2026-10-29");
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
      date: formDate,
      color: "border-l-4 border-emerald-600 bg-emerald-50 text-emerald-950",
    };

    const nextEvents = [created, ...events];
    setEvents(nextEvents);

    try {
      localStorage.setItem("bee_appointments", JSON.stringify(nextEvents));
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
    const updated = events.map((ev) => (ev.id === id ? { ...ev, status: newStatus } : ev));
    setEvents(updated);
    try {
      localStorage.setItem("bee_appointments", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setSelectedEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm("¿Deseas cancelar y eliminar esta cita de la agenda?")) {
      const remaining = events.filter((e) => e.id !== id);
      setEvents(remaining);
      try {
        localStorage.setItem("bee_appointments", JSON.stringify(remaining));
      } catch (e) {
        console.error(e);
      }
      setSelectedEvent(null);
    }
  };

  const handleClearAll = () => {
    if (confirm("¿Estás seguro de que deseas limpiar todas las citas de la agenda?")) {
      setEvents([]);
      try {
        localStorage.removeItem("bee_appointments");
      } catch (e) {
        console.error(e);
      }
    }
  };

  const filteredEvents =
    selectedProfessional === "ALL"
      ? events
      : events.filter((e) => e.professional.includes(selectedProfessional));

  // Time slots for Day view
  const timeSlots = [
    "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00",
    "12:30", "13:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00", "18:30", "19:00",
  ];

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Days in month calculation
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  // Day of week for 1st day (0 is Sunday, convert to Monday = 0)
  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

  // Calendar cells
  const calendarCells = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarCells.push({ dayNumber: null, dateStr: null });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    const dateStr = `${year}-${mm}-${dd}`;
    calendarCells.push({ dayNumber: d, dateStr });
  }

  return (
    <div className="space-y-6">
      {/* Top Controls & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">
            Agenda Clínica de Citas
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Planificación de consultas, agenda de sillones y citas de Dra. Leticia Bueno
          </p>
        </div>

        <div className="flex items-center gap-2">
          {events.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 py-2 rounded-xl border border-surface-container-high text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
              title="Limpiar agenda de citas"
            >
              <Trash2 size={14} />
              <span>Limpiar Citas</span>
            </button>
          )}

          <button
            onClick={() => {
              setPrefilledSlot("10:00");
              setFormDate(`${year}-${String(month + 1).padStart(2, "0")}-29`);
              setShowNewAptModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:bg-primary-container transition-all"
          >
            <Plus size={16} />
            <span>Nueva Cita</span>
          </button>
        </div>
      </div>

      {/* Filter and View Bar */}
      <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-high/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Month Selector Navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-surface-container-low rounded-xl p-1 border border-surface-container-high">
            <button
              onClick={handlePrevMonth}
              className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
              title="Mes Anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-4 text-xs sm:text-sm font-bold text-on-surface whitespace-nowrap">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
              title="Mes Siguiente"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 rounded-xl bg-surface-container text-primary font-bold text-xs hover:bg-surface-container-high transition-colors"
          >
            Hoy
          </button>
        </div>

        {/* View mode buttons: Día, Mes Completo, Lista */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Filter size={15} className="text-on-surface-variant" />
            <select
              value={selectedProfessional}
              onChange={(e) => setSelectedProfessional(e.target.value)}
              className="h-9 px-3 bg-surface-container-low rounded-xl text-xs font-bold text-on-surface border border-surface-container-high focus:outline-none"
            >
              <option value="ALL">Dra. Leticia Bueno (Directora)</option>
              <option value="Leticia Bueno">Dra. Leticia Bueno</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-surface-container-high text-xs font-bold">
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === "month"
                  ? "bg-white text-primary shadow-xs font-bold"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Mes Completo
            </button>
            <button
              onClick={() => setViewMode("day")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === "day"
                  ? "bg-white text-primary shadow-xs font-bold"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Día
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-white text-primary shadow-xs font-bold"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Lista
            </button>
          </div>
        </div>
      </div>

      {/* 1. Full Month Grid View */}
      {viewMode === "month" && (
        <div className="bg-surface-container-lowest rounded-3xl border border-surface-container-high/80 p-5 sm:p-6 shadow-sm overflow-hidden">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2 pb-3 mb-2 border-b border-surface-container-high text-center font-bold text-xs text-on-surface-variant uppercase tracking-wider">
            <span>Lun</span>
            <span>Mar</span>
            <span>Mié</span>
            <span>Jue</span>
            <span>Vie</span>
            <span className="text-primary">Sáb</span>
            <span className="text-rose-700">Dom</span>
          </div>

          {/* Month Cells Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarCells.map((cell, idx) => {
              if (!cell.dayNumber) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="min-h-[105px] rounded-2xl bg-surface-container-low/20 border border-transparent p-2 opacity-30"
                  />
                );
              }

              const dayEvents = filteredEvents.filter((ev) => ev.date === cell.dateStr);
              const isToday =
                cell.dayNumber === 29 && month === 9 && year === 2026;

              return (
                <div
                  key={cell.dateStr}
                  onClick={() => {
                    setFormDate(cell.dateStr || "");
                    setPrefilledSlot("10:00");
                    setShowNewAptModal(true);
                  }}
                  className={`min-h-[105px] rounded-2xl border p-2 flex flex-col justify-between transition-all group cursor-pointer hover:border-primary hover:shadow-md ${
                    isToday
                      ? "bg-primary-fixed/20 border-primary font-bold"
                      : "bg-surface-container-low/40 border-surface-container-high/60 hover:bg-surface-container-low"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday ? "bg-primary text-white" : "text-on-surface"
                      }`}
                    >
                      {cell.dayNumber}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormDate(cell.dateStr || "");
                        setPrefilledSlot("10:00");
                        setShowNewAptModal(true);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-primary hover:scale-110 transition-all text-xs font-bold"
                      title="Agendar cita en este día"
                    >
                      +
                    </button>
                  </div>

                  {/* Day Events Pills */}
                  <div className="space-y-1 mt-1 overflow-y-auto max-h-[68px]">
                    {dayEvents.map((ev) => (
                      <div
                        key={ev.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(ev);
                        }}
                        className="px-2 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-bold truncate flex items-center justify-between transition-colors shadow-2xs"
                        title={`${ev.startTime} - ${ev.patientName} (${ev.service})`}
                      >
                        <span className="truncate">{ev.patientName}</span>
                        <span className="font-mono text-[9px] opacity-80 shrink-0 ml-1">
                          {ev.startTime}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Day View */}
      {viewMode === "day" && (
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high/80 p-5 shadow-sm overflow-hidden">
          <div className="space-y-2">
            {timeSlots.map((slot) => {
              const matchedEvents = filteredEvents.filter((ev) => ev.startTime === slot);

              return (
                <div
                  key={slot}
                  className="flex items-start gap-4 py-2 border-b border-surface-container-low min-h-[56px] group hover:bg-surface-container-low/30 rounded-lg px-2 transition-colors"
                >
                  <div className="w-16 shrink-0 text-xs font-bold text-on-surface-variant pt-1 font-mono">
                    {slot}
                  </div>

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
      )}

      {/* 3. List View */}
      {viewMode === "list" && (
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high/80 overflow-hidden shadow-sm">
          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <CalendarIcon size={32} className="mx-auto text-on-surface-variant/40" />
              <p className="font-bold text-on-surface">No hay citas registradas en la agenda</p>
              <p className="text-xs text-on-surface-variant">
                Haz clic en &quot;Nueva Cita&quot; o pulsa en cualquier día del calendario para registrar una consulta.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-surface-container-high bg-surface-container-low/50 text-on-surface-variant font-bold text-xs">
                  <th className="py-3 px-4">Fecha &amp; Hora</th>
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
                    <td className="py-3 px-4 font-mono font-bold text-primary">
                      {ev.date} • {ev.startTime}
                    </td>
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
          )}
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
              <p><strong>Fecha y Hora:</strong> {selectedEvent.date} a las {selectedEvent.startTime}</p>
              <p><strong>Servicio:</strong> {selectedEvent.service}</p>
              <p><strong>Especialista:</strong> {selectedEvent.professional}</p>
              <p><strong>Gabinete:</strong> {selectedEvent.chair}</p>
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

            <div className="pt-2 border-t border-surface-container-high flex justify-between items-center">
              <button
                onClick={() => handleDeleteEvent(selectedEvent.id)}
                className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
              >
                <Trash2 size={13} />
                <span>Cancelar Cita</span>
              </button>

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
                <h3 className="font-display font-bold text-lg text-on-surface">Agendar Cita</h3>
                <p className="text-xs text-on-surface-variant">Fecha: {formDate}</p>
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
                  placeholder="Ej. Carmen Santana"
                  value={formPatient}
                  onChange={(e) => setFormPatient(e.target.value)}
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Fecha *</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Hora *</label>
                  <input
                    type="time"
                    required
                    value={prefilledSlot}
                    onChange={(e) => setPrefilledSlot(e.target.value)}
                    className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Servicio Dental</label>
                <select
                  value={formService}
                  onChange={(e) => setService(e.target.value as any)}
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Ortodoncia Invisible (Control)">Ortodoncia Invisible (Control)</option>
                  <option value="Implantología Guiada en 24h">Implantología Guiada en 24h</option>
                  <option value="Diseño Digital de Sonrisa (DSD)">Diseño Digital de Sonrisa (DSD)</option>
                  <option value="Profilaxis y Limpieza Ultrasonido">Profilaxis y Limpieza Ultrasonido</option>
                  <option value="Valoración Diagnóstica 3D">Valoración Diagnóstica 3D</option>
                  <option value="Blanqueamiento Dental">Blanqueamiento Dental</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Especialista</label>
                  <input
                    type="text"
                    readOnly
                    value="Dra. Leticia Bueno"
                    className="w-full h-10 px-3 bg-surface-container rounded-xl text-xs border border-surface-container-high text-primary font-bold"
                  />
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
