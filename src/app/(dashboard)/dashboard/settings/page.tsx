"use client";

import React, { useState } from "react";
import { Settings, Shield, Key, Building2, Clock, Check, Copy } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "operational" | "insurance" | "integrations">("general");
  const [insuranceEnabled, setInsuranceEnabled] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const apiKeySample = "bee_live_8496323258_9f7a8b3c2d1e0f4a";

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKeySample);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">
          Configuración de la Clínica Dental
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
          Parámetros operativos, moneda dominicana (DOP), módulo de seguros y credenciales de API
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-surface-container-high overflow-x-auto gap-4 text-xs sm:text-sm font-bold">
        {[
          { id: "general", label: "Datos Generales", icon: Building2 },
          { id: "operational", label: "Horarios y Agenda", icon: Clock },
          { id: "insurance", label: "Seguros Médicos (ARS)", icon: Shield },
          { id: "integrations", label: "API & WhatsApp", icon: Key },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-3 border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Datos Generales */}
      {activeTab === "general" && (
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high/80 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface">Nombre Comercial</label>
              <input
                type="text"
                defaultValue="Bee Dental"
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface">Razón Social</label>
              <input
                type="text"
                defaultValue="Bee Dental Dominicana S.R.L."
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface">RNC (Identificación Fiscal)</label>
              <input
                type="text"
                defaultValue="1-32-45678-9"
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface">Teléfono / WhatsApp</label>
              <input
                type="text"
                defaultValue="849-632-3258"
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high"
              />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-on-surface">Dirección Clínica</label>
              <input
                type="text"
                defaultValue="Plaza Balón Ave, Av. Charles de Gaulle 10, Santo Domingo 11404"
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface">Moneda Principal</label>
              <input
                type="text"
                disabled
                defaultValue="Peso Dominicano (DOP - RD$)"
                className="w-full h-10 px-3 bg-surface-container rounded-xl text-xs sm:text-sm border border-surface-container-high text-on-surface-variant"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface">Zona Horaria Oficial</label>
              <input
                type="text"
                disabled
                defaultValue="America/Santo_Domingo (GMT-4)"
                className="w-full h-10 px-3 bg-surface-container rounded-xl text-xs sm:text-sm border border-surface-container-high text-on-surface-variant"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Operacional */}
      {activeTab === "operational" && (
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high/80 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface">Lunes a Viernes</label>
              <input
                type="text"
                defaultValue="08:30 a 20:30 (Ininterrumpido)"
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface">Sábados de Guardia</label>
              <input
                type="text"
                defaultValue="09:00 a 14:00"
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface">Duración Base por Cita</label>
              <input
                type="text"
                defaultValue="30 minutos"
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface">Tiempo de Preparación y Esterilización</label>
              <input
                type="text"
                defaultValue="10 minutos entre pacientes"
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Seguros Médicos (Opcional según sección 12) */}
      {activeTab === "insurance" && (
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-surface-container-high">
            <div>
              <h3 className="font-bold text-sm text-on-surface">Módulo de Seguros Médicos (ARS)</h3>
              <p className="text-xs text-on-surface-variant">
                Habilita la gestión de aseguradoras, planes de cobertura, copagos y reclamaciones.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={insuranceEnabled}
                onChange={(e) => setInsuranceEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {insuranceEnabled ? (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-on-surface block">Aseguradoras Registradas:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {["ARS Senasa", "Primera ARS de Humano", "Mapfre Salud ARS"].map((ars) => (
                  <div key={ars} className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high text-xs font-bold text-on-surface flex items-center justify-between">
                    <span>{ars}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Activa</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
              El módulo de seguros se encuentra <strong>deshabilitado</strong>. La clínica opera en modalidad de pacientes particulares y pagos directos en DOP sin campos de seguro obligatorios.
            </div>
          )}
        </div>
      )}

      {/* Tab 4: API & WhatsApp Integrations */}
      {activeTab === "integrations" && (
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high/80 shadow-sm space-y-5">
          <div>
            <h3 className="font-bold text-sm text-on-surface">API REST v1 para Web y Agente de WhatsApp</h3>
            <p className="text-xs text-on-surface-variant">
              Utiliza esta clave de integración en tu bot conversacional o servicio intermediario para consultar disponibilidad y registrar citas.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface">API Key de Integración (Server-side)</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={apiKeySample}
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs font-mono border border-surface-container-high text-on-surface"
              />
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 h-10 rounded-xl bg-surface-container text-xs font-bold text-primary hover:bg-surface-container-high flex items-center gap-1.5 transition-colors"
              >
                {copiedKey ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiedKey ? "Copiada" : "Copiar"}</span>
              </button>
            </div>
            <p className="text-[11px] text-on-surface-variant">
              Seguridad: Nunca expongas esta clave en el cliente ni en JavaScript público.
            </p>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex items-center justify-between pt-2">
        {savedSuccess && (
          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
            <Check size={16} /> Parámetros guardados exitosamente
          </span>
        )}
        <div className="ml-auto">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-primary text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:bg-primary-container transition-all"
          >
            Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  );
}

