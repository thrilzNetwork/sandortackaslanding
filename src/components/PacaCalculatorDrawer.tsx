import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calculator, ShoppingBag, Truck, DollarSign, Eye, Copy, CheckCircle, ArrowRight } from "lucide-react";
import { VendorType } from "../types";

interface PacaCalculatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PacaCalculatorDrawer({ isOpen, onClose }: PacaCalculatorDrawerProps) {
  const [vendor, setVendor] = useState<VendorType>("Shein");
  const [quantity, setQuantity] = useState<number>(100);
  const [shippingMode, setShippingMode] = useState<"air" | "sea">("air");
  const [customCostPerPiece, setCustomCostPerPiece] = useState<number>(3.5);
  const [taxRate, setTaxRate] = useState<number>(12); // percent
  const [customSellingPrice, setCustomSellingPrice] = useState<number>(15);
  const [copied, setCopied] = useState(false);

  // Auto defaults when changing vendor
  const handleVendorChange = (v: VendorType) => {
    setVendor(v);
    if (v === "Shein") {
      setCustomCostPerPiece(3.2);
      setCustomSellingPrice(15);
    } else if (v === "Zara") {
      setCustomCostPerPiece(5.8);
      setCustomSellingPrice(25);
    } else if (v === "Pat Pat") {
      setCustomCostPerPiece(2.9);
      setCustomSellingPrice(12);
    }
  };

  // Average weight per piece (lbs)
  const averageWeight = useMemo(() => {
    if (vendor === "Shein") return 0.4;
    if (vendor === "Zara") return 0.6;
    return 0.35; // Pat Pat
  }, [vendor]);

  // Derived calculations
  const stats = useMemo(() => {
    const totalMerchandiseCost = quantity * customCostPerPiece;
    const estimatedWeightLbs = quantity * averageWeight;
    
    const shippingRate = shippingMode === "air" ? 4.5 : 1.8;
    const totalShippingCost = estimatedWeightLbs * shippingRate;
    
    const subtotal = totalMerchandiseCost + totalShippingCost;
    const customDuties = (subtotal * taxRate) / 100;
    
    // Emprendelandia commission: fixed 8% sourcing commission (or min $50)
    const commissionFee = Math.max(50, subtotal * 0.08); 
    
    const totalInvestment = subtotal + customDuties + commissionFee;
    const landedCostPerUnit = totalInvestment / quantity;
    
    const totalRevenue = quantity * customSellingPrice;
    const netProfit = totalRevenue - totalInvestment;
    const roiPercent = (netProfit / totalInvestment) * 100;

    return {
      totalMerchandiseCost,
      estimatedWeightLbs,
      totalShippingCost,
      customDuties,
      commissionFee,
      totalInvestment,
      landedCostPerUnit,
      totalRevenue,
      netProfit,
      roiPercent: Math.max(-100, Math.round(roiPercent)),
    };
  }, [quantity, vendor, shippingMode, customCostPerPiece, taxRate, customSellingPrice, averageWeight]);

  const copyToClipboard = () => {
    const textToCopy = `COTIZACIÓN ESTIMADA DE IMPORTACIÓN - EMPRENDELANDIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛒 Proveedor: Pacas de ${vendor}
👕 Cantidad de Prendas: ${quantity} unidades
📦 Peso total estimado: ${stats.estimatedWeightLbs.toFixed(1)} lbs
✈️ Transporte: ${shippingMode === "air" ? "Aéreo Rápido (5-7 días)" : "Marítimo Económico (15-20 días)"}

📊 DESGLOSE FINANCIERO:
  • Costo Prenda (Unitario): $${customCostPerPiece.toFixed(2)} USD
  • Costo Total Prendas: $${stats.totalMerchandiseCost.toFixed(2)} USD
  • Flete de Envío: $${stats.totalShippingCost.toFixed(2)} USD
  • Impuestos Aduanales (${taxRate}%): $${stats.customDuties.toFixed(2)} USD
  • Comisión Emprendelandia: $${stats.commissionFee.toFixed(2)} USD
  =============================
  💼 INVERSIÓN TOTAL: $${stats.totalInvestment.toFixed(2)} USD
  🎯 Costo Final Unitario (Puesto en tu Local): $${stats.landedCostPerUnit.toFixed(2)} USD

💸 PROYECCIÓN DE VENTAS:
  • Precio Sugerido de Venta: $${customSellingPrice.toFixed(2)} USD c/u
  • Ingreso Total Estimado: $${stats.totalRevenue.toFixed(2)} USD
  • Ganancia Neta Limpia: $${stats.netProfit.toFixed(2)} USD
  👑 Retorno de Inversión (ROI): ${stats.roiPercent}%

¡Quiero tramitar este lote y empezar a ganar en comisiones! Contáctanos para más detalles.`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 pointer-events-auto"
            id="paca-overlay"
          />

          {/* Sliding drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-white rounded-t-3xl shadow-2xl z-50 h-[88vh] overflow-y-auto pointer-events-auto flex flex-col"
            id="paca-drawer-container"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10" id="paca-header">
              <div className="flex items-center space-x-2">
                <span className="p-2 bg-pink-100 rounded-lg text-pink-500">
                  <Calculator className="w-5 h-5 animate-pulse" />
                </span>
                <div>
                  <h2 className="font-sans font-bold text-lg text-gray-900 tracking-tight">Simulador de Pacas Importadas</h2>
                  <p className="text-xs font-mono text-gray-500">Shein, Zara & Pat Pat Por Ti</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition"
                aria-label="Cerrar"
                id="close-paca-drawer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto" id="paca-body">
              {/* Select Vendor and Quantity */}
              <div className="space-y-4">
                <h4 className="font-sans font-bold text-gray-800 text-sm flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-pink-500" /> 1. Elige tu Marca & Proveedor
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {(["Shein", "Zara", "Pat Pat"] as VendorType[]).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => handleVendorChange(v)}
                      className={`py-3 px-1.5 text-xs font-bold rounded-xl border text-center transition-all ${
                        vendor === v
                          ? "bg-pink-500 text-white border-pink-500 shadow-lg shadow-pink-500/20"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {v === "Shein" && "✨ "}
                      {v === "Zara" && "👔 "}
                      {v === "Pat Pat" && "👶 "}
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider for Quantity */}
              <div className="space-y-3 bg-pink-50/40 p-4 rounded-xl border border-pink-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-gray-700">Cantidad de prendas en la paca:</span>
                  <span className="font-mono bg-pink-100 text-pink-700 px-2 py-0.5 rounded-md font-bold">
                    {quantity} unidades
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="10"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full accent-pink-500 h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>20 c/u</span>
                  <span>100 (Estándar)</span>
                  <span>250 (Mayorista)</span>
                  <span>500 Max</span>
                </div>
              </div>

              {/* Shipping Logistics Settings */}
              <div className="space-y-4">
                <h4 className="font-sans font-bold text-gray-800 text-sm flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-pink-500" /> 2. Tarifas y Vía de Transporte
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setShippingMode("air")}
                    className={`p-3.5 rounded-xl border text-left transition ${
                      shippingMode === "air"
                        ? "bg-pink-50 text-pink-700 border-pink-400 font-bold"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-xs font-semibold">Aéreo Expreso</div>
                    <div className="text-[10px] text-gray-500 font-mono mt-0.5">$4.50 por Libra • 5-7 días</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShippingMode("sea")}
                    className={`p-3.5 rounded-xl border text-left transition ${
                      shippingMode === "sea"
                        ? "bg-pink-50 text-pink-700 border-pink-400 font-bold"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-xs font-semibold">Marítimo Consolidado</div>
                    <div className="text-[10px] text-gray-500 font-mono mt-0.5">$1.80 por Libra • 15-20 días</div>
                  </button>
                </div>
              </div>

              {/* Slider for Unit Costs and Retail markup */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700">Coste de Fábrica por Prenda (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      step="0.10"
                      min="1"
                      max="20"
                      value={customCostPerPiece}
                      onChange={(e) => setCustomCostPerPiece(Number(e.target.value))}
                      className="w-full text-sm bg-white border border-gray-200 rounded-xl pl-7 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 block italic leading-tight">Valor promedio negociado directo de fábrica</span>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700">Aduana & Impuestos Locales (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full text-sm bg-white border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                  />
                  <span className="text-[10px] text-gray-400 block italic leading-tight">Arancel legal según el aduana de tu país</span>
                </div>
              </div>

              {/* Cost calculation result card */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-inner">
                <div className="text-xs font-mono text-pink-400 uppercase tracking-wider mb-2">Desglose de Costos de Importación</div>
                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Costo Neto Mercancía ({quantity} unidades x ${customCostPerPiece.toFixed(2)})</span>
                    <span>${stats.totalMerchandiseCost.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Flete Transportista ({stats.estimatedWeightLbs.toFixed(1)} lbs Lote)</span>
                    <span>${stats.totalShippingCost.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Aranceles de Aduana Estimados ({taxRate}%)</span>
                    <span>${stats.customDuties.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span>Comisión Logística Emprendelandia (8% Sourcing)</span>
                    <span>${stats.commissionFee.toFixed(2)} USD</span>
                  </div>
                  
                  {/* Results row */}
                  <div className="flex justify-between pt-1.5">
                    <span className="text-sm font-bold text-white">Inversión Final Total</span>
                    <span className="text-base font-extrabold text-pink-400">${stats.totalInvestment.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between bg-slate-800/40 p-2.5 rounded-xl border border-slate-800/80 mt-2">
                    <span className="text-slate-200">Costo Final Puesto en tu Bodega (Unitario):</span>
                    <span className="font-bold text-white font-mono bg-pink-500/20 px-2 py-0.5 rounded">${stats.landedCostPerUnit.toFixed(2)} USD</span>
                  </div>
                </div>
              </div>

              {/* Projection of Sales / Earnings Markup */}
              <div className="space-y-4" id="projection-section">
                <h4 className="font-sans font-bold text-gray-800 text-sm flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-pink-500" /> 3. Proyección Comercial de Ventas
                </h4>
                
                <div className="bg-pink-50/30 p-5 rounded-2xl border border-pink-100 flex flex-col md:flex-row gap-5 items-center justify-between">
                  {/* Price Setting Slider */}
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-gray-700">Precio de Venta Sugerido (Unitario):</span>
                      <span className="font-mono bg-pink-100 text-pink-700 px-2 py-0.5 rounded font-bold">
                        ${customSellingPrice.toFixed(2)} USD c/u
                      </span>
                    </div>
                    <input
                      type="range"
                      min={Math.ceil(stats.landedCostPerUnit) + 1}
                      max={Math.ceil(stats.landedCostPerUnit) * 4}
                      step="1"
                      value={customSellingPrice}
                      onChange={(e) => setCustomSellingPrice(Number(e.target.value))}
                      className="w-full accent-pink-500 h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-gray-400 font-mono">
                      <span>Mín: ${Math.ceil(stats.landedCostPerUnit) + 1} USD</span>
                      <span>Sugerido: ${(stats.landedCostPerUnit * 2.5).toFixed(0)} USD</span>
                      <span>Máx: ${(stats.landedCostPerUnit * 4).toFixed(0)} USD</span>
                    </div>
                  </div>

                  {/* Net Output Box */}
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-5 rounded-xl text-center space-y-1 w-full md:w-56 shadow-md shadow-emerald-500/10">
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                      Ganancia Neta Limpia
                    </span>
                    <h5 className="font-sans font-extrabold text-2xl tracking-tight">${stats.netProfit.toFixed(2)} USD</h5>
                    <p className="text-[10px] text-emerald-100 border-t border-white/20 pt-1.5 font-bold flex items-center justify-center gap-1">
                      ROI Estimado: <span className="font-mono bg-white text-emerald-600 px-1 py-0.2 rounded font-black">{stats.roiPercent}%</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Call-to-action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow transition-all"
                  id="copy-paca-quote"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>¡Copiado Exitosamente!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Desglose para Mis Notas</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    const message = `¡Hola EMPRENDELANDIA! Utilicé la calculadora de pacas. Estoy interesado en un lote de ${quantity} prendas de ${vendor} vía ${shippingMode === "air" ? "aéreo" : "marítimo"}. Mis ganancias estimadas son de $${stats.netProfit.toFixed(2)} USD con un ROI del ${stats.roiPercent}%. ¿Me ayudan a concretar este pedido?`;
                    window.open(`https://wa.me/50760000000?text=${encodeURIComponent(message)}`, "_blank");
                  }}
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-pink-500/10 hover:shadow-pink-500/20 transition-all"
                  id="order-paca"
                >
                  <span>Iniciar Pedido en WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
