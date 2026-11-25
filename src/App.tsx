import { useCallback, useState, type FormEvent, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { Calculator, Check, ChevronRight, MessageCircle, PackageSearch, Plane, Share2, Sparkles } from "lucide-react";
import { rates, site } from "./config";
import { hasWhatsApp, sendLead, usd, whatsappUrl } from "./lib/leads";
import TripSheet from "./components/TripSheet";
import BatchSheet from "./components/BatchSheet";
import OwnImportSheet from "./components/OwnImportSheet";
import ChatSheet from "./components/ChatSheet";
import ContactSheet from "./components/ContactSheet";

type SheetId = "trip" | "batch" | "own" | "chat" | "contact" | null;

const SOCIAL_ICONS: Record<keyof typeof site.socials, { label: string; path: ReactNode }> = {
  tiktok: { label: "TikTok", path: <path fill="currentColor" d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.2-.41-.43-.61-.65-.02.48-.01.96-.01 1.44-.02 3.47-.88 7.09-3.41 9.42-2.33 2.15-5.73 2.92-8.82 2.06C2.12 19.5-.14 15.28.18 11.51c.36-4.22 4.02-7.85 8.27-7.61.1.01.21.01.32.03V8c-1.42-.4-3.08-.1-4.18.86C3.41 9.87 3.3 11.66 3.98 13c.73 1.43 2.4 2.37 4.02 2.19 1.69-.17 3.12-1.52 3.39-3.21.14-.92.1-1.85.11-2.77 0-3.07-.01-6.13-.01-9.2z" /> },
  instagram: { label: "Instagram", path: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></g> },
  youtube: { label: "YouTube", path: <path fill="currentColor" d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /> },
  facebook: { label: "Facebook", path: <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /> },
};

const WA_ICON = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden><path fill="currentColor" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88zm8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.41z" /></svg>
);

function Portrait() {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative mx-auto h-[148px] w-[148px]">
      <span className="halo absolute inset-0 rounded-full" aria-hidden />
      <span className="absolute inset-[5px] grid place-items-center overflow-hidden rounded-full bg-white">
        {failed ? (
          <span className="text-4xl font-bold text-navy">ST</span>
        ) : (
          <img src={site.photo} alt={site.owner} className="h-full w-full object-cover" referrerPolicy="no-referrer" onError={() => setFailed(true)} />
        )}
      </span>
    </div>
  );
}

/** Freight estimate right on the page, no taps needed to see a number. */
function QuickQuote({ onDetail }: { onDetail: () => void }) {
  const [kg, setKg] = useState(10);
  const [mode, setMode] = useState<"air" | "sea">("air");
  const price = kg * (mode === "air" ? rates.airPerKg : rates.seaPerKg);
  return (
    <section className="rounded-[24px] border border-white/12 bg-white/[0.07] p-5 backdrop-blur">
      <h2 className="text-lg font-bold">¿Cuánto cuesta traerlo?</h2>
      <div className="mt-3 flex gap-1 rounded-[14px] bg-black/25 p-1">
        <button className="seg" aria-pressed={mode === "air"} onClick={() => setMode("air")}>Aéreo</button>
        <button className="seg" aria-pressed={mode === "sea"} onClick={() => setMode("sea")}>Marítimo</button>
      </div>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="tnum text-[2.6rem] font-bold leading-none text-signal">{usd(price)}</p>
          <p className="mt-1.5 text-sm text-white/70">Flete estimado, {mode === "air" ? rates.airDays : rates.seaDays}</p>
        </div>
        <output htmlFor="q-kg" className="tnum pb-1 text-lg font-semibold">{kg} kg</output>
      </div>
      <label className="sr-only" htmlFor="q-kg">Peso en kilos</label>
      <input id="q-kg" type="range" className="dark-range mt-2" min={1} max={70} value={kg} onChange={(e) => setKg(Number(e.target.value))} />
      <button onClick={onDetail} className="mt-1 inline-flex min-h-11 cursor-pointer items-center gap-1 font-semibold text-sky">
        Sumar aduana e impuestos <ChevronRight className="h-4 w-4" aria-hidden />
      </button>
    </section>
  );
}

export default function App() {
  const [sheet, setSheet] = useState<SheetId>(null);
  const [contactMsg, setContactMsg] = useState("");
  const [email, setEmail] = useState("");
  const [sub, setSub] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [shared, setShared] = useState(false);

  const close = useCallback(() => setSheet(null), []);

  // One door for every "talk to us" action: WhatsApp when a number is set, lead form otherwise.
  const contact = useCallback((message: string) => {
    if (hasWhatsApp) {
      window.open(whatsappUrl(message), "_blank", "noopener");
    } else {
      setContactMsg(message);
      setSheet("contact");
    }
  }, []);

  const share = async () => {
    const data = { title: `${site.owner} | ${site.brand}`, url: window.location.href };
    try {
      if (navigator.share) return await navigator.share(data);
      await navigator.clipboard.writeText(data.url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch { /* share sheet dismissed */ }
  };

  const subscribe = async (e: FormEvent) => {
    e.preventDefault();
    setSub("sending");
    try {
      await sendLead("boletin", { email });
      setSub("done");
    } catch {
      setSub("error");
    }
  };

  const socials = (Object.keys(site.socials) as (keyof typeof site.socials)[]).filter((k) => site.socials[k]);

  const links = [
    { id: "batch" as const, icon: PackageSearch, tint: "bg-[#e3f5fe] text-navy", title: "Importamos por ti", text: "Amazon, eBay, Shein, Zara y más" },
    { id: "own" as const, icon: Calculator, tint: "bg-[#fff3d1] text-[#7a5600]", title: "¿Importas por tu cuenta?", text: "Calculadora de aduana y guía paso a paso" },
    { id: "chat" as const, icon: Sparkles, tint: "bg-[#e6f6ec] text-wa", title: "Pregúntale al asistente", text: "Respuestas al instante, 24/7" },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-dvh overflow-x-clip text-white">
        {/* Ambient cover: his picture, blurred, fading into the page. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden" aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-b from-navy via-hull to-deep" />
          <img src={site.photo} alt="" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full scale-125 object-cover opacity-55 blur-3xl saturate-150" onError={(e) => (e.currentTarget.style.display = "none")} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deep/40 to-deep" />
        </div>

        <main className="rise relative mx-auto flex w-full max-w-[30rem] flex-col gap-4 px-4 pb-32 pt-5">
          <div className="flex justify-end">
            <button onClick={share} aria-label="Compartir esta página" className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-white/20 bg-white/10 backdrop-blur hover:bg-white/20">
              {shared ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
            </button>
          </div>

          <header className="text-center">
            <Portrait />
            <h1 className="mt-4 text-[2rem] font-bold leading-tight tracking-tight">{site.owner}</h1>
            <p className="mt-0.5 font-semibold text-sky">{site.brand}</p>
            <p className="mx-auto mt-3 max-w-[22rem] leading-relaxed text-white/85">{site.tagline}</p>
            {socials.length > 0 && (
              <div className="mt-4 flex justify-center gap-3">
                {socials.map((k) => (
                  <a key={k} href={site.socials[k]} target="_blank" rel="noreferrer" aria-label={SOCIAL_ICONS[k].label} className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/10 hover:bg-white/20">
                    <svg viewBox="0 0 24 24" className="h-5 w-5">{SOCIAL_ICONS[k].path}</svg>
                  </a>
                ))}
              </div>
            )}
          </header>

          <button
            onClick={() => setSheet("trip")}
            className="group relative mt-1 block w-full cursor-pointer overflow-hidden rounded-[24px] bg-gradient-to-br from-sky to-navy p-5 text-left shadow-[0_18px_40px_-14px_rgba(19,176,245,0.6)] transition-transform active:scale-[0.985]"
          >
            <Plane className="absolute -right-3 -top-3 h-28 w-28 -rotate-12 text-white/15" aria-hidden />
            <span className="inline-block rounded-full bg-signal px-3 py-1 text-sm font-bold text-hull">{site.trip.when}</span>
            <span className="mt-3 block text-[1.7rem] font-bold leading-[1.05] tracking-tight">{site.trip.name}</span>
            <span className="mt-1.5 block text-white/90">Feria de Cantón y Yiwu. Compra directo de fábrica.</span>
            <span className="mt-4 flex min-h-12 items-center justify-center gap-1 rounded-[14px] bg-white font-bold text-hull">
              Solicitar mi lugar <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
          </button>

          <QuickQuote onDetail={() => setSheet("own")} />

          <nav aria-label="Servicios" className="flex flex-col gap-3">
            {links.map(({ id, icon: Icon, tint, title, text }) => (
              <button key={id} onClick={() => setSheet(id)} className="tile">
                <span className={"grid h-[52px] w-[52px] shrink-0 place-items-center rounded-[14px] " + tint}><Icon className="h-6 w-6" aria-hidden /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[1.05rem] font-bold leading-tight">{title}</span>
                  <span className="mt-0.5 block text-sm text-[#4a5b6a]">{text}</span>
                </span>
                <ChevronRight className="h-5 w-5 shrink-0 text-[#8a9aa8]" aria-hidden />
              </button>
            ))}
          </nav>

          <section className="rounded-[24px] border border-white/12 bg-white/[0.07] p-5">
            <h2 className="text-lg font-bold">Alertas de aduana y contenedores</h2>
            <p className="mt-1 text-sm text-white/70">Remates de aduana y llegadas de pacas, directo en tu correo.</p>
            {sub === "done" ? (
              <p className="mt-3 flex items-center gap-2 rounded-[14px] bg-wa/25 px-4 py-3 font-medium"><Check className="h-5 w-5" /> Suscrito. Te avisamos en {email}.</p>
            ) : (
              <form onSubmit={subscribe} className="mt-3 flex gap-2">
                <label className="sr-only" htmlFor="sub-email">Correo electrónico</label>
                <input id="sub-email" type="email" required className="field min-w-0" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
                <button className="btn shrink-0 bg-sky text-hull" disabled={sub === "sending"}>{sub === "sending" ? "Enviando…" : "Suscribirme"}</button>
              </form>
            )}
            {sub === "error" && <p role="alert" className="mt-2 text-sm font-medium text-[#ffb4ab]">No se guardó tu correo. Vuelve a intentar.</p>}
          </section>

          <footer className="pt-2 text-center text-sm text-white/50">
            © {new Date().getFullYear()} {site.brand}. Aduanas, logística y distribución.
          </footer>
        </main>

        {/* Dock: the two actions that make money, always one thumb away. */}
        <div className="fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-deep via-deep/95 to-transparent px-4 pb-[max(0.9rem,env(safe-area-inset-bottom))] pt-6">
          <div className="mx-auto flex max-w-[30rem] gap-2">
            <button className="btn btn-wa min-h-[54px] flex-1 rounded-[16px] text-base shadow-[0_10px_30px_-8px_rgba(18,140,74,0.8)]" onClick={() => contact("Hola ST Importaciones. Quiero información para importar.")}>
              {WA_ICON} {hasWhatsApp ? "Escríbeme por WhatsApp" : "Hablar con un asesor"}
            </button>
            <button className="btn min-h-[54px] rounded-[16px] border border-white/20 bg-white/10 px-4 text-white backdrop-blur" onClick={() => setSheet("chat")} aria-label="Abrir el asistente">
              <MessageCircle className="h-6 w-6" />
            </button>
          </div>
        </div>

        <TripSheet open={sheet === "trip"} onClose={close} onContact={contact} />
        <BatchSheet open={sheet === "batch"} onClose={close} onContact={contact} />
        <OwnImportSheet open={sheet === "own"} onClose={close} onContact={contact} />
        <ChatSheet open={sheet === "chat"} onClose={close} onContact={contact} />
        <ContactSheet open={sheet === "contact"} onClose={close} message={contactMsg} />
      </div>
    </MotionConfig>
  );
}
