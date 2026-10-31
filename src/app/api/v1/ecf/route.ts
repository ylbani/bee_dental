import { NextRequest, NextResponse } from "next/server";

const DEFAULT_ECF_URL = process.env.ECF_API_URL || "https://ecf.autodilerpro.com/api/v1";
const DEFAULT_ECF_KEY = process.env.ECF_API_KEY || "";

function getEcfConfig(request: NextRequest, body?: any) {
  const customUrl =
    body?.ecfApiUrl ||
    request.headers.get("x-ecf-api-url") ||
    DEFAULT_ECF_URL;

  const customKey =
    body?.ecfApiKey ||
    request.headers.get("x-ecf-api-key") ||
    DEFAULT_ECF_KEY;

  return {
    apiUrl: customUrl.replace(/\/+$/, ""),
    apiKey: customKey.trim(),
  };
}

/**
 * POST /api/v1/ecf
 * Emite una Factura o Comprobante Electrónico (e-CF) a la DGII a través de e-CF API Hub.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiUrl, apiKey } = getEcfConfig(request, body);

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No se ha configurado la X-API-Key de e-CF. Configure la llave en Configuración > Facturación Electrónica e-CF.",
        },
        { status: 400 }
      );
    }

    const {
      tipoEcf = "32",
      tipoIngresos = "01",
      tipoPago = 1,
      externalReference,
      comprador,
      referencia,
      items = [],
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Debe incluir al menos un ítem o servicio a facturar." },
        { status: 400 }
      );
    }

    // Prepare items according to e-CF Hub schema
    const formattedItems = items.map((it: any, idx: number) => {
      const isService = it.indicadorBienoServicio !== undefined ? Number(it.indicadorBienoServicio) : 2; // 2 = Servicio por defecto en dental
      const indicadorFacturacion = it.indicadorFacturacion !== undefined ? Number(it.indicadorFacturacion) : 4; // 4 = Exento por defecto en dental

      return {
        codigo: it.codigo || `ODO-${String(idx + 1).padStart(3, "0")}`,
        nombre: it.nombre || it.service || "Servicio Odontológico Integral",
        descripcion: it.descripcion,
        piezaDental: it.piezaDental || undefined,
        coberturaArs: it.coberturaArs || undefined,
        indicadorBienoServicio: isService,
        indicadorFacturacion,
        cantidad: Number(it.cantidad || it.quantity || 1),
        precioUnitario: Number(it.precioUnitario || it.price || 0),
        descuentoMonto: Number(it.descuentoMonto || 0),
      };
    });

    const payload: Record<string, any> = {
      tipoEcf: String(tipoEcf),
      tipoIngresos: String(tipoIngresos),
      tipoPago: Number(tipoPago),
      externalReference: externalReference || `BEE-INV-${Date.now()}`,
      items: formattedItems,
    };

    if (comprador && (comprador.rnc || comprador.razonSocial)) {
      payload.comprador = {
        rnc: comprador.rnc ? comprador.rnc.replace(/[^0-9]/g, "") : undefined,
        razonSocial: comprador.razonSocial || "CONSUMIDOR FINAL",
        direccion: comprador.direccion,
        correo: comprador.correo,
      };
    }

    if (referencia && referencia.ncfModificado) {
      payload.referencia = {
        ncfModificado: referencia.ncfModificado,
        fechaNCFModificado: referencia.fechaNCFModificado,
        codigoModificacion: Number(referencia.codigoModificacion || 1),
        razonModificacion: referencia.razonModificacion || "Corrección o Devolución",
      };
    }

    // Call e-CF API Hub
    const hubResponse = await fetch(`${apiUrl}/invoices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000),
    });

    const result = await hubResponse.json().catch(() => ({}));

    if (!hubResponse.ok || !result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || result.message || `Error ${hubResponse.status} emitir e-CF`,
          details: result,
        },
        { status: hubResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    console.error("Error en /api/v1/ecf:", err);
    return NextResponse.json(
      {
        success: false,
        error: `Fallo de conexión con el e-CF API Hub: ${err.message}`,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/ecf
 * Consulta secuencias disponibles o detalle de un comprobante emitido.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const encf = searchParams.get("encf");
    const isXml = searchParams.get("xml") === "true";

    const { apiUrl, apiKey } = getEcfConfig(request);

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "X-API-Key no configurada" },
        { status: 400 }
      );
    }

    if (action === "sequences") {
      const res = await fetch(`${apiUrl}/sequences`, {
        headers: { "X-API-Key": apiKey },
        signal: AbortSignal.timeout(8000),
      });
      const data = await res.json().catch(() => ({}));
      return NextResponse.json(data, { status: res.status });
    }

    if (encf) {
      if (isXml) {
        const res = await fetch(`${apiUrl}/invoices/${encf}/xml`, {
          headers: { "X-API-Key": apiKey },
          signal: AbortSignal.timeout(8000),
        });
        const xmlText = await res.text();
        return new NextResponse(xmlText, {
          status: res.status,
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Content-Disposition": `attachment; filename="${encf}.xml"`,
          },
        });
      }

      const res = await fetch(`${apiUrl}/invoices/${encf}`, {
        headers: { "X-API-Key": apiKey },
        signal: AbortSignal.timeout(8000),
      });
      const data = await res.json().catch(() => ({}));
      return NextResponse.json(data, { status: res.status });
    }

    // Default: list recent invoices
    const limit = searchParams.get("limit") || "30";
    const res = await fetch(`${apiUrl}/invoices?limit=${limit}`, {
      headers: { "X-API-Key": apiKey },
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

