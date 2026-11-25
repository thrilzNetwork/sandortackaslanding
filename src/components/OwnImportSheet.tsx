import { useMemo, useState } from "react";
import Sheet from "./Sheet";
import { rates } from "../config";
import { usd } from "../lib/leads";

const STEPS = [
  "Abre un casillero (Miami o Panamá) para consolidar tu mercancía.",
  "Pide la factura comercial detallada a tu proveedor o fabricante.",
  "Registra la pre-alerta con el número de tracking.",
  "Revisa la clasificación arancelaria y si tu producto necesita permisos.",
  "Agrupa tus paquetes para pagar un solo flete base.",
  "Paga la liquidación en aduana y autoriza la entrega.",
];
const ORIGINS = ["China", "EE.UU.", "Panamá"] as const;

interface Props { open: boolean; onClose: () => void; onContact: (message: string) => void }

export default function OwnImportSheet({ open, onClose, onContact }: Props) {
  const [origin, setOrigin] = useState<(typeof ORIGINS)[number]>("China");
  const [mode, setMode] = useState<"air" | "sea">("air");
  const [kg, setKg] = useState(7);
  const [value, setValue] = useState(250);
  const [duty, setDuty] = useState<number>(rates.defaultDutyPct);
  const [done, setDone] = useState<number[]>([]);

  const c = useMemo(() => {
    const freight = kg * (mode === "air" ? rates.airPerKg : rates.seaPerKg);
    const duties = (value * duty) / 100;
    const clearance = value > rates.clearanceThreshold ? rates.clearanceHigh : rates.clearanceLow;
    return { freight, duties, clearance, total: freight + duties + clearance + rates.handlingFee };
  }, [kg, mode, value, duty]);

  const toggle = (i: number) => setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]));

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="¿Importas por tu cuenta?"
      subtitle="Estima flete, aduana y sigue la ruta paso a paso."
      footer={
        <button
          className="btn btn-wa w-full"
          onClick={() => onContact(`Hola ST Importaciones. Quiero importar por mi cuenta desde ${origin}, ${kg} kg vía ${mode === "air" ? "aérea" : "marítima"}, valor declarado ${usd(value)}. ¿Me ayudan con la clasificación y el costo real?`)}
        >
          Consultar mi caso
        </button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <fieldset>
          <legend className="label">Origen</legend>
          <div className="grid grid-cols-3 gap-2">
            {ORIGINS.map((o) => (
              <button key={o} type="button" className="chip px-2 text-center" aria-pressed={origin === o} onClick={() => setOrigin(o)}>{o}</button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="label">Vía</legend>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" className="chip text-center" aria-pressed={mode === "air"} onClick={() => setMode("air")}>Aéreo</button>
            <button type="button" className="chip text-center" aria-pressed={mode === "sea"} onClick={() => setMode("sea")}>Marítimo</button>
          </div>
        </fieldset>
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <label className="label" htmlFor="o-kg">Peso del bulto</label>
          <output className="tnum font-bold text-navy">{kg} kg</output>
        </div>
        <input id="o-kg" type="range" min={1} max={70} value={kg} onChange={(e) => setKg(Number(e.target.value))} />
      </div>
      <div>
        <div className="flex items-baseline justify-between">
          <label className="label" htmlFor="o-val">Valor declarado en factura</label>
          <output className="tnum font-bold text-navy">{usd(value)}</output>
        </div>
        <input id="o-val" type="range" min={10} max={2000} step={10} value={value} onChange={(e) => setValue(Number(e.target.value))} />
      </div>
      <div className="max-w-[12rem]">
        <label className="label" htmlFor="o-duty">Aduana e impuestos (%)</label>
        <input id="o-duty" className="field tnum" type="number" inputMode="decimal" min={0} max={60} value={duty} onChange={(e) => setDuty(Math.max(0, Number(e.target.value)))} />
      </div>

      <dl className="space-y-2.5 rounded-xl bg-hull p-5 text-[0.95rem] text-white/75">
        <div className="flex justify-between gap-4"><dt>Flete ({kg} kg, {mode === "air" ? "aéreo" : "marítimo"})</dt><dd className="tnum text-white">{usd(c.freight)}</dd></div>
        <div className="flex justify-between gap-4"><dt>Aduana e impuestos ({duty}%)</dt><dd className="tnum text-white">{usd(c.duties)}</dd></div>
        <div className="flex justify-between gap-4"><dt>Almacenaje y manejo</dt><dd className="tnum text-white">{usd(rates.handlingFee)}</dd></div>
        <div className="flex justify-between gap-4"><dt>Trámite de declaración</dt><dd className="tnum text-white">{usd(c.clearance)}</dd></div>
        <div className="flex items-baseline justify-between gap-4 border-t border-white/15 pt-3 text-white">
          <dt className="font-semibold">Costo logístico estimado</dt>
          <dd className="tnum text-xl font-bold text-signal">{usd(c.total)}</dd>
        </div>
      </dl>
      <p className="hint">Estimación de referencia. El porcentaje de aduana cambia según el producto y el país; ajústalo si conoces el tuyo.</p>

      <section>
        <div className="flex items-baseline justify-between">
          <h3 className="text-lg font-bold">Ruta de importación</h3>
          <span className="tnum hint">{done.length} de {STEPS.length}</span>
        </div>
        <ol className="mt-3 space-y-2">
          {STEPS.map((text, i) => {
            const on = done.includes(i);
            return (
              <li key={text}>
                <label className={"flex cursor-pointer items-start gap-3 rounded-xl border-[1.5px] bg-white p-3.5 " + (on ? "border-wa" : "border-[#c3d0db]")}>
                  <input type="checkbox" checked={on} onChange={() => toggle(i)} className="mt-1 h-5 w-5 accent-[#128c4a]" />
                  <span className={on ? "text-[#5a6b7a] line-through" : ""}><span className="tnum font-semibold">{i + 1}.</span> {text}</span>
                </label>
              </li>
            );
          })}
        </ol>
      </section>
    </Sheet>
  );
}
