# ST Importaciones

Link page for Sandor Takacs / ST Importaciones. Vite + React + Tailwind, hosted on Netlify.

- `src/config.ts`: WhatsApp number, social links, trip details and calculator rates.
- `netlify/functions/chat.mts`: assistant at `/api/chat` (Gemini when `GEMINI_API_KEY` is set, built-in answers otherwise).
- `public/__forms.html`: Netlify Forms definitions (`viaje`, `contacto`, `boletin`). Leads appear under Forms in Netlify.

`npm install`, `npm run dev`, `npm run build`.
