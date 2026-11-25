import { useEffect, useRef, useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import Sheet from "./Sheet";

interface Msg { role: "user" | "assistant"; content: string }

const GREETING: Msg = {
  role: "assistant",
  content: "Hola, soy el asistente de ST Importaciones. Pregúntame sobre el viaje a China, cómo traer lotes de Amazon, Shein o Zara, o qué pide la aduana.",
};
const QUICK = [
  "¿Cómo funciona el viaje a China?",
  "¿Aéreo o marítimo: cuál me conviene?",
  "¿Qué documentos pide la aduana?",
];

interface Props { open: boolean; onClose: () => void; onContact: (message: string) => void }

export default function ChatSheet({ open, onClose, onContact }: Props) {
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ block: "end" }); }, [messages, loading, open]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.text }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "No pude responder ahora. Toca “Hablar con un asesor” y te atendemos directo." }]);
    } finally {
      setLoading(false);
    }
  };

  const submit = (e: FormEvent) => { e.preventDefault(); send(input); };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Asistente de importación"
      subtitle="Respuestas al instante. Para cotizar, habla con un asesor."
      footer={
        <form onSubmit={submit} className="flex gap-2">
          <label className="sr-only" htmlFor="chat-input">Tu pregunta</label>
          <input id="chat-input" className="field" placeholder="Escribe tu pregunta" value={input} onChange={(e) => setInput(e.target.value)} maxLength={600} />
          <button className="btn btn-navy px-4" disabled={loading || !input.trim()} aria-label="Enviar pregunta"><Send className="h-5 w-5" /></button>
        </form>
      }
    >
      <div className="space-y-3" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={"flex " + (m.role === "user" ? "justify-end" : "justify-start")}>
            <p className={"max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 leading-relaxed " + (m.role === "user" ? "rounded-br-sm bg-navy text-white" : "rounded-bl-sm bg-white")}>{m.content}</p>
          </div>
        ))}
        {loading && <p className="hint">Escribiendo…</p>}
        <div ref={endRef} />
      </div>
      {messages.length === 1 && (
        <div className="flex flex-col gap-2">
          {QUICK.map((q) => <button key={q} className="chip" onClick={() => send(q)}>{q}</button>)}
        </div>
      )}
      <button className="btn btn-line w-full" onClick={() => onContact("Hola ST Importaciones. Vengo del asistente y quiero hablar con un asesor.")}>Hablar con un asesor</button>
    </Sheet>
  );
}
