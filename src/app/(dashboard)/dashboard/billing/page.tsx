"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Receipt,
  Plus,
  Search,
  DollarSign,
  Printer,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  CreditCard,
  Building2,
  Trash2,
  ShieldCheck,
  QrCode,
  Download,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  encf?: string;
  tipoEcf?: string;
  patientName: string;
  rncComprador?: string;
  recordNumber: string;
  issueDate: string;
  totalDop: number;
  montoExentoDop?: number;
  montoGravadoDop?: number;
  itbisDop?: number;
  insuranceCoveredDop: number;
  patientPortionDop: number;
  paidAmountDop: number;
  balanceDop: number;
  status: "PAID" | "PARTIALLY_PAID" | "ISSUED" | "CANCELLED";
  paymentMethod?: string;
  codigoSeguridad?: string;
  fechaHoraFirma?: string;
  qrDataUri?: string;
  qrUrl?: string;
  trackId?: string;
  statusDGII?: string;
  items?: Array<{
    service: string;
    price: number;
    quantity: number;
    indicadorFacturacion?: number;
    piezaDental?: string;
    coberturaArs?: string;
  }>;
}

export default function BillingPage() {
  const [search, setSearch] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<InvoiceItem | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [copiedEncf, setCopiedEncf] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bee_custom_invoices");
      if (stored) {
        setInvoices(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleRegisterPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalInvoice) return;

    const updated = invoices.map((inv) => {
      if (inv.id === paymentModalInvoice.id) {
        const newPaid = inv.paidAmountDop + Number(paymentAmount);
        const newBalance = Math.max(0, inv.totalDop - newPaid);
        const newStatus: "PAID" | "PARTIALLY_PAID" = newBalance === 0 ? "PAID" : "PARTIALLY_PAID";
        return {
          ...inv,
          paidAmountDop: newPaid,
          balanceDop: newBalance,
          status: newStatus,
        };
      }
      return inv;
    });

    setInvoices(updated);
    try {
      localStorage.setItem("bee_custom_invoices", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    setPaymentModalInvoice(null);
  };

  const handleClearInvoices = () => {
    if (confirm("¿Deseas vaciar todas las facturas y comprobantes de prueba?")) {
      setInvoices([]);
      try {
        localStorage.removeItem("bee_custom_invoices");
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEncf(true);
    setTimeout(() => setCopiedEncf(false), 2000);
  };

  const filtered = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      (inv.encf && inv.encf.toLowerCase().includes(search.toLowerCase())) ||
      inv.patientName.toLowerCase().includes(search.toLowerCase()) ||
      inv.recordNumber.toLowerCase().includes(search.toLowerCase())
  );

  const totalFacturado = invoices.reduce((acc, i) => acc + i.totalDop, 0);
  const totalCobrado = invoices.reduce((acc, i) => acc + i.paidAmountDop, 0);
  const totalPorCobrar = invoices.reduce((acc, i) => acc + i.balanceDop, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-on-surface flex items-center gap-2">
            <span>Facturación, Cobros y Comprobantes Electrónicos</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary-fixed text-primary">
              e-CF DGII
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Emisión de comprobantes fiscales según Ley 32-23 de la República Dominicana • Control de caja
          </p>
        </div>

        <div className="flex items-center gap-2">
          {invoices.length > 0 && (
            <button
              onClick={handleClearInvoices}
              className="px-3 py-2 rounded-xl border border-surface-container-high text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={14} />
              <span>Limpiar Datos</span>
            </button>
          )}

          <Link
            href="/dashboard/billing/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:bg-primary-container transition-all"
          >
            <Plus size={16} />
            <span>Emitir Nueva Factura e-CF</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high/80 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            Total Facturado
          </span>
          <p className="font-display text-2xl font-bold text-on-surface mt-1">
            RD$ {totalFacturado.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-on-surface-variant/70 mt-1">Acumulado en el período fiscal</p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high/80 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Total Cobrado en Caja
          </span>
          <p className="font-display text-2xl font-bold text-emerald-700 mt-1">
            RD$ {totalCobrado.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-on-surface-variant/70 mt-1">Liquidado satisfactoriamente</p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high/80 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
            Por Cobrar / Pendiente (ARS / Crédito)
          </span>
          <p className="font-display text-2xl font-bold text-amber-700 mt-1">
            RD$ {totalPorCobrar.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-on-surface-variant/70 mt-1">Saldos activos de pacientes y ARS</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-high/80 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Buscar por e-NCF, paciente, RNC o expediente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-transparent focus:border-primary focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high/80 overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <Receipt size={32} />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-on-surface">Caja y Facturación Limpia</h3>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto mt-1">
                No hay facturas ni comprobantes electrónicos registrados. Haz clic en &quot;Emitir Nueva Factura e-CF&quot; para registrar un cobro clínico oficial ante la DGII.
              </p>
            </div>
            <Link
              href="/dashboard/billing/new"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:bg-primary-container"
            >
              <Plus size={16} />
              <span>Emitir Primer e-CF</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-surface-container-high bg-surface-container-low/50 text-on-surface-variant font-bold text-xs">
                  <th className="py-3 px-4">e-NCF / Comprobante</th>
                  <th className="py-3 px-4">Paciente / Razón Social</th>
                  <th className="py-3 px-4">Fecha Emisión</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Cobrado</th>
                  <th className="py-3 px-4">Saldo</th>
                  <th className="py-3 px-4 text-center">Estado DGII</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {filtered.map((inv) => {
                  const isEcfAccepted = inv.statusDGII === "ACCEPTED";
                  const displayEncf = inv.encf || inv.invoiceNumber;
                  const isE31 = displayEncf.startsWith("E31") || inv.tipoEcf === "31";

                  return (
                    <tr key={inv.id} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-primary">
                        <div className="flex items-center gap-1.5">
                          <span>{displayEncf}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              isE31
                                ? "bg-purple-100 text-purple-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {isE31 ? "E31 Crédito" : "E32 Consumo"}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-on-surface">{inv.patientName}</span>
                          <span className="text-[11px] text-on-surface-variant font-mono">
                            {inv.rncComprador ? `RNC: ${inv.rncComprador} • ` : ""}
                            {inv.recordNumber}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-on-surface-variant">{inv.issueDate}</td>

                      <td className="py-3.5 px-4 font-mono font-bold text-on-surface">
                        RD$ {inv.totalDop.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-emerald-700 font-semibold">
                        RD$ {inv.paidAmountDop.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-3.5 px-4">
                        {inv.balanceDop > 0 ? (
                          <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded font-mono">
                            RD$ {inv.balanceDop.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-semibold">Al día</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                            isEcfAccepted
                              ? "bg-emerald-100 text-emerald-800"
                              : inv.status === "PAID"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          <ShieldCheck size={12} />
                          <span>{isEcfAccepted ? "Aceptado DGII" : inv.statusDGII || "Emitida"}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {inv.balanceDop > 0 && (
                            <button
                              onClick={() => {
                                setPaymentModalInvoice(inv);
                                setPaymentAmount(inv.balanceDop);
                              }}
                              className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-lg transition-colors"
                            >
                              Abonar
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="px-2.5 py-1 rounded-lg border border-surface-container-high hover:bg-surface-container text-primary font-bold text-xs flex items-center gap-1 transition-colors"
                            title="Ver Comprobante Oficial DGII"
                          >
                            <Printer size={13} />
                            <span>Factura</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Official DGII e-CF Printable Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-3xl border border-surface-container-high max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 my-auto max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-surface-container-high">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Bee Dental" className="h-10 w-auto object-contain" />
                <div>
                  <h3 className="font-bold text-sm text-on-surface">BEE DENTAL DOMINICANA S.R.L.</h3>
                  <p className="text-[11px] text-on-surface-variant font-mono">
                    RNC: 1-32-45678-9 • Directora: Dra. Leticia Bueno
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                <X size={18} />
              </button>
            </div>

            {/* Document Title & e-NCF Banner */}
            <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-surface-container-low rounded-2xl border border-emerald-200/80 text-center space-y-1">
              <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                {selectedInvoice.tipoEcf === "31" || selectedInvoice.invoiceNumber.startsWith("E31")
                  ? "Factura de Crédito Fiscal Electrónica (e-CF 31)"
                  : "Factura de Consumo Electrónica (e-CF 32)"}
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-xl sm:text-2xl font-bold text-primary tracking-wide">
                  {selectedInvoice.encf || selectedInvoice.invoiceNumber}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(selectedInvoice.encf || selectedInvoice.invoiceNumber)}
                  className="p-1 rounded text-primary hover:bg-primary-fixed/40 transition-colors"
                  title="Copiar e-NCF"
                >
                  {copiedEncf ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <p className="text-[11px] text-emerald-800">
                Emitida conforme a la Ley No. 32-23 de Facturación Electrónica de la República Dominicana
              </p>
            </div>

            {/* Buyer and Meta info */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-surface-container-low/70 rounded-2xl text-xs">
              <div className="space-y-1">
                <p className="text-on-surface-variant uppercase text-[10px] font-bold">Comprador / Paciente:</p>
                <p className="font-bold text-on-surface text-sm">{selectedInvoice.patientName}</p>
                {selectedInvoice.rncComprador && (
                  <p className="font-mono text-on-surface-variant">RNC/Cédula: {selectedInvoice.rncComprador}</p>
                )}
                <p className="text-on-surface-variant">Expediente: {selectedInvoice.recordNumber}</p>
              </div>

              <div className="space-y-1 text-right">
                <p className="text-on-surface-variant uppercase text-[10px] font-bold">Detalle de Emisión:</p>
                <p className="font-semibold text-on-surface">Fecha: {selectedInvoice.issueDate}</p>
                <p className="text-on-surface-variant">Pago: {selectedInvoice.paymentMethod || "Contado"}</p>
                <p className="text-[11px] font-semibold text-emerald-700">Estado: {selectedInvoice.statusDGII || "ACEPTADA"}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase text-on-surface-variant tracking-wider">
                Detalle de Servicios Odontológicos
              </span>

              <div className="border border-surface-container-high rounded-xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-surface-container-low text-on-surface-variant font-bold border-b border-surface-container-high">
                    <tr>
                      <th className="py-2 px-3 text-left">Concepto</th>
                      <th className="py-2 px-2 text-center">Cant.</th>
                      <th className="py-2 px-3 text-right">Precio</th>
                      <th className="py-2 px-3 text-right">ITBIS</th>
                      <th className="py-2 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-low">
                    {selectedInvoice.items && selectedInvoice.items.length > 0 ? (
                      selectedInvoice.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-3">
                            <p className="font-semibold text-on-surface">{it.service}</p>
                            {it.piezaDental && (
                              <span className="text-[10px] font-mono text-primary font-bold">
                                Pieza: {it.piezaDental}
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-2 text-center font-bold">{it.quantity}</td>
                          <td className="py-2 px-3 text-right font-mono">
                            RD$ {it.price.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2 px-3 text-right text-[11px] font-semibold">
                            {it.indicadorFacturacion === 4 ? (
                              <span className="text-emerald-700">E (0%)</span>
                            ) : (
                              <span className="text-amber-800">18%</span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold">
                            RD$ {(it.price * it.quantity).toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="py-2 px-3 font-semibold text-on-surface">Servicios Odontológicos Integrales</td>
                        <td className="py-2 px-2 text-center font-bold">1</td>
                        <td className="py-2 px-3 text-right font-mono">
                          RD$ {selectedInvoice.totalDop.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-2 px-3 text-right text-emerald-700 font-semibold text-[11px]">E (0%)</td>
                        <td className="py-2 px-3 text-right font-mono font-bold">
                          RD$ {selectedInvoice.totalDop.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals Section */}
            <div className="space-y-1.5 border-t border-surface-container-high pt-3 text-xs">
              <div className="flex justify-between text-on-surface-variant">
                <span>Servicios Exentos de ITBIS (Art. 344 Ley 11-92):</span>
                <span className="font-mono">
                  RD$ {(selectedInvoice.montoExentoDop || selectedInvoice.totalDop).toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                </span>
              </div>
              {selectedInvoice.itbisDop !== undefined && selectedInvoice.itbisDop > 0 && (
                <div className="flex justify-between text-on-surface-variant">
                  <span>ITBIS 18%:</span>
                  <span className="font-mono font-bold text-amber-900">
                    RD$ {selectedInvoice.itbisDop.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-on-surface border-t border-surface-container-high pt-2">
                <span>Monto Total de la Factura:</span>
                <span className="font-mono text-primary text-lg">
                  RD$ {selectedInvoice.totalDop.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* DGII Security Strip & Official QR Code */}
            <div className="p-4 bg-white rounded-2xl border-2 border-emerald-500/40 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Representación Impresa Oficial DGII
                  </span>
                  <p className="text-[11px] text-on-surface-variant pt-1">
                    Código de Seguridad:{" "}
                    <strong className="font-mono text-sm text-primary bg-primary-fixed/30 px-2 py-0.5 rounded">
                      {selectedInvoice.codigoSeguridad || "mUsGWw"}
                    </strong>
                  </p>
                  <p className="text-[11px] text-on-surface-variant font-mono">
                    Fecha y Hora de Firma Digital: {selectedInvoice.fechaHoraFirma || selectedInvoice.issueDate}
                  </p>
                  {selectedInvoice.trackId && (
                    <p className="text-[10px] text-on-surface-variant font-mono">
                      TrackID DGII: {selectedInvoice.trackId}
                    </p>
                  )}
                </div>

                <div className="shrink-0 flex flex-col items-center">
                  {selectedInvoice.qrDataUri ? (
                    <img
                      src={selectedInvoice.qrDataUri}
                      alt="Código QR DGII e-CF"
                      className="w-24 h-24 object-contain border border-surface-container-high rounded-lg p-1 bg-white"
                    />
                  ) : (
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
                        selectedInvoice.qrUrl ||
                          `https://fc.dgii.gov.do/ConsultaTimbreFC?RncEmisor=132456789&ENCF=${selectedInvoice.encf || selectedInvoice.invoiceNumber}&MontoTotal=${selectedInvoice.totalDop}&CodigoSeguridad=${selectedInvoice.codigoSeguridad || "mUsGWw"}`
                      )}`}
                      alt="Código QR DGII e-CF"
                      className="w-24 h-24 object-contain border border-surface-container-high rounded-lg p-1 bg-white"
                    />
                  )}
                  <span className="text-[9px] text-on-surface-variant font-mono mt-1">Escaneo DGII</span>
                </div>
              </div>

              {selectedInvoice.qrUrl && (
                <div className="pt-2 border-t border-surface-container-high/60 flex items-center justify-between text-[11px]">
                  <a
                    href={selectedInvoice.qrUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Verificar validez en portal DGII</span>
                    <ExternalLink size={12} />
                  </a>
                  <span className="text-on-surface-variant font-mono">Firma RSA-SHA256</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-surface-container-high">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-sm hover:bg-primary-container"
                >
                  <Printer size={15} />
                  <span>Imprimir Comprobante Fiscal</span>
                </button>

                <a
                  href={`/api/v1/ecf?encf=${selectedInvoice.encf || selectedInvoice.invoiceNumber}&xml=true`}
                  download
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold rounded-xl transition-colors"
                >
                  <Download size={14} />
                  <span>XML Firmado</span>
                </a>
              </div>

              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 rounded-xl bg-surface-container text-xs font-bold text-on-surface-variant hover:bg-surface-container-high"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Abono Payment Modal */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <div>
                <h3 className="font-display font-bold text-lg text-on-surface">Registrar Abono</h3>
                <p className="text-xs text-on-surface-variant">Factura {paymentModalInvoice.invoiceNumber}</p>
              </div>
              <button
                onClick={() => setPaymentModalInvoice(null)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterPayment} className="space-y-4">
              <div className="bg-surface-container-low p-3 rounded-xl text-xs space-y-1">
                <p><strong>Paciente:</strong> {paymentModalInvoice.patientName}</p>
                <p><strong>Saldo Actual Pendiente:</strong> RD$ {paymentModalInvoice.balanceDop.toLocaleString("es-DO")}</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface">Monto a Abonar (RD$) *</label>
                <input
                  type="number"
                  min={1}
                  max={paymentModalInvoice.balanceDop}
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full h-11 px-3 bg-surface-container-low rounded-xl text-sm font-mono font-bold border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentModalInvoice(null)}
                  className="px-4 py-2 rounded-xl border border-surface-container-high text-xs font-bold text-on-surface-variant hover:bg-surface-container"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:bg-primary-container"
                >
                  Confirmar Cobro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
