"use client";

import React, { useState } from "react";
import { Receipt, Plus, Search, DollarSign, Printer, CheckCircle, Clock, AlertTriangle } from "lucide-react";

interface InvoiceItem {
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
}

export default function BillingPage() {
  const [search, setSearch] = useState("");

  const invoices: InvoiceItem[] = [
    {
      id: "inv-1",
      invoiceNumber: "FAC-00412",
      patientName: "Laura Martínez Gómez",
      recordNumber: "EXP-0142",
      issueDate: "27/10/2026",
      totalDop: 65000,
      insuranceCoveredDop: 0,
      patientPortionDop: 65000,
      paidAmountDop: 65000,
      balanceDop: 0,
      status: "PAID",
    },
    {
      id: "inv-2",
      invoiceNumber: "FAC-00413",
      patientName: "Carlos Henríquez Peña",
      recordNumber: "EXP-0211",
      issueDate: "27/10/2026",
      totalDop: 45000,
      insuranceCoveredDop: 0,
      patientPortionDop: 45000,
      paidAmountDop: 30000,
      balanceDop: 15000,
      status: "PARTIALLY_PAID",
    },
    {
      id: "inv-3",
      invoiceNumber: "FAC-00414",
      patientName: "Ramón Valdez Cruz",
      recordNumber: "EXP-0305",
      issueDate: "26/10/2026",
      totalDop: 3500,
      insuranceCoveredDop: 0,
      patientPortionDop: 3500,
      paidAmountDop: 0,
      balanceDop: 3500,
      status: "ISSUED",
    },
    {
      id: "inv-4",
      invoiceNumber: "FAC-00415",
      patientName: "Lucía Gómez Rosario",
      recordNumber: "EXP-0089",
      issueDate: "25/10/2026",
      totalDop: 15000,
      insuranceCoveredDop: 0,
      patientPortionDop: 15000,
      paidAmountDop: 15000,
      balanceDop: 0,
      status: "PAID",
    },
  ];

  const filtered = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.patientName.toLowerCase().includes(search.toLowerCase()) ||
      inv.recordNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">
            Facturación, Cobros y Cuentas por Cobrar
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Emisión de comprobantes, abonos parciales y registro fiscal de caja en DOP
          </p>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:bg-primary-container transition-all">
          <Plus size={16} />
          <span>Emitir Nueva Factura</span>
        </button>
      </div>

      <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-high/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Buscar por número de factura o paciente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-surface-container-low rounded-xl text-xs sm:text-sm text-on-surface border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all"
          />
        </div>
        <span className="text-xs font-semibold text-on-surface-variant">
          {filtered.length} factura(s)
        </span>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-surface-container-high bg-surface-container-low/50 text-on-surface-variant font-bold text-xs">
                <th className="py-3 px-4">No. Factura</th>
                <th className="py-3 px-4">Paciente</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Total (DOP)</th>
                <th className="py-3 px-4">Pagado</th>
                <th className="py-3 px-4">Saldo Pendiente</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-primary">{inv.invoiceNumber}</td>
                  <td className="py-3.5 px-4 font-bold text-on-surface">
                    <div className="flex flex-col">
                      <span>{inv.patientName}</span>
                      <span className="text-[11px] font-normal text-on-surface-variant">{inv.recordNumber}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant">{inv.issueDate}</td>
                  <td className="py-3.5 px-4 font-bold text-on-surface">
                    RD$ {inv.totalDop.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-emerald-700 font-semibold">
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
                      <button
                        onClick={() => window.print()}
                        className="p-1.5 rounded-lg border border-surface-container-high hover:bg-surface-container text-on-surface-variant"
                        title="Imprimir Factura"
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
      </div>
    </div>
  );
}

