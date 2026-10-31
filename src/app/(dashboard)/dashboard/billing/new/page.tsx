"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Receipt,
  Plus,
  Trash2,
  ChevronLeft,
  Check,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Building2,
  User,
  Clock,
  Loader2,
  Info,
  Search,
  X,
  Stethoscope,
  Tag,
  CheckCircle,
  FileText,
  CreditCard,
  Smile,
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

interface PatientSuggestion {
  id: string;
  recordNumber: string;
  name: string;
  idDocument: string;
  phone: string;
  email?: string;
  insuranceProvider?: string;
}

interface DentalCatalogService {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  durationMinutes: number;
  indicadorFacturacion: 4 | 1;
  description: string;
  popular?: boolean;
}

const DEFAULT_PATIENTS: PatientSuggestion[] = [
  {
    id: "p-1",
    name: "Laura Martínez Gómez",
    recordNumber: "EXP-0142",
    idDocument: "402-2894152-3",
    phone: "(809) 555-0142",
    email: "laura.martinez@gmail.com",
    insuranceProvider: "Primera ARS de Humano",
  },
  {
    id: "p-2",
    name: "Carlos Eduardo Méndez",
    recordNumber: "EXP-0189",
    idDocument: "001-1894231-5",
    phone: "(809) 555-0189",
    email: "carlos.mendez@outlook.com",
    insuranceProvider: "Seguros Universal",
  },
  {
    id: "p-3",
    name: "Ana Patricia Rodríguez",
    recordNumber: "EXP-0205",
    idDocument: "402-1984562-1",
    phone: "(809) 555-0205",
    email: "ana.rodriguez@gmail.com",
    insuranceProvider: "ARS Palic / MAPFRE Salud",
  },
  {
    id: "p-4",
    name: "José Antonio Rosario",
    recordNumber: "EXP-0231",
    idDocument: "001-0945612-8",
    phone: "(809) 555-0231",
    email: "jose.rosario@hotmail.com",
    insuranceProvider: "ARS Monumental",
  },
  {
    id: "p-5",
    name: "María Isabel Fernández",
    recordNumber: "EXP-0245",
    idDocument: "402-3012948-7",
    phone: "(809) 555-0245",
    email: "maria.fernandez@gmail.com",
    insuranceProvider: "Privado (Sin seguro)",
  },
  {
    id: "p-6",
    name: "Dra. Leticia Bueno",
    recordNumber: "EXP-0001",
    idDocument: "001-1456789-2",
    phone: "(809) 555-0100",
    email: "dra.bueno@beedental.do",
    insuranceProvider: "Privado (Sin seguro)",
  },
];

const DENTAL_SERVICES_CATALOG: DentalCatalogService[] = [
  {
    id: "cat-1",
    code: "EST-01",
    name: "Diseño de Sonrisa Digital (DSD) + Modelado 3D",
    category: "Estética Dental",
    price: 15000,
    durationMinutes: 45,
    indicadorFacturacion: 4,
    description: "Visualización 3D computarizada y simulación estética digital antes de carillas.",
    popular: true,
  },
  {
    id: "cat-2",
    code: "EST-02",
    name: "Carilla Dental de Porcelana / Disilicato de Litio",
    category: "Estética Dental",
    price: 18500,
    durationMinutes: 60,
    indicadorFacturacion: 4,
    description: "Carilla estética de alta precisión, mimetismo y durabilidad para sector anterior.",
    popular: true,
  },
  {
    id: "cat-3",
    code: "EST-03",
    name: "Blanqueamiento Dental Láser / LED en Consultorio",
    category: "Estética Dental",
    price: 8500,
    durationMinutes: 45,
    indicadorFacturacion: 4,
    description: "Aclaramiento seguro y efectivo con activación lumínica y gel de peróxido.",
    popular: true,
  },
  {
    id: "cat-4",
    code: "ORT-01",
    name: "Ortodoncia Invisible (Alineadores Transparentes)",
    category: "Ortodoncia",
    price: 65000,
    durationMinutes: 30,
    indicadorFacturacion: 4,
    description: "Férulas transparentes extraíbles con escaneo intraoral 3D de alta precisión.",
    popular: true,
  },
  {
    id: "cat-5",
    code: "ORT-02",
    name: "Control Mensual de Ortodoncia (Brackets / Alineadores)",
    category: "Ortodoncia",
    price: 2500,
    durationMinutes: 30,
    indicadorFacturacion: 4,
    description: "Ajuste de arcos, ligaduras elásticas y revisión de la evolución de mordida.",
  },
  {
    id: "cat-6",
    code: "CIR-01",
    name: "Implantología Guiada en 24h (Implante Titanio Puro)",
    category: "Cirugía e Implantes",
    price: 45000,
    durationMinutes: 60,
    indicadorFacturacion: 4,
    description: "Implante biocompatible con planificación tomográfica 3D y carga inmediata.",
    popular: true,
  },
  {
    id: "cat-7",
    code: "CIR-02",
    name: "Extracción Quirúrgica de Tercer Molar (Cordal Retenido)",
    category: "Cirugía e Implantes",
    price: 7500,
    durationMinutes: 45,
    indicadorFacturacion: 4,
    description: "Cirugía odontológica especializada con osteotomía, odontosección y sutura.",
  },
  {
    id: "cat-8",
    code: "CIR-03",
    name: "Extracción Simple de Pieza Dental",
    category: "Cirugía e Implantes",
    price: 2500,
    durationMinutes: 30,
    indicadorFacturacion: 4,
    description: "Exodoncia convencional no traumática con anestesia local infiltrativa.",
  },
  {
    id: "cat-9",
    code: "PRE-01",
    name: "Profilaxis y Limpieza con Ultrasonido + Pulido de Flúor",
    category: "Prevención & Limpieza",
    price: 3500,
    durationMinutes: 30,
    indicadorFacturacion: 4,
    description: "Higiene profunda indolora, remoción de cálculo supragingival y pulido profiláctico.",
    popular: true,
  },
  {
    id: "cat-10",
    code: "PRE-02",
    name: "Aplicación de Sellantes de Fosas y Fisuras",
    category: "Prevención & Limpieza",
    price: 1800,
    durationMinutes: 20,
    indicadorFacturacion: 4,
    description: "Protección preventiva en esmalte dental contra caries oclusales en molares.",
  },
  {
    id: "cat-11",
    code: "END-01",
    name: "Endodoncia Rotatoria Molar Multirradicular",
    category: "Endodoncia",
    price: 12000,
    durationMinutes: 60,
    indicadorFacturacion: 4,
    description: "Tratamiento de conductos con instrumentación rotatoria NiTi y sellado térmico 3D.",
    popular: true,
  },
  {
    id: "cat-12",
    code: "END-02",
    name: "Endodoncia Diente Anterior / Premolar (Unirradicular)",
    category: "Endodoncia",
    price: 7500,
    durationMinutes: 45,
    indicadorFacturacion: 4,
    description: "Desinfección biomecánica y obturación de conducto único con localizador apical.",
  },
  {
    id: "cat-13",
    code: "PRO-01",
    name: "Corona en Zirconio Monolítico de Alta Resistencia",
    category: "Prótesis & Rehabilitación",
    price: 19000,
    durationMinutes: 45,
    indicadorFacturacion: 4,
    description: "Restauración protésica definitiva libre de metal fresada mediante CAD/CAM.",
  },
  {
    id: "cat-14",
    code: "PRO-02",
    name: "Incrustación Cerámica Inlay / Onlay (CAD/CAM)",
    category: "Prótesis & Rehabilitación",
    price: 11500,
    durationMinutes: 40,
    indicadorFacturacion: 4,
    description: "Reconstrucción anatómica adhesiva en cerámica pura para molares afectados.",
  },
  {
    id: "cat-15",
    code: "RES-01",
    name: "Restauración en Resina Nanohíbrida Fotocurada",
    category: "Restauradora",
    price: 2800,
    durationMinutes: 30,
    indicadorFacturacion: 4,
    description: "Obturación biomimética del tono exacto de la pieza con adhesión de 5ta generación.",
  },
  {
    id: "cat-16",
    code: "URG-01",
    name: "Consulta de Urgencia & Diagnóstico Radiológico",
    category: "Urgencias",
    price: 2500,
    durationMinutes: 30,
    indicadorFacturacion: 4,
    description: "Atención clínica inmediata para alivio agudo del dolor e infección odontológica.",
  },
  {
    id: "cat-17",
    code: "PED-01",
    name: "Consulta Odontopediátrica & Flúor Barniz Protector",
    category: "Odontopediatría",
    price: 3000,
    durationMinutes: 30,
    indicadorFacturacion: 4,
    description: "Atención adaptada y amigable para niños con aplicación tópica de barniz remineralizante.",
  },
  {
    id: "cat-18",
    code: "MAT-01",
    name: "Kit de Higiene Bucal Especializado Post-Tratamiento",
    category: "Productos & Materiales",
    price: 1200,
    durationMinutes: 10,
    indicadorFacturacion: 1, // Gravado 18% para productos comerciales
    description: "Cepillo ultrasuave quirúrgico, enjuague de clorhexidina 0.12% e hilo dental encerado.",
  },
];

export default function NewBillingPage() {
  const router = useRouter();

  // Basic Buyer & Clinical info
  const [patientName, setPatientName] = useState("Laura Martínez Gómez");
  const [buyerRnc, setBuyerRnc] = useState("402-2894152-3");
  const [recordNumber, setRecordNumber] = useState("EXP-0142");
  const [paymentMethod, setPaymentMethod] = useState("Tarjeta de Crédito / Débito");

  // Autocomplete patient state
  const [allPatients, setAllPatients] = useState<PatientSuggestion[]>(DEFAULT_PATIENTS);
  const [showPatientSuggestions, setShowPatientSuggestions] = useState(false);
  const patientInputRef = useRef<HTMLInputElement>(null);
  const patientDropdownRef = useRef<HTMLDivElement>(null);

  // DGII e-CF Fields
  const [tipoEcf, setTipoEcf] = useState<"32" | "31" | "34" | "44" | "45">("32");
  const [tipoPago, setTipoPago] = useState<1 | 2>(1); // 1 = Contado, 2 = Crédito
  const [transmitEcf, setTransmitEcf] = useState(true);

  // Items in invoice
  const [items, setItems] = useState<InvoiceRow[]>([
    {
      id: "1",
      service: "Diseño de Sonrisa Digital (DSD) + Modelado 3D",
      price: 15000,
      quantity: 1,
      indicadorFacturacion: 4, // Exento por ley médica
      piezaDental: "Sector Anterior",
    },
  ]);

  // Modal Service Selector state
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [serviceSearch, setServiceSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("TODOS");

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [ecfResult, setEcfResult] = useState<any | null>(null);
  const [ecfError, setEcfError] = useState<string | null>(null);

  // e-CF Configuration from localStorage
  const [ecfApiKey, setEcfApiKey] = useState("");
  const [ecfApiUrl, setEcfApiUrl] = useState("https://ecf.autodilerpro.com/api/v1");

  // Load registered patients & settings on mount
  useEffect(() => {
    try {
      const storedPatients = localStorage.getItem("bee_custom_patients");
      if (storedPatients) {
        const parsed = JSON.parse(storedPatients);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with defaults avoiding duplicate recordNumbers/names
          const merged = [...parsed];
          DEFAULT_PATIENTS.forEach((dp) => {
            if (!merged.some((p) => p.name.toLowerCase() === dp.name.toLowerCase())) {
              merged.push(dp);
            }
          });
          setAllPatients(merged);
        }
      }

      const storedKey = localStorage.getItem("bee_ecf_api_key");
      const storedUrl = localStorage.getItem("bee_ecf_api_url");
      if (storedKey) setEcfApiKey(storedKey);
      if (storedUrl) setEcfApiUrl(storedUrl);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Click outside to close patient autocomplete dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        patientDropdownRef.current &&
        !patientDropdownRef.current.contains(event.target as Node) &&
        patientInputRef.current &&
        !patientInputRef.current.contains(event.target as Node)
      ) {
        setShowPatientSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter patients for autocomplete
  const filteredPatients = allPatients.filter((p) => {
    if (!patientName.trim()) return true;
    const query = patientName.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(query) ||
      p.recordNumber.toLowerCase().includes(query) ||
      (p.idDocument && p.idDocument.toLowerCase().includes(query)) ||
      (p.phone && p.phone.includes(query))
    );
  });

  const handleSelectPatient = (patient: PatientSuggestion) => {
    setPatientName(patient.name);
    setRecordNumber(patient.recordNumber || "");
    if (patient.idDocument && patient.idDocument !== "Pendiente") {
      setBuyerRnc(patient.idDocument);
    }
    setShowPatientSuggestions(false);
  };

  // Filter services in modal
  const serviceCategories = [
    "TODOS",
    "Estética Dental",
    "Ortodoncia",
    "Cirugía e Implantes",
    "Prevención & Limpieza",
    "Endodoncia",
    "Prótesis & Rehabilitación",
    "Restauradora",
    "Urgencias",
    "Odontopediatría",
    "Productos & Materiales",
  ];

  const filteredServices = DENTAL_SERVICES_CATALOG.filter((s) => {
    const matchesCategory = selectedCategory === "TODOS" || s.category === selectedCategory;
    const q = serviceSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const handleAddServiceFromCatalog = (service: DentalCatalogService) => {
    const newItem: InvoiceRow = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      service: service.name,
      price: service.price,
      quantity: 1,
      indicadorFacturacion: service.indicadorFacturacion,
      piezaDental: "",
    };
    setItems((prev) => [...prev, newItem]);
    setIsServiceModalOpen(false);
  };

  const handleAddCustomBlankItem = () => {
    const newItem: InvoiceRow = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      service: "",
      price: 0,
      quantity: 1,
      indicadorFacturacion: 4,
      piezaDental: "",
    };
    setItems((prev) => [...prev, newItem]);
    setIsServiceModalOpen(false);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      alert("La factura debe tener al menos un concepto facturado.");
      return;
    }
    setItems(items.filter((it) => it.id !== id));
  };

  // Compute Totals
  const montoExento = items
    .filter((it) => it.indicadorFacturacion === 4)
    .reduce((acc, it) => acc + it.price * it.quantity, 0);

  const montoGravado = items
    .filter((it) => it.indicadorFacturacion === 1)
    .reduce((acc, it) => acc + it.price * it.quantity, 0);

  const itbisTotal = Math.round(montoGravado * 0.18);
  const total = montoExento + montoGravado + itbisTotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("Por favor agregue al menos un servicio o tratamiento.");
      return;
    }

    if (tipoEcf === "31" && !buyerRnc.trim()) {
      alert("Para emitir Comprobante de Crédito Fiscal (E31) es obligatorio ingresar el RNC del comprador / ARS.");
      return;
    }

    setIsSubmitting(true);
    setEcfError(null);

    let encfEmitido = "";
    let codigoSeguridad = "";
    let fechaHoraFirma = "";
    let qrDataUri = "";
    let qrUrl = "";
    let trackId = "";
    let dgiiStatus = "ISSUED";

    // Call e-CF Hub API if transmit is enabled
    if (transmitEcf) {
      try {
        const payload = {
          tipoEcf,
          tipoPago,
          comprador: {
            rnc: buyerRnc ? buyerRnc.replace(/[^0-9]/g, "") : undefined,
            razonSocial: patientName,
            correo: undefined,
          },
          items: items.map((it) => ({
            nombre: it.service,
            indicadorFacturacion: it.indicadorFacturacion, // 4 = Exento, 1 = Gravado
            indicadorBienoServicio: 2, // 2 = Servicios Odontológicos Ley 11-92 Art. 344
            cantidad: it.quantity,
            precioUnitario: it.price,
            descuento: 0,
            piezaDental: it.piezaDental || undefined,
            coberturaArs: it.coberturaArs || undefined,
          })),
          apiUrl: ecfApiUrl || undefined,
          apiKey: ecfApiKey || undefined,
        };

        const res = await fetch("/api/v1/ecf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          encfEmitido = data.encf || "";
          codigoSeguridad = data.codigoSeguridad || "";
          fechaHoraFirma = data.fechaHoraFirma || "";
          qrDataUri = data.qrDataUri || "";
          qrUrl = data.qrUrl || "";
          trackId = data.trackId || "";
          dgiiStatus = data.status || "ACCEPTED";
          setEcfResult(data);
        } else {
          console.warn("e-CF API Hub returned non-success, saving local invoice with fallback:", data);
          setEcfError(data.error || "No se pudo transmitir en vivo a DGII. Se guardará con secuencia provisional.");
          encfEmitido = `E${tipoEcf}000${Math.floor(100000 + Math.random() * 900000)}`;
          codigoSeguridad = Math.random().toString(36).substring(2, 8).toUpperCase();
        }
      } catch (err: any) {
        console.error("Error communicating with e-CF proxy:", err);
        setEcfError("Error de comunicación con el API e-CF Hub. Se guardará localmente.");
        encfEmitido = `E${tipoEcf}000${Math.floor(100000 + Math.random() * 900000)}`;
        codigoSeguridad = Math.random().toString(36).substring(2, 8).toUpperCase();
      }
    } else {
      encfEmitido = `E${tipoEcf}000${Math.floor(100000 + Math.random() * 900000)}`;
      codigoSeguridad = Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    const newInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `FAC-${Math.floor(1000 + Math.random() * 9000)}`,
      encf: encfEmitido,
      tipoEcf,
      patientName,
      rncComprador: buyerRnc,
      recordNumber,
      issueDate: new Date().toISOString().split("T")[0],
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
                <span>
                  Código de Seguridad: <strong>{ecfResult.codigoSeguridad}</strong> •{" "}
                </span>
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
              La factura ha sido registrada en el sistema de Bee Dental. Para transmitirla en vivo a la DGII, verifique que la{" "}
              <strong>X-API-Key</strong> esté configurada en <em>Configuración &gt; Integraciones</em>.
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

        {/* Patient / Buyer Info with Autocomplete */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="sm:col-span-2 space-y-1 relative">
            <label className="text-xs font-bold text-on-surface flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User size={13} className="text-primary" />
                <span>{tipoEcf === "31" ? "Razón Social o Paciente *" : "Nombre del Paciente / Comprador *"}</span>
              </span>
              <span className="text-[10px] text-primary/80 font-normal">Autocompletar dinámico activo</span>
            </label>

            <div className="relative">
              <input
                ref={patientInputRef}
                type="text"
                required
                value={patientName}
                onChange={(e) => {
                  setPatientName(e.target.value);
                  setShowPatientSuggestions(true);
                }}
                onFocus={() => setShowPatientSuggestions(true)}
                placeholder="Escribe el nombre del paciente para buscar en el sistema..."
                className="w-full h-11 pl-3 pr-8 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary font-medium"
              />

              {patientName ? (
                <button
                  type="button"
                  onClick={() => {
                    setPatientName("");
                    setRecordNumber("");
                    setShowPatientSuggestions(true);
                    patientInputRef.current?.focus();
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1 rounded-full"
                >
                  <X size={14} />
                </button>
              ) : null}
            </div>

            {/* Suggestions Floating Dropdown */}
            {showPatientSuggestions && (
              <div
                ref={patientDropdownRef}
                className="absolute left-0 right-0 top-full mt-1.5 bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto"
              >
                <div className="px-3 py-2 bg-surface-container-low/60 border-b border-surface-container-high flex items-center justify-between text-[11px] text-on-surface-variant">
                  <span className="font-semibold flex items-center gap-1">
                    <Search size={12} />
                    <span>Pacientes registrados en Bee Dental</span>
                  </span>
                  <span>{filteredPatients.length} sugerencias</span>
                </div>

                {filteredPatients.length > 0 ? (
                  <div className="divide-y divide-surface-container-high/40">
                    {filteredPatients.map((pt) => (
                      <button
                        key={pt.id}
                        type="button"
                        onClick={() => handleSelectPatient(pt)}
                        className="w-full px-3.5 py-2.5 text-left hover:bg-primary/5 transition-colors flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                            {pt.name.charAt(0)}
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                              {pt.name}
                            </p>
                            <p className="text-[10px] text-on-surface-variant flex items-center gap-2 mt-0.5">
                              <span className="font-mono font-semibold text-primary">{pt.recordNumber}</span>
                              {pt.idDocument && pt.idDocument !== "Pendiente" && (
                                <>
                                  <span>•</span>
                                  <span className="font-mono">Doc: {pt.idDocument}</span>
                                </>
                              )}
                            </p>
                          </div>
                        </div>

                        {pt.insuranceProvider && pt.insuranceProvider !== "Privado (Sin seguro)" ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                            {pt.insuranceProvider}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] text-on-surface-variant bg-surface-container-low shrink-0">
                            Privado
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-on-surface-variant">
                    <p className="font-semibold text-on-surface">No se encontraron pacientes registrados con ese nombre</p>
                    <p className="text-[11px] mt-1 text-on-surface-variant">
                      Puedes continuar escribiendo para emitir a un paciente nuevo o no registrado.
                    </p>
                  </div>
                )}
              </div>
            )}
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
              placeholder="Ej. EXP-0142"
              className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-xs sm:text-sm font-mono border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
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
              onClick={() => {
                setServiceSearch("");
                setSelectedCategory("TODOS");
                setIsServiceModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
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

      {/* Modal: Seleccionar Servicio Odontológico */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest w-full max-w-3xl rounded-3xl shadow-2xl border border-surface-container-high max-h-[88vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-surface-container-high flex items-center justify-between bg-surface-container-low/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md">
                  <Stethoscope size={20} />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-on-surface flex items-center gap-2">
                    <span>Catálogo de Servicios Clínicos</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                      Bee Dental
                    </span>
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    Selecciona un tratamiento odontológico para incluirlo en la factura
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsServiceModalOpen(false)}
                className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Search & Filters */}
            <div className="p-4 border-b border-surface-container-high space-y-3 bg-surface-container-lowest">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type="text"
                  autoFocus
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  placeholder="Buscar por nombre, código o palabra clave (Ej. Profilaxis, Corona, Resina, Implante)..."
                  className="w-full h-11 pl-10 pr-4 bg-surface-container-low rounded-xl text-xs sm:text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {serviceSearch && (
                  <button
                    type="button"
                    onClick={() => setServiceSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                {serviceCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-semibold transition-all ${
                      selectedCategory === cat
                        ? "bg-primary text-white shadow-sm"
                        : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Services List / Cards */}
            <div className="p-4 overflow-y-auto flex-1 divide-y divide-surface-container-high/50 space-y-2">
              {filteredServices.length > 0 ? (
                filteredServices.map((srv) => (
                  <div
                    key={srv.id}
                    className="pt-2 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl hover:bg-surface-container-low transition-colors group border border-transparent hover:border-surface-container-high"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-lg bg-surface-container text-primary">
                          {srv.code}
                        </span>
                        <h4 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                          {srv.name}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-container-low text-on-surface-variant">
                          {srv.category}
                        </span>
                        {srv.popular && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            Frecuente
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant line-clamp-2">
                        {srv.description}
                      </p>
                      <div className="flex items-center gap-3 pt-0.5 text-[11px]">
                        <span className="text-on-surface-variant flex items-center gap-1">
                          <Clock size={12} />
                          <span>{srv.durationMinutes} min aprox.</span>
                        </span>
                        <span
                          className={`font-semibold ${
                            srv.indicadorFacturacion === 4 ? "text-emerald-700" : "text-amber-700"
                          }`}
                        >
                          {srv.indicadorFacturacion === 4 ? "Exento ITBIS (Ley 11-92)" : "Gravado 18% ITBIS"}
                        </span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-surface-container-high/40">
                      <div className="text-right">
                        <span className="text-[10px] text-on-surface-variant block uppercase font-bold">Precio</span>
                        <span className="font-mono text-base font-bold text-emerald-800">
                          RD$ {srv.price.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddServiceFromCatalog(srv)}
                        className="px-3.5 py-1.5 bg-primary text-white text-xs font-bold rounded-xl shadow-sm hover:bg-primary-container transition-all flex items-center gap-1.5 active:scale-95"
                      >
                        <Plus size={14} />
                        <span>Seleccionar</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center space-y-2">
                  <Stethoscope size={36} className="mx-auto text-on-surface-variant/40" />
                  <p className="text-sm font-bold text-on-surface">No se encontraron servicios</p>
                  <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                    No hay ningún procedimiento clínico que coincida con tu búsqueda. Puedes crear un concepto libre o personalizado.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer with Option to add custom item */}
            <div className="p-4 border-t border-surface-container-high bg-surface-container-low/40 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleAddCustomBlankItem}
                className="w-full sm:w-auto px-4 py-2 border border-surface-container-high rounded-xl text-xs font-bold text-primary hover:bg-surface-container transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus size={14} />
                <span>Agregar Concepto / Servicio Manual Libre</span>
              </button>

              <button
                type="button"
                onClick={() => setIsServiceModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2 bg-surface-container text-on-surface rounded-xl text-xs font-bold hover:bg-surface-container-high transition-colors text-center"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
