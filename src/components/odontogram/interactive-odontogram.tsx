"use client";

import React, { useState } from "react";
import { Smile, Plus, Trash2, Printer, Check, Info } from "lucide-react";

export type ConditionType =
  | "HEALTHY"
  | "CARIES"
  | "RESTORATION"
  | "ENDODONTIC"
  | "CROWN"
  | "IMPLANT"
  | "ABSENT"
  | "FRACTURE"
  | "SEALANT";

export type SurfaceName = "OCCLUSAL" | "MESIAL" | "DISTAL" | "VESTIBULAR" | "PALATAL";

export interface ToothCondition {
  id: string;
  toothNumber: number;
  condition: ConditionType;
  surfaces: SurfaceName[];
  status: "PLANNED" | "COMPLETED";
  notes?: string;
  date: string;
}

// FDI Notation Quadrants
const PERMANENT_TEETH = {
  upperRight: [18, 17, 16, 15, 14, 13, 12, 11],
  upperLeft: [21, 22, 23, 24, 25, 26, 27, 28],
  lowerRight: [48, 47, 46, 45, 44, 43, 42, 41],
  lowerLeft: [31, 32, 33, 34, 35, 36, 37, 38],
};

const TEMPORARY_TEETH = {
  upperRight: [55, 54, 53, 52, 51],
  upperLeft: [61, 62, 63, 64, 65],
  lowerRight: [85, 84, 83, 82, 81],
  lowerLeft: [71, 72, 73, 74, 75],
};

const CONDITION_COLORS: Record<ConditionType, { fill: string; label: string }> = {
  HEALTHY: { fill: "#ffffff", label: "Sano" },
  CARIES: { fill: "#ef4444", label: "Caries (Rojo)" },
  RESTORATION: { fill: "#3b82f6", label: "Restauración (Azul)" },
  ENDODONTIC: { fill: "#a855f7", label: "Endodoncia (Morado)" },
  CROWN: { fill: "#f59e0b", label: "Corona (Ámbar)" },
  IMPLANT: { fill: "#0d9488", label: "Implante (Teal)" },
  ABSENT: { fill: "#9ca3af", label: "Ausente (Gris)" },
  FRACTURE: { fill: "#dc2626", label: "Fractura" },
  SEALANT: { fill: "#10b981", label: "Sellante (Verde)" },
};

export function InteractiveOdontogram() {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [dentitionType, setDentitionType] = useState<"permanent" | "temporary">("permanent");
  const [selectedSurfaces, setSelectedSurfaces] = useState<SurfaceName[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<ConditionType>("CARIES");
  const [selectedStatus, setSelectedStatus] = useState<"PLANNED" | "COMPLETED">("PLANNED");
  const [notes, setNotes] = useState("");

  // Stored conditions list
  const [conditions, setConditions] = useState<ToothCondition[]>([
    {
      id: "c-1",
      toothNumber: 16,
      condition: "RESTORATION",
      surfaces: ["OCCLUSAL", "MESIAL"],
      status: "COMPLETED",
      notes: "Resina compuesta colocada en 2024",
      date: "2024-11-12",
    },
    {
      id: "c-2",
      toothNumber: 21,
      condition: "CARIES",
      surfaces: ["DISTAL"],
      status: "PLANNED",
      notes: "Caries incipiente interproximal",
      date: "2025-01-15",
    },
    {
      id: "c-3",
      toothNumber: 36,
      condition: "IMPLANT",
      surfaces: [],
      status: "COMPLETED",
      notes: "Implante de titanio Straumann 4.1mm",
      date: "2024-08-20",
    },
  ]);

  const activeTeeth = dentitionType === "permanent" ? PERMANENT_TEETH : TEMPORARY_TEETH;

  const handleOpenToothModal = (toothNum: number) => {
    setSelectedTooth(toothNum);
    setSelectedSurfaces([]);
    setNotes("");
  };

  const handleToggleSurface = (surface: SurfaceName) => {
    setSelectedSurfaces((prev) =>
      prev.includes(surface) ? prev.filter((s) => s !== surface) : [...prev, surface]
    );
  };

  const handleSaveFinding = () => {
    if (!selectedTooth) return;

    const newFinding: ToothCondition = {
      id: `c-${Date.now()}`,
      toothNumber: selectedTooth,
      condition: selectedCondition,
      surfaces: selectedSurfaces,
      status: selectedStatus,
      notes,
      date: new Date().toISOString().split("T")[0],
    };

    setConditions([...conditions, newFinding]);
    setSelectedTooth(null);
  };

  const handleDeleteFinding = (id: string) => {
    setConditions(conditions.filter((c) => c.id !== id));
  };

  const getToothConditions = (toothNum: number) => {
    return conditions.filter((c) => c.toothNumber === toothNum);
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high/80 p-5 sm:p-6 shadow-sm space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-container-high">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-on-surface flex items-center gap-2">
            <Smile className="text-primary" size={24} />
            <span>Odontograma Gráfico FDI Interactivo</span>
          </h2>
          <p className="text-xs text-on-surface-variant">
            Sistema universal FDI • Registro por pieza dental y superficies anatómicas
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-surface-container-low rounded-xl border border-surface-container-high text-xs font-bold">
            <button
              onClick={() => setDentitionType("permanent")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                dentitionType === "permanent" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant"
              }`}
            >
              Permanente (Adulto)
            </button>
            <button
              onClick={() => setDentitionType("temporary")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                dentitionType === "temporary" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant"
              }`}
            >
              Temporal (Niño)
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl border border-surface-container-high hover:bg-surface-container text-on-surface-variant transition-colors"
            title="Imprimir Odontograma"
          >
            <Printer size={18} />
          </button>
        </div>
      </div>

      {/* Visual Condition Legend */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-surface-container-low/60 rounded-xl border border-surface-container-high/50 text-xs">
        <span className="font-bold text-on-surface-variant">Leyenda:</span>
        {Object.entries(CONDITION_COLORS).map(([key, value]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span
              className="w-3.5 h-3.5 rounded-sm border border-gray-300"
              style={{ backgroundColor: value.fill }}
            />
            <span className="text-on-surface font-medium">{value.label}</span>
          </div>
        ))}
      </div>

      {/* SVG Odontogram Arches */}
      <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-surface-container-low/30 rounded-2xl border border-surface-container-high/40 overflow-x-auto space-y-6">
        {/* Anatomical Orientation Guide */}
        <div className="w-full max-w-4xl flex items-center justify-between text-[11px] font-bold text-on-surface-variant uppercase tracking-wider px-2 border-b border-surface-container-high/60 pb-2">
          <span className="flex items-center gap-1 text-emerald-700">
            <span>◀ DERECHA DEL PACIENTE</span>
            <span className="text-[10px] lowercase text-on-surface-variant">(Lado vestibular derecho)</span>
          </span>
          <span className="text-primary font-mono bg-primary-fixed/40 px-2.5 py-0.5 rounded-full text-[10px]">
            LÍNEA MEDIA INTERINCISIVA
          </span>
          <span className="flex items-center gap-1 text-blue-700">
            <span className="text-[10px] lowercase text-on-surface-variant">(Lado vestibular izquierdo)</span>
            <span>IZQUIERDA DEL PACIENTE ▶</span>
          </span>
        </div>

        {/* Upper Arch (Maxilar Superior) */}
        <div className="text-center w-full max-w-4xl">
          <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-3">
            Arcada Superior (Maxilar)
          </span>

          <div className="flex items-start justify-center gap-2 sm:gap-4">
            {/* 1st Quadrant (Upper Right) */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md mb-2 border border-emerald-200">
                {dentitionType === "permanent" ? "1er Cuadrante (18 al 11)" : "5to Cuadrante (55 al 51)"}
              </span>
              <div className="flex gap-1 sm:gap-2">
                {activeTeeth.upperRight.map((tooth) => (
                  <ToothSVG
                    key={tooth}
                    toothNumber={tooth}
                    findings={getToothConditions(tooth)}
                    onClick={() => handleOpenToothModal(tooth)}
                  />
                ))}
              </div>
            </div>

            {/* Midline divider */}
            <div className="w-0.5 h-24 bg-primary/40 mx-0.5 sm:mx-1 rounded-full self-center" />

            {/* 2nd Quadrant (Upper Left) */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-md mb-2 border border-blue-200">
                {dentitionType === "permanent" ? "2do Cuadrante (21 al 28)" : "6to Cuadrante (61 al 65)"}
              </span>
              <div className="flex gap-1 sm:gap-2">
                {activeTeeth.upperLeft.map((tooth) => (
                  <ToothSVG
                    key={tooth}
                    toothNumber={tooth}
                    findings={getToothConditions(tooth)}
                    onClick={() => handleOpenToothModal(tooth)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Lower Arch (Mandíbula Inferior) */}
        <div className="text-center w-full max-w-4xl pt-2 border-t border-surface-container-high/40">
          <div className="flex items-start justify-center gap-2 sm:gap-4 mb-3">
            {/* 4th Quadrant (Lower Right) */}
            <div className="flex flex-col items-center">
              <div className="flex gap-1 sm:gap-2">
                {activeTeeth.lowerRight.map((tooth) => (
                  <ToothSVG
                    key={tooth}
                    toothNumber={tooth}
                    findings={getToothConditions(tooth)}
                    onClick={() => handleOpenToothModal(tooth)}
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md mt-2 border border-amber-200">
                {dentitionType === "permanent" ? "4to Cuadrante (48 al 41)" : "8vo Cuadrante (85 al 81)"}
              </span>
            </div>

            {/* Midline divider */}
            <div className="w-0.5 h-24 bg-primary/40 mx-0.5 sm:mx-1 rounded-full self-center" />

            {/* 3rd Quadrant (Lower Left) */}
            <div className="flex flex-col items-center">
              <div className="flex gap-1 sm:gap-2">
                {activeTeeth.lowerLeft.map((tooth) => (
                  <ToothSVG
                    key={tooth}
                    toothNumber={tooth}
                    findings={getToothConditions(tooth)}
                    onClick={() => handleOpenToothModal(tooth)}
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-md mt-2 border border-purple-200">
                {dentitionType === "permanent" ? "3er Cuadrante (31 al 38)" : "7mo Cuadrante (71 al 75)"}
              </span>
            </div>
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-primary block mt-1">
            Arcada Inferior (Mandíbula)
          </span>
        </div>
      </div>

      {/* Registered Findings Table */}
      <div className="space-y-3 pt-4 border-t border-surface-container-high">
        <h3 className="font-display font-bold text-base text-on-surface">
          Historial de Hallazgos y Tratamientos del Paciente
        </h3>

        {conditions.length === 0 ? (
          <div className="p-6 text-center text-on-surface-variant text-sm bg-surface-container-low rounded-xl">
            No hay hallazgos registrados. Haz clic en cualquier diente para registrar un diagnóstico o tratamiento.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-surface-container-high text-on-surface-variant font-bold text-xs">
                  <th className="pb-2">Diente FDI</th>
                  <th className="pb-2">Condición</th>
                  <th className="pb-2">Superficies</th>
                  <th className="pb-2">Estado</th>
                  <th className="pb-2">Observaciones</th>
                  <th className="pb-2">Fecha</th>
                  <th className="pb-2 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {conditions.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-low/50">
                    <td className="py-2.5 font-bold text-primary">#{item.toothNumber}</td>
                    <td className="py-2.5">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-on-surface">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: CONDITION_COLORS[item.condition].fill }}
                        />
                        {CONDITION_COLORS[item.condition].label}
                      </span>
                    </td>
                    <td className="py-2.5 text-on-surface-variant">
                      {item.surfaces.length > 0 ? item.surfaces.join(", ") : "Toda la pieza"}
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          item.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.status === "COMPLETED" ? "Realizado" : "Planificado"}
                      </span>
                    </td>
                    <td className="py-2.5 text-on-surface-variant">{item.notes || "—"}</td>
                    <td className="py-2.5 text-on-surface-variant whitespace-nowrap">{item.date}</td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => handleDeleteFinding(item.id)}
                        className="text-on-surface-variant hover:text-error transition-colors p-1"
                        title="Eliminar hallazgo"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Finding on Selected Tooth */}
      {selectedTooth && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">
                  #{selectedTooth}
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-on-surface">
                    Registro Clínico — Diente #{selectedTooth}
                  </h3>
                  <span className="text-xs text-on-surface-variant">Selecciona condición y superficies</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTooth(null)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                ✕
              </button>
            </div>

            {/* Condition Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface">Tipo de Condición / Tratamiento:</label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value as ConditionType)}
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm text-on-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="CARIES">Caries Dental</option>
                <option value="RESTORATION">Restauración / Obturación</option>
                <option value="ENDODONTIC">Tratamiento de Endodoncia</option>
                <option value="CROWN">Corona Cerámica / Funda</option>
                <option value="IMPLANT">Implante Dental de Titanio</option>
                <option value="ABSENT">Diente Ausente / Extraído</option>
                <option value="FRACTURE">Fractura Dental</option>
                <option value="SEALANT">Sellante de Fosas y Fisuras</option>
                <option value="HEALTHY">Pieza Sana</option>
              </select>
            </div>

            {/* Surfaces Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface">
                Superficies Afectadas (Opcional si aplica a todo el diente):
              </label>
              <div className="grid grid-cols-5 gap-2">
                {(
                  [
                    { id: "OCCLUSAL", label: "Oclusal" },
                    { id: "MESIAL", label: "Mesial" },
                    { id: "DISTAL", label: "Distal" },
                    { id: "VESTIBULAR", label: "Vestibular" },
                    { id: "PALATAL", label: "Ling/Pal" },
                  ] as { id: SurfaceName; label: string }[]
                ).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleToggleSurface(s.id)}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                      selectedSurfaces.includes(s.id)
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-surface-container-low text-on-surface border-surface-container-high hover:border-primary"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status (Planned vs Completed) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface">Estado del Procedimiento:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedStatus("PLANNED")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    selectedStatus === "PLANNED"
                      ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                      : "bg-surface-container-low text-on-surface border-surface-container-high"
                  }`}
                >
                  Planificado (Pendiente)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStatus("COMPLETED")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    selectedStatus === "COMPLETED"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "bg-surface-container-low text-on-surface border-surface-container-high"
                  }`}
                >
                  Realizado / Existente
                </button>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface">Observaciones Clínicas:</label>
              <input
                type="text"
                placeholder="Ej. Resina fotopolimerizable en mesio-oclusal..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm text-on-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container-high">
              <button
                type="button"
                onClick={() => setSelectedTooth(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveFinding}
                className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:bg-primary-container transition-all"
              >
                Guardar en Odontograma
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Interactive Vector Tooth SVG Component (Anatomical 5-surface breakdown)
// -----------------------------------------------------------------------------
interface ToothSVGProps {
  toothNumber: number;
  findings: ToothCondition[];
  onClick: () => void;
}

function ToothSVG({ toothNumber, findings, onClick }: ToothSVGProps) {
  const hasFinding = findings.length > 0;
  const mainCondition = hasFinding ? findings[findings.length - 1].condition : null;
  const isAbsent = mainCondition === "ABSENT";
  const isImplant = mainCondition === "IMPLANT";

  // Check if any surface has restoration or caries
  const getSurfaceColor = (surface: SurfaceName) => {
    const findingWithSurface = findings.find((f) => f.surfaces.includes(surface));
    if (findingWithSurface) {
      return CONDITION_COLORS[findingWithSurface.condition].fill;
    }
    return "#ffffff";
  };

  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center p-1.5 rounded-xl cursor-pointer transition-all border ${
        hasFinding
          ? "bg-primary-fixed/20 border-primary"
          : "bg-surface-container-lowest border-surface-container-high hover:border-primary hover:shadow-md"
      }`}
      title={`Diente #${toothNumber} - Clic para editar`}
    >
      <span className="text-[11px] font-bold text-on-surface mb-1">#{toothNumber}</span>

      <svg width="40" height="40" viewBox="0 0 100 100" className="drop-shadow-sm">
        {/* Outer Vestibular/Palatal surfaces */}
        {/* Top (Vestibular on upper, Palatal on lower) */}
        <polygon
          points="10,10 90,10 70,30 30,30"
          fill={getSurfaceColor("VESTIBULAR")}
          stroke="#475569"
          strokeWidth="3"
        />
        {/* Bottom */}
        <polygon
          points="30,70 70,70 90,90 10,90"
          fill={getSurfaceColor("PALATAL")}
          stroke="#475569"
          strokeWidth="3"
        />
        {/* Left (Mesial) */}
        <polygon
          points="10,10 30,30 30,70 10,90"
          fill={getSurfaceColor("MESIAL")}
          stroke="#475569"
          strokeWidth="3"
        />
        {/* Right (Distal) */}
        <polygon
          points="90,10 90,90 70,70 70,30"
          fill={getSurfaceColor("DISTAL")}
          stroke="#475569"
          strokeWidth="3"
        />
        {/* Center (Occlusal/Incisal) */}
        <rect
          x="30"
          y="30"
          width="40"
          height="40"
          fill={getSurfaceColor("OCCLUSAL")}
          stroke="#475569"
          strokeWidth="3"
        />

        {/* Cross overlay if ABSENT */}
        {isAbsent && (
          <g stroke="#ef4444" strokeWidth="6" strokeLinecap="round">
            <line x1="10" y1="10" x2="90" y2="90" />
            <line x1="90" y1="10" x2="10" y2="90" />
          </g>
        )}

        {/* IMPLANT icon symbol */}
        {isImplant && (
          <circle cx="50" cy="50" r="16" fill="#0d9488" stroke="#ffffff" strokeWidth="3" />
        )}
      </svg>

      {/* Tiny status indicator dot */}
      {hasFinding && (
        <span
          className="w-2 h-2 rounded-full mt-1"
          style={{ backgroundColor: CONDITION_COLORS[mainCondition!].fill }}
        />
      )}
    </div>
  );
}

