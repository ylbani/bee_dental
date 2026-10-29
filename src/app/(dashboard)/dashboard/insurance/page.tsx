"use client";

import React, { useState } from "react";
import { Shield, Plus, CheckCircle, AlertCircle, X, ExternalLink, FileCheck } from "lucide-react";

interface InsuranceProvider {
  name: string;
  code: string;
  rnc: string;
  claimsCount: number;
  active: boolean;
  coveragePercent: number;
  contactPhone: string;
}

export default function InsurancePage() {
  const [providers, setProviders] = useState<InsuranceProvider[]>([
    {
      name: "ARS Senasa",
      code: "SENASA",
      rnc: "4-01-50001-2",
      claimsCount: 14,
      active: true,
      coveragePercent: 80,
      contactPhone: "809-701-3821",
    },
    {
      name: "Primera ARS de Humano",
      code: "PRIMERA",
      rnc: "1-01-88992-1",
      claimsCount: 8,
      active: true,
      coveragePercent: 75,
      contactPhone: "809-200-2777",
    },
    {
      name: "Mapfre Salud ARS",
      code: "MAPFRE",
      rnc: "1-01-55443-4",
      claimsCount: 5,
      active: true,
      coveragePercent: 70,
      contactPhone: "809-582-4111",
    },
    {
      name: "ARS Monumental",
      code: "MONUMENTAL",
      rnc: "1-02-33441-5",
      claimsCount: 2,
      active: false,
      coveragePercent: 65,
      contactPhone: "809-583-1122",
    },
  ]);

  const [selectedProvider, setSelectedProvider] = useState<InsuranceProvider | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProvider, setNewProvider] = useState({
    name: "",
    code: "",
    rnc: "",
    coveragePercent: 80,
    contactPhone: "",
  });

  const handleCreateProvider = (e: React.FormEvent) => {
    e.preventDefault();
    setProviders([
      ...providers,
      {
        name: newProvider.name,
        code: newProvider.code.toUpperCase(),
        rnc: newProvider.rnc,
        claimsCount: 0,
        active: true,
        coveragePercent: Number(newProvider.coveragePercent),
        contactPhone: newProvider.contactPhone,
      },
    ]);
    setShowAddModal(false);
    setNewProvider({ name: "", code: "", rnc: "", coveragePercent: 80, contactPhone: "" });
  };

  const toggleStatus = (code: string) => {
    setProviders(
      providers.map((p) => (p.code === code ? { ...p, active: !p.active } : p))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">
            Seguros Médicos y ARS
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Gestión de aseguradoras dominicanas, contratos, copagos y reclamaciones clínicas
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:bg-primary-container transition-all"
        >
          <Plus size={16} />
          <span>Registrar Aseguradora</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {providers.map((p) => (
          <div
            key={p.code}
            className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high/80 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-primary">{p.code}</span>
                <button
                  onClick={() => toggleStatus(p.code)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                    p.active ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"
                  }`}
                  title="Clic para cambiar estado"
                >
                  {p.active ? "Activa" : "Inactiva"}
                </button>
              </div>
              <h3 className="font-display font-bold text-base text-on-surface">{p.name}</h3>
              <p className="text-xs text-on-surface-variant mt-1">RNC: {p.rnc}</p>
              <p className="text-xs text-on-surface-variant">Cobertura estándar: <strong>{p.coveragePercent}%</strong></p>
            </div>
            <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">{p.claimsCount} reclamaciones</span>
              <button
                onClick={() => setSelectedProvider(p)}
                className="text-primary font-bold hover:underline"
              >
                Ver Planes
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Plan Details Modal */}
      {selectedProvider && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <div>
                <h3 className="font-display font-bold text-lg text-on-surface">{selectedProvider.name}</h3>
                <p className="text-xs text-on-surface-variant">Código: {selectedProvider.code} • RNC: {selectedProvider.rnc}</p>
              </div>
              <button onClick={() => setSelectedProvider(null)} className="text-on-surface-variant">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-surface-container-low p-3 rounded-xl space-y-1">
                <p><strong>Teléfono Autorizaciones:</strong> {selectedProvider.contactPhone}</p>
                <p><strong>Porcentaje Cobertura Estándar:</strong> {selectedProvider.coveragePercent}%</p>
                <p><strong>Reclamaciones Procesadas:</strong> {selectedProvider.claimsCount} este mes</p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-on-surface">Servicios Odontológicos Cubiertos:</p>
                <ul className="list-disc pl-4 space-y-1 text-on-surface-variant">
                  <li>Limpieza ultrasónica y profilaxis semestral (100% cubierto)</li>
                  <li>Radiografías periapicales y panorámicas diagnósticas (80%)</li>
                  <li>Operatoria dental y restauraciones resina (80%)</li>
                  <li>Exodoncias simples y de urgencia (75%)</li>
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedProvider(null)}
                className="px-4 py-2 rounded-xl bg-surface-container text-xs font-bold text-on-surface-variant hover:bg-surface-container-high"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add ARS Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <h3 className="font-display font-bold text-lg text-on-surface">Registrar Nueva ARS</h3>
              <button onClick={() => setShowAddModal(false)} className="text-on-surface-variant">✕</button>
            </div>

            <form onSubmit={handleCreateProvider} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Nombre de la ARS / Aseguradora *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. ARS Futuro"
                  value={newProvider.name}
                  onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })}
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Código Único *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. FUTURO"
                    value={newProvider.code}
                    onChange={(e) => setNewProvider({ ...newProvider, code: e.target.value })}
                    className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs border border-surface-container-high"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">RNC *</label>
                  <input
                    type="text"
                    required
                    placeholder="1-01-XXXXX-X"
                    value={newProvider.rnc}
                    onChange={(e) => setNewProvider({ ...newProvider, rnc: e.target.value })}
                    className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs border border-surface-container-high"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Cobertura (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={newProvider.coveragePercent}
                    onChange={(e) => setNewProvider({ ...newProvider, coveragePercent: Number(e.target.value) })}
                    className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs border border-surface-container-high"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Teléfono</label>
                  <input
                    type="tel"
                    placeholder="809-555-0000"
                    value={newProvider.contactPhone}
                    onChange={(e) => setNewProvider({ ...newProvider, contactPhone: e.target.value })}
                    className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs border border-surface-container-high"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-surface-container-high text-xs font-bold text-on-surface-variant hover:bg-surface-container"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:bg-primary-container"
                >
                  Guardar Aseguradora
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
