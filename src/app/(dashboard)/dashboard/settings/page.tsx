"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Shield,
  Key,
  Building2,
  Clock,
  Check,
  Copy,
  QrCode,
  Smartphone,
  RefreshCw,
  Server,
  Send,
  AlertTriangle,
  CheckCircle2,
  LogOut,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "operational" | "insurance" | "integrations">("integrations");
  const [insuranceEnabled, setInsuranceEnabled] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // WhatsApp Evolution API state
  const [serverUrl, setServerUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [instanceName, setInstanceName] = useState("");
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [isLoadingQr, setIsLoadingQr] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [testPhone, setTestPhone] = useState("");
  const [testMessage, setTestMessage] = useState("Hola, confirmación de cita en Bee Dental con Dra. Leticia Bueno");
  const [sendingTest, setSendingTest] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  const apiKeySample = "bee_live_8496323258_9f7a8b3c2d1e0f4a";

  useEffect(() => {
    try {
      const storedUrl = localStorage.getItem("bee_evolution_url");
      const storedKey = localStorage.getItem("bee_evolution_key");
      const storedInstance = localStorage.getItem("bee_evolution_instance");
      if (storedUrl) setServerUrl(storedUrl);
      if (storedKey) setApiKey(storedKey);
      if (storedInstance) setInstanceName(storedInstance);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem("bee_evolution_url", serverUrl);
      localStorage.setItem("bee_evolution_key", apiKey);
      localStorage.setItem("bee_evolution_instance", instanceName);
    } catch (e) {
      console.error(e);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKeySample);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Evolution API: Generate / Fetch QR
  const handleGenerateQr = async () => {
    setIsLoadingQr(true);
    setErrorMessage(null);
    setQrCodeData(null);
    setConnectionStatus("connecting");

    try {
      const res = await fetch("/api/v1/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_or_qr",
          serverUrl,
          apiKey,
          instanceName,
        }),
      });

      const data = await res.json();
      if (data.success && data.qr) {
        setQrCodeData(data.qr);
        setPairingCode(data.pairingCode || null);
        setConnectionStatus("connecting");
      } else {
        setErrorMessage(data.error || "No se pudo obtener el QR de Evolution API");
        setConnectionStatus("disconnected");
      }
    } catch (err: any) {
      setErrorMessage(`Error de conexión con el backend: ${err.message}`);
      setConnectionStatus("disconnected");
    } finally {
      setIsLoadingQr(false);
    }
  };

  // Evolution API: Check Status
  const handleCheckStatus = async () => {
    setErrorMessage(null);
    try {
      const res = await fetch("/api/v1/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "status",
          serverUrl,
          apiKey,
          instanceName,
        }),
      });

      const data = await res.json();
      if (data.success && data.data?.instance?.state === "open") {
        setConnectionStatus("connected");
        setQrCodeData(null);
      } else {
        setConnectionStatus("disconnected");
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  // Evolution API: Logout / Disconnect
  const handleDisconnect = async () => {
    if (!confirm("¿Deseas desvincular la sesión de WhatsApp de Bee Dental?")) return;
    try {
      await fetch("/api/v1/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "logout",
          serverUrl,
          apiKey,
          instanceName,
        }),
      });
      setConnectionStatus("disconnected");
      setQrCodeData(null);
    } catch (err: any) {
      console.error(err);
    }
  };

  // Evolution API: Send Test Message
  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone) return;
    setSendingTest(true);
    setTestSuccess(false);

    try {
      const res = await fetch("/api/v1/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_test",
          serverUrl,
          apiKey,
          instanceName,
          phone: testPhone,
          message: testMessage,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTestSuccess(true);
        setTimeout(() => setTestSuccess(false), 4000);
      } else {
        alert(`Error al enviar: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Fallo de conexión: ${err.message}`);
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">
          Configuración de la Clínica Dental
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
          Parámetros operativos, moneda dominicana (DOP), módulo de seguros y servidor WhatsApp Evolution API
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-surface-container-high overflow-x-auto gap-4 text-xs sm:text-sm font-bold">
        {[
          { id: "integrations", label: "WhatsApp & Evolution API", icon: Smartphone },
          { id: "general", label: "Datos Generales", icon: Building2 },
          { id: "operational", label: "Horarios y Agenda", icon: Clock },
          { id: "insurance", label: "Seguros Médicos (ARS)", icon: Shield },
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

      {/* Tab 1: WhatsApp Evolution API & QR vinculación */}
      {activeTab === "integrations" && (
        <div className="space-y-6">
          {/* Server Docker Specs Card */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-on-surface">
                    Canal Oficial de WhatsApp (Bee Dental)
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Sincronización y recordatorios automatizados de citas para pacientes.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                    connectionStatus === "connected"
                      ? "bg-emerald-100 text-emerald-800"
                      : connectionStatus === "connecting"
                      ? "bg-amber-100 text-amber-800 animate-pulse"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      connectionStatus === "connected"
                        ? "bg-emerald-600"
                        : connectionStatus === "connecting"
                        ? "bg-amber-500"
                        : "bg-gray-400"
                    }`}
                  />
                  <span>
                    {connectionStatus === "connected"
                      ? "Conectado a WhatsApp"
                      : connectionStatus === "connecting"
                      ? "Esperando Escaneo QR"
                      : "Desconectado"}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-surface-container-high">
              <button
                onClick={handleCheckStatus}
                className="px-3.5 py-2 rounded-xl bg-surface-container text-xs font-bold text-on-surface-variant hover:bg-surface-container-high flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw size={14} />
                <span>Verificar Estado</span>
              </button>

              <div className="flex items-center gap-2">
                {connectionStatus === "connected" && (
                  <button
                    onClick={handleDisconnect}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold rounded-xl border border-rose-200 transition-colors flex items-center gap-1.5"
                  >
                    <LogOut size={14} />
                    <span>Desvincular WhatsApp</span>
                  </button>
                )}
                <button
                  onClick={handleGenerateQr}
                  disabled={isLoadingQr}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <QrCode size={16} />
                  <span>{isLoadingQr ? "Generando..." : "Vincular mediante Código QR"}</span>
                </button>
              </div>
            </div>

            {/* Parámetros Avanzados de Servidor (Ocultos por defecto para usuarios finales) */}
            <details className="pt-2 border-t border-surface-container-high/60 group">
              <summary className="cursor-pointer text-xs font-semibold text-on-surface-variant hover:text-on-surface flex items-center gap-1.5 select-none py-1">
                <span>⚙️ Parámetros Avanzados de Servidor (Solo Administrador TI)</span>
              </summary>
              <div className="mt-3 p-3 bg-surface-container-low/50 rounded-xl space-y-3 text-xs">
                <p className="text-[11px] text-on-surface-variant">
                  Los parámetros de infraestructura se gestionan de forma segura en el servidor. Si requiere apuntar a una instancia o servidor alternativo, puede definirlos aquí:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-on-surface">URL Servidor</label>
                    <input
                      type="text"
                      placeholder="Por defecto (Servidor en producción)"
                      value={serverUrl}
                      onChange={(e) => setServerUrl(e.target.value)}
                      className="w-full h-9 px-3 bg-surface-container-lowest rounded-lg text-xs font-mono border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-on-surface">API Key</label>
                    <input
                      type="password"
                      placeholder="••••••••••••••••"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full h-9 px-3 bg-surface-container-lowest rounded-lg text-xs font-mono border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-on-surface">Nombre de Instancia</label>
                    <input
                      type="text"
                      placeholder="bee-dental"
                      value={instanceName}
                      onChange={(e) => setInstanceName(e.target.value)}
                      className="w-full h-9 px-3 bg-surface-container-lowest rounded-lg text-xs font-mono border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </details>
          </div>

          {/* QR Code Presentation Box */}
          {qrCodeData && (
            <div className="bg-surface-container-lowest p-6 rounded-3xl border-2 border-emerald-500/50 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-lg text-on-surface flex items-center gap-2">
                    <Smartphone size={20} className="text-emerald-600" />
                    <span>Escanea este Código QR con tu WhatsApp</span>
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    1. Abre WhatsApp en tu teléfono móvil.<br />
                    2. Ve a <strong>Ajustes / Configuración &gt; Dispositivos vinculados</strong>.<br />
                    3. Toca en <strong>Vincular un dispositivo</strong> y apunta la cámara a este código.
                  </p>
                </div>

                <button
                  onClick={() => setQrCodeData(null)}
                  className="text-xs font-bold text-on-surface-variant hover:text-on-surface"
                >
                  ✕ Cerrar QR
                </button>
              </div>

              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-surface-container-high w-fit mx-auto shadow-inner">
                {qrCodeData.startsWith("data:image") ? (
                  <img
                    src={qrCodeData}
                    alt="Código QR WhatsApp"
                    className="w-64 h-64 object-contain rounded-lg"
                  />
                ) : (
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                      qrCodeData
                    )}`}
                    alt="Código QR WhatsApp"
                    className="w-64 h-64 object-contain rounded-lg"
                  />
                )}
                <span className="text-[11px] text-on-surface-variant mt-3 font-semibold flex items-center gap-1.5">
                  <RefreshCw size={12} className="animate-spin text-emerald-600" />
                  <span>Actualizando estado de escaneo en tiempo real...</span>
                </span>
              </div>

              {pairingCode && (
                <div className="text-center">
                  <span className="text-xs text-on-surface-variant">O vincula con código numérico: </span>
                  <span className="font-mono font-bold text-primary text-sm bg-primary-fixed/30 px-3 py-1 rounded-lg">
                    {pairingCode}
                  </span>
                </div>
              )}
            </div>
          )}

          {errorMessage && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900 text-xs">
              <AlertTriangle size={18} className="shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="font-bold">Aviso del Canal de WhatsApp:</p>
                <p>{errorMessage}</p>
                <p className="mt-1 text-[11px] text-amber-800">
                  Si no logra establecer conexión, verifique que la sesión no haya caducado en su teléfono móvil o contacte con soporte técnico.
                </p>
              </div>
            </div>
          )}

          {/* Test WhatsApp Message Sender */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high/80 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-on-surface flex items-center gap-2">
              <Send size={16} className="text-primary" />
              <span>Prueba de Envío de Mensaje Clínico</span>
            </h3>

            {testSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-900 text-xs font-semibold">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>¡Mensaje de prueba enviado con éxito a través de WhatsApp!</span>
              </div>
            )}

            <form onSubmit={handleSendTest} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Número de Destino (con código país)</label>
                <input
                  type="tel"
                  required
                  placeholder="Ej. 18496323258 o 34600000000"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-on-surface">Texto del Mensaje</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high"
                  />
                  <button
                    type="submit"
                    disabled={sendingTest}
                    className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-container transition-all shrink-0 flex items-center gap-1.5"
                  >
                    <Send size={14} />
                    <span>{sendingTest ? "Enviando..." : "Enviar"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Datos Generales */}
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
              <label className="text-xs font-bold text-on-surface">Directora Médica Responsable</label>
              <input
                type="text"
                defaultValue="Dra. Leticia Bueno"
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface">Teléfono / WhatsApp de la Clínica</label>
              <input
                type="text"
                defaultValue="849-632-3258"
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Horarios y Agenda */}
      {activeTab === "operational" && (
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high/80 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-on-surface">Jornada Clínica y Duración de Consultas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-on-surface">Hora de Apertura</label>
              <input
                type="time"
                defaultValue="08:30"
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl border border-surface-container-high"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-on-surface">Hora de Cierre</label>
              <input
                type="time"
                defaultValue="19:30"
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl border border-surface-container-high"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-on-surface">Duración Estándar Turno (min)</label>
              <input
                type="number"
                defaultValue={30}
                className="w-full h-10 px-3 bg-surface-container-low rounded-xl border border-surface-container-high"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Seguros Médicos */}
      {activeTab === "insurance" && (
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-on-surface">Módulo de Seguros Médicos (ARS)</h3>
              <p className="text-xs text-on-surface-variant">Habilitar cálculo automático de copagos y reclamaciones.</p>
            </div>
            <input
              type="checkbox"
              checked={insuranceEnabled}
              onChange={(e) => setInsuranceEnabled(e.target.checked)}
              className="w-5 h-5 accent-primary cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Bottom Save Bar */}
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
