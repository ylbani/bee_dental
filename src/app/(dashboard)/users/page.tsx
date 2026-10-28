"use client";

import React from "react";
import { UserCog, Plus, Shield, User } from "lucide-react";

export default function UsersPage() {
  const staff = [
    { name: "Dr. Michael Chen", email: "m.chen@beedental.es", role: "Administrador / Director Médico", status: "Activo" },
    { name: "Dra. Elena Ruiz", email: "e.ruiz@beedental.es", role: "Odontóloga Especialista", status: "Activo" },
    { name: "Dr. Carlos Morales", email: "c.morales@beedental.es", role: "Odontólogo Estética", status: "Activo" },
    { name: "Lic. Ana Henríquez", email: "recepcion@beedental.es", role: "Recepcionista y Agendamiento", status: "Activo" },
    { name: "Marcos Tavares", email: "caja@beedental.es", role: "Caja y Facturación", status: "Activo" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">
            Usuarios, Roles y Permisos
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Control de acceso basado en roles (RBAC) para el personal clínico y administrativo
          </p>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:bg-primary-container transition-all">
          <Plus size={16} />
          <span>Invitar Usuario</span>
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-surface-container-high bg-surface-container-low/50 text-on-surface-variant font-bold text-xs">
                <th className="py-3 px-4">Usuario</th>
                <th className="py-3 px-4">Correo Electrónico</th>
                <th className="py-3 px-4">Rol Asignado</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {staff.map((u) => (
                <tr key={u.email} className="hover:bg-surface-container-low/40">
                  <td className="py-3.5 px-4 font-bold text-on-surface flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-primary text-xs">
                      {u.name.split(" ")[1]?.substring(0, 1) || "U"}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant">{u.email}</td>
                  <td className="py-3.5 px-4 font-semibold text-primary">{u.role}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="text-xs font-bold text-primary hover:underline">
                      Editar Permisos
                    </button>
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

