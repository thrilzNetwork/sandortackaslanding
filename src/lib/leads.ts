import { site } from "../config";

/** Saves a lead in Netlify Forms (visible in the Netlify dashboard). */
export async function sendLead(form: "viaje" | "contacto" | "boletin", data: Record<string, string>) {
  const body = new URLSearchParams({ "form-name": form, "bot-field": "", ...data }).toString();
  const res = await fetch("/__forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`Form ${form} failed: ${res.status}`);
}

export const hasWhatsApp = site.whatsapp.replace(/\D/g, "").length >= 8;

export function whatsappUrl(message: string) {
  return `https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export const usd = (n: number) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
