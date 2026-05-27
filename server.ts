import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI securely on the server
let aiClient: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Secure GoogleGenAI client successfully initialized.");
  } else {
    console.warn("No valid GEMINI_API_KEY provided in environment variables. Falling back to local offline smart assistance.");
  }
} catch (e) {
  console.error("Failed to initialize Google Gen AI client: ", e);
}

// -------------------------------------------------------------
// API Route: Secure AI Chat Assistant
// -------------------------------------------------------------
app.post("/api/chat", async (req, res) => {
  const { messages, context } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages array." });
  }

  const systemInstruction = `
Eres la Asistente de Inteligencia Artificial para "EMPRENDELANDIA", un espacio liderado por una mentora experta en importaciones y negocios mayoristas.
Tu propósito es ayudar con empatía, energía positiva y conocimiento práctico a emprendedores y minoristas que desean importar mercancías (de marcas como Shein, Zara, Pat Pat u otros distribuidores en China y Estados Unidos) o que quieren viajar en misiones comerciales internacionales y ganar dinero en comisiones USD desde casa.

Detalles comerciales clave de EMPRENDELANDIA para guiar al usuario:
1. "Viaje de Negocios Panamá 2026": Se programará del 14 al 20 de Junio de 2026. Es una inmersión completa para aprender a comprar directamente de las distribuidoras en la Zona Libre de Colón y en Ciudad de Panamá. Incluye mentoría, transporte grupal, acompañamiento logístico, hotel e inducción de aduanas. ¡No requiere visa de EE. UU.!
2. "Importamos Pacas por Ti": Facilitamos pacas de tiendas reconocidas como Shein, Zara y Pat Pat. No tienes que preocuparte por trámites aduanales, nosotros nos encargamos y te las entregamos a precios mayoristas competitivos para que tu margen de ganancia sea excelente (frecuentemente del 80% al 120%).
3. "Estilo de Comunicación": Entusiasta, amigable, orientada a los negocios, práctica y estructurada. Siempre respondes en español. Usa emojis de manera moderada y elegante (como ✈️, 💸, 📦, 🏡) para motivar la lectura.

Si el cliente pregunta por costos o simulaciones, oriéntalo a usar los excelentes simuladores interactivos de nuestra página, y ofrécele explicarle cómo optimizar las tarifas aéreas o marítimas. Si no hay API key disponible o falla, responde con consejos genéricos pero útiles de comercio exterior.
  `;

  if (!aiClient) {
    // Elegant fallback simulation when no Gemini key is provided
    const lastUserMsg = messages[messages.length - 1]?.content || "";
    let reply = `¡Hola! Gracias por escribirle a EMPRENDELANDIA. Para darte la mejor asesoría en importaciones y comentarte sobre nuestro viaje comercial a Panamá del 14 al 20 de Junio de 2026, te recomiendo registrarte en nuestro formulario superior. `;
    if (lastUserMsg.toLowerCase().includes("panama") || lastUserMsg.toLowerCase().includes("viaje")) {
      reply += "El Viaje de Negocios a Panamá es ideal ya que visitamos las bodegas libres de impuestos más grandes en la Zona de Colón. No necesitas visa de EE. UU. para ir con nosotros y te guiamos en la creación de tu propio casillero postal.";
    } else if (lastUserMsg.toLowerCase().includes("paca") || lastUserMsg.toLowerCase().includes("shein") || lastUserMsg.toLowerCase().includes("zara")) {
      reply += "Con nuestro servicio de Importación de Pacas de Shein, Zara o Pat Pat, puedes ordenar packs de 50 o 100 prendas seleccionadas con entrega garantizada. ¡Te sugerimos usar nuestra calculadora de pacas personalizada en esta misma página!";
    } else {
      reply += "¡Podemos ayudarte a importar vía aérea o marítima! ¿Te gustaría calcular el costo estimado de libras o tienes dudas de aduanas en tu país?";
    }
    return res.json({ text: reply });
  }

  try {
    // Construct simplified prompt history
    // Since we're doing a single generateContent call, we can pass systemInstruction inside config
    const promptParts = messages.map(m => `${m.role === "user" ? "Usuario" : "Tú"}: ${m.content}`).join("\n");
    const fullPrompt = `${promptParts}\n\nTú (continúa la conversación amablemente en base a las instrucciones del sistema):`;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({ text: response.text || "Disculpa, no logré procesar la respuesta." });
  } catch (error) {
    console.error("Gemini request failed:", error);
    return res.status(500).json({ error: "Lo siento, tuvimos un contratiempo técnico con el asesor inteligente." });
  }
});

// Serve assets and setup Vite development server middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite middleware for development.");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production assets from /dist.");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EMPRENDELANDIA server listing on http://localhost:${PORT}`);
  });
}

startServer();
