"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Receipt,
  Plus,
  Trash2,
  ChevronLeft,
  Check,
  Sparkles,
  Printer,
  ShieldCheck,
  AlertTriangle,
  QrCode,
  Building2,
  User,
  Clock,
  Loader2,
  Info,
} from "lucide-react";

interface InvoiceRow {
  id: string;
  service: string;
  price: number;
  quantity: number;
  indicadorFacturacion: 4 | 1; // 4 = Exento (Servicios Odontológicos Ley 11-92), 1 = Gravado 18%
  piezaDental?: string;
  coberturaArs?: string;
}

export default function NewBillingPage() {
  const router = useRouter();

  // Basic Buyer & Clinical info
  const [patientName, setPatientName] = useState("Laura Martínez Gómez");
  const [buyerRnc, setBuyerRnc] = useState("");
  const [recordNumber, setRecordNumber] = useState("EXP-0142");
  const [paymentMethod, setPaymentMethod] = useState("Tarjeta de Crédito / Débito");

  // DGII e-CF Fields
  const [tipoEcf, setTipoEcf] = useState<"32" | "31" | "34" | "44" | "45">("32");
  const [tipoPago, setTipoPago] = useState<1 | 2>(1); // 1 = Contado, 2 = Crédito
  const [transmitEcf, setTransmitEcf] = useState(true);

  // Items
  const [items, setItems] = useState<InvoiceRow[]>([
    {
      id: "1",
      service: "Diseño Digital de Sonrisa (DSD) + Modelado 3D",
      price: 15000,
      quantity: 1,
      indicadorFacturacion: 4, // Exento por ley médica
      piezaDental: "Sector Anterior",
    },
  ]);

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [ecfResult, setEcfResult] = useState<any | null>(null);
  const [ecfError, setEcfError] = useState<string | null>(null);

  // e-CF Configuration from localStorage
  const [ecfApiKey, setEcfApiKey] = useState("");
  const [ecfApiUrl, setEcfApiUrl] = useState("https://ecf.autodilerpro.com/api/v1");

  useEffect(() => {
    try {
      const storedKey = localStorage.getItem("bee_ecf_api_key");
      const storedUrl = localStorage.getItem("bee_ecf_api_url");
      if (storedKey) setEcfApiKey(storedKey);
      if (storedUrl) setEcfApiUrl(storedUrl);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Compute Totals
  const montoExento = items
    .filter((it) => it.indicadorFacturacion === 4)
    .reduce((acc, it) => acc + it.price * it.quantity, 0);

  const montoGravado = items
    .filter((it) => it.indicadorFacturacion === 1)
    .reduce((acc, it) => acc + it.price * it.quantity, 0);

  const itbisTotal = Math.round(montoGravado * 0.18);
  const total = montoExento + montoGravado + itbisTotal;

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: String(Date.now()),
        service: "Profilaxis y Limpieza Ultrasonido",
        price: 3500,
        quantity: 1,
        indicadorFacturacion: 4,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((it) => it.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setEcfError(null);

    let assignedEncf = `B${tipoEcf}0000${Math.floor(1000 + Math.random() * 9000)}`;
    let codigoSeguridad = "";
    let fechaHoraFirma = "";
    let qrDataUri = "";
    let qrUrl = "";
    let trackId = "";
    let dgiiStatus = "EMITIDA_LOCAL";

    // If online DGII transmission is requested
    if (transmitEcf) {
      try {
        const payload = {
          ecfApiUrl,
          ecfApiKey,
          tipoEcf,
          tipoIngresos: "01",
          tipoPago,
          externalReference: `BEE-CLINIC-${Date.now()}`,
          comprador: {
            rnc: buyerRnc ? buyerRnc.replace(/[^0-9]/g, "") : undefined,
            razonSocial: patientName.toUpperCase(),
          },
          items: items.map((it, idx) => ({
            codigo: `ODO-${String(idx + 1).padStart(3, "0")}`,
            nombre: it.service,
            piezaDental: it.piezaDental || undefined,
            coberturaArs: it.coberturaArs || undefined,
            indicadorBienoServicio: it.indicadorFacturacion === 4 ? 2 : 1, // 2 = Servicio, 1 = Bien
            indicadorFacturacion: it.indicadorFacturacion,
            cantidad: it.quantity,
            precioUnitario: it.price,
          })),
        };

        const res = await fetch("/api/v1/ecf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const resData = await res.json();

        if (res.ok && resData.success && resData.data) {
          const apiData = resData.data;
          assignedEncf = apiData.encf || assignedEncf;
          codigoSeguridad = apiData.codigoSeguridad || "";
          fechaHoraFirma = apiData.fechaHoraFirma || "";
          qrDataUri = apiData.qrDataUri || "";
          qrUrl = apiData.qrUrl || "";
          trackId = apiData.trackId || "";
          dgiiStatus = apiData.status || "ACCEPTED";
          setEcfResult(apiData);
        } else {
          // If the hub returned an error, we show error notice
          setEcfError(
            resData.error ||
              "No se pudo conectar con el e-CF API Hub. Verifique su API Key o conectividad."
          );
        }
      } catch (err: any) {
        console.warn("Fallo transmitiendo e-CF a DGII:", err);
        setEcfError(`Error de red al conectar con el Hub de Facturación: ${err.message}`);
      }
    }

    const newInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: assignedEncf,
      encf: assignedEncf,
      tipoEcf,
      patientName,
      rncComprador: buyerRnc || undefined,
      recordNumber,
      issueDate: new Date().toLocaleDateString("es-ES"),
      totalDop: total,
      montoExentoDop: montoExento,
      montoGravadoDop: montoGravado,
      itbisDop: itbisTotal,
      insuranceCoveredDop: 0,
      patientPortionDop: total,
      paidAmountDop: tipoPago === 1 ? total : 0,
      balanceDop: tipoPago === 1 ? 0 : total,
      status: tipoPago === 1 ? "PAID" : "ISSUED",
      paymentMethod,
      codigoSeguridad,
      fechaHoraFirma: fechaHoraFirma || new Date().toLocaleString("es-ES"),
      qrDataUri,
      qrUrl,
      trackId,
      statusDGII: dgiiStatus,
      items: items.map((it) => ({
        service: it.service,
        price: it.price,
        quantity: it.quantity,
        indicadorFacturacion: it.indicadorFacturacion,
        piezaDental: it.piezaDental,
        coberturaArs: it.coberturaArs,
      })),
    };

    try {
      const existing = JSON.parse(localStorage.getItem("bee_custom_invoices") || "[]");
      localStorage.setItem("bee_custom_invoices", JSON.stringify([newInvoice, ...existing]));
    } catch (err) {
      console.error(err);
    }

    setIsSubmitting(false);
    setSavedSuccess(true);

    setTimeout(() => {
      router.push("/dashboard/billing");
    }, 1800);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/billing"
          className="w-9 h-9 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
        >
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface flex items-center gap-2">
            <span>Emitir Comprobante Fiscal Electrónico</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-fixed text-primary">
              e-CF DGII
            </span>
          </h1>
          <p className="text-xs text-on-surface-variant">
            Factura electrónica bajo la Ley 32-23 de la República Dominicana • Bee Dental
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900 text-sm font-semibold animate-in fade-in">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Check size={18} />
          </div>
          <div>
            <p className="font-bold">
              {ecfResult?.encf
                ? `¡Comprobante Electrónico ${ecfResult.encf} emitido con éxito ante la DGII!`
                : "¡Factura registrada y guardada exitosamente!"}
            </p>
            <p className="text-xs text-emerald-700">
              {ecfResult?.codigoSeguridad && (
                <span>Código de Seguridad: <strong>{ecfResult.codigoSeguridad}</strong> • </span>
              )}
              Redirigiendo a facturación y caja...
            </p>
          </div>
        </div>
      )}

      {ecfError && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900 text-xs animate-in fade-in">
          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Aviso del Sistema e-CF DGII:</p>
            <p>{ecfError}</p>
            <p className="text-[11px] text-amber-800">
              La factura ha sido registrada en el sistema de Bee Dental. Para transmitirla en vivo a la DGII, verifique que la <strong>X-API-Key</strong> esté configurada en <em>Configuración &gt; Integraciones</em>.
            </p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-surface-container-lowest p-6 rounded-3xl border border-surface-container-high/80 shadow-sm space-y-6"
      >
        {/* e-CF Header Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-surface-container-low border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-emerald-950 flex items-center gap-1.5">
                <span>Conexión e-CF API Hub (Ley 32-23)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </h3>
              <p className="text-xs text-emerald-800">
                Firma digital XMLDSig, validación XSD y código QR oficial en tiempo real.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer self-start sm:self-center">
            <input
              type="checkbox"
              checked={transmitEcf}
              onChange={(e) => setTransmitEcf(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary"
            />
            <span className="text-xs font-bold text-on-surface">Transmitir a DGII</span>
          </label>
        </div>

        {/* Tipo de Comprobante & Tipo de Pago */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface flex items-center justify-between">
              <span>Tipo de Comprobante e-CF *</span>
              <span className="text-[10px] text-primary font-mono font-bold">
                Serie {tipoEcf === "32" ? "E32" : tipoEcf === "31" ? "E31" : `E${tipoEcf}`}
              </span>
            </label>
            <select
              value={tipoEcf}
              onChange={(e) => setTipoEcf(e.target.value as any)}
              className="w-full h-11 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm font-semibold border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="32">E32 — Factura de Consumo Electrónica (Pacientes / Consumidor Final)</option>
              <option value="31">E31 — Factura de Crédito Fiscal Electrónica (Empresas / Cobro a ARS con RNC)</option>
              <option value="34">E34 — Nota de Crédito Electrónica (Devoluciones / Corrección)</option>
              <option value="44">E44 — Regímenes Especiales (Exenta Ley Incentivo)</option>
              <option value="45">E45 — Comprobante Gubernamental (Estado Dominicano)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface">Término y Tipo de Pago</label>
            <select
              value={tipoPago}
              onChange={(e) => setTipoPago(Number(e.target.value) as any)}
              className="w-full h-11 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm font-semibold border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value={1}>1 — Contado (Efectivo, Tarjeta, Transferencia)</option>
              <option value={2}>2 — Crédito (Cobro a ARS a 30 días / Saldo Pendiente)</option>
            </select>
          </div>
        </div>

        {/* Patient / Buyer Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-bold text-on-surface">
              {tipoEcf === "31" ? "Razón Social de la Empresa o ARS *" : "Nombre del Paciente / Comprador *"}
            </label>
            <input
              type="text"
              required
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Ej. Laura Martínez Gómez o ARS Humano Seguros"
              className="w-full h-11 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface flex items-center justify-between">
              <span>{tipoEcf === "31" ? "RNC Comprador *" : "RNC / Cédula (Opcional)"}</span>
              {tipoEcf === "31" && <span className="text-[10px] text-rose-600 font-bold">Obligatorio</span>}
            </label>
            <input
              type="text"
              required={tipoEcf === "31"}
              value={buyerRnc}
              onChange={(e) => setBuyerRnc(e.target.value)}
              placeholder={tipoEcf === "31" ? "Ej. 101010101" : "Ej. 001-1234567-8"}
              className="w-full h-11 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm font-mono border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface">No. Expediente Clínico</label>
            <input
              type="text"
              value={recordNumber}
              onChange={(e) => setRecordNumber(e.target.value)}
              className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface">Medio de Pago</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Tarjeta de Crédito / Débito">Tarjeta de Crédito / Débito</option>
              <option value="Efectivo en Caja">Efectivo en Caja</option>
              <option value="Transferencia Bancaria">Transferencia Bancaria</option>
              <option value="Seguro Médico / ARS (Copago)">Seguro Médico / ARS (Copago)</option>
            </select>
          </div>
        </div>

        {/* Conceptos / Items */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Receipt size={14} />
              <span>Servicios Odontológicos &amp; Conceptos Facturados</span>
            </label>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              <Plus size={14} />
              <span>Agregar Servicio</span>
            </button>
          </div>

          <div className="space-y-3">
            {items.map((it, idx) => (
              <div
                key={it.id}
                className="bg-surface-container-low p-3.5 rounded-2xl border border-surface-container-high/60 space-y-2.5"
              >
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-12 sm:col-span-6">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">
                      Descripción del Tratamiento
                    </label>
                    <input
                      type="text"
                      required
                      value={it.service}
                      onChange={(e) => {
                        const next = [...items];
                        next[idx].service = e.target.value;
                        setItems(next);
                      }}
                      placeholder="Ej. Endodoncia Molar Multirradicular..."
                      className="w-full h-9 px-2.5 bg-surface-container-lowest rounded-lg text-xs border border-surface-container-high font-medium"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">
                      Precio Unitario (RD$)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={it.price}
                      onChange={(e) => {
                        const next = [...items];
                        next[idx].price = Number(e.target.value);
                        setItems(next);
                      }}
                      className="w-full h-9 px-2.5 bg-surface-container-lowest rounded-lg text-xs border border-surface-container-high font-mono font-bold"
                    />
                  </div>

                  <div className="col-span-4 sm:col-span-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase text-center block">
                      Cant.
                    </label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={it.quantity}
                      onChange={(e) => {
                        const next = [...items];
                        next[idx].quantity = Number(e.target.value);
                        setItems(next);
                      }}
                      className="w-full h-9 px-2 bg-surface-container-lowest rounded-lg text-xs border border-surface-container-high text-center font-bold"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1 flex justify-center pt-4">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(it.id)}
                      className="text-on-surface-variant hover:text-error transition-colors p-1"
                      title="Eliminar concepto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Sub-row: Indicador ITBIS + Pieza Dental */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-surface-container-high/40">
                  <div className="sm:col-span-2 flex items-center gap-3">
                    <span className="text-[11px] text-on-surface-variant font-medium">Tratamiento Fiscal:</span>
                    <label className="flex items-center gap-1.5 text-xs cursor-pointer font-semibold text-emerald-900">
                      <input
                        type="radio"
                        name={`facturacion_${it.id}`}
                        checked={it.indicadorFacturacion === 4}
                        onChange={() => {
                          const next = [...items];
                          next[idx].indicadorFacturacion = 4;
                          setItems(next);
                        }}
                        className="text-primary focus:ring-primary"
                      />
                      <span>Exento ITBIS 0% (Servicio Odontológico Ley 11-92)</span>
                    </label>

                    <label className="flex items-center gap-1.5 text-xs cursor-pointer font-semibold text-on-surface">
                      <input
                        type="radio"
                        name={`facturacion_${it.id}`}
                        checked={it.indicadorFacturacion === 1}
                        onChange={() => {
                          const next = [...items];
                          next[idx].indicadorFacturacion = 1;
                          setItems(next);
                        }}
                        className="text-primary focus:ring-primary"
                      />
                      <span>Gravado 18%</span>
                    </label>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Pieza dental (Ej. #16)"
                      value={it.piezaDental || ""}
                      onChange={(e) => {
                        const next = [...items];
                        next[idx].piezaDental = e.target.value;
                        setItems(next);
                      }}
                      className="w-full h-8 px-2.5 bg-surface-container-lowest rounded-lg text-xs border border-surface-container-high font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totales Fiscales DGII */}
        <div className="bg-surface-container-low p-5 rounded-2xl space-y-2 text-xs sm:text-sm border border-surface-container-high/60">
          <div className="flex justify-between text-on-surface-variant">
            <span>Servicios Odontológicos Exentos (0% ITBIS):</span>
            <span className="font-mono font-semibold">
              RD$ {montoExento.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
            </span>
          </div>

          {montoGravado > 0 && (
            <>
              <div className="flex justify-between text-on-surface-variant">
                <span>Monto Gravado (18%):</span>
                <span className="font-mono">
                  RD$ {montoGravado.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>ITBIS Liquidado (18%):</span>
                <span className="font-mono font-bold text-amber-900">
                  RD$ {itbisTotal.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </>
          )}

          <div className="flex justify-between text-base font-bold text-on-surface border-t border-surface-container-high pt-2.5">
            <span className="flex items-center gap-1.5">
              <span>Monto Total a Cobrar:</span>
              <span className="text-xs font-normal text-on-surface-variant">
                ({tipoPago === 1 ? "Contado" : "Crédito"})
              </span>
            </span>
            <span className="text-primary font-mono text-xl">
              RD$ {total.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Buttons Bar */}
        <div className="pt-2 flex items-center justify-between border-t border-surface-container-high">
          <Link
            href="/dashboard/billing"
            className="px-4 py-2.5 rounded-xl border border-surface-container-high text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-primary text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:bg-primary-container transition-all flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Firmando y Transmitiendo e-CF...</span>
              </>
            ) : (
              <>
                <Receipt size={16} />
                <span>Emitir Comprobante Electrónico (e-CF)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
