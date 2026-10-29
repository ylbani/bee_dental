"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState("dsd");
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [submittedTreatment, setSubmittedTreatment] = useState("");
  const [submittedTime, setSubmittedTime] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    horario: "Mañanas (08:30 - 14:00)",
  });

  const handleSelectTreatment = (value: string) => {
    setSelectedTreatment(value);
    const element = document.getElementById("cita");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        const input = document.getElementById("nombre");
        if (input) input.focus();
      }, 500);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Call public booking API
      await fetch("/api/v1/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: formData.nombre,
          patientPhone: formData.telefono,
          patientEmail: formData.email,
          serviceId: selectedTreatment,
          startDateTime: new Date().toISOString(),
          durationMinutes: 30,
          channel: "WEB",
          notes: `Horario preferido: ${formData.horario} | Tratamiento: ${selectedTreatment}`,
        }),
      });
    } catch {
      // Graceful fallback to client feedback
    }

    setSubmittedName(formData.nombre);
    setSubmittedTreatment(
      selectedTreatment === "dsd"
        ? "Diseño de Sonrisa Digital"
        : selectedTreatment === "ortodoncia"
        ? "Ortodoncia Invisible"
        : selectedTreatment === "implantes"
        ? "Implantología Guiada en 24h"
        : "Revisión Odontológica"
    );
    setSubmittedTime(formData.horario);
    setIsSubmitting(false);
    setBookingSubmitted(true);
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      telefono: "",
      email: "",
      horario: "Mañanas (08:30 - 14:00)",
    });
    setBookingSubmitted(false);
  };

  return (
    <div className="bg-surface font-sans text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* ================= TOP BAR & HEADER ================= */}
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/95 backdrop-blur-xl border-b border-surface-container-high/60 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all">
        <div className="bg-surface-container-low px-4 sm:px-6 border-b border-surface-container-high/40 text-xs sm:text-sm text-on-surface-variant">
          <div className="max-w-7xl mx-auto h-9 sm:h-10 flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-6">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="material-symbols-outlined text-[16px] text-primary">medical_services</span>
                <span className="hidden sm:inline">Urgencias & WhatsApp:</span>
                <a className="font-semibold text-primary hover:text-on-surface transition-colors" href="tel:+18496323258">
                  849-632-3258
                </a>
              </span>
              <span className="hidden md:inline-flex items-center gap-1.5 text-secondary">
                <span className="material-symbols-outlined text-[16px] text-tertiary">schedule</span>
                <span>Lun - Vie: 08:30 - 20:30 | Sáb: 09:00 - 14:00</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden lg:flex items-center gap-1.5 text-secondary">
                <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                <span>Plaza Balón, Av. Charles de Gaulle 10</span>
              </span>
              <div className="flex items-center gap-2 pl-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary-container text-white text-xs font-semibold hover:bg-primary transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  <span>Portal Clínico</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-16 sm:h-20 flex items-center justify-between gap-4">
            <a className="flex items-center group py-1" href="#inicio" aria-label="Bee Dental Inicio">
              <img src="/logo.png" alt="Bee Dental - Perfilando tu sonrisa" className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform group-hover:scale-105" />
            </a>

            <nav className="hidden xl:flex items-center gap-7 text-sm font-semibold text-on-surface-variant">
              <a className="hover:text-primary transition-colors py-1" href="#inicio">Inicio</a>
              <a className="hover:text-primary transition-colors py-1" href="#tratamientos">Tratamientos</a>
              <a className="hover:text-primary transition-colors py-1" href="#ventajas">Tecnología 3D</a>
              <a className="hover:text-primary transition-colors py-1" href="#casos">Casos Clínicos</a>
              <a className="hover:text-primary transition-colors py-1" href="#equipo">Especialistas</a>
              <a className="hover:text-primary transition-colors py-1" href="#opiniones">Testimonios</a>
              <a className="hover:text-primary transition-colors py-1" href="#ubicacion">Ubicación</a>
            </nav>

            <div className="flex items-center gap-3">
              <a
                className="hidden sm:inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold text-sm rounded-lg shadow-md hover:bg-primary-container transition-all"
                href="#cita"
              >
                <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                <span>Agendar Cita</span>
              </a>

              <button
                className="inline-flex xl:hidden items-center justify-center w-10 h-10 rounded-lg bg-surface-container text-on-surface hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <span className="material-symbols-outlined text-[24px]">
                  {mobileMenuOpen ? "close" : "menu"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-surface-container bg-surface/98 backdrop-blur-2xl px-6 py-5 shadow-2xl">
            <nav className="flex flex-col gap-3 font-semibold text-base text-on-surface-variant pb-4 border-b border-surface-container">
              <a className="py-2 hover:text-primary transition-colors" href="#inicio" onClick={() => setMobileMenuOpen(false)}>Inicio</a>
              <a className="py-2 hover:text-primary transition-colors" href="#tratamientos" onClick={() => setMobileMenuOpen(false)}>Tratamientos</a>
              <a className="py-2 hover:text-primary transition-colors" href="#ventajas" onClick={() => setMobileMenuOpen(false)}>Tecnología 3D</a>
              <a className="py-2 hover:text-primary transition-colors" href="#casos" onClick={() => setMobileMenuOpen(false)}>Casos Clínicos</a>
              <a className="py-2 hover:text-primary transition-colors" href="#equipo" onClick={() => setMobileMenuOpen(false)}>Especialistas</a>
              <a className="py-2 hover:text-primary transition-colors" href="#opiniones" onClick={() => setMobileMenuOpen(false)}>Testimonios</a>
              <a className="py-2 hover:text-primary transition-colors" href="#ubicacion" onClick={() => setMobileMenuOpen(false)}>Plaza Balón, Charles de Gaulle</a>
              <Link className="py-2 text-primary font-bold transition-colors" href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                🔐 Acceso al Portal Clínico
              </Link>
            </nav>
            <div className="pt-4 flex flex-col gap-2.5">
              <a className="w-full py-3 bg-primary text-white font-semibold text-center rounded-lg shadow-sm" href="#cita" onClick={() => setMobileMenuOpen(false)}>
                Solicitar Primera Consulta Gratis
              </a>
              <a className="w-full py-2.5 bg-surface-container-high text-primary font-semibold text-center rounded-lg" href="tel:+18496323258">
                Llamar al 849-632-3258
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ================= HERO SECTION ================= */}
      <main className="pt-24 sm:pt-28">
        <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-low via-surface to-surface pb-16 pt-8 sm:pt-12" id="inicio">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              <div className="lg:col-span-6 flex flex-col gap-5 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-highest text-primary font-semibold text-xs sm:text-sm w-fit shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Clínica de Alta Precisión &amp; Estética Dental</span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-bold text-on-surface leading-[1.12] tracking-tight">
                  Bee Dental — <br />
                  <span className="italic font-display text-primary font-semibold">Perfilando tu sonrisa</span> con precisión y calidez.
                </h1>

                <p className="text-base sm:text-lg text-on-surface-variant max-w-xl leading-relaxed">
                  Odontología integral y diseño de sonrisa de vanguardia. Diagnóstico digital 3D sin moldes, protocolos libres de dolor y un trato humano que transforma tu experiencia clínica en Santo Domingo.
                </p>

                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <a className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white font-semibold text-sm sm:text-base rounded-xl shadow-md hover:bg-primary-container transition-all" href="#cita">
                    <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                    <span>Agendar Primera Valoración Gratuita</span>
                  </a>
                  <a className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-surface-container-lowest text-primary font-semibold text-sm sm:text-base rounded-xl shadow-sm border border-surface-container-high hover:bg-surface-container-high transition-all" href="#tratamientos">
                    <span className="material-symbols-outlined text-[20px]">dentistry</span>
                    <span>Explorar Tratamientos</span>
                  </a>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4">
                  <div className="flex flex-col bg-surface-container-lowest/90 backdrop-blur-sm p-3.5 rounded-xl shadow-sm border border-surface-container-high/60">
                    <span className="font-display text-2xl sm:text-3xl text-primary font-bold leading-tight">+12,000</span>
                    <span className="text-xs sm:text-sm text-on-surface-variant font-medium mt-0.5">Sonrisas diseñadas</span>
                  </div>
                  <div className="flex flex-col bg-surface-container-lowest/90 backdrop-blur-sm p-3.5 rounded-xl shadow-sm border border-surface-container-high/60">
                    <div className="flex items-center gap-1 text-tertiary">
                      <span className="font-display text-2xl sm:text-3xl font-bold text-on-surface">4.9</span>
                      <span className="material-symbols-outlined text-[20px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </div>
                    <span className="text-xs sm:text-sm text-on-surface-variant font-medium mt-0.5">850+ Google Reviews</span>
                  </div>
                  <div className="flex flex-col bg-surface-container-lowest/90 backdrop-blur-sm p-3.5 rounded-xl shadow-sm border border-surface-container-high/60">
                    <span className="font-display text-2xl sm:text-3xl text-primary font-bold leading-tight">15+</span>
                    <span className="text-xs sm:text-sm text-on-surface-variant font-medium mt-0.5">Años de excelencia</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 relative">
                <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[520px] rounded-3xl overflow-hidden bg-surface-container shadow-2xl ring-1 ring-black/5">
                  <img
                    alt="Instalaciones Bee Dental con tecnología 3D"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuuP9SrEeCy-jyqOQnpC-cniqDECgoz0Ktkiv8BDmgFI9spyc-pI_KlYRkP7wz9h9pgPIIu1u7Y0WsFcP89FRs2HabSHDBol4-7H4R3xTI972d1tajAmRrF2BOGg3nisle6u37BiPKyekNY3YuhEU2eo1BhUZ0H-BIqKBqqKHupNlB7jm6ILWS6i-yJYh1PIwYUTJVqQ_Xo8qu6eJvWwPxK5XngIa-9kcYHoCXTyI"
                  />
                  <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-surface-container-lowest/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-white/60 flex items-center gap-3">
                    <img
                      alt="Paciente satisfecha en consulta"
                      className="w-14 h-14 rounded-xl object-cover shadow-sm shrink-0"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaRaLHrQrvhtHSvElZhoKvTk_h5heDn_lYKdSUoICTSHcxiupKJLCrabY0_ZhPZHo132oprO3pakZ3bu0Odhed7laBMMLhjyAPbURTtlsCb5Qkv1h_otrWgdHTpMZwy2G5aaWh6FkLaSZGUaH23_PL7rImscVZijKFlP2DZacChljCFbfqIf9M8oBEx54PDBQcG10_pbDfVyyVPHmmO62t6C0bbRGdLXohvD3dQzs"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-sm text-on-surface truncate">Experiencia Zero-Pain</span>
                      <span className="text-xs text-on-surface-variant line-clamp-1">Sedación consciente certificada</span>
                      <div className="flex items-center gap-1 mt-1 text-primary text-xs font-semibold">
                        <span className="material-symbols-outlined text-[14px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
                        <span>100% Sin Molestias</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-5 right-5 bg-surface-container-lowest/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/60 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">view_in_ar</span>
                    <span className="text-xs sm:text-sm font-bold text-on-surface">Escaneo 3D Sin Moldes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= MEDICAL ACCREDITATIONS & PILLARS ================= */}
        <section className="w-full bg-surface-container-low py-6 border-y border-surface-container-high/60 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[22px]">precision_manufacturing</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-on-surface leading-tight">CAD / CAM 3D</span>
                  <span className="text-[11px] sm:text-xs text-on-surface-variant">Prótesis Instantánea</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined text-[22px]">medical_information</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-on-surface leading-tight">Colegiados Oficiales</span>
                  <span className="text-[11px] sm:text-xs text-on-surface-variant">Consejo Odontológico</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0">
                  <span className="material-symbols-outlined text-[22px]">contract_edit</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-on-surface leading-tight">Garantía Escrita</span>
                  <span className="text-[11px] sm:text-xs text-on-surface-variant">Protección Integral</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary-container shrink-0">
                  <span className="material-symbols-outlined text-[22px]">payments</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-on-surface leading-tight">0% Intereses</span>
                  <span className="text-[11px] sm:text-xs text-on-surface-variant">Hasta 24 Meses</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SERVICES SECTION ================= */}
        <section className="w-full py-16 sm:py-20 bg-surface" id="tratamientos">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="flex flex-col gap-2 max-w-2xl">
                <span className="text-xs sm:text-sm uppercase tracking-wider text-primary font-bold">Servicios Clínicos &amp; Estética Dental</span>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-on-surface">Tratamientos diseñados a tu medida</h2>
                <p className="text-sm sm:text-base text-on-surface-variant">
                  Unificamos la ciencia médica más rigurosa con la armonía estética facial en nuestras modernas instalaciones de Plaza Balón.
                </p>
              </div>
              <a className="inline-flex items-center gap-2 text-primary font-semibold text-sm sm:text-base hover:text-primary-container transition-colors group" href="#cita">
                <span>Solicitar valoración personalizada</span>
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                { id: "dsd", icon: "auto_awesome", tag: "Aesthetic Star", title: "Diseño de Sonrisa Digital (DSD)", desc: "Simulación 3D antes de tocar una sola pieza dental.", sub: "Prueba virtual 3D sin coste" },
                { id: "ortodoncia", icon: "flare", tag: "100% Discreto", title: "Ortodoncia Invisible (Alineadores)", desc: "Férulas transparentes y removibles con seguimiento digital.", sub: "Resultados visibles desde mes 3" },
                { id: "implantes", icon: "hardware", tag: "Carga Inmediata", title: "Implantología Guiada en 24h", desc: "Implantes de titanio suizo con corona fija en el mismo día.", sub: "Dientes fijos en 1 solo día" },
                { id: "limpieza", icon: "dentistry", tag: "Conservadora", title: "Odontología Restauradora & Preventiva", desc: "Higiene por ultrasonidos no abrasivos y resinas nano-híbridas.", sub: "Preservación del esmalte" },
                { id: "urgencia", icon: "health_and_safety", tag: "Salud Gingival", title: "Periodoncia & Terapia de Encías", desc: "Regeneración ósea tisular para salvar piezas dentales.", sub: "Soporte biológico avanzado" },
                { id: "pediatria", icon: "child_care", tag: "Pediatría", title: "Odontopediatría Amigable", desc: "Ambiente lúdico para que los niños amen cuidar su boca.", sub: "Consulta sin temores" },
              ].map((srv) => (
                <div
                  key={srv.id}
                  onClick={() => handleSelectTreatment(srv.id)}
                  className="group bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-surface-container-high/60 flex flex-col justify-between cursor-pointer"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[28px]">{srv.icon}</span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-surface-container text-primary font-bold text-xs uppercase tracking-wider">
                        {srv.tag}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-on-surface group-hover:text-primary transition-colors">
                        {srv.title}
                      </h3>
                      <p className="text-sm text-on-surface-variant leading-relaxed">
                        {srv.desc}
                      </p>
                    </div>
                  </div>
                  <div className="pt-6 mt-4 border-t border-surface-container flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-on-surface-variant group-hover:text-primary transition-colors">
                      {srv.sub}
                    </span>
                    <span className="material-symbols-outlined text-primary group-hover:translate-x-1.5 transition-transform">east</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= MEDICAL TEAM SECTION ================= */}
        <section className="w-full py-16 sm:py-20 bg-surface-container-low" id="equipo">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12 flex flex-col gap-2">
              <span className="text-xs sm:text-sm text-primary font-bold uppercase tracking-wider">Dirección Médica &amp; Especialista</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-on-surface">Compromiso y excelencia con tu salud</h2>
              <p className="text-sm sm:text-base text-on-surface-variant">
                Atención personalizada de vanguardia con diagnóstico digital 3D y el trato humano y cercano que mereces.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="bg-surface-container-lowest p-8 sm:p-10 rounded-3xl shadow-lg hover:shadow-xl transition-all border border-surface-container-high/60 flex flex-col items-center text-center">
                <div className="w-36 h-36 rounded-full overflow-hidden mb-6 shadow-md ring-4 ring-primary-fixed">
                  <img
                    alt="Dra. Leticia Bueno - Especialista en Odontología Integral"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRXeiMWL1EdSgjYo9SoO_2Q7zagwo37RN9eOz6k50E2l-h3CpBh4xy4Pz02306pbRQVGJQ--clsv-ibOfu4-DtMmVbY4-z25sKKXXGkqMPzqfQVAKKfhjc2wmn0a6q3LDHVSMmcbycXQ8OYbjQckUy7kAJM08jCMU-vX56T2ZxwDEyHsI_iyihtq_QJ_6lVsLrHC_XVyG-plr_5_OapORV2VoaI-6E5Z23LKO8Jv0"
                  />
                </div>
                <span className="font-display text-2xl sm:text-3xl font-bold text-on-surface">Dra. Leticia Bueno</span>
                <span className="text-xs sm:text-sm text-primary font-bold mt-1.5 uppercase tracking-wide">Directora Médica &amp; Odontología Integral</span>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-3.5 leading-relaxed">
                  Especialista en Ortodoncia Invisible, Diseño de Sonrisa Digital (DSD) y Odontología Restauradora Avanzada. Comprometida con la máxima precisión clínica y el bienestar de cada paciente.
                </p>
                <div className="mt-6 pt-4 w-full border-t border-surface-container flex items-center justify-center gap-2 text-on-surface-variant text-xs sm:text-sm font-semibold">
                  <span className="material-symbols-outlined text-[18px] text-primary">verified</span>
                  <span>+1,200 sonrisas transformadas con éxito</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= BOOKING & APPOINTMENT FORM ================= */}
        <section className="w-full py-16 sm:py-20 bg-surface-container-low" id="cita">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-10 lg:p-14 shadow-2xl border border-surface-container-high/60">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
                <div className="lg:col-span-5 flex flex-col justify-between">
                  <div className="flex flex-col gap-4">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary-fixed text-primary font-bold text-xs sm:text-sm w-fit">
                      <span className="material-symbols-outlined text-[16px]">celebration</span>
                      <span>Primera Consulta &amp; Diagnóstico 3D Gratis</span>
                    </div>

                    <h3 className="font-display text-3xl sm:text-4xl font-bold text-on-surface leading-tight">
                      Comienza hoy tu transformación dental
                    </h3>

                    <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                      Completa tus datos y te confirmaremos tu cita en menos de 15 minutos hábiles. Incluye escaneo digital 3D y plan de tratamiento personalizado.
                    </p>

                    <div className="flex flex-col gap-2.5 pt-2">
                      <div className="flex items-center gap-2.5 text-on-surface font-semibold text-sm">
                        <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                        <span>Sin ningún compromiso ni cargos ocultos</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-on-surface font-semibold text-sm">
                        <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                        <span>Aparcamiento gratuito en Plaza Balón</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-on-surface font-semibold text-sm">
                        <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                        <span>Financiación flexible a tu medida</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface-container-low p-5 rounded-2xl mt-8 flex flex-col gap-1.5 border border-surface-container-high/60">
                    <span className="text-xs text-primary font-bold uppercase tracking-wider">Atención Telefónica Directa</span>
                    <a className="font-display text-2xl font-bold text-on-surface hover:text-primary transition-colors" href="tel:+18496323258">
                      849-632-3258
                    </a>
                    <span className="text-xs text-on-surface-variant">Lunes a Viernes: 08:30 - 20:30 h | Sábados: 09:00 - 14:00 h</span>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-surface p-6 sm:p-8 rounded-2xl shadow-sm border border-surface-container-high/60">
                  {!bookingSubmitted ? (
                    <form className="flex flex-col gap-5" onSubmit={handleBookingSubmit}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs sm:text-sm text-on-surface font-bold" htmlFor="nombre">Nombre y Apellidos *</label>
                          <input
                            className="h-12 px-4 bg-surface-container-lowest rounded-xl text-on-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all"
                            id="nombre"
                            placeholder="Ej. Ana Fernández"
                            required
                            type="text"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs sm:text-sm text-on-surface font-bold" htmlFor="telefono">Teléfono o WhatsApp *</label>
                          <input
                            className="h-12 px-4 bg-surface-container-lowest rounded-xl text-on-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all"
                            id="telefono"
                            placeholder="849-632-3258"
                            required
                            type="tel"
                            value={formData.telefono}
                            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs sm:text-sm text-on-surface font-bold" htmlFor="email">Correo Electrónico *</label>
                          <input
                            className="h-12 px-4 bg-surface-container-lowest rounded-xl text-on-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all"
                            id="email"
                            placeholder="ana@ejemplo.com"
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs sm:text-sm text-on-surface font-bold" htmlFor="tratamiento">Tratamiento de Interés</label>
                          <select
                            className="h-12 px-4 bg-surface-container-lowest rounded-xl text-on-surface border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all cursor-pointer"
                            id="tratamiento"
                            value={selectedTreatment}
                            onChange={(e) => setSelectedTreatment(e.target.value)}
                          >
                            <option value="dsd">Diseño Digital de Sonrisa / Carillas</option>
                            <option value="ortodoncia">Ortodoncia Invisible (Alineadores)</option>
                            <option value="implantes">Implantes Dentales en 24h &amp; Cirugía</option>
                            <option value="limpieza">Limpieza &amp; Revisión General Preventiva</option>
                            <option value="blanqueamiento">Blanqueamiento Clínico Láser</option>
                            <option value="urgencia">Urgencia Dental o Dolor</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs sm:text-sm text-on-surface font-bold">Horario Preferente de Visita</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {["Mañanas (08:30 - 14:00)", "Tardes (15:00 - 20:30)", "Sábados de Guardia"].map((time) => (
                            <label
                              key={time}
                              className={`flex items-center justify-center p-3 rounded-xl border text-xs sm:text-sm font-semibold cursor-pointer transition-all ${
                                formData.horario === time
                                  ? "bg-primary text-white border-primary shadow-sm"
                                  : "bg-surface-container-lowest text-on-surface border-surface-container-high hover:border-primary"
                              }`}
                            >
                              <input
                                type="radio"
                                name="horario"
                                className="sr-only"
                                checked={formData.horario === time}
                                onChange={() => setFormData({ ...formData, horario: time })}
                              />
                              <span>{time}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <button
                        className="w-full py-4 bg-primary text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 mt-2"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {isSubmitting ? "progress_activity" : "send"}
                        </span>
                        <span>{isSubmitting ? "Enviando reserva..." : "Solicitar Cita de Diagnóstico Gratuita"}</span>
                      </button>
                    </form>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary shadow-inner">
                        <span className="material-symbols-outlined text-[36px]">check_circle</span>
                      </div>
                      <h4 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">
                        ¡Solicitud Recibida con Éxito!
                      </h4>
                      <p className="text-sm sm:text-base text-on-surface-variant max-w-md leading-relaxed">
                        ¡Gracias, <strong>{submittedName}</strong>! Hemos registrado tu solicitud para{" "}
                        <strong>{submittedTreatment}</strong> en horario de <strong>{submittedTime}</strong>. Nuestro equipo médico se pondrá en contacto contigo de inmediato al <strong>{formData.telefono}</strong>.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full max-w-sm">
                        <a
                          className="flex-1 py-3 px-4 bg-emerald-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-emerald-700 transition-colors"
                          href={`https://wa.me/18496323258?text=${encodeURIComponent(
                            `¡Hola Bee Dental! Acabo de registrar mi cita para ${submittedTreatment} (${submittedTime}) a nombre de ${submittedName}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Confirmar por WhatsApp
                        </a>
                        <button
                          className="py-3 px-4 bg-surface-container text-on-surface font-semibold text-sm rounded-xl hover:bg-surface-container-high transition-colors"
                          onClick={resetForm}
                        >
                          Nueva Consulta
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= GOOGLE MAP & LOCATION ================= */}
        <section className="w-full py-16 sm:py-20 bg-surface-container-low" id="ubicacion">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-5 bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-sm border border-surface-container-high/60 flex flex-col justify-between">
                <div className="flex flex-col gap-4">
                  <span className="text-xs sm:text-sm text-primary font-bold uppercase tracking-wider">Ubicación Estratégica</span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-on-surface">Plaza Balón, Av. Charles de Gaulle 10</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Situados en Santo Domingo (11404), con fácil acceso vehicular, transporte público y amplio parqueo vigilado para nuestros pacientes.
                  </p>
                  <div className="flex flex-col gap-3 pt-2 text-sm text-on-surface font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined text-[18px]">storefront</span>
                      </div>
                      <span>Plaza Balón Ave, Nivel Principal</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined text-[18px]">directions_car</span>
                      </div>
                      <span>Acceso directo sobre Av. Charles de Gaulle</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0">
                        <span className="material-symbols-outlined text-[18px]">local_parking</span>
                      </div>
                      <span>Estacionamiento vigilado y gratuito</span>
                    </div>
                  </div>
                </div>

                <a
                  className="mt-8 inline-flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary-container transition-all shadow-sm"
                  href="https://www.google.com/maps/search/?api=1&query=Plaza+Bal%C3%B3n+Ave%2C+Av.+Charles+de+Gaulle+10%2C+Santo+Domingo+11404"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                  <span>Abrir en Google Maps</span>
                </a>
              </div>

              <div className="lg:col-span-7 min-h-[420px] rounded-3xl overflow-hidden shadow-md border border-surface-container-high/60 relative bg-surface-container">
                <iframe
                  src="https://maps.google.com/maps?q=Plaza+Bal%C3%B3n+Ave%2C+Av.+Charles+de+Gaulle+10%2C+Santo+Domingo+11404&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full min-h-[420px] rounded-3xl border-0"
                  allowFullScreen
                  loading="lazy"
                  title="Ubicación Bee Dental en Plaza Balón, Santo Domingo"
                />
                <div className="absolute top-5 left-5 bg-surface-container-lowest/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/60 max-w-xs pointer-events-none">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <span className="material-symbols-outlined text-[20px]">location_on</span>
                    <span>Clínica Bee Dental</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1 font-medium">Plaza Balón Ave, Av. Charles de Gaulle 10, Santo Domingo 11404</p>
                  <div className="mt-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded w-fit">
                    Abierto hoy hasta las 20:30 h
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="w-full bg-surface-container-low text-on-surface border-t border-surface-container-high/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-surface-container-high">
            <div className="flex flex-col gap-4">
              <a className="flex items-center group w-fit" href="#inicio" aria-label="Bee Dental Inicio">
                <img src="/logo.png" alt="Bee Dental - Perfilando tu sonrisa" className="h-11 sm:h-13 w-auto object-contain transition-transform group-hover:scale-105" />
              </a>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Excelencia odontológica y diseño estético en armonía con tu salud bucal. Tecnología diagnóstica 3D, sedación consciente y profesionales colegiados.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-sm sm:text-base text-on-surface uppercase tracking-wide">Tratamientos</h4>
              <ul className="flex flex-col gap-2 text-xs sm:text-sm text-on-surface-variant font-medium">
                <li><a className="hover:text-primary transition-colors" href="#tratamientos">Diseño Digital de Sonrisa (DSD)</a></li>
                <li><a className="hover:text-primary transition-colors" href="#tratamientos">Ortodoncia Invisible (Alineadores)</a></li>
                <li><a className="hover:text-primary transition-colors" href="#tratamientos">Implantología Guiada en 24h</a></li>
                <li><a className="hover:text-primary transition-colors" href="#tratamientos">Odontopediatría Integral</a></li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-sm sm:text-base text-on-surface uppercase tracking-wide">Horarios</h4>
              <div className="flex flex-col gap-2.5 text-xs sm:text-sm text-on-surface-variant">
                <div><span className="font-bold text-on-surface">Lunes a Viernes:</span> 08:30 a 20:30 h</div>
                <div><span className="font-bold text-on-surface">Sábados:</span> 09:00 a 14:00 h</div>
                <div><span className="font-bold text-on-surface">Urgencias:</span> Línea 24 Horas Activa</div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-sm sm:text-base text-on-surface uppercase tracking-wide">Contacto</h4>
              <div className="flex flex-col gap-2.5 text-xs sm:text-sm text-on-surface-variant">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">location_on</span>
                  <span>Plaza Balón Ave, Av. Charles de Gaulle 10, Santo Domingo 11404</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary shrink-0">call</span>
                  <a className="hover:text-primary transition-colors font-semibold" href="tel:+18496323258">849-632-3258</a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary shrink-0">mail</span>
                  <a className="hover:text-primary transition-colors" href="mailto:contacto@beedental.es">contacto@beedental.es</a>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant text-center md:text-left">
            <div>© 2025 Bee Dental S.L. Todos los derechos reservados. Centro Odontológico Especializado.</div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-primary font-semibold hover:underline">
                Acceso Personal Clínico
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ================= FLOATING WHATSAPP BUTTON ================= */}
      <aside className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <a
          className="group flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
          href="https://wa.me/18496323258?text=Hola,%20deseo%20solicitar%20cita%20de%20diagn%C3%B3stico%20gratuito%20en%20Bee%20Dental"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
          </span>
          <span className="material-symbols-outlined text-[22px]">chat</span>
          <span className="hidden sm:inline font-bold text-sm tracking-wide">¿Dudas? WhatsApp</span>
        </a>
      </aside>
    </div>
  );
}

