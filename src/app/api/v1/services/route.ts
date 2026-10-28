import { NextResponse } from "next/server";

export async function GET() {
  const services = [
    {
      id: "dsd",
      code: "EST-01",
      name: "Diseño de Sonrisa Digital (DSD)",
      category: "Estética Dental",
      basePriceDop: 15000.0,
      durationMinutes: 45,
      requiresAppointment: true,
      description: "Visualización 3D y simulación estética digital antes de iniciar carillas.",
    },
    {
      id: "ortodoncia",
      code: "ORT-01",
      name: "Ortodoncia Invisible (Alineadores)",
      category: "Ortodoncia",
      basePriceDop: 65000.0,
      durationMinutes: 30,
      requiresAppointment: true,
      description: "Férulas transparentes y removibles con escaneado 3D.",
    },
    {
      id: "implantes",
      code: "CIR-01",
      name: "Implantología Guiada en 24h",
      category: "Cirugía e Implantes",
      basePriceDop: 45000.0,
      durationMinutes: 60,
      requiresAppointment: true,
      description: "Implante de titanio puro suizo con carga inmediata y sedación consciente.",
    },
    {
      id: "limpieza",
      code: "PRE-01",
      name: "Odontología Restauradora & Profilaxis",
      category: "Prevención & Limpieza",
      basePriceDop: 3500.0,
      durationMinutes: 30,
      requiresAppointment: true,
      description: "Higiene profunda no abrasiva con ultrasonidos y resinas biomiméticas.",
    },
    {
      id: "urgencia",
      code: "URG-01",
      name: "Consulta de Urgencia & Alivio de Dolor",
      category: "Urgencias",
      basePriceDop: 2500.0,
      durationMinutes: 30,
      requiresAppointment: false,
      description: "Atención prioritaria inmediata con diagnóstico radiológico.",
    },
  ];

  return NextResponse.json({
    clinic: "Bee Dental Santo Domingo",
    currency: "DOP",
    total: services.length,
    services,
  });
}

