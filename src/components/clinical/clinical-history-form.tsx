"use client";

import React, { useState, useEffect } from "react";
import {
  HeartPulse,
  Smile,
  FileSearch,
  Sparkles,
  Save,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  User,
  Phone,
  Pill,
  ShieldAlert,
  Loader2,
  Copy,
  Printer,
  ChevronRight,
} from "lucide-react";

export interface MedicalHistoryData {
  tratamiento_medico_actual: boolean;
  nombre_medico_tratante: string;
  numero_telefono_medico: string;
  medicamento_utiliza: string;
  cambio_peso_5kg: boolean;
  familiares_afecciones: boolean;
  // Afecciones sistémicas
  hipertension_arterial: boolean;
  cardiopatias: boolean;
  afecciones_cardiacas: boolean;
  renales: boolean;
  hepaticas: boolean;
  alergias: boolean;
  diabetes: boolean;
  problemas_coagulacion: boolean;
  hemofilia: boolean;
  fiebre_reumatica: boolean;
  ulcera: boolean;
  ets: boolean;
  epilepsia: boolean;
  anemias: boolean;
  afecciones_psiquicas: boolean;
  sinusitis: boolean;
  trastornos_respiratorios: boolean;
  obs_historial_medico: string;
}

export interface DentalHistoryData {
  cirugia_previa: boolean;
  sangrado_excesivo: boolean;
  anestesia_previa: boolean;
  inconveniente_anestesia: boolean;
  cual_inconveniente: string;
  embarazada: boolean;
  cuanto_tiempo_embarazo: string;
  nervioso_tratamiento_odontologico: boolean;
  por_que_nervioso: string;
  // Hábitos
  ultima_visita_odontologo: string;
  veces_cepilla_dia: string;
  elementos_utiliza_cepillo: boolean;
  elementos_utiliza_pasta_dental: boolean;
  elementos_utiliza_hilo_dental: boolean;
  elementos_utiliza_enjuagues_bucales: boolean;
  elementos_utiliza_otros: string;
  obs_historial_odontologico: string;
}

export interface OralExamData {
  labios: string;
  encias: string;
  vestibulos: string;
  paladar: string;
  lengua: string;
  atm: string;
  carrillos: string;
  oclusion: string;
  pedido_examenes: string;
}

export interface CompleteClinicalHistory {
  patientId: string;
  patientName: string;
  recordNumber: string;
  updatedAt: string;
  updatedBy: string;
  medical: MedicalHistoryData;
  dental: DentalHistoryData;
  oralExam: OralExamData;
  aiSummary?: string;
}

const defaultMedical: MedicalHistoryData = {
  tratamiento_medico_actual: false,
  nombre_medico_tratante: "",
  numero_telefono_medico: "",
  medicamento_utiliza: "",
  cambio_peso_5kg: false,
  familiares_afecciones: false,
  hipertension_arterial: false,
  cardiopatias: false,
  afecciones_cardiacas: false,
  renales: false,
  hepaticas: false,
  alergias: false,
  diabetes: false,
  problemas_coagulacion: false,
  hemofilia: false,
  fiebre_reumatica: false,
  ulcera: false,
  ets: false,
  epilepsia: false,
  anemias: false,
  afecciones_psiquicas: false,
  sinusitis: false,
  trastornos_respiratorios: false,
  obs_historial_medico: "",
};

const defaultDental: DentalHistoryData = {
  cirugia_previa: false,
  sangrado_excesivo: false,
  anestesia_previa: false,
  inconveniente_anestesia: false,
  cual_inconveniente: "",
  embarazada: false,
  cuanto_tiempo_embarazo: "",
  nervioso_tratamiento_odontologico: false,
  por_que_nervioso: "",
  ultima_visita_odontologo: "",
  veces_cepilla_dia: "",
  elementos_utiliza_cepillo: true,
  elementos_utiliza_pasta_dental: true,
  elementos_utiliza_hilo_dental: false,
  elementos_utiliza_enjuagues_bucales: false,
  elementos_utiliza_otros: "",
  obs_historial_odontologico: "",
};

const defaultOralExam: OralExamData = {
  labios: "Aparentemente normales, hidratados y sin lesiones visibles.",
  encias: "Coloración rosada coral. Sin signos agudos de hemorragia espontánea.",
  vestibulos: "Mucosa de fondo de surco íntegra y permeable.",
  paladar: "Paladar duro y blando sin alteraciones anatómicas relevantes.",
  lengua: "Normoglosa, movilidad conservada, papilas en estado normal.",
  atm: "Apertura simétrica, sin chasquidos palpables ni desvío doloroso.",
  carrillos: "Conducto de Stenon permeable bilateral, sin leucoedema patológico.",
  oclusion: "Normoclusión Clase I molar y canina.",
  pedido_examenes: "Radiografía panorámica ortopantomográfica y serie periapical.",
};

interface ClinicalHistoryFormProps {
  patientId: string;
  patientName: string;
  recordNumber?: string;
  onSave?: (history: CompleteClinicalHistory) => void;
}

export default function ClinicalHistoryForm({
  patientId,
  patientName,
  recordNumber = "EXP-0001",
  onSave,
}: ClinicalHistoryFormProps) {
  const [activeTab, setActiveTab] = useState<"medico" | "odontologico" | "examen" | "resumen">("medico");
  const [medical, setMedical] = useState<MedicalHistoryData>(defaultMedical);
  const [dental, setDental] = useState<DentalHistoryData>(defaultDental);
  const [oralExam, setOralExam] = useState<OralExamData>(defaultOralExam);
  const [aiSummary, setAiSummary] = useState<string>("");
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const storageKey = `bee_history_${patientId}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: CompleteClinicalHistory = JSON.parse(saved);
        if (parsed.medical) setMedical(parsed.medical);
        if (parsed.dental) setDental(parsed.dental);
        if (parsed.oralExam) setOralExam(parsed.oralExam);
        if (parsed.aiSummary) setAiSummary(parsed.aiSummary);
      }
    } catch (e) {
      console.error(e);
    }
  }, [patientId]);

  const handleSaveAll = () => {
    const complete: CompleteClinicalHistory = {
      patientId,
      patientName,
      recordNumber,
      updatedAt: new Date().toLocaleString("es-ES"),
      updatedBy: "Dra. Leticia Bueno",
      medical,
      dental,
      oralExam,
      aiSummary,
    };

    try {
      localStorage.setItem(`bee_history_${patientId}`, JSON.stringify(complete));
      // Also update index list of histories
      const indexList = JSON.parse(localStorage.getItem("bee_histories_index") || "{}");
      indexList[patientId] = {
        patientName,
        recordNumber,
        updatedAt: complete.updatedAt,
      };
      localStorage.setItem("bee_histories_index", JSON.stringify(indexList));
    } catch (e) {
      console.error(e);
    }

    if (onSave) onSave(complete);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleGenerateAiSummary = async () => {
    setIsLoadingAi(true);
    setAiError(null);
    try {
      const apiKey = localStorage.getItem("bee_gemini_key") || "";
      const model = localStorage.getItem("bee_gemini_model") || "gemini-1.5-flash";

      const res = await fetch("/api/v1/clinical-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName,
          medicalHistory: medical,
          dentalHistory: dental,
          oralExam,
          apiKey,
          model,
        }),
      });

      const data = await res.json();
      if (data.success && data.summary) {
        setAiSummary(data.summary);
        setActiveTab("resumen");
      } else {
        setAiError(data.error || "No se pudo generar el resumen con IA.");
      }
    } catch (err: any) {
      setAiError(err.message || "Error al conectar con el servicio de IA.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Critical alerts detection
  const hasCriticalAlerts =
    medical.alergias ||
    medical.hipertension_arterial ||
    medical.diabetes ||
    medical.cardiopatias ||
    medical.problemas_coagulacion ||
    medical.hemofilia ||
    dental.embarazada ||
    dental.inconveniente_anestesia;

  return (
    <div className="bg-surface-container-lowest rounded-3xl border border-surface-container-high/80 shadow-sm overflow-hidden">
      {/* Patient Header Banner */}
      <div className="p-6 bg-gradient-to-r from-surface-container-low via-surface-container-lowest to-surface-container-low border-b border-surface-container-high/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary-fixed text-primary">
              {recordNumber}
            </span>
            <h2 className="font-display font-bold text-xl text-on-surface">
              Historia Clínica Integral &bull; {patientName}
            </h2>
          </div>
          <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-2">
            <span>Responsable Clínico: <strong>Dra. Leticia Bueno</strong></span>
            <span>&bull;</span>
            <span>Anamnesis y Examen Estomatológico</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {hasCriticalAlerts && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1.5 animate-pulse">
              <ShieldAlert size={14} />
              <span>Alertas Médicas Activas</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleGenerateAiSummary}
            disabled={isLoadingAi}
            className="px-4 py-2 bg-gradient-to-r from-primary to-teal-700 text-white text-xs font-bold rounded-xl shadow hover:opacity-95 transition-all flex items-center gap-1.5"
          >
            {isLoadingAi ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Sparkles size={14} className="text-amber-300" />
            )}
            <span>{isLoadingAi ? "Generando Resumen..." : "Generar Resumen con IA ✨"}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow hover:bg-primary-container transition-all flex items-center gap-1.5"
          >
            <Save size={14} />
            <span>{saveSuccess ? "¡Guardado!" : "Guardar Historia"}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>Historia clínica y examen estomatológico actualizados exitosamente en el expediente.</span>
        </div>
      )}

      {aiError && (
        <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle size={16} className="text-rose-600 shrink-0" />
          <span>{aiError}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="px-6 pt-4 border-b border-surface-container-high flex gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("medico")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "medico"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <HeartPulse size={16} />
          <span>1. Historial Médico</span>
          {medical.alergias || medical.hipertension_arterial ? (
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          ) : null}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("odontologico")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "odontologico"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <Smile size={16} />
          <span>2. Historial Odontológico</span>
          {dental.inconveniente_anestesia || dental.embarazada ? (
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          ) : null}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("examen")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "examen"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <FileSearch size={16} />
          <span>3. Examen de Boca</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("resumen")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "resumen"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <Sparkles size={16} className="text-amber-500" />
          <span>4. Resumen Clínico IA ✨</span>
          {aiSummary ? (
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-100 text-emerald-800">
              Listo
            </span>
          ) : null}
        </button>
      </div>

      <div className="p-6">
        {/* ============================================================== */}
        {/* TAB 1: HISTORIAL MÉDICO GENERAL                                */}
        {/* ============================================================== */}
        {activeTab === "medico" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Tratamiento actual & Médico tratante */}
            <div className="p-5 rounded-2xl bg-surface-container-low/60 border border-surface-container-high/80 space-y-4">
              <h3 className="font-bold text-sm text-on-surface flex items-center gap-2">
                <Info size={16} className="text-primary" />
                <span>Tratamiento y Seguimiento Médico Actual</span>
              </h3>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-surface-container-high">
                <div>
                  <label htmlFor="chk_trat_act" className="text-xs font-bold text-on-surface cursor-pointer">
                    1. ¿Se está realizando algún tratamiento médico actualmente?
                  </label>
                  <p className="text-[11px] text-on-surface-variant">
                    Indica si el paciente se encuentra bajo supervisión médica activa por cualquier causa.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="chk_trat_act"
                  checked={medical.tratamiento_medico_actual}
                  onChange={(e) => setMedical({ ...medical, tratamiento_medico_actual: e.target.checked })}
                  className="w-5 h-5 rounded text-primary focus:ring-primary cursor-pointer"
                />
              </div>

              {medical.tratamiento_medico_actual && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-on-surface">Nombre del Médico Tratante</label>
                    <input
                      type="text"
                      placeholder="Dr. / Dra. Especialista"
                      value={medical.nombre_medico_tratante}
                      onChange={(e) => setMedical({ ...medical, nombre_medico_tratante: e.target.value })}
                      className="w-full h-10 px-3 bg-white rounded-xl text-xs border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-on-surface">Número Teléfono del Médico</label>
                    <input
                      type="text"
                      placeholder="Ej. (809) 000-0000"
                      value={medical.numero_telefono_medico}
                      onChange={(e) => setMedical({ ...medical, numero_telefono_medico: e.target.value })}
                      className="w-full h-10 px-3 bg-white rounded-xl text-xs border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">
                  2. ¿Qué medicamento utiliza actualmente?
                </label>
                <input
                  type="text"
                  placeholder="Detallar fármacos, dosis, antihipertensivos, anticoagulantes, etc."
                  value={medical.medicamento_utiliza}
                  onChange={(e) => setMedical({ ...medical, medicamento_utiliza: e.target.value })}
                  className="w-full h-10 px-3 bg-white rounded-xl text-xs border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-surface-container-high">
                  <label htmlFor="chk_peso" className="text-xs font-bold text-on-surface cursor-pointer pr-3">
                    3. ¿Ha bajado o subido más de 5 Kg. de peso en el último año?
                  </label>
                  <input
                    type="checkbox"
                    id="chk_peso"
                    checked={medical.cambio_peso_5kg}
                    onChange={(e) => setMedical({ ...medical, cambio_peso_5kg: e.target.checked })}
                    className="w-5 h-5 rounded text-primary focus:ring-primary cursor-pointer shrink-0"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-surface-container-high">
                  <label htmlFor="chk_fam" className="text-xs font-bold text-on-surface cursor-pointer pr-3">
                    4. ¿Es usted o sus parientes cercanos portador de afecciones hereditarias?
                  </label>
                  <input
                    type="checkbox"
                    id="chk_fam"
                    checked={medical.familiares_afecciones}
                    onChange={(e) => setMedical({ ...medical, familiares_afecciones: e.target.checked })}
                    className="w-5 h-5 rounded text-primary focus:ring-primary cursor-pointer shrink-0"
                  />
                </div>
              </div>
            </div>

            {/* Afecciones Sistémicas (17 Patologías de historial.php) */}
            <div className="p-5 rounded-2xl bg-surface-container-low/60 border border-surface-container-high/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-on-surface flex items-center gap-2">
                    <HeartPulse size={16} className="text-rose-600" />
                    <span>Afecciones Sistémicas y Factores de Riesgo (17 Criterios)</span>
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Marque todas las patologías diagnosticadas en el paciente o antecedentes patológicos familiares:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { key: "hipertension_arterial", label: "Hipertensión Arterial", alert: true },
                  { key: "cardiopatias", label: "Cardiopatías", alert: true },
                  { key: "afecciones_cardiacas", label: "Afecciones Cardíacas", alert: true },
                  { key: "renales", label: "Enfermedades Renales", alert: false },
                  { key: "hepaticas", label: "Enfermedades Hepáticas", alert: false },
                  { key: "alergias", label: "Alergias (Fármacos / Látex)", alert: true },
                  { key: "diabetes", label: "Diabetes Mellitus", alert: true },
                  { key: "problemas_coagulacion", label: "Problemas de Coagulación", alert: true },
                  { key: "hemofilia", label: "Hemofilia", alert: true },
                  { key: "fiebre_reumatica", label: "Fiebre Reumática", alert: false },
                  { key: "ulcera", label: "Úlcera Gástrica", alert: false },
                  { key: "ets", label: "ETS (Transmisión Sexual)", alert: false },
                  { key: "epilepsia", label: "Epilepsia / Convulsiones", alert: false },
                  { key: "anemias", label: "Anemias", alert: false },
                  { key: "afecciones_psiquicas", label: "Afecciones Psíquicas / Ansiedad", alert: false },
                  { key: "sinusitis", label: "Sinusitis Crónica", alert: false },
                  { key: "trastornos_respiratorios", label: "Trastornos Respiratorios / Asma", alert: false },
                ].map((item) => {
                  const isChecked = (medical as any)[item.key];
                  return (
                    <label
                      key={item.key}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                        isChecked
                          ? item.alert
                            ? "bg-rose-50 border-rose-300 text-rose-950 font-bold"
                            : "bg-emerald-50 border-emerald-300 text-emerald-950 font-bold"
                          : "bg-white border-surface-container-high text-on-surface hover:bg-surface-container-low"
                      }`}
                    >
                      <span>{item.label}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => setMedical({ ...medical, [item.key]: e.target.checked })}
                        className="w-4 h-4 rounded text-primary focus:ring-primary ml-2"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Observaciones Médicas */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface">OBS. (Observaciones Médicas Generales)</label>
              <textarea
                rows={3}
                placeholder="Anotaciones médicas especiales, cirugías recientes, interconsultas con otros especialistas..."
                value={medical.obs_historial_medico}
                onChange={(e) => setMedical({ ...medical, obs_historial_medico: e.target.value })}
                className="w-full p-3 bg-surface-container-low rounded-xl text-xs border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: HISTORIAL ODONTOLÓGICO                                  */}
        {/* ============================================================== */}
        {activeTab === "odontologico" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Antecedentes Quirúrgicos y Anestesia */}
            <div className="p-5 rounded-2xl bg-surface-container-low/60 border border-surface-container-high/80 space-y-4">
              <h3 className="font-bold text-sm text-on-surface flex items-center gap-2">
                <Smile size={16} className="text-primary" />
                <span>Antecedentes Quirúrgicos y Reacción a Anestesia</span>
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-surface-container-high">
                  <label htmlFor="chk_cirugia" className="text-xs font-bold text-on-surface cursor-pointer pr-3">
                    1. ¿Alguna vez se sometió a alguna operación o intervención quirúrgica?
                  </label>
                  <input
                    type="checkbox"
                    id="chk_cirugia"
                    checked={dental.cirugia_previa}
                    onChange={(e) => setDental({ ...dental, cirugia_previa: e.target.checked })}
                    className="w-5 h-5 rounded text-primary focus:ring-primary cursor-pointer shrink-0"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-surface-container-high">
                  <label htmlFor="chk_sangrado" className="text-xs font-bold text-on-surface cursor-pointer pr-3">
                    2. ¿Al cortarse o hacerse alguna extracción sangra mucho y cuesta que se detenga?
                  </label>
                  <input
                    type="checkbox"
                    id="chk_sangrado"
                    checked={dental.sangrado_excesivo}
                    onChange={(e) => setDental({ ...dental, sangrado_excesivo: e.target.checked })}
                    className="w-5 h-5 rounded text-primary focus:ring-primary cursor-pointer shrink-0"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-surface-container-high">
                  <label htmlFor="chk_anest" className="text-xs font-bold text-on-surface cursor-pointer pr-3">
                    3. ¿Alguna vez le aplicaron anestesia dental o general?
                  </label>
                  <input
                    type="checkbox"
                    id="chk_anest"
                    checked={dental.anestesia_previa}
                    onChange={(e) => setDental({ ...dental, anestesia_previa: e.target.checked })}
                    className="w-5 h-5 rounded text-primary focus:ring-primary cursor-pointer shrink-0"
                  />
                </div>

                {/* Inconveniente con anestesia */}
                <div className="p-3.5 rounded-xl bg-white border border-surface-container-high space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface">
                      ¿Tuvo algún inconveniente o reacción adversa con la anestesia?
                    </span>
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="inconveniente_anestesia"
                          checked={dental.inconveniente_anestesia}
                          onChange={() => setDental({ ...dental, inconveniente_anestesia: true })}
                          className="text-primary focus:ring-primary"
                        />
                        <span>SÍ</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="inconveniente_anestesia"
                          checked={!dental.inconveniente_anestesia}
                          onChange={() => setDental({ ...dental, inconveniente_anestesia: false, cual_inconveniente: "" })}
                          className="text-primary focus:ring-primary"
                        />
                        <span>NO</span>
                      </label>
                    </div>
                  </div>

                  {dental.inconveniente_anestesia && (
                    <input
                      type="text"
                      placeholder="Describa el inconveniente (lipotimia, taquicardia, alergia, shock...)"
                      value={dental.cual_inconveniente}
                      onChange={(e) => setDental({ ...dental, cual_inconveniente: e.target.value })}
                      className="w-full h-9 px-3 bg-surface-container-low rounded-lg text-xs border border-rose-300 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  )}
                </div>

                {/* Embarazo */}
                <div className="p-3.5 rounded-xl bg-white border border-surface-container-high space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface">
                      8. ¿Está embarazada actualmente?
                    </span>
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="embarazada"
                          checked={dental.embarazada}
                          onChange={() => setDental({ ...dental, embarazada: true })}
                          className="text-primary focus:ring-primary"
                        />
                        <span>SÍ</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="embarazada"
                          checked={!dental.embarazada}
                          onChange={() => setDental({ ...dental, embarazada: false, cuanto_tiempo_embarazo: "" })}
                          className="text-primary focus:ring-primary"
                        />
                        <span>NO</span>
                      </label>
                    </div>
                  </div>

                  {dental.embarazada && (
                    <input
                      type="text"
                      placeholder="¿Cuánto tiempo de gestación? (Ej. 18 semanas / 2do trimestre)"
                      value={dental.cuanto_tiempo_embarazo}
                      onChange={(e) => setDental({ ...dental, cuanto_tiempo_embarazo: e.target.value })}
                      className="w-full h-9 px-3 bg-surface-container-low rounded-lg text-xs border border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  )}
                </div>

                {/* Nerviosismo Odontológico */}
                <div className="p-3.5 rounded-xl bg-white border border-surface-container-high space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface">
                      9. ¿Se siente muy nervioso/a porque va a someterse a un tratamiento odontológico?
                    </span>
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="nervioso"
                          checked={dental.nervioso_tratamiento_odontologico}
                          onChange={() => setDental({ ...dental, nervioso_tratamiento_odontologico: true })}
                          className="text-primary focus:ring-primary"
                        />
                        <span>SÍ</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="nervioso"
                          checked={!dental.nervioso_tratamiento_odontologico}
                          onChange={() => setDental({ ...dental, nervioso_tratamiento_odontologico: false, por_que_nervioso: "" })}
                          className="text-primary focus:ring-primary"
                        />
                        <span>NO</span>
                      </label>
                    </div>
                  </div>

                  {dental.nervioso_tratamiento_odontologico && (
                    <input
                      type="text"
                      placeholder="¿Por qué se siente nervioso? (Fobia a las agujas, dolor previo, ansiedad...)"
                      value={dental.por_que_nervioso}
                      onChange={(e) => setDental({ ...dental, por_que_nervioso: e.target.value })}
                      className="w-full h-9 px-3 bg-surface-container-low rounded-lg text-xs border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Hábitos de Higiene Oral */}
            <div className="p-5 rounded-2xl bg-surface-container-low/60 border border-surface-container-high/80 space-y-4">
              <h3 className="font-bold text-sm text-on-surface flex items-center gap-2">
                <Smile size={16} className="text-teal-700" />
                <span>Hábitos de Higiene Oral y Visitas Odontológicas</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">
                    1. ¿Cuándo fue su última visita al Odontólogo?
                  </label>
                  <select
                    value={dental.ultima_visita_odontologo}
                    onChange={(e) => setDental({ ...dental, ultima_visita_odontologo: e.target.value })}
                    className="w-full h-10 px-3 bg-white rounded-xl text-xs font-semibold border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Seleccione...</option>
                    <option value="6_meses">Hace 6 meses</option>
                    <option value="1_anyo">Hace 1 año</option>
                    <option value="2_anyos">Hace 2 años</option>
                    <option value="mas_2_anyos">Más de 2 años</option>
                    <option value="no_recuerda">No recuerda / Primera vez</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface">
                    2. ¿Cuántas veces se cepilla al día?
                  </label>
                  <select
                    value={dental.veces_cepilla_dia}
                    onChange={(e) => setDental({ ...dental, veces_cepilla_dia: e.target.value })}
                    className="w-full h-10 px-3 bg-white rounded-xl text-xs font-semibold border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Seleccione...</option>
                    <option value="1">1 vez al día</option>
                    <option value="2">2 veces al día</option>
                    <option value="3">3 veces al día</option>
                    <option value="mas_3_veces">Más de 3 veces</option>
                    <option value="a_veces">Ocasionalmente / A veces</option>
                    <option value="no_se_cepilla">No se cepilla</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-on-surface">
                  3. ¿Qué elementos de higiene dental utiliza habitualmente?
                </label>
                <div className="flex flex-wrap items-center gap-4">
                  {[
                    { key: "elementos_utiliza_cepillo", label: "Cepillo Dental" },
                    { key: "elementos_utiliza_pasta_dental", label: "Pasta Dental" },
                    { key: "elementos_utiliza_hilo_dental", label: "Hilo Dental" },
                    { key: "elementos_utiliza_enjuagues_bucales", label: "Enjuague Bucal" },
                  ].map((elem) => (
                    <label key={elem.key} className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(dental as any)[elem.key]}
                        onChange={(e) => setDental({ ...dental, [elem.key]: e.target.checked })}
                        className="w-4 h-4 rounded text-primary focus:ring-primary"
                      />
                      <span>{elem.label}</span>
                    </label>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Otros elementos (irrigador bucal, cepillos interproximales, limpiador lingual...)"
                  value={dental.elementos_utiliza_otros}
                  onChange={(e) => setDental({ ...dental, elementos_utiliza_otros: e.target.value })}
                  className="w-full h-9 px-3 bg-white rounded-xl text-xs border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary mt-2"
                />
              </div>
            </div>

            {/* Observaciones Odontológicas */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface">OBS. (Observaciones Odontológicas)</label>
              <textarea
                rows={3}
                placeholder="Preferencias del paciente, hábitos parafuncionales como bruxismo, antecedentes de ortodoncia o prótesis..."
                value={dental.obs_historial_odontologico}
                onChange={(e) => setDental({ ...dental, obs_historial_odontologico: e.target.value })}
                className="w-full p-3 bg-surface-container-low rounded-xl text-xs border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: EXAMEN DE BOCA (ESTOMATOLÓGICO)                          */}
        {/* ============================================================== */}
        {activeTab === "examen" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-5 rounded-2xl bg-surface-container-low/60 border border-surface-container-high/80 space-y-4">
              <div>
                <h3 className="font-bold text-sm text-on-surface flex items-center gap-2">
                  <FileSearch size={16} className="text-primary" />
                  <span>Examen Clínico Estomatológico de Estructuras Orales</span>
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Evaluación anatómica sistemática de tejidos blandos, articulación temporomandibular y oclusión.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-on-surface tracking-wider">LABIOS</label>
                  <textarea
                    rows={2}
                    value={oralExam.labios}
                    onChange={(e) => setOralExam({ ...oralExam, labios: e.target.value })}
                    className="w-full p-2.5 bg-white rounded-xl text-xs border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-on-surface tracking-wider">ENCÍAS</label>
                  <textarea
                    rows={2}
                    value={oralExam.encias}
                    onChange={(e) => setOralExam({ ...oralExam, encias: e.target.value })}
                    className="w-full p-2.5 bg-white rounded-xl text-xs border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-on-surface tracking-wider">VESTÍBULOS</label>
                  <textarea
                    rows={2}
                    value={oralExam.vestibulos}
                    onChange={(e) => setOralExam({ ...oralExam, vestibulos: e.target.value })}
                    className="w-full p-2.5 bg-white rounded-xl text-xs border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-on-surface tracking-wider">PALADAR</label>
                  <textarea
                    rows={2}
                    value={oralExam.paladar}
                    onChange={(e) => setOralExam({ ...oralExam, paladar: e.target.value })}
                    className="w-full p-2.5 bg-white rounded-xl text-xs border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-on-surface tracking-wider">LENGUA</label>
                  <textarea
                    rows={2}
                    value={oralExam.lengua}
                    onChange={(e) => setOralExam({ ...oralExam, lengua: e.target.value })}
                    className="w-full p-2.5 bg-white rounded-xl text-xs border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-on-surface tracking-wider">ATM (Articulación Temporomandibular)</label>
                  <textarea
                    rows={2}
                    value={oralExam.atm}
                    onChange={(e) => setOralExam({ ...oralExam, atm: e.target.value })}
                    className="w-full p-2.5 bg-white rounded-xl text-xs border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-on-surface tracking-wider">CARRILLOS</label>
                  <textarea
                    rows={2}
                    value={oralExam.carrillos}
                    onChange={(e) => setOralExam({ ...oralExam, carrillos: e.target.value })}
                    className="w-full p-2.5 bg-white rounded-xl text-xs border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-on-surface tracking-wider">OCLUSIÓN</label>
                  <textarea
                    rows={2}
                    value={oralExam.oclusion}
                    onChange={(e) => setOralExam({ ...oralExam, oclusion: e.target.value })}
                    className="w-full p-2.5 bg-white rounded-xl text-xs border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1 pt-1">
                  <label className="text-xs font-bold uppercase text-primary tracking-wider flex items-center gap-1.5">
                    <FileSearch size={14} />
                    <span>PEDIDO DE EXÁMENES COMPLEMENTARIOS</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Radiografías periapicales, ortopantomografía digital, tomografía CBCT 3D, análisis de laboratorio..."
                    value={oralExam.pedido_examenes}
                    onChange={(e) => setOralExam({ ...oralExam, pedido_examenes: e.target.value })}
                    className="w-full p-3 bg-white rounded-xl text-xs border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: RESUMEN GENERADO POR IA (GEMINI ✨)                     */}
        {/* ============================================================== */}
        {activeTab === "resumen" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-surface-container-low border border-emerald-200/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
                    <Sparkles size={18} className="text-amber-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-on-surface">
                      Síntesis Clínica Automatizada con IA (Gemini)
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      Resumen conciso para el odontólogo con factores de riesgo, precauciones y recomendaciones.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateAiSummary}
                  disabled={isLoadingAi}
                  className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow hover:bg-primary-container transition-all flex items-center gap-1.5 shrink-0"
                >
                  {isLoadingAi ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  <span>{isLoadingAi ? "Generando..." : "Actualizar Resumen IA ✨"}</span>
                </button>
              </div>

              {aiSummary ? (
                <div className="mt-3 p-4 bg-white rounded-2xl border border-emerald-200 shadow-sm space-y-3 text-xs leading-relaxed whitespace-pre-line text-on-surface">
                  {aiSummary}
                </div>
              ) : (
                <div className="p-8 text-center bg-white/70 rounded-2xl border border-dashed border-emerald-300 space-y-3">
                  <Sparkles size={28} className="mx-auto text-emerald-600 animate-pulse" />
                  <p className="text-xs font-bold text-emerald-950">
                    Aún no se ha generado el resumen clínico con Inteligencia Artificial.
                  </p>
                  <p className="text-[11px] text-emerald-800 max-w-md mx-auto">
                    Haz clic en el botón superior para que Gemini analice el historial médico, odontológico y examen de boca de este paciente.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-5 bg-surface-container-low/60 border-t border-surface-container-high/80 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-on-surface-variant font-medium">
          Diligenciado y avalado por: <strong>Dra. Leticia Bueno</strong> &bull; Bee Dental
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:bg-primary-container transition-all flex items-center gap-2"
          >
            <CheckCircle2 size={16} />
            <span>Guardar Cambios de la Historia Clínica</span>
          </button>
        </div>
      </div>
    </div>
  );
}
