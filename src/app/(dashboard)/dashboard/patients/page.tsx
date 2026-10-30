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
  Trash2,
} from "lucide-react";
import ClinicalHistoryForm from "@/components/clinical/clinical-history-form";

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
  const [historyModalPatient, setHistoryModalPatient] = useState<PatientItem | null>(null);
  const [patients, setPatients] = useState<PatientItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bee_custom_patients");
      if (stored) {
        setPatients(JSON.parse(stored));
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
      lastVisit: "Primera Visita",
      balanceDop: 0,
      status: "ACTIVO",
      allergies: newPatient.allergies || "Sin alergias conocidas.",
      medicalHistory: newPatient.medicalHistory || "Apertura de ficha clínica.",
      insuranceProvider: newPatient.insuranceProvider,
    };

    const updated = [created, ...patients];
    setPatients(updated);

    try {
      localStorage.setItem("bee_custom_patients", JSON.stringify(updated));
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

  const handleClearAllPatients = () => {
    if (confirm("¿Estás seguro de que deseas vaciar todos los pacientes y datos de prueba?")) {
      setPatients([]);
      try {
        localStorage.removeItem("bee_custom_patients");
      } catch (e) {
        console.error(e);
      }
    }
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
          {patients.length > 0 && (
            <button
              onClick={handleClearAllPatients}
              className="px-3 py-2 rounded-xl border border-surface-container-high text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
              title="Limpiar pacientes de prueba"
            >
              <Trash2 size={14} />
              <span>Limpiar Datos</span>
            </button>
          )}

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
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary-fixed/30 text-primary flex items-center justify-center mx-auto">
              <Users size={32} />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-on-surface">Base de Pacientes Limpia</h3>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto mt-1">
                No hay pacientes de prueba registrados. Registra tu primer paciente real para aperturar su expediente clínico.
              </p>
            </div>
            <Link
              href="/dashboard/patients/new"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:bg-primary-container"
            >
              <Plus size={16} />
              <span>Crear Primer Expediente</span>
            </Link>
          </div>
        ) : (
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
                          onClick={() => setHistoryModalPatient(pt)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs hover:bg-emerald-100 transition-colors flex items-center gap-1"
                          title="Abrir Anamnesis e Historia Clínica"
                        >
                          <HeartPulse size={13} />
                          <span>Historia</span>
                        </button>
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
        )}
      </div>

      {/* Patient Detail Ficha Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl border border-surface-container-high max-w-2xl w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
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
                <button
                  onClick={() => {
                    setHistoryModalPatient(selectedPatient);
                    setSelectedPatient(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  <HeartPulse size={15} />
                  <span>Historia Clínica Completa</span>
                </button>
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

      {/* Full Clinical History Modal */}
      {historyModalPatient && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-4xl my-auto animate-in fade-in zoom-in-95">
            <button
              onClick={() => setHistoryModalPatient(null)}
              className="absolute -top-3 -right-3 z-50 w-9 h-9 rounded-full bg-white shadow-lg border border-surface-container-high text-on-surface-variant hover:text-on-surface flex items-center justify-center"
            >
              <X size={18} />
            </button>
            <ClinicalHistoryForm
              patientId={historyModalPatient.id}
              patientName={historyModalPatient.name}
              recordNumber={historyModalPatient.recordNumber}
              onSave={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
}
