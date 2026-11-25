import { useState, type FormEvent } from "react";
import { CalendarDays, Check, MapPin, Users } from "lucide-react";
import Sheet from "./Sheet";
import { site } from "../config";
import { hasWhatsApp, sendLead } from "../lib/leads";

const CATEGORIES = [
  "Ropa de dama",
  "Calzado",
  "Accesorios y bisutería",
  "Electrónicos y celulares",
  "Hogar y decoración",
  "Maquillaje y cuidado de la piel",
];

const ITINERARY = [
  ["Llegada a Guangzhou", "Te recibimos en el aeropuerto Baiyun, traslado al hotel y cena de bienvenida con la introducción al sourcing en China."],
  ["Feria de Cantón o showrooms mayoristas", "Visita guiada a la Feria de Cantón o a los centros mayoristas de ropa, calzado y accesorios."],
  ["Mercado de Yiwu (Futian)", "Recorrido por el mercado mayorista más grande del mundo: papelería, juguetes, ferretería y decoración."],
  ["Fábricas y negociación de precios", "Visitas a fábricas en Guangdong y Zhejiang. Producción personalizada (OEM/ODM) y control de calidad."],
  ["Logística y consolidación de carga", "Eliges agente de carga y entiendes contenedor completo (FCL), carga consolidada (LCL) y aduanas."],
  ["Cierre y plan de acción", "Almuerzo de negocios y tu plan de importación listo para despachar."],
];

interface Props { open: boolean; onClose: () => void; onContact: (message: string) => void }

export default function TripSheet({ open, onClose, onContact }: Props) {
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [cats, setCats] = useState<string[]>([]);
  const [experienced, setExperienced] = useState(false);
  const [error, setError] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  const toggle = (c: string) => {
    setError("");
    setCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (cats.length === 0) return setError("Elige al menos una categoría.");
    setState("sending");
    try {
      await sendLead("viaje", {
        nombre, whatsapp, email,
        categorias: cats.join(", "),
        experiencia: experienced ? "Ya importa" : "Empieza de cero",
      });
      setState("sent");
    } catch {
      setState("idle");
      setError("No se envió tu solicitud. Revisa tu conexión y vuelve a intentar.");
    }
  };

  return (
    <Sheet open={open} onClose={onClose} title={site.trip.name} subtitle="Compra directo de fábrica, sin intermediarios.">
      <section className="door rounded-xl p-5 text-white">
        <p className="text-[1.05rem] leading-relaxed text-white/90">
          Viaja con un grupo pequeño de empresarios y conoce en persona a los proveedores de textiles, tecnología, calzado y
          gadgets de Guangzhou y Yiwu.
        </p>
        <dl className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
          <div className="flex items-start gap-2"><CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-signal" /><div><dt className="font-semibold">{site.trip.when}</dt><dd className="text-white/70">{site.trip.whenNote}</dd></div></div>
          <div className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-signal" /><div><dt className="font-semibold">{site.trip.place}</dt><dd className="text-white/70">China</dd></div></div>
          <div className="flex items-start gap-2"><Users className="mt-0.5 h-4 w-4 shrink-0 text-signal" /><div><dt className="font-semibold">{site.trip.seats}</dt><dd className="text-white/70">Grupo reducido</dd></div></div>
        </dl>
      </section>

      {state === "sent" ? (
        <section className="rounded-xl bg-white p-6 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-wa text-white"><Check className="h-6 w-6" /></span>
          <h3 className="mt-4 text-xl font-bold">Lugar solicitado, {nombre.split(" ")[0]}</h3>
          <p className="hint mx-auto mt-1 max-w-sm">
            Guardamos tu solicitud. Te escribimos al {whatsapp} con fechas, precio y los pasos para confirmar tu cupo.
          </p>
          {hasWhatsApp && (
            <button
              className="btn btn-wa mt-5"
              onClick={() => onContact(`Hola ST Importaciones. Soy ${nombre} y acabo de solicitar mi lugar en el viaje de negocios a China. Me interesa: ${cats.join(", ")}.`)}
            >
              Confirmar por WhatsApp
            </button>
          )}
        </section>
      ) : (
        <>
          <section>
            <h3 className="text-lg font-bold">Itinerario de referencia</h3>
            <ol className="mt-3 space-y-0">
              {ITINERARY.map(([title, desc], i) => (
                <li key={title} className="grid grid-cols-[3.25rem_1fr] gap-3 border-t border-[#c3d0db] py-3.5">
                  <span className="pt-0.5 text-sm font-bold text-navy">Día {i + 1}</span>
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="hint mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-xl bg-white p-5">
            <h3 className="text-lg font-bold">Solicita tu lugar</h3>
            <p className="hint mt-1">Sin pago ni compromiso. Te contactamos con fechas y precio.</p>
            <form onSubmit={submit} className="mt-4 space-y-4">
              <div>
                <label className="label" htmlFor="t-nombre">Nombre completo</label>
                <input id="t-nombre" className="field" required value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="t-wa">WhatsApp</label>
                  <input id="t-wa" className="field" required type="tel" inputMode="tel" placeholder="+591 7XXXXXXX" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} autoComplete="tel" />
                </div>
                <div>
                  <label className="label" htmlFor="t-email">Correo <span className="font-normal text-[#5a6b7a]">(opcional)</span></label>
                  <input id="t-email" className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
                </div>
              </div>
              <fieldset>
                <legend className="label">¿Qué quieres importar?</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {CATEGORIES.map((c) => (
                    <button type="button" key={c} className="chip" aria-pressed={cats.includes(c)} onClick={() => toggle(c)}>{c}</button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="label">¿Ya has importado antes?</legend>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" className="chip" aria-pressed={experienced} onClick={() => setExperienced(true)}>Sí, ya importo</button>
                  <button type="button" className="chip" aria-pressed={!experienced} onClick={() => setExperienced(false)}>No, empiezo de cero</button>
                </div>
              </fieldset>
              {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}
              <button className="btn btn-navy w-full" disabled={state === "sending"}>{state === "sending" ? "Enviando…" : "Solicitar mi lugar"}</button>
            </form>
          </section>
        </>
      )}
    </Sheet>
  );
}
