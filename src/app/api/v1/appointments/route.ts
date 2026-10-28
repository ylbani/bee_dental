import { NextRequest, NextResponse } from "next/server";
import { AppointmentCreateSchema } from "../../../../lib/validation/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const idempotencyKey = request.headers.get("x-idempotency-key");

    const parsed = AppointmentCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Datos de reserva inválidos",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const {
      patientName,
      patientPhone,
      patientEmail,
      serviceId,
      startDateTime,
      durationMinutes,
      channel,
      notes,
    } = parsed.data;

    const appointmentId = `apt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const recordNumber = `EXP-${Math.floor(1000 + Math.random() * 9000)}`;

    return NextResponse.json(
      {
        success: true,
        message: "Cita registrada con éxito en Bee Dental",
        appointment: {
          id: appointmentId,
          recordNumber,
          patientName: patientName || "Paciente Web",
          patientPhone: patientPhone || "849-632-3258",
          patientEmail: patientEmail || null,
          serviceId: serviceId || "dsd",
          startDateTime,
          durationMinutes: durationMinutes || 30,
          status: "PENDING",
          channel: channel || "WEB",
          notes,
          clinic: {
            name: "Bee Dental",
            address: "Plaza Balón Ave, Av. Charles de Gaulle 10, Santo Domingo 11404",
            phone: "849-632-3258",
          },
        },
        idempotencyKey: idempotencyKey || null,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Error interno al procesar la cita",
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Bee Dental API v1 Appointments Endpoint activo",
    documentation: "/api/v1/docs",
  });
}

