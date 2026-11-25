import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import Sheet from "./Sheet";
import { rates, type Vendor } from "../config";
import { usd } from "../lib/leads";

const VENDORS = Object.keys(rates.vendors) as Vendor[];

interface Props { open: boolean; onClose: () => void; onContact: (message: string) => void }

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={"flex items-baseline justify-between gap-4 " + (strong ? "text-white" : "text-white/75")}>
      <dt className={strong ? "font-semibold" : ""}>{label}</dt>
      <dd className={"tnum shrink-0 " + (strong ? "text-xl font-bold text-signal" : "text-white")}>{value}</dd>
    </div>
  );
}

export default function BatchSheet({ open, onClose, onContact }: Props) {
  const [vendor, setVendor] = useState<Vendor>("Amazon");
  const [qty, setQty] = useState(100);
  const [mode, setMode] = useState<"air" | "sea">("air");
  const [cost, setCost] = useState<number>(rates.vendors.Amazon.cost);
  const [duty, setDuty] = useState<number>(rates.defaultDutyPct);
  const [price, setPrice] = useState<number>(rates.vendors.Amazon.price);
  const [copied, setCopied] = useState(false);

  const pickVendor = (v: Vendor) => {
    setVendor(v);
    setCost(rates.vendors[v].cost);
    setPrice(rates.vendors[v].price);
  };

  const s = useMemo(() => {
    const goods = qty * cost;
    const kg = qty * rates.vendors[vendor].kg;
    const freight = kg * (mode === "air" ? rates.airPerKg : rates.seaPerKg);
    const subtotal = goods + freight;
    const duties = (subtotal * duty) / 100;
    const commission = Math.max(rates.commissionMin, (subtotal * rates.commissionPct) / 100);
    const total = subtotal + duties + commission;
    const unit = total / qty;
    const revenue = qty * price;
    const profit = revenue - total;
    const roi = total > 0 ? Math.round((profit / total) * 100) : 0;
    return { goods, kg, freight, duties, commission, total, unit, revenue, profit, roi };
  }, [qty, cost, vendor, mode, duty, price]);

  const modeLabel = mode === "air" ? `aéreo (${rates.airDays})` : `marítimo (${rates.seaDays})`;

  const summary = `Cotización estimada · ST Importaciones
Proveedor: ${vendor}
Cantidad: ${qty} prendas (${s.kg.toFixed(1)} kg aprox.)
Envío: ${modeLabel}

Mercancía: ${usd(s.goods)}
Flete: ${usd(s.freight)}
Aduana e impuestos (${duty}%): ${usd(s.duties)}
Comisión ST Importaciones: ${usd(s.commission)}
Inversión total: ${usd(s.total)}
Costo por prenda puesta en bodega: ${usd(s.unit)}

Precio de venta: ${usd(price)} c/u
Ganancia estimada: ${usd(s.profit)} (ROI ${s.roi}%)`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked: nothing to confirm */ }
  };

  const order = () =>
    onContact(`Hola ST Importaciones. Quiero cotizar este lote:\n\n${summary}\n\n¿Me ayudan a concretar el pedido?`);

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Importamos por ti"
      subtitle="Calcula tu lote de Amazon, eBay, Shein, Zara y más."
      footer={
        <div className="flex gap-2">
          <button className="btn btn-line" onClick={copy} aria-live="polite">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copiado" : "Copiar"}
          </button>
          <button className="btn btn-wa flex-1" onClick={order}>Pedir este lote</button>
        </div>
      }
    >
      <fieldset>
        <legend className="label">Tienda o proveedor</legend>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {VENDORS.map((v) => (
            <button key={v} type="button" className="chip text-center" aria-pressed={vendor === v} onClick={() => pickVendor(v)}>{v}</button>
          ))}
        </div>
      </fieldset>

      <div>
        <div className="flex items-baseline justify-between">
          <label className="label" htmlFor="b-qty">Prendas en el lote</label>
          <output className="tnum font-bold text-navy">{qty}</output>
        </div>
        <input id="b-qty" type="range" min={20} max={500} step={10} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
      </div>

      <fieldset>
        <legend className="label">Vía de transporte</legend>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className="chip h-auto py-2.5" aria-pressed={mode === "air"} onClick={() => setMode("air")}>
            Aéreo<span className="block text-[0.8rem] font-normal opacity-80">{usd(rates.airPerKg)}/kg, {rates.airDays}</span>
          </button>
          <button type="button" className="chip h-auto py-2.5" aria-pressed={mode === "sea"} onClick={() => setMode("sea")}>
            Marítimo<span className="block text-[0.8rem] font-normal opacity-80">{usd(rates.seaPerKg)}/kg, {rates.seaDays}</span>
          </button>
        </div>
      </fieldset>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="label" htmlFor="b-cost">Costo c/u</label>
          <input id="b-cost" className="field tnum" type="number" inputMode="decimal" min={0.5} step={0.1} value={cost} onChange={(e) => setCost(Math.max(0, Number(e.target.value)))} />
        </div>
        <div>
          <label className="label" htmlFor="b-duty">Aduana %</label>
          <input id="b-duty" className="field tnum" type="number" inputMode="decimal" min={0} max={60} value={duty} onChange={(e) => setDuty(Math.max(0, Number(e.target.value)))} />
        </div>
        <div>
          <label className="label" htmlFor="b-price">Venta c/u</label>
          <input id="b-price" className="field tnum" type="number" inputMode="decimal" min={0} step={0.5} value={price} onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))} />
        </div>
      </div>

      <dl className="space-y-2.5 rounded-xl bg-hull p-5 text-[0.95rem]">
        <Row label={`Mercancía (${qty} × ${usd(cost)})`} value={usd(s.goods)} />
        <Row label={`Flete (${s.kg.toFixed(1)} kg)`} value={usd(s.freight)} />
        <Row label={`Aduana e impuestos (${duty}%)`} value={usd(s.duties)} />
        <Row label={`Comisión ST (${rates.commissionPct}%, mín. ${usd(rates.commissionMin)})`} value={usd(s.commission)} />
        <div className="border-t border-white/15 pt-3"><Row strong label="Inversión total" value={usd(s.total)} /></div>
        <Row label="Costo por prenda en tu bodega" value={usd(s.unit)} />
      </dl>

      <div className={"grid grid-cols-2 gap-3 rounded-xl p-5 " + (s.profit >= 0 ? "bg-[#dff3e6]" : "bg-[#fbe3e1]")}>
        <div>
          <p className="text-sm font-medium">{s.profit >= 0 ? "Ganancia estimada" : "Pérdida estimada"}</p>
          <p className="tnum text-3xl font-bold leading-none">{usd(Math.abs(s.profit))}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">Retorno</p>
          <p className="tnum text-3xl font-bold leading-none">{s.roi}%</p>
        </div>
      </div>

      <p className="hint">Montos en USD. Tarifas de referencia. El costo final depende del producto, el peso real y la aduana de tu país; lo confirmamos en tu cotización.</p>
    </Sheet>
  );
}
