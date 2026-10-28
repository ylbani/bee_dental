"use client";

import React, { useState } from "react";
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
} from "lucide-react";

type ViewMode = "day" | "week" | "month" | "list";

interface CalendarEvent {
  id: string;
  patientName: string;
  service: string;
  professional: string;
  chair: string;
  startTime: string;
  durationMinutes: number;
  status: "CONFIRMED" | "IN_PROGRESS" | "ARRIVED" | "PENDING" | "COMPLETED";
  color: string;
}

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [selectedProfessional, setSelectedProfessional] = useState<string>("ALL");
  const [showNewAptModal, setShowNewAptModal] = useState(false);

  const events: CalendarEvent[] = [
    {
      id: "e-1",
      patientName: "Laura Martínez",
      service: "Ortodoncia Invisible (Control)",
      professional: "Dra. Elena Ruiz",
      chair: "Sillón 2",
      startTime: "09:00",
      durationMinutes: 30,
      status: "COMPLETED",
      color: "border-l-4 border-emerald-600 bg-emerald-50 text-emerald-950",
    },
    {
      id: "e-2",
      patientName: "Carlos Henríquez",
      service: "Implantología Guiada en 24h",
      professional: "Dr. Michael Chen",
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
      professional: "Dr. Carlos Morales",
      chair: "Sillón Estética 3",
      startTime: "11:30",
      durationMinutes: 45,
      status: "ARRIVED",
      color: "border-l-4 border-amber-600 bg-amber-50 text-amber-950",
    },
    {
      id: "e-4",
      patientName: "Ramón Valdez",
      service: "Profilaxis y Sellante",
      professional: "Dra. Elena Ruiz",
      chair: "Sillón 2",
      startTime: "15:00",
      durationMinutes: 45,
      status: "CONFIRMED",
      color: "border-l-4 border-purple-600 bg-purple-50 text-purple-950",
    },
    {
      id: "e-5",
      patientName: "Patricia Santana",
      service: "Valoración Diagnóstico 3D",
      professional: "Dr. Michael Chen",
      chair: "Sillón 1",
      startTime: "16:30",
      durationMinutes: 30,
      status: "PENDING",
      color: "border-l-4 border-teal-600 bg-teal-50 text-teal-950",
    },
  ];

  const filteredEvents =
    selectedProfessional === "ALL"
      ? events
      : events.filter((e) => e.professional.includes(selectedProfessional));

  // Time grid slots (08:30 to 20:00 in 30-min steps)
  const timeSlots = [
    "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00",
    "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
    "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00",
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">
            Calendario de Citas Clínicas
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Sede Plaza Balón, Santo Domingo • Zona Horaria America/Santo_Domingo
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowNewAptModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:bg-primary-container transition-all"
          >
            <Plus size={16} />
            <span>Agendar Cita</span>
          </button>
        </div>
      </div>

      {/* Filter and View mode toolbar */}
      <div className="bg-surface-container-lowest p-3.5 sm:p-4 rounded-2xl border border-surface-container-high/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="font-display font-bold text-sm sm:text-base text-on-surface px-2">
              Hoy, 27 de Octubre 2026
            </span>
            <button className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Professional Filter & View switcher */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Filter size={15} className="text-on-surface-variant" />
            <select
              value={selectedProfessional}
              onChange={(e) => setSelectedProfessional(e.target.value)}
              className="h-9 px-3 bg-surface-container-low rounded-xl text-xs font-bold text-on-surface border border-surface-container-high focus:outline-none"
            >
              <option value="ALL">Todos los Odontólogos</option>
              <option value="Chen">Dr. Michael Chen</option>
              <option value="Ruiz">Dra. Elena Ruiz</option>
              <option value="Morales">Dr. Carlos Morales</option>
            </select>
          </div>

          <div className="flex items-center p-1 bg-surface-container-low rounded-xl border border-surface-container-high text-xs font-bold">
            {(["day", "week", "month", "list"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  viewMode === mode
                    ? "bg-white text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {mode === "day"
                  ? "Día"
                  : mode === "week"
                  ? "Semana"
                  : mode === "month"
                  ? "Mes"
                  : "Listado"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Day Schedule Timeline View */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high/80 p-5 shadow-sm overflow-hidden">
        <div className="space-y-1">
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
                      onClick={() => setShowNewAptModal(true)}
                      className="w-full text-transparent hover:text-primary text-xs font-semibold py-1 cursor-pointer flex items-center gap-1 transition-colors"
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
    </div>
  );
}

