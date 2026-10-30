import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, serverUrl, apiKey, instanceName, phone, message } = body;

    // Prioritize environment variables, fallback to request body or defaults
    const baseServer = (
      serverUrl ||
      process.env.EVOLUTION_API_URL ||
      process.env.WHATSAPP_API_URL ||
      "http://localhost:8080"
    ).replace(/\/+$/, "");

    const instance =
      instanceName ||
      process.env.EVOLUTION_INSTANCE_NAME ||
      process.env.WHATSAPP_INSTANCE ||
      "bee-dental";

    const resolvedApiKey =
      apiKey ||
      process.env.EVOLUTION_API_KEY ||
      process.env.WHATSAPP_API_KEY ||
      "";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      apikey: resolvedApiKey,
    };

    if (action === "status") {
      try {
        const res = await fetch(`${baseServer}/instance/connectionState/${instance}`, {
          method: "GET",
          headers,
          signal: AbortSignal.timeout(5000),
        });
        if (res.ok) {
          const data = await res.json();
          return NextResponse.json({ success: true, data });
        }
        return NextResponse.json({ success: true, data: { instance: { state: "close" } } });
      } catch (err: any) {
        return NextResponse.json({
          success: false,
          error: "El servicio de mensajería no respondió a la verificación de estado.",
        });
      }
    }

    if (action === "create_or_qr") {
      try {
        // 1. Try to fetch existing QR or connection
        const connectRes = await fetch(`${baseServer}/instance/connect/${instance}`, {
          method: "GET",
          headers,
          signal: AbortSignal.timeout(8000),
        });

        if (connectRes.ok) {
          const connectData = await connectRes.json();
          return NextResponse.json({
            success: true,
            status: "ready_qr",
            qr: connectData.base64 || connectData.code || connectData.qrcode?.base64,
            pairingCode: connectData.pairingCode,
          });
        }

        // 2. If not found, create instance
        const createRes = await fetch(`${baseServer}/instance/create`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            instanceName: instance,
            token: resolvedApiKey || "bee-token-secret",
            qrcode: true,
            integration: "WHATSAPP-BAILEYS",
          }),
          signal: AbortSignal.timeout(8000),
        });

        if (createRes.ok) {
          const createData = await createRes.json();
          return NextResponse.json({
            success: true,
            status: "created",
            qr: createData.qrcode?.base64 || createData.base64 || createData.hash?.base64,
            data: createData,
          });
        }

        return NextResponse.json({
          success: false,
          error: "No se pudo generar el código QR. Verifica la conexión con el servidor de mensajería.",
        });
      } catch (err: any) {
        return NextResponse.json({
          success: false,
          error: "No fue posible comunicarse con el servicio de WhatsApp. Verifica que el servidor esté activo.",
        });
      }
    }

    if (action === "send_test") {
      try {
        const cleanNumber = (phone || "").replace(/\D/g, "");
        const res = await fetch(`${baseServer}/message/sendText/${instance}`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            number: cleanNumber,
            text: message || "Mensaje de prueba oficial desde Bee Dental • Dra. Leticia Bueno",
          }),
          signal: AbortSignal.timeout(8000),
        });

        if (res.ok) {
          const data = await res.json();
          return NextResponse.json({ success: true, message: "Mensaje enviado exitosamente", data });
        }

        return NextResponse.json({
          success: false,
          error: "El servicio no pudo entregar el mensaje al número indicado.",
        });
      } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message });
      }
    }

    if (action === "logout") {
      try {
        await fetch(`${baseServer}/instance/logout/${instance}`, {
          method: "DELETE",
          headers,
          signal: AbortSignal.timeout(5000),
        });
        return NextResponse.json({ success: true, message: "Instancia desvinculada" });
      } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message });
      }
    }

    return NextResponse.json({ success: false, error: "Acción no reconocida" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
