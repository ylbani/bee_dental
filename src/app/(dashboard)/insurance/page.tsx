"use client";

import React from "react";
import { Shield, Plus, CheckCircle, AlertCircle } from "lucide-react";

export default function InsurancePage() {
  const providers = [
    { name: "ARS Senasa", code: "SENASA", rnc: "4-01-50001-2", claimsCount: 14, active: true },
    { name: "Primera ARS de Humano", code: "PRIMERA", rnc: "1-01-88992-1", claimsCount: 8, active: true },
    { name: "Mapfre Salud ARS", code: "MAPFRE", rnc: "1-01-55443-4", claimsCount: 5, active: true },
    { name: "ARS Monumental", code: "MONUMENTAL", rnc: "1-02-33441-5", claimsCount: 2, active: false },
  ];

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

        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:bg-primary-container transition-all">
          <Plus size={16} />
          <span>Registrar Aseguradora</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {providers.map((p) => (
          <div key={p.code} className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-primary">{p.code}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.active ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"}`}>
                  {p.active ? "Activa" : "Inactiva"}
                </span>
              </div>
              <h3 className="font-display font-bold text-base text-on-surface">{p.name}</h3>
              <p className="text-xs text-on-surface-variant mt-1">RNC: {p.rnc}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">{p.claimsCount} reclamaciones</span>
              <button className="text-primary font-bold hover:underline">Ver Planes</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

