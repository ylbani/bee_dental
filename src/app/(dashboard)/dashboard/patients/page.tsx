"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  FileText,
  Calendar,
  Filter,
  MoreVertical,
  X,
  CreditCard,
  Smile,
  AlertTriangle,
  HeartPulse,
  UserCheck,
  CheckCircle,
} from "lucide-react";

export interface PatientItem {
  id: string;
  recordNumber: string;
  name: string;
  idDocument: string;
  phone: string;
  email: string;
  lastVisit: string;
  balanceDop: number;
  status: "ACTIVO" | "INACTIVO";
  birthDate?: string;
  allergies?: string;
  medicalHistory?: string;
  insuranceProvider?: string;
  notes?: string;
}

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientItem | null>(null);

  const initialPatients: PatientItem[] = [
    {
      id: "p-1",
      recordNumber: "EXP-0142",
      name: "Laura Martínez Gómez",
      idDocument: "402-2345678-1",
      phone: "809-555-0192",
      email: "laura.m@ejemplo.com",
      lastVisit: "Hoy, 09:00",
      balanceDop: 0,
      status: "ACTIVO",
      birthDate: "1994-05-12",
      allergies: "Sin alergias conocidas a fármacos o anestésicos.",
      medicalHistory: "Tratamiento activo de Ortodoncia Invisible con alineadores transparentes. Salud periodontal óptima.",
      insuranceProvider: "ARS Senasa",
    },
    {
      id: "p-2",
      recordNumber: "EXP-0211",
      name: "Carlos Henríquez Peña",
      idDocument: "001-9876543-2",
      phone: "829-444-1234",
      email: "carlos.h@ejemplo.com",
      lastVisit: "Hoy, 10:00",
      balanceDop: 15000,
      status: "ACTIVO",
      birthDate: "1982-11-20",
      allergies: "Alergia confirmada a la Penicilina (usar Clindamicina o Azitromicina).",
      medicalHistory: "Implante oseointegrado en pieza 36. Cirugía guiada 3D.",
      insuranceProvider: "Primera ARS de Humano",
    },
    {
      id: "p-3",
      recordNumber: "EXP-0089",
      name: "Lucía Gómez Rosario",
      idDocument: "402-1122334-5",
      phone: "849-888-9900",
      email: "lucia.g@ejemplo.com",
      lastVisit: "Hoy, 11:30",
      balanceDop: 0,
      status: "ACTIVO",
      birthDate: "1990-03-18",
      allergies: "Ninguna reportada.",
      medicalHistory: "Carillas cerámicas E-Max en sector anterior (piezas 13 a 23). Diseño Digital de Sonrisa.",
      insuranceProvider: "Privado (Sin seguro)",
    },
    {
      id: "p-4",
      recordNumber: "EXP-0305",
      name: "Ramón Valdez Cruz",
      idDocument: "001-5566778-9",
      phone: "809-777-3322",
      email: "ramon.v@ejemplo.com",
      lastVisit: "15 Octubre 2026",
      balanceDop: 3500,
      status: "ACTIVO",
      birthDate: "1975-08-30",
      allergies: "Ninguna.",
      medicalHistory: "Profilaxis y remoción ultrasónica periódica cada 6 meses.",
      insuranceProvider: "Mapfre Salud ARS",
    },
    {
      id: "p-5",
      recordNumber: "EXP-0418",
      name: "Patricia Santana Morales",
      idDocument: "402-9988776-3",
      phone: "849-632-3258",
      email: "patricia.s@ejemplo.com",
      lastVisit: "Primera Visita",
      balanceDop: 0,
      status: "ACTIVO",
      birthDate: "1998-09-04",
      allergies: "Sensibilidad dental leve a estímulos fríos.",
      medicalHistory: "Evaluación inicial solicitada por canal WhatsApp para blanqueamiento dental.",
      insuranceProvider: "ARS Monumental",
    },
  ];

  const [patients, setPatients] = useState<PatientItem[]>(initialPatients);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bee_custom_patients");
      if (stored) {
        const parsed: PatientItem[] = JSON.parse(stored);
        setPatients([...parsed, ...initialPatients]);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const [newPatient, setNewPatient] = useState({
    firstName: "",
    lastName: "",
    idDocument: "",
    phone: "",
    email: "",
    address: "",
    allergies: "",
    medicalHistory: "",
    insuranceProvider: "Privado (Sin seguro)",
  });

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    const created: PatientItem = {
      id: `p-${Date.now()}`,
      recordNumber: `EXP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: `${newPatient.firstName} ${newPatient.lastName}`,
      idDocument: newPatient.idDocument || "Pendiente",
      phone: newPatient.phone,
      email: newPatient.email || "No registrada",
      lastVisit: "Sin consultas",
      balanceDop: 0,
      status: "ACTIVO",
      allergies: newPatient.allergies || "Sin alergias conocidas.",
      medicalHistory: newPatient.medicalHistory || "Apertura de ficha clínica.",
      insuranceProvider: newPatient.insuranceProvider,
    };

    const updated = [created, ...patients];
    setPatients(updated);

    try {
      const stored = JSON.parse(localStorage.getItem("bee_custom_patients") || "[]");
      localStorage.setItem("bee_custom_patients", JSON.stringify([created, ...stored]));
    } catch (err) {
      console.error(err);
    }

    setShowNewModal(false);
    setNewPatient({
      firstName: "",
      lastName: "",
      idDocument: "",
      phone: "",
      email: "",
      address: "",
      allergies: "",
      medicalHistory: "",
      insuranceProvider: "Privado (Sin seguro)",
    });
  };

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.recordNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.idDocument.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">
            Directorio y Fichas de Pacientes
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Registro unificado de expedientes, contactos, saldos y antecedentes médicos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/patients/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:bg-primary-container transition-all"
          >
            <Plus size={16} />
            <span>Nuevo Paciente</span>
          </Link>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-high/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Buscar por nombre, cédula, teléfono o expediente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">
            {filtered.length} paciente(s) registrado(s)
          </span>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-surface-container-high bg-surface-container-low/50 text-on-surface-variant font-bold text-xs">
                <th className="py-3 px-4">Expediente</th>
                <th className="py-3 px-4">Paciente</th>
                <th className="py-3 px-4">Documento / Cédula</th>
                <th className="py-3 px-4">Teléfono &amp; Correo</th>
                <th className="py-3 px-4">Última Visita</th>
                <th className="py-3 px-4">Saldo Pendiente</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filtered.map((pt) => (
                <tr key={pt.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-primary">{pt.recordNumber}</td>
                  <td className="py-3 px-4 font-bold text-on-surface">{pt.name}</td>
                  <td className="py-3 px-4 text-on-surface-variant">{pt.idDocument}</td>
                  <td className="py-3 px-4 text-on-surface-variant">
                    <div className="flex flex-col">
                      <span>{pt.phone}</span>
                      <span className="text-[11px] text-on-surface-variant/70">{pt.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant">{pt.lastVisit}</td>
                  <td className="py-3 px-4">
                    {pt.balanceDop > 0 ? (
                      <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded">
                        RD$ {pt.balanceDop.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-semibold">Al día</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedPatient(pt)}
                        className="px-3 py-1.5 rounded-lg bg-surface-container text-primary font-bold text-xs hover:bg-primary hover:text-white transition-colors"
                        title="Ver Ficha Clínica Completa"
                      >
                        Ver Ficha
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Detail Ficha Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl border border-surface-container-high max-w-2xl w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-surface-container-high">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary font-bold text-lg">
                  {selectedPatient.name.split(" ")[0]?.substring(0, 1)}
                  {selectedPatient.name.split(" ")[1]?.substring(0, 1)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display font-bold text-xl text-on-surface">
                      {selectedPatient.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {selectedPatient.status}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    Expediente: <span className="font-mono font-bold text-primary">{selectedPatient.recordNumber}</span> • Doc: {selectedPatient.idDocument}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="w-8 h-8 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick stats strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-surface-container-low rounded-xl">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase">Contacto</span>
                <p className="text-xs font-semibold text-on-surface mt-0.5">{selectedPatient.phone}</p>
                <p className="text-[11px] text-on-surface-variant truncate">{selectedPatient.email}</p>
              </div>
              <div className="p-3 bg-surface-container-low rounded-xl">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase">Aseguradora (ARS)</span>
                <p className="text-xs font-semibold text-primary mt-0.5">
                  {selectedPatient.insuranceProvider || "Atención Privada"}
                </p>
              </div>
              <div className="p-3 bg-surface-container-low rounded-xl">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase">Saldo en Cuenta</span>
                <p className="text-sm font-bold font-mono mt-0.5 text-on-surface">
                  {selectedPatient.balanceDop > 0 ? (
                    <span className="text-amber-800">RD$ {selectedPatient.balanceDop.toLocaleString("es-DO")}</span>
                  ) : (
                    <span className="text-emerald-700">RD$ 0.00 (Al día)</span>
                  )}
                </p>
              </div>
            </div>

            {/* Antecedentes y Alergias */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase text-on-surface-variant tracking-wider flex items-center gap-1.5">
                <HeartPulse size={15} className="text-primary" />
                <span>Historial Médico &amp; Alertas Odontológicas</span>
              </h3>

              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                <span className="text-xs font-bold text-rose-900 flex items-center gap-1">
                  <AlertTriangle size={14} />
                  <span>Alergias Clínicas Registradas:</span>
                </span>
                <p className="text-xs text-rose-800">
                  {selectedPatient.allergies || "Sin alergias conocidas a medicamentos o anestésicos."}
                </p>
              </div>

              <div className="p-3.5 bg-surface-container-low rounded-xl space-y-1">
                <span className="text-xs font-bold text-on-surface">Evolución y Antecedentes Clínicos:</span>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {selectedPatient.medicalHistory || "Paciente en seguimiento de rutina. Sin patologías sistémicas complejas."}
                </p>
              </div>
            </div>

            {/* Acciones Rápidas de la Ficha */}
            <div className="pt-2 border-t border-surface-container-high flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard/odontogram"
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-surface-container-high text-primary text-xs font-bold rounded-xl hover:bg-primary hover:text-white transition-colors"
                >
                  <Smile size={15} />
                  <span>Ver Odontograma</span>
                </Link>
                <Link
                  href="/dashboard/appointments/new"
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-container transition-colors shadow-sm"
                >
                  <Calendar size={15} />
                  <span>Nueva Cita</span>
                </Link>
              </div>

              <div className="flex items-center gap-2">
                {selectedPatient.balanceDop > 0 && (
                  <Link
                    href="/dashboard/billing/new"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-100 text-amber-900 text-xs font-bold rounded-xl hover:bg-amber-200 transition-colors"
                  >
                    <CreditCard size={15} />
                    <span>Cobrar Saldo</span>
                  </Link>
                )}
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="px-4 py-2 rounded-xl bg-surface-container text-xs font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Patient Quick Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <h3 className="font-display font-bold text-lg text-on-surface">
                Registrar Nuevo Paciente
              </h3>
              <button onClick={() => setShowNewModal(false)} className="text-on-surface-variant hover:text-on-surface">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Nombres *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. María"
                    value={newPatient.firstName}
                    onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })}
                    className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Apellidos *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Santos"
                    value={newPatient.lastName}
                    onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
                    className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">DNI / Cédula</label>
                  <input
                    type="text"
                    placeholder="402-XXXXXXX-X"
                    value={newPatient.idDocument}
                    onChange={(e) => setNewPatient({ ...newPatient, idDocument: e.target.value })}
                    className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Teléfono *</label>
                  <input
                    type="tel"
                    required
                    placeholder="809-555-0199"
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                    className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="paciente@ejemplo.com"
                  value={newPatient.email}
                  onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl border border-surface-container-high text-xs font-bold text-on-surface-variant hover:bg-surface-container"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:bg-primary-container"
                >
                  Guardar Paciente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
