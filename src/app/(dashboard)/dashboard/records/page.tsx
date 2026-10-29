"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Plus,
  Calendar,
  User,
  Eye,
  Lock,
  X,
  Stethoscope,
  Pill,
  Smile,
  CheckCircle,
  Trash2,
} from "lucide-react";

interface ClinicalRecordItem {
  id: string;
  patient: string;
  recordNumber: string;
  doctor: string;
  date: string;
  reason: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  status: "CERRADA" | "EN PROCESO";
}

export default function RecordsPage() {
  const [search, setSearch] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<ClinicalRecordItem | null>(null);
  const [showNewEvolutionModal, setShowNewEvolutionModal] = useState(false);
  const [records, setRecords] = useState<ClinicalRecordItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bee_custom_records");
      if (stored) {
        setRecords(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const [newEvolution, setNewEvolution] = useState({
    patient: "",
    recordNumber: "",
    reason: "",
    diagnosis: "",
    treatment: "",
    prescription: "",
  });

  const handleCreateEvolution = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ClinicalRecordItem = {
      id: `rec-${Date.now()}`,
      patient: newEvolution.patient,
      recordNumber: newEvolution.recordNumber || `EXP-${Math.floor(1000 + Math.random() * 9000)}`,
      doctor: "Dra. Leticia Bueno",
      date: new Date().toLocaleDateString("es-ES"),
      reason: newEvolution.reason,
      diagnosis: newEvolution.diagnosis,
      treatment: newEvolution.treatment,
      prescription: newEvolution.prescription || "Ninguna requerida.",
      status: "CERRADA",
    };

    const next = [created, ...records];
    setRecords(next);

    try {
      localStorage.setItem("bee_custom_records", JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }

    setShowNewEvolutionModal(false);
    setNewEvolution({
      patient: "",
      recordNumber: "",
      reason: "",
      diagnosis: "",
      treatment: "",
      prescription: "",
    });
  };

  const handleClearAllRecords = () => {
    if (confirm("¿Deseas vaciar los expedientes clínicos de prueba?")) {
      setRecords([]);
      try {
        localStorage.removeItem("bee_custom_records");
      } catch (e) {
        console.error(e);
      }
    }
  };

  const filtered = records.filter(
    (r) =>
      r.patient.toLowerCase().includes(search.toLowerCase()) ||
      r.recordNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.reason.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">
            Expedientes Clínicos Longitudinales
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Historial médico fechado, adendas clínicas inmutables y prescripciones
          </p>
        </div>

        <div className="flex items-center gap-2">
          {records.length > 0 && (
            <button
              onClick={handleClearAllRecords}
              className="px-3 py-2 rounded-xl border border-surface-container-high text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={14} />
              <span>Limpiar Datos</span>
            </button>
          )}

          <button
            onClick={() => setShowNewEvolutionModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:bg-primary-container transition-all"
          >
            <Plus size={16} />
            <span>Nueva Entrada Clínica</span>
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-high/80 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Buscar por paciente o expediente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-transparent focus:border-primary focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high/80 p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-primary-fixed/30 text-primary flex items-center justify-center mx-auto">
            <FileText size={32} />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-on-surface">Base de Expedientes Limpia</h3>
            <p className="text-xs text-on-surface-variant max-w-md mx-auto mt-1">
              No hay notas ni evoluciones clínicas de prueba. Haz clic en &quot;Nueva Entrada Clínica&quot; para asentar la primera consulta.
            </p>
          </div>
          <button
            onClick={() => setShowNewEvolutionModal(true)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:bg-primary-container"
          >
            <Plus size={16} />
            <span>Añadir Primera Entrada</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="p-5 bg-surface-container-lowest rounded-2xl border border-surface-container-high/80 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                  <FileText size={20} />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-base text-on-surface">{r.patient}</span>
                    <span className="text-xs font-mono font-bold text-primary bg-primary-fixed/30 px-2 py-0.5 rounded">
                      {r.recordNumber}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-on-surface-variant">{r.reason}</p>
                  <div className="flex items-center gap-3 text-xs text-on-surface-variant/70 mt-1">
                    <span>Atendido por: {r.doctor}</span>
                    <span>•</span>
                    <span>{r.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    r.status === "CERRADA"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {r.status}
                </span>
                <button
                  onClick={() => setSelectedRecord(r)}
                  className="px-3 py-1.5 rounded-xl bg-surface-container text-primary font-bold text-xs hover:bg-surface-container-high transition-colors"
                >
                  Ver Notas
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Clinical Record Notes Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl border border-surface-container-high max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-surface-container-high">
              <div>
                <span className="text-xs font-mono font-bold text-primary bg-primary-fixed/30 px-2 py-0.5 rounded">
                  {selectedRecord.recordNumber}
                </span>
                <h2 className="font-display font-bold text-xl text-on-surface mt-1">
                  {selectedRecord.patient}
                </h2>
                <p className="text-xs text-on-surface-variant">
                  Fecha: {selectedRecord.date} • Atendido por: <strong>{selectedRecord.doctor}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="w-8 h-8 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-3.5 bg-surface-container-low rounded-xl space-y-1">
                <span className="text-xs font-bold uppercase text-primary tracking-wider">
                  Motivo de Consulta
                </span>
                <p className="text-on-surface font-medium">{selectedRecord.reason}</p>
              </div>

              <div className="p-3.5 bg-surface-container-low rounded-xl space-y-1">
                <span className="text-xs font-bold uppercase text-on-surface-variant tracking-wider">
                  Diagnóstico Odontológico
                </span>
                <p className="text-on-surface font-medium">{selectedRecord.diagnosis}</p>
              </div>

              <div className="p-3.5 bg-surface-container-low rounded-xl space-y-1">
                <span className="text-xs font-bold uppercase text-on-surface-variant tracking-wider flex items-center gap-1.5">
                  <Stethoscope size={15} className="text-primary" />
                  <span>Tratamiento y Procedimiento Realizado</span>
                </span>
                <p className="text-on-surface leading-relaxed">{selectedRecord.treatment}</p>
              </div>

              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <span className="text-xs font-bold uppercase text-emerald-900 tracking-wider flex items-center gap-1.5">
                  <Pill size={15} />
                  <span>Receta Médica &amp; Farmacoterapia</span>
                </span>
                <p className="text-emerald-950 font-medium">{selectedRecord.prescription}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-container-high flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
                <CheckCircle size={16} />
                <span>Entrada firmada digitalmente por Dra. Leticia Bueno</span>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl bg-surface-container text-xs font-bold text-on-surface-variant hover:bg-surface-container-high"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Evolution Modal */}
      {showNewEvolutionModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <h3 className="font-display font-bold text-lg text-on-surface">
                Nueva Entrada en Expediente Clínico
              </h3>
              <button
                onClick={() => setShowNewEvolutionModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvolution} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">Paciente *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carmen Santana"
                    value={newEvolution.patient}
                    onChange={(e) => setNewEvolution({ ...newEvolution, patient: e.target.value })}
                    className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">No. Expediente</label>
                  <input
                    type="text"
                    placeholder="EXP-0142"
                    value={newEvolution.recordNumber}
                    onChange={(e) => setNewEvolution({ ...newEvolution, recordNumber: e.target.value })}
                    className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Motivo de Consulta *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Control periódico y ajuste de férula..."
                  value={newEvolution.reason}
                  onChange={(e) => setNewEvolution({ ...newEvolution, reason: e.target.value })}
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Diagnóstico Odontológico *</label>
                <input
                  type="text"
                  required
                  placeholder="Diagnóstico clínico..."
                  value={newEvolution.diagnosis}
                  onChange={(e) => setNewEvolution({ ...newEvolution, diagnosis: e.target.value })}
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Procedimiento Realizado *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Detalle técnico de la intervención..."
                  value={newEvolution.treatment}
                  onChange={(e) => setNewEvolution({ ...newEvolution, treatment: e.target.value })}
                  className="w-full p-2.5 bg-surface-container-low rounded-xl text-xs border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Receta / Farmacoterapia</label>
                <input
                  type="text"
                  placeholder="Medicamento, dosis e intervalo..."
                  value={newEvolution.prescription}
                  onChange={(e) => setNewEvolution({ ...newEvolution, prescription: e.target.value })}
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewEvolutionModal(false)}
                  className="px-4 py-2 rounded-xl border border-surface-container-high text-xs font-bold text-on-surface-variant hover:bg-surface-container"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:bg-primary-container"
                >
                  Guardar Nota Clínica
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
