import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, serverUrl, apiKey, instanceName, phone, message } = body;

    const baseServer = (serverUrl || "http://localhost:8080").replace(/\/+$/, "");
    const instance = instanceName || "bee-dental";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      apikey: apiKey || "",
    };

    if (action === "status") {
      try {
        const res = await fetch(`${baseServer}/instance/connectionState/${instance}`, {
          method: "GET",
          headers,
          // 5s timeout
          signal: AbortSignal.timeout(5000),
        });
        if (res.ok) {
          const data = await res.json();
          return NextResponse.json({ success: true, data });
        }
      } catch (err: any) {
        return NextResponse.json({
          success: false,
          error: `No se pudo conectar a Evolution API en ${baseServer}: ${err.message}`,
        });
      }
    }

    if (action === "create_or_qr") {
      try {
        // First check if instance exists
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

        // If not found, create instance
        const createRes = await fetch(`${baseServer}/instance/create`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            instanceName: instance,
            token: apiKey || "bee-token-secret",
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

        const errText = await createRes.text();
        return NextResponse.json({
          success: false,
          error: `Error al crear/conectar instancia en Evolution API (${createRes.status}): ${errText}`,
        });
      } catch (err: any) {
        return NextResponse.json({
          success: false,
          error: `Fallo de conexión con ${baseServer}: ${err.message}. Verifica que el contenedor Docker esté accesible en el puerto 8080.`,
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

        const errText = await res.text();
        return NextResponse.json({ success: false, error: `Error Evolution API: ${errText}` });
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
