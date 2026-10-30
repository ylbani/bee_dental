import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { apiKey, model = "gemini-1.5-flash", prompt, systemPrompt } = await request.json();

    const resolvedApiKey =
      apiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      "";

    if (!resolvedApiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "No se proporcionó una API Key de Gemini. Ingrese su clave gratuita de Google AI Studio.",
        },
        { status: 400 }
      );
    }

    const defaultSystemPrompt = `Eres "Bee Assistant", el asistente virtual inteligente y empático de la clínica odontológica Bee Dental, liderada por la Dra. Leticia Bueno.
Tu objetivo es responder dudas sobre tratamientos dentales (ortodoncia invisible, diseño de sonrisa 3D, implantes inmediatos, blanqueamiento LED, endodoncia mecanizada), horarios (Lunes a Viernes de 8:00 AM a 6:00 PM, Sábados de 9:00 AM a 2:00 PM), ubicación en Santo Domingo y coordinar citas de forma cálida, profesional y concisa (ideal para WhatsApp).
Portal oficial de citas: https://beedental.vercel.app`;

    const cleanModel = model.trim().replace(/^models\//, "");
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${resolvedApiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt || defaultSystemPrompt }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: prompt || "¿Cuáles son los horarios de atención y qué tratamientos ofrece la Dra. Leticia Bueno?" }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 600,
        },
      }),
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const msg = errData.error?.message || `Error ${res.status}: Fallo de autenticación o cuota en Gemini API`;
      return NextResponse.json({ success: false, error: msg }, { status: res.status });
    }

    const data = await res.json();
    const candidateText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No se obtuvo respuesta de texto del modelo.";

    return NextResponse.json({
      success: true,
      model: cleanModel,
      response: candidateText,
      usage: data.usageMetadata,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Error interno al comunicarse con Gemini" },
      { status: 500 }
    );
  }
}

