import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, MapPin, CheckCircle, Ticket, Award, Users, Ship } from "lucide-react";
import { PanamaTripBooking } from "../types";

interface PanamaTripDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PanamaTripDrawer({ isOpen, onClose }: PanamaTripDrawerProps) {
  const [booking, setBooking] = useState<PanamaTripBooking>({
    name: "",
    email: "",
    whatsapp: "",
    sourcingCategories: [],
    hasImportedBefore: false,
  });

  const [isCompleted, setIsCompleted] = useState(false);
  const [categoriesError, setCategoriesError] = useState("");

  const categories = [
    "Ropa de Damas (Shein/Zara style)",
    "Calzado Femenino y Deportivo",
    "Accesorios, Joyería y Bisutería",
    "Electrónicos y Celulares",
    "Artículos del Hogar y Decoración",
    "Maquillaje y Cuidado de la Piel",
  ];

  const handleCategoryToggle = (category: string) => {
    setBooking((prev) => {
      const exists = prev.sourcingCategories.includes(category);
      if (exists) {
        return {
          ...prev,
          sourcingCategories: prev.sourcingCategories.filter((c) => c !== category),
        };
      } else {
        return {
          ...prev,
          sourcingCategories: [...prev.sourcingCategories, category],
        };
      }
    });
    setCategoriesError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (booking.sourcingCategories.length === 0) {
      setCategoriesError("Selecciona al menos una categoría de interés.");
      return;
    }
    // Simulate API registration, and generate voucher!
    setIsCompleted(true);
  };

  const resetForm = () => {
    setBooking({
      name: "",
      email: "",
      whatsapp: "",
      sourcingCategories: [],
      hasImportedBefore: false,
    });
    setIsCompleted(false);
  };

  const itinerarySteps = [
    {
      day: "DÍA 1",
      title: "Llegada y Bienvenida VIP",
      desc: "Recibimiento en aeropuerto, check-in en el hotel seleccionado y cóctel de bienvenida con la primera mentoría de negocios grupal.",
    },
    {
      day: "DÍA 2",
      title: "Ruta de Bodegas en Ciudad de Panamá",
      desc: "Visita exclusiva a los showrooms mayoristas de tecnología, cosméticos y marcas premium en el centro comercial de la capital.",
    },
    {
      day: "DÍA 3",
      title: "Inmersión Zona Libre de Colón",
      desc: "Traslado al puerto libre de impuestos más grande de América Latina. Recorrido con agentes autorizados de bodegas masivas.",
    },
    {
      day: "DÍA 4",
      title: "Negociaciones y Consolidación",
      desc: "Contacto directo con dueños de fábricas, acuerdos de fletes, tarifas especiales grupal y apertura de casillero postal.",
    },
    {
      day: "DÍA 5",
      title: "Logística y Taller de Desaduanamiento",
      desc: "Taller teórico-práctico presencial: Cómo registrar tu importación, pago de tributos arancelarios y transporte seguro a tu país.",
    },
    {
      day: "DÍA 6",
      title: "Networking y Certificación de Socios",
      desc: "Almuerzo de gala frente al Canal de Panamá, entrega de certificados de agentes mayoristas y plan de acción definitivo.",
    },
  ];

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
            id="trip-overlay"
          />

          {/* Sliding drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-white rounded-t-3xl shadow-2xl z-50 h-[88vh] overflow-y-auto pointer-events-auto flex flex-col"
            id="trip-drawer-container"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10" id="trip-header">
              <div className="flex items-center space-x-2">
                <span className="p-2 bg-brand-sky/10 rounded-lg text-brand-sky">
                  <Calendar className="w-5 h-5 animate-pulse" />
                </span>
                <div>
                  <h2 className="font-sans font-bold text-lg text-gray-900 tracking-tight">Viaje de Negocios Panamá 2026</h2>
                  <p className="text-xs font-mono text-gray-500">Del 14 al 20 de Junio de 2026</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition"
                aria-label="Cerrar"
                id="close-trip-drawer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-8 flex-1 overflow-y-auto" id="trip-body">
              {/* Introduction Banner */}
              <div className="bg-gradient-to-br from-brand-navy to-brand-sky rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-8 -translate-y-8"></div>
                <div className="relative z-10 space-y-3">
                  <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
                    Sourcing Misión VIP
                  </span>
                  <h3 className="text-2xl font-sans font-extrabold tracking-tight">
                    Compra Directo de Fábrica. Sin Intermediarios.
                  </h3>
                  <p className="text-sm text-blue-50/90">
                    Únete a nuestro grupo selecto de empresarios en un viaje presencial a Panamá. Descubre los mayores proveedores de textiles, calzado y gadgets de la Zona Libre de Colón.
                  </p>
                  <div className="grid grid-cols-2 gap-4 pt-3 text-xs border-t border-white/20">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-brand-sky" />
                      <span>Colón & Panamá Ciudad</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-brand-sky" />
                      <span>Cupos limitados (20 max)</span>
                    </div>
                  </div>
                </div>
              </div>

              {!isCompleted ? (
                <>
                  {/* Detailed Itinerary */}
                  <div className="space-y-4" id="trip-itinerary-section">
                    <h4 className="font-sans font-bold text-gray-800 text-base border-b pb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-brand-sky" /> Itinerario de Sourcing
                    </h4>
                    <div className="relative border-l border-brand-sky/20 ml-4 pl-6 space-y-6">
                      {itinerarySteps.map((step, idx) => (
                        <div key={idx} className="relative">
                          {/* Dot indicator */}
                          <div className="absolute -left-[31px] top-1 bg-white border-2 border-brand-sky rounded-full w-4 h-4 flex items-center justify-center">
                            <div className="bg-brand-sky rounded-full w-1.5 h-1.5" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs font-mono font-bold text-brand-sky bg-brand-sky/10 px-2 py-0.5 rounded-md">
                              {step.day}
                            </span>
                            <h5 className="font-bold text-gray-900 text-sm mt-1">{step.title}</h5>
                            <p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Booking / Interest Intake Form */}
                  <div className="bg-brand-sky/5 rounded-2xl p-6 border border-brand-sky/10" id="trip-booking-form-section">
                    <h4 className="font-sans font-bold text-gray-800 text-base mb-4 flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-brand-sky" /> Pre-Registro y Solicitud de Vacante
                    </h4>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre Completo</label>
                        <input
                          type="text"
                          required
                          value={booking.name}
                          onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                          placeholder="Tu nombre y apellido"
                          className="w-full text-sm bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-sky focus:border-transparent transition"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Correo Electrónico</label>
                          <input
                            type="email"
                            required
                            value={booking.email}
                            onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                            placeholder="nombre@correo.com"
                            className="w-full text-sm bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-sky focus:border-transparent transition"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Número de WhatsApp</label>
                          <input
                            type="tel"
                            required
                            value={booking.whatsapp}
                            onChange={(e) => setBooking({ ...booking, whatsapp: e.target.value })}
                            placeholder="+507 6000-0000"
                            className="w-full text-sm bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-sky focus:border-transparent transition"
                          />
                        </div>
                      </div>

                      {/* categories multi select */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          ¿Qué te interesa importar a tu país de origen?
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                          {categories.map((cat, idx) => {
                            const isSelected = booking.sourcingCategories.includes(cat);
                            return (
                              <button
                                type="button"
                                key={idx}
                                onClick={() => handleCategoryToggle(cat)}
                                className={`text-left text-xs p-2.5 rounded-xl border transition-all flex items-center space-x-2 ${
                                  isSelected
                                    ? "bg-brand-sky text-white border-brand-sky shadow-md shadow-brand-sky/25"
                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                }`}
                              >
                                <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${isSelected ? "border-white bg-white" : "border-gray-400"}`}>
                                  {isSelected && <span className="bg-brand-sky rounded-full w-1 h-1" />}
                                </span>
                                <span className="truncate">{cat}</span>
                              </button>
                            );
                          })}
                        </div>
                        {categoriesError && (
                          <p className="text-red-500 text-xs mt-1 font-medium">{categoriesError}</p>
                        )}
                      </div>

                      {/* Radio for importing status */}
                      <div className="pt-2">
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                          ¿Tienes experiencia previa importando mercancía?
                        </label>
                        <div className="flex space-x-4">
                          <button
                            type="button"
                            onClick={() => setBooking({ ...booking, hasImportedBefore: true })}
                            className={`flex-1 text-center py-2 text-xs font-semibold rounded-xl border transition ${
                              booking.hasImportedBefore
                                ? "bg-brand-sky/10 text-brand-navy border-brand-sky/35 font-bold"
                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            Sí, ya importo regularmente
                          </button>
                          <button
                            type="button"
                            onClick={() => setBooking({ ...booking, hasImportedBefore: false })}
                            className={`flex-1 text-center py-2 text-xs font-semibold rounded-xl border transition ${
                              !booking.hasImportedBefore
                                ? "bg-brand-sky/10 text-brand-navy border-brand-sky/35 font-bold"
                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            No, quiero aprender de cero
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-brand-navy hover:bg-brand-navy/95 text-white text-sm font-semibold rounded-xl py-3 shadow-lg shadow-brand-navy/10 transition-all flex items-center justify-center space-x-2"
                        id="submit-trip-booking"
                      >
                        <Ticket className="w-4 h-4" />
                        <span>Generar Pase VIP de Interés</span>
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                /* Success VIP Boarding Pass State */
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-6 text-center py-4"
                  id="ticket-boarding-pass"
                >
                  <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">¡Siguiente Paso Listo!</h4>
                    <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                      Tu solicitud de cupo VIP ha quedado registrada. Se ha generado tu boleto de preventa informativa en el sistema.
                    </p>
                  </div>

                  {/* Virtual Boarding Ticket */}
                  <div className="bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl max-w-sm mx-auto text-left relative border border-slate-700">
                    {/* Decorative notches */}
                    <div className="absolute left-0 top-[60%] w-6 h-12 bg-white rounded-r-full -translate-x-3 -translate-y-6"></div>
                    <div className="absolute right-0 top-[60%] w-6 h-12 bg-white rounded-l-full translate-x-3 -translate-y-6"></div>

                    {/* Top ticket header */}
                    <div className="p-6 bg-gradient-to-r from-brand-navy to-brand-sky pb-8 flex justify-between items-start">
                      <div>
                        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
                          PRE-EMBARQUE
                        </span>
                        <h5 className="font-extrabold text-xl mt-1 tracking-tight">VIP SOURCING</h5>
                        <p className="text-[10px] text-blue-50/80 font-mono mt-0.5">ST IMPORTACIONES</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-xs text-blue-50/80">CUPÓN</span>
                        <p className="font-mono font-bold text-base text-yellow-300">#PAN2026</p>
                      </div>
                    </div>

                    {/* Body fields */}
                    <div className="p-6 space-y-4 pt-6 border-b border-dashed border-slate-700">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold font-mono">EMPRESARIO(A)</span>
                        <span className="font-bold text-sm tracking-wide text-white uppercase">{booking.name}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-semibold font-mono">DESTINO</span>
                          <span className="font-bold text-sm text-white">Zona Libre de Colón</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-semibold font-mono">FECHAS</span>
                          <span className="font-bold text-xs text-white">14-20 Jun, 2026</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold font-mono">FOCO COMERCIAL</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {booking.sourcingCategories.map((cat, idx) => (
                            <span key={idx} className="bg-slate-800 text-slate-300 text-[9px] px-2 py-0.5 rounded border border-slate-700">
                              {cat.split(" ")[0]}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom barcode segment */}
                    <div className="p-6 pt-4 bg-slate-950 flex justify-between items-center bg-opacity-40">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-mono">CONTACTO WHATSAPP</span>
                        <p className="font-mono text-xs font-bold text-brand-sky">{booking.whatsapp}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        {/* Mock vertical barcode stripes in CSS */}
                        <div className="flex space-x-[2px] h-8 w-24 bg-teal-50 bg-opacity-5 p-1 rounded">
                          <div className="w-1 bg-slate-200 h-full"></div>
                          <div className="w-[2px] bg-slate-200 h-full"></div>
                          <div className="w-2 bg-slate-200 h-full"></div>
                          <div className="w-[1px] bg-slate-200 h-full"></div>
                          <div className="w-1 bg-slate-200 h-full"></div>
                          <div className="w-2 bg-slate-200 h-full"></div>
                          <div className="w-[2px] bg-slate-200 h-full"></div>
                          <div className="w-1 bg-slate-200 h-full"></div>
                          <div className="w-[1px] bg-slate-200 h-full"></div>
                          <div className="w-[3px] bg-slate-200 h-full"></div>
                        </div>
                        <span className="text-[8px] font-mono text-slate-500 mt-1 uppercase">Suscrito Satisfactoriamente</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 max-w-sm mx-auto justify-center">
                    <button
                      onClick={() => {
                        const message = `¡Hola ST IMPORTACIONES! Ya hice mi pre-registro para el Viaje de Sourcing a Panamá 2026. Mi nombre es ${booking.name} y me interesa importar. ¿Podrían confirmarme los cupos hoteleros disponibles?`;
                        window.open(`https://wa.me/${booking.whatsapp.replace(/\+/g, "") || "50760000000"}?text=${encodeURIComponent(message)}`, "_blank");
                      }}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs py-2 px-4 rounded-xl shadow-lg transition"
                    >
                      Enviar Solicitud a WhatsApp
                    </button>
                    <button
                      onClick={resetForm}
                      className="border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold text-xs py-2 px-4 rounded-xl transition"
                    >
                      Nuevo Registro
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
