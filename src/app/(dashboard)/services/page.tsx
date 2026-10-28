"use client";

import React, { useState } from "react";
import { Stethoscope, Plus, Search, Tag, Clock, DollarSign, Check, X } from "lucide-react";

interface ServiceItem {
  id: string;
  code: string;
  name: string;
  category: string;
  basePriceDop: number;
  durationMinutes: number;
  isActive: boolean;
  requiresAppt: boolean;
}

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [services, setServices] = useState<ServiceItem[]>([
    {
      id: "s-1",
      code: "EST-01",
      name: "Diseño de Sonrisa Digital (DSD)",
      category: "Estética Dental",
      basePriceDop: 15000,
      durationMinutes: 45,
      isActive: true,
      requiresAppt: true,
    },
    {
      id: "s-2",
      code: "ORT-01",
      name: "Ortodoncia Invisible (Alineadores)",
      category: "Ortodoncia",
      basePriceDop: 65000,
      durationMinutes: 30,
      isActive: true,
      requiresAppt: true,
    },
    {
      id: "s-3",
      code: "CIR-01",
      name: "Implantología Guiada en 24h",
      category: "Cirugía e Implantes",
      basePriceDop: 45000,
      durationMinutes: 60,
      isActive: true,
      requiresAppt: true,
    },
    {
      id: "s-4",
      code: "PRE-01",
      name: "Odontología Restauradora & Profilaxis",
      category: "Prevención & Limpieza",
      basePriceDop: 3500,
      durationMinutes: 30,
      isActive: true,
      requiresAppt: true,
    },
    {
      id: "s-5",
      code: "URG-01",
      name: "Consulta de Urgencia & Alivio de Dolor",
      category: "Urgencias",
      basePriceDop: 2500,
      durationMinutes: 30,
      isActive: true,
      requiresAppt: false,
    },
    {
      id: "s-6",
      code: "PED-01",
      name: "Odontopediatría & Ortopedia Funcional",
      category: "Pediatría",
      basePriceDop: 3000,
      durationMinutes: 30,
      isActive: true,
      requiresAppt: true,
    },
  ]);

  const [newService, setNewService] = useState({
    code: "",
    name: "",
    category: "Estética Dental",
    basePriceDop: 0,
    durationMinutes: 30,
  });

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ServiceItem = {
      id: `s-${Date.now()}`,
      code: newService.code.toUpperCase(),
      name: newService.name,
      category: newService.category,
      basePriceDop: Number(newService.basePriceDop),
      durationMinutes: Number(newService.durationMinutes),
      isActive: true,
      requiresAppt: true,
    };
    setServices([...services, created]);
    setShowAddModal(false);
    setNewService({ code: "", name: "", category: "Estética Dental", basePath: "", durationMinutes: 30 } as any);
  };

  const filtered = services.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">
            Catálogo de Servicios Odontológicos
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Tarifas oficiales en Pesos Dominicanos (DOP), duraciones y categorías clínicas
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:bg-primary-container transition-all"
        >
          <Plus size={16} />
          <span>Añadir Servicio Clínico</span>
        </button>
      </div>

      <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-high/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Buscar por código, nombre o especialidad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-surface-container-low rounded-xl text-xs sm:text-sm text-on-surface border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all"
          />
        </div>

        <span className="text-xs font-semibold text-on-surface-variant">
          {filtered.length} servicios registrados
        </span>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-surface-container-high bg-surface-container-low/50 text-on-surface-variant font-bold text-xs">
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Servicio Clínico</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Duración Estimada</th>
                <th className="py-3 px-4">Tarifa Base (DOP)</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-primary">{item.code}</td>
                  <td className="py-3.5 px-4 font-bold text-on-surface">{item.name}</td>
                  <td className="py-3.5 px-4 text-on-surface-variant">
                    <span className="px-2.5 py-1 rounded-full bg-surface-container text-xs font-semibold">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant font-medium">
                    {item.durationMinutes} minutos
                  </td>
                  <td className="py-3.5 px-4 font-bold text-on-surface">
                    RD$ {item.basePriceDop.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      Activo
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="text-xs font-bold text-primary hover:underline">
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <h3 className="font-display font-bold text-lg text-on-surface">Añadir Nuevo Servicio</h3>
              <button onClick={() => setShowAddModal(false)} className="text-on-surface-variant">✕</button>
            </div>
            <form onSubmit={handleCreateService} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Código Interno *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. ENDO-01"
                  value={newService.code}
                  onChange={(e) => setNewService({ ...newService, code: e.target.value })}
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Nombre del Servicio *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Tratamiento de Conducto Molar"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Tarifa Base (RD$) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="Ej. 8500"
                  value={newService.basePriceDop || ""}
                  onChange={(e) => setNewService({ ...newService, totalPrice: e.target.value, basePriceDop: Number(e.target.value) } as any)}
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Duración Estimada (Minutos) *</label>
                <input
                  type="number"
                  required
                  min="10"
                  step="5"
                  value={newService.durationMinutes}
                  onChange={(e) => setNewService({ ...newService, durationMinutes: Number(e.target.value) })}
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container-high">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-on-surface-variant"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:bg-primary-container"
                >
                  Guardar Servicio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

