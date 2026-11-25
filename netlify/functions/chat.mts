import type { Config } from "@netlify/functions";

const SYSTEM = `Eres el asistente de "ST Importaciones", la empresa de importación y logística de Sandor Takacs.
Ayudas a emprendedores que quieren importar mercancía (Amazon, eBay, Shein, Zara, fábricas en China y EE.UU.) o unirse al viaje de negocios a China.

Lo que ofrece ST Importaciones:
1. Viaje de negocios a China: grupo reducido, Feria de Cantón en Guangzhou y mercado de Yiwu (Futian), visitas a fábricas, acompañamiento logístico. La próxima salida es en 2027 y las fechas y el precio aún se están confirmando: nunca inventes fechas ni precios; invita a solicitar lugar en la página.
2. "Importamos por ti": compra consolidada en Amazon, eBay, Shein, Zara y otras tiendas, con trámite de aduana incluido.
3. Guía para quien importa por su cuenta: casillero, factura comercial, pre-alerta, clasificación arancelaria, consolidación y liquidación.

Reglas:
- Responde siempre en español, claro y breve (máximo 120 palabras), sin emojis en exceso.
- No des cifras exactas de aranceles, impuestos ni tarifas como si fueran oficiales: varían por producto y país. Sugiere usar las calculadoras de la página para estimar y hablar con un asesor para la cotización real.
- Si no sabes algo, dilo y sugiere "Hablar con un asesor".
- Solo hablas de importación, logística, aduanas y los servicios de ST Importaciones.`;

function offlineAnswer(question: string): string {
  const q = question.toLowerCase();
  if (/china|viaje|yiwu|cant[oó]n|guangzhou|feria/.test(q))
    return "El viaje de negocios a China es para comprar directo de fábrica: Feria de Cantón en Guangzhou, mercado de Yiwu y visitas a fábricas, en grupo reducido y con nuestro acompañamiento. La próxima salida es en 2027 y estamos confirmando fechas. Abre “Viaje de negocios a China” en la página y solicita tu lugar; te escribimos con fechas y precio.";
  if (/a[eé]reo|mar[ií]timo|flete|env[ií]o|cu[aá]nto tarda|demora/.test(q))
    return "Aéreo conviene cuando necesitas la mercancía rápido o el paquete es liviano; marítimo cuesta menos por kilo y conviene para lotes grandes sin apuro. En las calculadoras de la página puedes comparar ambos con tu peso y cantidad. Para la tarifa real de tu carga, toca “Hablar con un asesor”.";
  if (/aduana|arancel|impuesto|documento|factura|permiso/.test(q))
    return "Para aduana necesitas, como base, la factura comercial detallada de tu proveedor, el número de tracking registrado como pre-alerta y la clasificación arancelaria correcta del producto. Algunos productos (cosméticos, alimentos, ropa infantil) pueden requerir permisos. El porcentaje a pagar depende del producto y del país; un asesor te confirma tu caso.";
  if (/amazon|ebay|shein|zara|paca|lote|ropa|comprar/.test(q))
    return "Con “Importamos por ti” compramos tu lote en Amazon, eBay, Shein, Zara y otras tiendas, lo consolidamos y nos encargamos del trámite de aduana. Usa la calculadora de esa sección para ver inversión, costo por prenda y ganancia estimada, y envíanos el lote desde ahí.";
  return "Puedo orientarte sobre el viaje de negocios a China, la compra de lotes en Amazon, Shein o Zara, y los pasos de aduana si importas por tu cuenta. Cuéntame qué producto quieres traer y desde dónde. Si prefieres atención directa, toca “Hablar con un asesor”.";
}

interface Msg { role: "user" | "assistant"; content: string }

export default async (req: Request) => {
  let messages: Msg[] = [];
  try {
    const body = await req.json();
    if (Array.isArray(body?.messages)) messages = body.messages;
  } catch {
    return Response.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const clean = messages
    .filter((m) => (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string")
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 800) }));
  while (clean.length && clean[0].role !== "user") clean.shift();
  const last = clean[clean.length - 1];
  if (!last || last.role !== "user") return Response.json({ error: "Falta la pregunta." }, { status: 400 });

  const key = Netlify.env.get("GEMINI_API_KEY");
  if (key) {
    const base = (Netlify.env.get("GOOGLE_GEMINI_BASE_URL") || "https://generativelanguage.googleapis.com").replace(/\/$/, "");
    const models = [Netlify.env.get("GEMINI_MODEL"), "gemini-3.5-flash", "gemini-2.5-flash"].filter(Boolean) as string[];
    for (const model of models) {
      try {
        const res = await fetch(`${base}/v1beta/models/${model}:generateContent`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": key },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM }] },
            contents: clean.map((m) => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.content }] })),
            generationConfig: { temperature: 0.6, maxOutputTokens: 600 },
          }),
          signal: AbortSignal.timeout(20000),
        });
        if (!res.ok) {
          console.error(`Gemini ${model} responded ${res.status}`);
          continue;
        }
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("").trim();
        if (text) return Response.json({ text, source: "ai" });
      } catch (err) {
        console.error(`Gemini ${model} failed`, err);
      }
    }
  }

  return Response.json({ text: offlineAnswer(last.content), source: "faq" });
};

export const config: Config = {
  path: "/api/chat",
  method: "POST",
  rateLimit: { windowLimit: 20, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
