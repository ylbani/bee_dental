"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Phone, Mail, MapPin, ChevronLeft, Check, Shield, AlertTriangle } from "lucide-react";

export default function NewPatientPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    idDocument: "",
    phone: "",
    email: "",
    birthDate: "",
    gender: "Femenino",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    medicalHistory: "",
    allergies: "",
    insuranceProvider: "Ninguno (Privado)",
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newPt = {
      id: `p-${Date.now()}`,
      recordNumber: `EXP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: `${formData.firstName} ${formData.lastName}`,
      idDocument: formData.idDocument || "No provisto",
      phone: formData.phone,
      email: formData.email || "No registrada",
      lastVisit: "Primera Visita",
      balanceDop: 0,
      status: "ACTIVO",
      ...formData,
    };

    try {
      const existing = JSON.parse(localStorage.getItem("bee_custom_patients") || "[]");
      localStorage.setItem("bee_custom_patients", JSON.stringify([newPt, ...existing]));
    } catch (err) {
      console.error(err);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      router.push("/dashboard/patients");
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/patients"
          className="w-9 h-9 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
        >
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface">Registrar Paciente</h1>
          <p className="text-xs text-on-surface-variant">
            Apertura de ficha clínica y expediente digital Bee Dental
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900 text-sm font-semibold animate-in fade-in">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Check size={18} />
          </div>
          <div>
            <p className="font-bold">¡Paciente y expediente clínico creados exitosamente!</p>
            <p className="text-xs text-emerald-700">Redirigiendo a la lista de pacientes...</p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high/80 shadow-sm space-y-6"
      >
        {/* Datos Personales */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider border-b border-surface-container-high pb-2">
            1. Datos Personales &amp; Contacto
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface">Nombres *</label>
              <input
                type="text"
                required
                placeholder="Ej. Carmen"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full h-11 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface">Apellidos *</label>
              <input
                type="text"
                required
                placeholder="Ej. Santana Morales"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full h-11 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface">DNI / Cédula / Pasaporte *</label>
              <input
                type="text"
                required
                placeholder="402-XXXXXXX-X / 12345678A"
                value={formData.idDocument}
                onChange={(e) => setFormData({ ...formData, idDocument: e.target.value })}
                className="w-full h-11 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface">Teléfono / WhatsApp *</label>
              <input
                type="tel"
                required
                placeholder="809-555-0100 / +34 600..."
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full h-11 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface">Correo Electrónico</label>
              <input
                type="email"
                placeholder="paciente@correo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-11 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface">Fecha de Nacimiento</label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full h-11 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface">Dirección Residencial</label>
              <input
                type="text"
                placeholder="Calle, No., Sector o Ciudad"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full h-11 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Antecedentes Clínicos */}
        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider border-b border-surface-container-high pb-2">
            2. Anamnesis Médica y Alertas Odontológicas
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-rose-800 flex items-center gap-1">
                <AlertTriangle size={14} />
                <span>Alergias Conocidas (Medicamentos, Látex, Anestesia)</span>
              </label>
              <input
                type="text"
                placeholder="Ej. Alergia a Penicilina, Amoxicilina o Ninguna"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                className="w-full h-11 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface flex items-center gap-1">
                <Shield size={14} />
                <span>Aseguradora / ARS</span>
              </label>
              <select
                value={formData.insuranceProvider}
                onChange={(e) => setFormData({ ...formData, insuranceProvider: e.target.value })}
                className="w-full h-11 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Ninguno (Privado)">Ninguno (Atención Privada)</option>
                <option value="ARS Senasa">ARS Senasa</option>
                <option value="Primera ARS de Humano">Primera ARS de Humano</option>
                <option value="Mapfre Salud ARS">Mapfre Salud ARS</option>
                <option value="ARS Monumental">ARS Monumental</option>
                <option value="Sanitas / DKV / Adeslas">Sanitas / Adeslas (Internacional)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface">Antecedentes Médicos Relevantes</label>
            <textarea
              rows={2}
              placeholder="Hipertensión, diabetes, problemas de coagulación, marcapasos o tratamientos activos..."
              value={formData.medicalHistory}
              onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
              className="w-full p-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <Link
            href="/dashboard/patients"
            className="px-4 py-2.5 rounded-xl border border-surface-container-high text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-primary text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:bg-primary-container transition-all flex items-center gap-2"
          >
            <User size={16} />
            <span>{isSubmitting ? "Registrando..." : "Crear Expediente y Guardar"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

