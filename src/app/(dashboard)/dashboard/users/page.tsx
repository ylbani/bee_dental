"use client";

import React, { useState } from "react";
import { UserCog, Plus, Shield, User, X, Check, Mail, Lock } from "lucide-react";

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Activo" | "Inactivo";
}

export default function UsersPage() {
  const [staff, setStaff] = useState<StaffUser[]>([
    {
      id: "u-1",
      name: "Dra. Leticia Bueno",
      email: "l.bueno@beedental.es",
      role: "Administradora / Directora Médica",
      status: "Activo",
    },
  ]);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingUser, setEditingUser] = useState<StaffUser | null>(null);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Odontólogo Especialista",
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setStaff([
      ...staff,
      {
        id: `u-${Date.now()}`,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: "Activo",
      },
    ]);
    setShowInviteModal(false);
    setNewUser({ name: "", email: "", role: "Odontólogo Especialista" });
  };

  const handleSavePermissions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setStaff(staff.map((u) => (u.id === editingUser.id ? editingUser : u)));
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">
            Equipo, Roles y Permisos Clínicos
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Personal médico autorizado bajo la dirección de la Dra. Leticia Bueno
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:bg-primary-container transition-all"
        >
          <Plus size={16} />
          <span>Invitar Colaborador</span>
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
                <tr key={u.id} className="hover:bg-surface-container-low/40">
                  <td className="py-3.5 px-4 font-bold text-on-surface flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-primary text-xs">
                      LB
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
                    <button
                      onClick={() => setEditingUser(u)}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Editar Permisos
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <h3 className="font-display font-bold text-lg text-on-surface">Invitar Miembro del Equipo</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-on-surface-variant">✕</button>
            </div>
            <form onSubmit={handleInvite} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Dr. Alejandro Soto"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  placeholder="colaborador@beedental.es"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Rol y Nivel de Acceso</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high"
                >
                  <option value="Odontólogo Especialista">Odontólogo Especialista</option>
                  <option value="Higienista / Asistente Dental">Higienista / Asistente Dental</option>
                  <option value="Recepcionista y Agendamiento">Recepcionista y Agendamiento</option>
                  <option value="Caja y Facturación">Caja y Facturación</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl border border-surface-container-high text-xs font-bold text-on-surface-variant hover:bg-surface-container"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:bg-primary-container"
                >
                  Enviar Invitación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Permissions Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <h3 className="font-display font-bold text-lg text-on-surface">Editar Permisos</h3>
              <button onClick={() => setEditingUser(null)} className="text-on-surface-variant">✕</button>
            </div>
            <form onSubmit={handleSavePermissions} className="space-y-3">
              <div className="bg-surface-container-low p-3 rounded-xl text-xs">
                <p><strong>Usuario:</strong> {editingUser.name}</p>
                <p><strong>Email:</strong> {editingUser.email}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Rol Clínico / Administrativo</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high"
                >
                  <option value="Administradora / Directora Médica">Administradora / Directora Médica</option>
                  <option value="Odontóloga Especialista">Odontóloga Especialista</option>
                  <option value="Recepcionista y Agendamiento">Recepcionista y Agendamiento</option>
                  <option value="Caja y Facturación">Caja y Facturación</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl border border-surface-container-high text-xs font-bold text-on-surface-variant hover:bg-surface-container"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:bg-primary-container"
                >
                  Actualizar Permisos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
