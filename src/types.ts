export type VendorType = "Shein" | "Zara" | "Pat Pat";

export interface PacaCalculation {
  vendor: VendorType;
  quantity: number; // e.g. 50, 100, 250 pieces
  costPerPiece: number; // in USD
  shippingCostPerLb: number; // depending on air/sea
  estimatedWeightLbs: number;
  taxRatePercent: number; // e.g. 15% customs duties
  targetRetailPrice: number; // what they sell each for
}

export type OriginCountry = "USA" | "China" | "Panamá";
export type ShipMethod = "Aéreo (Rápido)" | "Marítimo (Económico)";

export interface CustomImportCalculation {
  origin: OriginCountry;
  method: ShipMethod;
  weightLbs: number;
  declaredValueUSD: number;
}

export interface PanamaTripBooking {
  name: string;
  email: string;
  whatsapp: string;
  sourcingCategories: string[]; // e.g. "Ropa", "Calzado", "Electrónica"
  hasImportedBefore: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}
