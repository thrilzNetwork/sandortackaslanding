/**
 * Everything the owner is likely to change lives here:
 * contact, links, trip details and the calculator rates.
 */
export const site = {
  brand: "ST Importaciones",
  owner: "Sandor Takacs",
  photo: "/photo.jpg",
  tagline: "✈️ Te ayudamos a importar de forma segura y eficiente desde cualquier parte del mundo. 📦",

  // Digits only, country code first (Bolivia: 591XXXXXXXX). While empty,
  // every WhatsApp button collects the visitor's number instead.
  whatsapp: "",

  // Leave a network empty to hide its icon.
  socials: { tiktok: "", instagram: "", youtube: "", facebook: "" },

  route: { origins: "China, EE.UU. y Panamá", modes: "Aéreo y marítimo" },

  trip: {
    name: "Viaje de negocios a China",
    when: "Próxima salida 2027",
    whenNote: "Fechas por confirmar",
    place: "Guangzhou y Yiwu",
    seats: "15 cupos por grupo",
  },
};

/** Reference rates used by the two calculators. Estimates only. */
export const rates = {
  airPerKg: 9.9,
  seaPerKg: 3.95,
  airDays: "5 a 7 días",
  seaDays: "15 a 20 días",
  commissionPct: 8,
  commissionMin: 50,
  defaultDutyPct: 12,
  handlingFee: 7.5,
  clearanceLow: 5,
  clearanceHigh: 15,
  clearanceThreshold: 100,
  vendors: {
    Amazon: { cost: 4.5, price: 20, kg: 0.36 },
    eBay: { cost: 3.9, price: 18, kg: 0.32 },
    Shein: { cost: 3.2, price: 15, kg: 0.18 },
    Zara: { cost: 5.8, price: 25, kg: 0.27 },
    "Pat Pat": { cost: 2.9, price: 12, kg: 0.16 },
  },
} as const;

export type Vendor = keyof typeof rates.vendors;
