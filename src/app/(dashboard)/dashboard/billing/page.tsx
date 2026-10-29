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
} from "lucide-react";

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  patientName: string;
  recordNumber: string;
  issueDate: string;
  totalDop: number;
  insuranceCoveredDop: number;
  patientPortionDop: number;
  paidAmountDop: number;
  balanceDop: number;
  status: "PAID" | "PARTIALLY_PAID" | "ISSUED" | "CANCELLED";
  paymentMethod?: string;
}

export default function BillingPage() {
  const [search, setSearch] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<InvoiceItem | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);

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

  const filtered = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.patientName.toLowerCase().includes(search.toLowerCase()) ||
      inv.recordNumber.toLowerCase().includes(search.toLowerCase())
  );

  const totalFacturado = invoices.reduce((acc, i) => acc + i.totalDop, 0);
  const totalCobrado = invoices.reduce((acc, i) => acc + i.paidAmountDop, 0);
  const totalPorCobrar = invoices.reduce((acc, i) => acc + i.balanceDop, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">
            Facturación, Cobros y Caja
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Emisión de comprobantes fiscales, registro de abonos y control de caja en DOP
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
            <span>Emitir Nueva Factura</span>
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
          <p className="text-xs text-on-surface-variant/70 mt-1">Acumulado en el período</p>
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
            Por Cobrar / Pendiente
          </span>
          <p className="font-display text-2xl font-bold text-amber-700 mt-1">
            RD$ {totalPorCobrar.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-on-surface-variant/70 mt-1">Saldos activos de pacientes</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-high/80 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Buscar por número de factura, paciente o expediente..."
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
                No hay facturas ni cuentas pendientes de prueba. Haz clic en &quot;Emitir Nueva Factura&quot; para registrar un cobro clínico.
              </p>
            </div>
            <Link
              href="/dashboard/billing/new"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:bg-primary-container"
            >
              <Plus size={16} />
              <span>Emitir Primer Comprobante</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-surface-container-high bg-surface-container-low/50 text-on-surface-variant font-bold text-xs">
                  <th className="py-3 px-4">No. Factura</th>
                  <th className="py-3 px-4">Paciente</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Cobrado</th>
                  <th className="py-3 px-4">Saldo Pendiente</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">{inv.invoiceNumber}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface">{inv.patientName}</span>
                        <span className="text-[11px] text-on-surface-variant">{inv.recordNumber}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-on-surface-variant">{inv.issueDate}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-on-surface">
                      RD$ {inv.totalDop.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-700">
                      RD$ {inv.paidAmountDop.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4">
                      {inv.balanceDop > 0 ? (
                        <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded">
                          RD$ {inv.balanceDop.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">RD$ 0.00</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          inv.status === "PAID"
                            ? "bg-emerald-100 text-emerald-800"
                            : inv.status === "PARTIALLY_PAID"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {inv.status === "PAID"
                          ? "Pagada"
                          : inv.status === "PARTIALLY_PAID"
                          ? "Abono Parcial"
                          : "Emitida"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
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
                          className="p-1.5 rounded-lg border border-surface-container-high hover:bg-surface-container text-on-surface-variant transition-colors"
                          title="Ver Comprobante / Imprimir"
                        >
                          <Printer size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Printable View Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl border border-surface-container-high max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-4 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Bee Dental" className="h-8 w-auto object-contain" />
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold text-sm text-on-surface">Bee Dental Dominicana S.R.L.</p>
                  <p className="text-on-surface-variant">RNC: 1-32-45678-9 • Directora: Dra. Leticia Bueno</p>
                  <p className="text-on-surface-variant">Madrid / Santo Domingo • Tel: 849-632-3258</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-primary">{selectedInvoice.invoiceNumber}</span>
                  <p className="text-on-surface-variant">{selectedInvoice.issueDate}</p>
                </div>
              </div>

              <div className="bg-surface-container-low p-3 rounded-xl space-y-1">
                <p><strong>Paciente:</strong> {selectedInvoice.patientName}</p>
                <p><strong>No. Expediente:</strong> {selectedInvoice.recordNumber}</p>
                <p><strong>Forma de Pago:</strong> {selectedInvoice.paymentMethod || "Efectivo / Tarjeta"}</p>
              </div>

              <div className="space-y-1 border-t border-surface-container-high pt-3">
                <div className="flex justify-between py-1 text-on-surface-variant">
                  <span>Total Servicios Realizados:</span>
                  <span className="font-mono">RD$ {selectedInvoice.totalDop.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between py-1 text-emerald-800 font-bold">
                  <span>Monto Pagado:</span>
                  <span className="font-mono">RD$ {selectedInvoice.paidAmountDop.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between py-1 text-base font-bold text-on-surface border-t border-surface-container-high pt-2">
                  <span>Saldo Pendiente:</span>
                  <span className="font-mono text-primary">
                    RD$ {selectedInvoice.balanceDop.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-surface-container-high">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-sm hover:bg-primary-container"
              >
                <Printer size={15} />
                <span>Imprimir Recibo</span>
              </button>
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
