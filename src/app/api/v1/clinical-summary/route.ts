import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { patientName, medicalHistory, dentalHistory, oralExam, apiKey, model = "gemini-1.5-flash" } = await request.json();

    const resolvedApiKey =
      apiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      "";

    if (!resolvedApiKey) {
      return NextResponse.json({
        success: false,
        error: "Se requiere una API Key de Gemini configurada en el sistema para generar el resumen clínico asistido por IA.",
      }, { status: 400 });
    }

    const clinicalPrompt = `Eres un odontólogo especialista asistente de la Dra. Leticia Bueno en Bee Dental.
Tu misión es generar una síntesis clínica concisa, técnica y de alta relevancia a partir de la historia clínica del paciente ${patientName || "del paciente"}.

Datos del Historial Médico:
${JSON.stringify(medicalHistory, null, 2)}

Datos del Historial Odontológico:
${JSON.stringify(dentalHistory, null, 2)}

Examen Estomatológico de Boca:
${JSON.stringify(oralExam, null, 2)}

Por favor, estructura tu respuesta en 3 secciones claras:
1. ⚠️ **Factores de Riesgo y Precauciones Clínicas**: (Alergias, hipertensión, antecedentes con anestesia, sangrado o embarazo).
2. 🦷 **Estado de Salud Bucal y Hábitos**: (Higiene, frecuencia de cepillado, hallazgos de labios, encías, ATM y oclusión).
3. 📋 **Recomendaciones para el Plan de Tratamiento**: (Exámenes complementarios requeridos y consideraciones previas a procedimientos invasivos).`;

    const cleanModel = model.trim().replace(/^models\//, "");
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${resolvedApiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: clinicalPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 700,
        },
      }),
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json({
        success: false,
        error: err.error?.message || "Error al comunicarse con la IA para generar el resumen.",
      }, { status: res.status });
    }

    const data = await res.json();
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || "No se generó texto de resumen.";

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || "Error interno al procesar el resumen clínico",
    }, { status: 500 });
  }
}

