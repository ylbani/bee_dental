"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Clock, User, Stethoscope, ChevronLeft, Check, Sparkles } from "lucide-react";

export default function NewAppointmentPage() {
  const router = useRouter();
  const [patientName, setPatientName] = useState("");
  const [service, setService] = useState("Ortodoncia Invisible (Control)");
  const [professional, setProfessional] = useState("Dra. Leticia Bueno");
  const [chair, setChair] = useState("Sillón 1 - Principal");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("10:00");
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newApt = {
      id: `e-${Date.now()}`,
      patientName,
      service,
      professional,
      chair,
      startTime: time,
      durationMinutes: Number(durationMinutes),
      status: "CONFIRMED",
      date,
      notes,
      color: "border-l-4 border-emerald-600 bg-emerald-50 text-emerald-950",
    };

    try {
      const existing = JSON.parse(localStorage.getItem("bee_appointments") || "[]");
      localStorage.setItem("bee_appointments", JSON.stringify([newApt, ...existing]));
    } catch (err) {
      console.error(err);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      router.push("/dashboard/calendar");
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/calendar"
          className="w-9 h-9 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
        >
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface">Agendar Nueva Cita</h1>
          <p className="text-xs text-on-surface-variant">
            Programar consulta clínica para Bee Dental • Dra. Leticia Bueno
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900 text-sm font-semibold animate-in fade-in">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Check size={18} />
          </div>
          <div>
            <p className="font-bold">¡Cita registrada con éxito!</p>
            <p className="text-xs text-emerald-700">Redirigiendo a la agenda en tiempo real...</p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high/80 shadow-sm space-y-5"
      >
        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface">Nombre Completo del Paciente *</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              required
              placeholder="Ej. Laura Martínez Gómez"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full h-11 pl-10 pr-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface">Especialista Asignado *</label>
            <select
              value={professional}
              onChange={(e) => setProfessional(e.target.value)}
              className="w-full h-11 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary font-medium"
            >
              <option value="Dra. Leticia Bueno">Dra. Leticia Bueno (Directora Médica)</option>
              <option value="Dra. Elena Ruiz">Dra. Elena Ruiz (Ortodoncia)</option>
              <option value="Dr. Carlos Morales">Dr. Carlos Morales (Estética)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface">Servicio Clínico *</label>
            <div className="relative">
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full h-11 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary font-medium"
              >
                <option value="Ortodoncia Invisible (Control)">Ortodoncia Invisible (Control)</option>
                <option value="Implantología Guiada en 24h">Implantología Guiada en 24h</option>
                <option value="Diseño Digital de Sonrisa (DSD)">Diseño Digital de Sonrisa (DSD)</option>
                <option value="Profilaxis y Limpieza Ultrasonido">Profilaxis y Limpieza Ultrasonido</option>
                <option value="Valoración Diagnóstica 3D">Valoración Diagnóstica 3D</option>
                <option value="Blanqueamiento Dental Láser">Blanqueamiento Dental Láser</option>
                <option value="Endodoncia Rotatoria">Endodoncia Rotatoria</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface">Fecha de Consulta *</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-11 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface">Hora de Inicio *</label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full h-11 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface">Duración (min) *</label>
            <select
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full h-11 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value={15}>15 minutos</option>
              <option value={30}>30 minutos</option>
              <option value={45}>45 minutos</option>
              <option value={60}>60 minutos (1 hora)</option>
              <option value={90}>90 minutos (1.5 horas)</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface">Gabinete / Sillón Dental</label>
          <select
            value={chair}
            onChange={(e) => setChair(e.target.value)}
            className="w-full h-11 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Sillón 1 - Principal (Dra. Leticia Bueno)">Sillón 1 - Principal (Dra. Leticia Bueno)</option>
            <option value="Sillón 2 - Gabinete Ortodoncia">Sillón 2 - Gabinete Ortodoncia</option>
            <option value="Gabinete Quirúrgico 1">Gabinete Quirúrgico 1</option>
            <option value="Sillón 3 - Estética Dental">Sillón 3 - Estética Dental</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface">Notas Clínicas o Motivo de Consulta</label>
          <textarea
            rows={3}
            placeholder="Observaciones preliminares, alergias del paciente o indicaciones..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <Link
            href="/dashboard/calendar"
            className="px-4 py-2.5 rounded-xl border border-surface-container-high text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-primary text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:bg-primary-container transition-all flex items-center gap-2"
          >
            <Sparkles size={16} />
            <span>{isSubmitting ? "Guardando..." : "Confirmar Cita"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

