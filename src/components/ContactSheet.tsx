import { useEffect, useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import Sheet from "./Sheet";
import { sendLead } from "../lib/leads";

interface Props { open: boolean; onClose: () => void; message: string }

/** Used while no business WhatsApp is configured: we collect theirs instead. */
export default function ContactSheet({ open, onClose, message }: Props) {
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [mensaje, setMensaje] = useState(message);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => { if (open) { setMensaje(message); setState("idle"); } }, [open, message]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      await sendLead("contacto", { nombre, whatsapp, mensaje });
      setState("sent");
    } catch {
      setState("error");
    }
  };

  return (
    <Sheet open={open} onClose={onClose} title="Te escribimos nosotros" subtitle="Déjanos tu WhatsApp y un asesor te contacta.">
      {state === "sent" ? (
        <div className="rounded-xl bg-white p-6 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-wa text-white"><Check className="h-6 w-6" /></span>
          <p className="mt-4 text-lg font-semibold">Mensaje enviado</p>
          <p className="hint mt-1">Te escribimos al {whatsapp} lo antes posible.</p>
          <button className="btn btn-line mt-5" onClick={onClose}>Cerrar</button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label" htmlFor="c-nombre">Nombre</label>
            <input id="c-nombre" className="field" required value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" />
          </div>
          <div>
            <label className="label" htmlFor="c-wa">Tu WhatsApp</label>
            <input id="c-wa" className="field" required type="tel" inputMode="tel" placeholder="+591 7XXXXXXX" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} autoComplete="tel" />
          </div>
          <div>
            <label className="label" htmlFor="c-msg">¿En qué te ayudamos?</label>
            <textarea id="c-msg" className="field" rows={5} required value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
          </div>
          {state === "error" && <p className="text-sm font-medium text-red-700">No se envió. Revisa tu conexión y vuelve a intentar.</p>}
          <button className="btn btn-navy w-full" disabled={state === "sending"}>{state === "sending" ? "Enviando…" : "Enviar mensaje"}</button>
        </form>
      )}
    </Sheet>
  );
}
