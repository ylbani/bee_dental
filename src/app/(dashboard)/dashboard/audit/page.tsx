"use client";

import React, { useState } from "react";
import { History, ShieldCheck, Lock, Trash2 } from "lucide-react";

export default function AuditPage() {
  const [logs, setLogs] = useState([
    {
      id: "aud-1",
      action: "SYSTEM_INITIALIZED",
      entity: "Plataforma Bee Dental",
      user: "Dra. Leticia Bueno",
      details: "Inicialización de base clínica, configuración de moneda DOP y agenda",
      time: "28/10/2026 21:00:00",
      ip: "190.166.42.18",
    },
    {
      id: "aud-2",
      action: "WHATSAPP_CONFIGURED",
      entity: "Canal de WhatsApp",
      user: "Dra. Leticia Bueno",
      details: "Actualización de credenciales y enlace del canal oficial de mensajería",
      time: "28/10/2026 21:15:00",
      ip: "190.166.42.18",
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-on-surface flex items-center gap-2">
            <Lock size={24} className="text-primary" />
            <span>Registro Inmutable de Auditoría</span>
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Trazabilidad criptográfica de accesos, modificaciones clínicas y operaciones financieras
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">
          <ShieldCheck size={16} />
          <span>Políticas RLS y Logs Protegidos</span>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-surface-container-high bg-surface-container-low/50 text-on-surface-variant font-bold text-xs">
                <th className="py-3 px-4">Acción</th>
                <th className="py-3 px-4">Entidad Afectada</th>
                <th className="py-3 px-4">Usuario Responsable</th>
                <th className="py-3 px-4">Detalle del Registro</th>
                <th className="py-3 px-4">Dirección IP</th>
                <th className="py-3 px-4 text-right">Fecha y Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-container-low/40">
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs font-bold text-primary bg-primary-fixed/30 px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-on-surface">{log.entity}</td>
                  <td className="py-3 px-4 text-on-surface-variant font-medium">{log.user}</td>
                  <td className="py-3 px-4 text-on-surface-variant max-w-xs truncate">{log.details}</td>
                  <td className="py-3 px-4 font-mono text-xs text-on-surface-variant/70">{log.ip}</td>
                  <td className="py-3 px-4 text-right text-xs text-on-surface-variant font-mono whitespace-nowrap">
                    {log.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
