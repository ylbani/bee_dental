"use client";

import React, { useState } from "react";
import { Users, Search, Plus, Phone, Mail, FileText, Calendar, Filter, MoreVertical } from "lucide-react";

interface PatientItem {
  id: string;
  recordNumber: string;
  name: string;
  idDocument: string;
  phone: string;
  email: string;
  lastVisit: string;
  balanceDop: number;
  status: "ACTIVO" | "INACTIVO";
}

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);

  const [patients, setPatients] = useState<PatientItem[]>([
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
    },
  ]);

  const [newPatient, setNewPatient] = useState({
    firstName: "",
    lastName: "",
    idDocument: "",
    phone: "",
    email: "",
    address: "",
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
    };
    setPatients([created, ...patients]);
    setShowNewModal(false);
    setNewPatient({ firstName: "", lastName: "", idDocument: "", phone: "", email: "", address: "" });
  };

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.idDocument.includes(search) ||
      p.recordNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">
            Gestión de Pacientes
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Registro clínico de pacientes, expedientes médicos, balances y contactos
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:bg-primary-container transition-all"
        >
          <Plus size={16} />
          <span>Registrar Nuevo Paciente</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-high/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Buscar por nombre, cédula, expediente o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-surface-container-low rounded-xl text-xs sm:text-sm text-on-surface border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">
            {filtered.length} paciente(s)
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
                <th className="py-3 px-4">Teléfono & Correo</th>
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
                        className="px-2.5 py-1 rounded-lg bg-surface-container text-primary font-bold text-xs hover:bg-primary hover:text-white transition-colors"
                        title="Ver Ficha Clínica"
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

      {/* New Patient Modal */}
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
                  <label className="text-xs font-bold text-on-surface">Cédula / Documento</label>
                  <input
                    type="text"
                    placeholder="001-0000000-0"
                    value={newPatient.idDocument}
                    onChange={(e) => setNewPatient({ ...newPatient, idDocument: e.target.value })}
                    className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="849-632-3258"
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

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Dirección Residencial</label>
                <input
                  type="text"
                  placeholder="Ej. Ensanche Ozama, Santo Domingo Este"
                  value={newPatient.address}
                  onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container-high">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:bg-primary-container transition-all"
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

