import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Globe, Ship, Anchor, HelpCircle, CheckSquare, ClipboardCheck, Percent, HelpCircle as HelpIcon } from "lucide-react";
import { OriginCountry, ShipMethod } from "../types";

interface CustomImportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomImportDrawer({ isOpen, onClose }: CustomImportDrawerProps) {
  const [origin, setOrigin] = useState<OriginCountry>("China");
  const [method, setMethod] = useState<ShipMethod>("Aéreo (Rápido)");
  const [weightLbs, setWeightLbs] = useState<number>(15);
  const [declaredValueUSD, setDeclaredValueUSD] = useState<number>(250);

  // Guide Steps with checkmarks
  const [checklist, setChecklist] = useState<Array<{ id: number; text: string; completed: boolean }>>([
    { id: 1, text: "Crear Casillero Gratuito (Miami o Panamá) para consolidar mercancías.", completed: false },
    { id: 2, text: "Obtener la Factura Comercial (Invoice) detallada del exportador o fabricante.", completed: false },
    { id: 3, text: "Registrar Pre-Alerta en el sistema logístico con el Número de Tracking.", completed: false },
    { id: 4, text: "Clasificación Arancelaria: Verificar si el producto requiere permisos especiales de salud o minería.", completed: false },
    { id: 5, text: "Consolidación de paquetes: Agrupar envíos pequeños para pagar un único flete base.", completed: false },
    { id: 6, text: "Liquidación & Pago: Recibir bultos en aduanas nacionales y autorizar entrega.", completed: false },
  ]);

  const toggleChecklistStep = (id: number) => {
    setChecklist(
      checklist.map((step) => (step.id === id ? { ...step, completed: !step.completed } : step))
    );
  };

  const completedCount = useMemo(() => checklist.filter((item) => item.completed).length, [checklist]);

  // Derived duty, transport, clearance formulas
  const costs = useMemo(() => {
    // Duty percent depending on country
    const dutyPercent = origin === "China" ? 15 : origin === "USA" ? 10 : 5;
    const customsDuties = (declaredValueUSD * dutyPercent) / 100;

    // Freight costs depending on method
    const weightRate = method === "Aéreo (Rápido)" ? 4.95 : 1.95;
    const freightCost = weightLbs * weightRate;

    // Standard warehousing fee and agency clearance
    const agencyClearance = declaredValueUSD > 100 ? 15 : 5;
    const handlingFee = 7.5;

    const totalLocalPay = customsDuties + freightCost + agencyClearance + handlingFee;

    return {
      dutyPercent,
      customsDuties,
      freightCost,
      agencyClearance,
      handlingFee,
      totalLocalPay,
    };
  }, [origin, method, weightLbs, declaredValueUSD]);

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
            id="custom-import-overlay"
          />

          {/* Sliding drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-white rounded-t-3xl shadow-2xl z-50 h-[88vh] overflow-y-auto pointer-events-auto flex flex-col"
            id="custom-import-drawer"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10" id="custom-import-header">
              <div className="flex items-center space-x-2">
                <span className="p-2 bg-brand-sky/10 rounded-lg text-brand-sky">
                  <Globe className="w-5 h-5 animate-pulse" />
                </span>
                <div>
                  <h2 className="font-sans font-bold text-lg text-gray-900 tracking-tight">Cálculo de Importaciones Propias</h2>
                  <p className="text-xs font-mono text-gray-500">Aduanas, Impuestos y Guía Paso a Paso</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition"
                aria-label="Cerrar"
                id="close-custom-import-drawer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto" id="custom-import-body">
              {/* Top Form Controls */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">País / Región de Origen</label>
                  <div className="grid grid-cols-3 gap-1">
                    {(["USA", "China", "Panamá"] as OriginCountry[]).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setOrigin(c)}
                        className={`py-2 text-xs font-bold rounded-lg border text-center transition-all ${
                          origin === c
                            ? "bg-brand-sky text-white border-brand-sky shadow"
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">Vía de Despacho</label>
                  <div className="grid grid-cols-2 gap-1">
                    {(["Aéreo (Rápido)", "Marítimo (Económico)"] as ShipMethod[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMethod(m)}
                        className={`py-2 text-[10px] font-bold rounded-lg border text-center transition-all ${
                          method === m
                            ? "bg-brand-sky text-white border-brand-sky shadow"
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {m.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Slider Input Values */}
              <div className="space-y-4 bg-brand-sky/5 p-4 rounded-xl border border-brand-sky/10">
                {/* Weight Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-700">Peso estimado del bulto:</span>
                    <span className="font-mono bg-brand-sky/15 text-brand-navy px-2 py-0.5 rounded font-bold">{weightLbs} libras</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="150"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(Number(e.target.value))}
                    className="w-full accent-brand-sky h-1.5 bg-brand-sky/20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Declared Value Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-700">Valor de factura total declarado (Mercancía USD):</span>
                    <span className="font-mono bg-brand-sky/15 text-brand-navy px-2 py-0.5 rounded font-bold">${declaredValueUSD} USD</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="2000"
                    step="10"
                    value={declaredValueUSD}
                    onChange={(e) => setDeclaredValueUSD(Number(e.target.value))}
                    className="w-full accent-brand-sky h-1.5 bg-brand-sky/20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Real-time tax / shipping display */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg">
                <div className="text-xs font-mono text-brand-sky uppercase tracking-wider mb-2.5">
                  Liquidación Estimada de Aduana
                </div>
                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Flete de Carga ({method.split(" ")[0]} x {weightLbs} lbs)</span>
                    <span className="font-mono text-slate-100">${costs.freightCost.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Impuestos de Importación ({costs.dutyPercent}% de Arancel sobre CIF)</span>
                    <span className="font-mono text-slate-100">${costs.customsDuties.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tasa por Almacenamiento & Handling</span>
                    <span className="font-mono text-slate-100">${costs.handlingFee.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span>Trámite de Declaración / Seguro Interno</span>
                    <span className="font-mono text-slate-100">${costs.agencyClearance.toFixed(2)} USD</span>
                  </div>
                  
                  {/* Result row */}
                  <div className="flex justify-between pt-1.5">
                    <span className="text-sm font-bold text-white">Costo Total Logístico Local</span>
                    <span className="text-base font-extrabold text-brand-sky font-mono">${costs.totalLocalPay.toFixed(2)} USD</span>
                  </div>
                </div>
              </div>

              {/* Importing Checklist Guidance */}
              <div className="space-y-3" id="checklist-section">
                <div className="flex justify-between items-center border-b pb-2">
                  <h4 className="font-sans font-bold text-gray-800 text-sm flex items-center gap-1.5">
                    <ClipboardCheck className="w-4 h-4 text-brand-sky" /> Checklist de Ruta de Importación
                  </h4>
                  <span className="text-[10px] bg-brand-sky/15 text-brand-navy font-bold px-2.5 py-0.5 rounded-full font-mono">
                    {completedCount} / {checklist.length} Completados
                  </span>
                </div>

                <div className="space-y-2">
                  {checklist.map((step) => (
                    <button
                      type="button"
                      key={step.id}
                      onClick={() => toggleChecklistStep(step.id)}
                      className={`w-full text-left p-3 rounded-xl border text-xs flex items-start space-x-3 transition-all cursor-pointer ${
                        step.completed
                          ? "bg-emerald-50/50 border-emerald-200 text-gray-500"
                          : "bg-white border-gray-100 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={step.completed}
                        readOnly
                        className="mt-0.5 accent-emerald-500 pointer-events-none"
                      />
                      <span className={step.completed ? "line-through text-gray-400" : ""}>{step.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Help segment */}
              <div className="bg-brand-sky/5 border border-brand-sky/10 rounded-xl p-4 flex items-start space-x-3 text-xs text-gray-600 leading-relaxed">
                <HelpIcon className="w-5 h-5 text-brand-sky flex-shrink-0 mt-0.5" />
                <p>
                  <strong>¿Tienes dudas con la clasificación de tu mercancía?</strong> Algunos países exigen fito-sanitarios para cosméticos o ropa infantil. Consúltalo hoy mismo con nuestro Asistente Inteligente de manera gratuita para evitar retenciones de aduana.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
