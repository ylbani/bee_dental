import { NextRequest, NextResponse } from "next/server";

// Fallback configuration if not in environment
const DEFAULT_SYSTEM_PROMPT = `Eres "Bee Assistant", el asistente virtual inteligente, empático y resolutivo de la clínica odontológica Bee Dental, liderada por la Dra. Leticia Bueno.

Tu misión es brindar atención cálida, resolver dudas sobre tratamientos y coordinar citas de pacientes vía WhatsApp.

Información institucional de Bee Dental:
- Doctora principal: Dra. Leticia Bueno (Odontología Estética, Implantes y Rehabilitación Oral Integral).
- Tratamientos destacados:
  * Ortodoncia Invisible (Alineadores transparentes de última generación).
  * Diseño de Sonrisa 3D y Carillas de Porcelana E-Max.
  * Implantes Dentales Inmediatos (carga en 24 horas y sedación consciente).
  * Blanqueamiento Dental LED y Profilaxis Ultrasonido.
  * Endodoncia mecanizada y Odontopediatría.
- Horario de consulta:
  * Lunes a Viernes: 8:00 AM – 6:00 PM
  * Sábados: 9:00 AM – 2:00 PM
  * Domingos: Cerrado (Emergencias coordinadas vía clínica).
- Ubicación: Santo Domingo, República Dominicana.
- Portal directo de citas: https://beedental.vercel.app

Pautas de interacción en WhatsApp:
1. Responde de forma concisa, cálida y profesional (1 a 3 párrafos breves, fáciles de leer en pantalla de teléfono).
2. Utiliza emojis con moderación (🦷, ✨, 📅, 📍) para dar cercanía humana.
3. Si el paciente desea agendar, pregúntale amablemente su nombre completo, motivo de consulta y día u horario de preferencia, o invítale a reservar en tiempo real en https://beedental.vercel.app.
4. Si el paciente reporta dolor severo, inflamación aguda o traumatismo, indícale acudir de inmediato a consulta prioritaria o llamar a los números de la clínica.`;

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json().catch(() => null);

    if (!payload) {
      return NextResponse.json({ success: false, error: "Cuerpo de solicitud vacío" }, { status: 400 });
    }

    // Evolution API sends event either in payload.event or payload.type
    const event = payload.event || payload.type;

    // We only process incoming message events
    if (event !== "messages.upsert") {
      return NextResponse.json({ received: true, ignoredEvent: event });
    }

    const messageData = payload.data;
    if (!messageData || !messageData.key) {
      return NextResponse.json({ received: true, message: "No data.key found" });
    }

    // 1. Never reply to own messages to avoid endless loops
    if (messageData.key.fromMe) {
      return NextResponse.json({ received: true, ignored: "fromMe is true" });
    }

    // 2. Ignore group messages and broadcast channels
    const remoteJid: string = messageData.key.remoteJid || "";
    if (remoteJid.includes("@g.us") || remoteJid.includes("@broadcast") || remoteJid.includes("status@broadcast")) {
      return NextResponse.json({ received: true, ignored: "group or broadcast message" });
    }

    // 3. Extract patient message text
    const messageContent = messageData.message;
    if (!messageContent) {
      return NextResponse.json({ received: true, ignored: "no message payload" });
    }

    const incomingText: string =
      messageContent.conversation ||
      messageContent.extendedTextMessage?.text ||
      messageContent.imageMessage?.caption ||
      messageContent.videoMessage?.caption ||
      "";

    if (!incomingText.trim()) {
      return NextResponse.json({ received: true, ignored: "empty incoming text" });
    }

    // 4. Resolve Evolution API Server & Instance
    const baseServer = (
      process.env.EVOLUTION_API_URL ||
      process.env.WHATSAPP_API_URL ||
      "http://localhost:8080"
    ).replace(/\/+$/, "");

    const instance =
      payload.instance ||
      process.env.EVOLUTION_INSTANCE_NAME ||
      process.env.WHATSAPP_INSTANCE ||
      "bee-dental";

    const evolutionApiKey =
      process.env.EVOLUTION_API_KEY ||
      process.env.WHATSAPP_API_KEY ||
      "";

    // 5. Resolve Gemini API Key (Client BYOK or Env)
    const geminiApiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      "";

    const geminiModel =
      process.env.GEMINI_MODEL ||
      "gemini-1.5-flash";

    if (!geminiApiKey) {
      console.warn("Evolution API Webhook: Gemini API Key no configurada.");
      return NextResponse.json({
        received: true,
        warning: "Gemini API Key no configurada en las variables de entorno o panel de ajustes.",
      });
    }

    // 6. Call Google Gemini API
    const pushName = messageData.pushName || "Estimado paciente";
    const promptWithUser = `Paciente (${pushName}) pregunta: "${incomingText}"`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: DEFAULT_SYSTEM_PROMPT }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: promptWithUser }],
          },
        ],
        generationConfig: {
          temperature: 0.35,
          maxOutputTokens: 500,
        },
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Error al consultar Gemini:", errText);
      return NextResponse.json({ success: false, error: "Error en Gemini API" });
    }

    const geminiData = await geminiRes.json();
    const aiAnswer =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiAnswer) {
      return NextResponse.json({ received: true, error: "Gemini devolvió respuesta vacía" });
    }

    // 7. Send AI response back to the patient via Evolution API
    const cleanNumber = remoteJid.replace("@s.whatsapp.net", "");
    const sendRes = await fetch(`${baseServer}/message/sendText/${instance}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: evolutionApiKey,
      },
      body: JSON.stringify({
        number: cleanNumber,
        text: aiAnswer,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!sendRes.ok) {
      const sendErr = await sendRes.text();
      console.error("Error enviando respuesta a WhatsApp:", sendErr);
      return NextResponse.json({ success: false, error: "Fallo al enviar a Evolution API" });
    }

    return NextResponse.json({
      success: true,
      sender: cleanNumber,
      userQuery: incomingText,
      replySent: true,
    });
  } catch (error: any) {
    console.error("Error en Webhook de WhatsApp:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Allow GET to verify webhook endpoint health
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    endpoint: "/api/v1/whatsapp/webhook",
    service: "Bee Dental AI WhatsApp Agent Webhook",
    timestamp: new Date().toISOString(),
  });
}
