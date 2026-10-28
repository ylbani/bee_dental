import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const AvailabilityQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
  serviceId: z.string().optional(),
  professionalId: z.string().optional(),
  durationMinutes: z.coerce.number().int().min(10).max(180).default(30),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = AvailabilityQuerySchema.safeParse({
      date: searchParams.get("date"),
      serviceId: searchParams.get("serviceId") || undefined,
      professionalId: searchParams.get("professionalId") || undefined,
      durationMinutes: searchParams.get("durationMinutes") || undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Parámetros inválidos", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { date, durationMinutes } = parsed.data;
    const requestedDate = new Date(`${date}T00:00:00`);
    const dayOfWeek = requestedDate.getDay(); // 0 = Domingo, 6 = Sábado

    // Closed on Sunday
    if (dayOfWeek === 0) {
      return NextResponse.json({
        date,
        available: false,
        message: "La clínica está cerrada los domingos.",
        slots: [],
      });
    }

    // Schedule: Mon-Fri 08:30 - 20:30; Sat 09:00 - 14:00
    const startHour = dayOfWeek === 6 ? 9 : 8.5; // 08:30 = 8.5
    const endHour = dayOfWeek === 6 ? 14 : 20.5; // 20:30 = 20.5

    const slots: string[] = [];
    const intervalMinutes = 30;

    let currentMinutes = startHour * 60;
    const endMinutes = endHour * 60;

    while (currentMinutes + durationMinutes <= endMinutes) {
      // Exclude lunch break 13:30 - 14:30 on weekdays
      if (dayOfWeek !== 6 && currentMinutes >= 13.5 * 60 && currentMinutes < 14.5 * 60) {
        currentMinutes += intervalMinutes;
        continue;
      }

      const h = Math.floor(currentMinutes / 60);
      const m = currentMinutes % 60;
      const timeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

      slots.push(timeStr);
      currentMinutes += intervalMinutes;
    }

    return NextResponse.json({
      date,
      available: slots.length > 0,
      clinic: "Bee Dental — Plaza Balón, Santo Domingo",
      timeZone: "America/Santo_Domingo",
      durationMinutes,
      slots,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error calculando disponibilidad", details: (error as Error).message },
      { status: 500 }
    );
  }
}

