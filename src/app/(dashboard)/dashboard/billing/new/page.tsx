"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Receipt, Plus, Trash2, ChevronLeft, Check, Sparkles, Printer } from "lucide-react";

interface InvoiceRow {
  id: string;
  service: string;
  price: number;
  quantity: number;
}

export default function NewBillingPage() {
  const router = useRouter();
  const [patientName, setPatientName] = useState("Laura Martínez Gómez");
  const [recordNumber, setRecordNumber] = useState("EXP-0142");
  const [paymentMethod, setPaymentMethod] = useState("Tarjeta de Crédito / Débito");
  const [items, setItems] = useState<InvoiceRow[]>([
    { id: "1", service: "Diseño Digital de Sonrisa (DSD)", price: 15000, quantity: 1 },
  ]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const subtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: String(Date.now()), service: "Profilaxis y Limpieza Ultrasonido", price: 3500, quantity: 1 },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((it) => it.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `FAC-${Math.floor(10000 + Math.random() * 90000)}`,
      patientName,
      recordNumber,
      issueDate: new Date().toLocaleDateString("es-ES"),
      totalDop: total,
      insuranceCoveredDop: 0,
      patientPortionDop: total,
      paidAmountDop: total,
      balanceDop: 0,
      status: "PAID",
      paymentMethod,
    };

    try {
      const existing = JSON.parse(localStorage.getItem("bee_custom_invoices") || "[]");
      localStorage.setItem("bee_custom_invoices", JSON.stringify([newInvoice, ...existing]));
    } catch (err) {
      console.error(err);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      router.push("/dashboard/billing");
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/billing"
          className="w-9 h-9 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
        >
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface">Emitir Nueva Factura</h1>
          <p className="text-xs text-on-surface-variant">
            Registro de cobro fiscal y comprobante clínico • Bee Dental
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900 text-sm font-semibold animate-in fade-in">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Check size={18} />
          </div>
          <div>
            <p className="font-bold">¡Factura emitida y registrada correctamente!</p>
            <p className="text-xs text-emerald-700">Redirigiendo a facturación y caja...</p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high/80 shadow-sm space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface">Paciente *</label>
            <input
              type="text"
              required
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full h-11 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface">No. Expediente Clínico</label>
            <input
              type="text"
              value={recordNumber}
              onChange={(e) => setRecordNumber(e.target.value)}
              className="w-full h-11 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Conceptos / Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-primary uppercase tracking-wider">
              Conceptos y Servicios Prestados
            </label>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              <Plus size={14} />
              <span>Agregar concepto</span>
            </button>
          </div>

          <div className="space-y-2">
            {items.map((it, idx) => (
              <div key={it.id} className="grid grid-cols-12 gap-2 items-center bg-surface-container-low p-2.5 rounded-xl">
                <div className="col-span-6">
                  <input
                    type="text"
                    value={it.service}
                    onChange={(e) => {
                      const next = [...items];
                      next[idx].service = e.target.value;
                      setItems(next);
                    }}
                    placeholder="Descripción del servicio"
                    className="w-full h-9 px-2.5 bg-surface-container-lowest rounded-lg text-xs border border-surface-container-high"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    value={it.price}
                    onChange={(e) => {
                      const next = [...items];
                      next[idx].price = Number(e.target.value);
                      setItems(next);
                    }}
                    placeholder="Precio"
                    className="w-full h-9 px-2.5 bg-surface-container-lowest rounded-lg text-xs border border-surface-container-high font-mono"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    min={1}
                    value={it.quantity}
                    onChange={(e) => {
                      const next = [...items];
                      next[idx].quantity = Number(e.target.value);
                      setItems(next);
                    }}
                    className="w-full h-9 px-2 bg-surface-container-lowest rounded-lg text-xs border border-surface-container-high text-center font-bold"
                  />
                </div>
                <div className="col-span-1 flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(it.id)}
                    className="text-on-surface-variant hover:text-error transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Método de Pago */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface">Método de Pago</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full h-11 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Tarjeta de Crédito / Débito">Tarjeta de Crédito / Débito</option>
            <option value="Efectivo en Caja">Efectivo en Caja</option>
            <option value="Transferencia Bancaria">Transferencia Bancaria</option>
            <option value="Seguro Médico / ARS (Copago)">Seguro Médico / ARS (Copago)</option>
          </select>
        </div>

        {/* Totales */}
        <div className="bg-surface-container-low p-4 rounded-xl space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between text-on-surface-variant">
            <span>Subtotal:</span>
            <span className="font-mono">RD$ {subtotal.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-on-surface-variant">
            <span>ITBIS (18%):</span>
            <span className="font-mono">RD$ {tax.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-on-surface border-t border-surface-container-high pt-2">
            <span>Total a Cobrar:</span>
            <span className="text-primary font-mono">
              RD$ {total.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <Link
            href="/dashboard/billing"
            className="px-4 py-2.5 rounded-xl border border-surface-container-high text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:bg-primary-container transition-all flex items-center gap-2"
          >
            <Receipt size={16} />
            <span>Emitir Comprobante</span>
          </button>
        </div>
      </form>
    </div>
  );
}
