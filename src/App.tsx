import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Compass, 
  MapPin, 
  ShoppingBag, 
  Sparkles, 
  CheckCircle, 
  Send, 
  ArrowRight, 
  ShieldAlert, 
  FileText,
  BadgePercent
} from "lucide-react";

import PanamaTripDrawer from "./components/PanamaTripDrawer";
import PacaCalculatorDrawer from "./components/PacaCalculatorDrawer";
import CustomImportDrawer from "./components/CustomImportDrawer";
import GeminiChatDrawer from "./components/GeminiChatDrawer";

export default function App() {
  const [activeDrawer, setActiveDrawer] = useState<"panama" | "paca" | "custom" | "chat" | null>(null);
  
  // Newsletter Subscription State
  const [emailSub, setEmailSub] = useState("");
  const [isSubbed, setIsSubbed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSub.trim()) return;
    setIsSubbed(true);
    setEmailSub("");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative flex flex-col justify-between overflow-x-hidden" id="app-viewport">
      
      {/* Background Ambience Graphics */}
      <div className="absolute top-0 inset-x-0 h-[380px] bg-gradient-to-b from-brand-sky/15 via-brand-navy/5 to-transparent pointer-events-none z-0"></div>
      
      {/* Principal Container (Centered link-in-bio style card) */}
      <main className="w-full max-w-md mx-auto px-4 py-8 relative z-10 flex-grow flex flex-col justify-start space-y-6">
        
        {/* Profile Card & Bio Segment */}
        <section className="text-center space-y-4" id="profile-section">
          {/* Main Hero Avatar illustration matching original */}
          <div className="relative inline-block" id="avatar-container">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy to-brand-sky rounded-full blur-sm opacity-60 animate-pulse"></div>
            <div className="relative w-28 h-28 bg-white p-[3.5px] rounded-full shadow-lg border border-brand-sky/30">
              <img
                src="https://i.postimg.cc/6qg0TsZ2/00071ab0-4718-464a-9e7f-b230324da389.jpg"
                alt="ST Importaciones Logo"
                className="w-full h-full object-cover rounded-full bg-white"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Core Branding Typography */}
          <div className="space-y-1">
            <h1 className="font-display font-black text-2xl text-brand-navy tracking-wider uppercase">
              ST IMPORTACIONES
            </h1>
            <p className="text-xs text-brand-sky font-extrabold uppercase tracking-widest flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-sky"></span>
              Soluciones Integrales de Importación
            </p>
          </div>

          {/* Brand Tagline matching original exactly */}
          <p className="text-sm text-gray-700 bg-white/70 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-gray-100 shadow-sm leading-relaxed max-w-sm mx-auto">
            ✈️ Te ayudamos a importar de forma segura y eficiente desde cualquier parte del mundo. 📦
          </p>
        </section>

        {/* Social Networks Row (High fidelity custom SVG paths) */}
        <section className="flex justify-center items-center space-x-3.5" id="social-links-bar">
          {/* TikTok */}
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-115 transition-transform duration-200 border border-gray-100 shadow-sm text-gray-900"
            aria-label="TikTok"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.2-.41-.43-.61-.65-.02.48-.01.96-.01 1.44-.02 3.47-.88 7.09-3.41 9.42-2.33 2.15-5.73 2.92-8.82 2.06C2.12 19.5-.14 15.28.18 11.51c.36-4.22 4.02-7.85 8.27-7.61.1.01.21.01.32.03V8c-1.42-.4-3.08-.1-4.18.86C3.41 9.87 3.3 11.66 3.98 13c.73 1.43 2.4 2.37 4.02 2.19 1.69-.17 3.12-1.52 3.39-3.21.14-.92.1-1.85.11-2.77c0-3.07-.01-6.13-.01-9.2 1.04.01 1.04.01 1.04.01z" />
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-115 transition-transform duration-200 border border-gray-100 shadow-sm text-gray-900"
            aria-label="Instagram"
          >
            <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>

          {/* YouTube */}
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-115 transition-transform duration-200 border border-gray-100 shadow-sm text-gray-900"
            aria-label="YouTube"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>

          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-115 transition-transform duration-200 border border-gray-100 shadow-sm text-gray-900"
            aria-label="Facebook"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
        </section>

        {/* Core Link-In-Bio Button Stack */}
        <section className="space-y-4" id="links-stack">
          
          {/* Button 1: VIAJE DE NEGOCIOS CHINA */}
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => setActiveDrawer("panama")}
            className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white p-4.5 rounded-3xl shadow-md border border-brand-sky/20 text-left relative overflow-hidden transition-all flex items-center group cursor-pointer"
            id="btn-panama-trip"
          >
            {/* Visual Thumbnail Frame */}
            <div className="w-11 h-11 bg-white p-[2px] rounded-full shadow-inner flex-shrink-0 mr-4 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-brand-sky/10 rounded-full flex items-center justify-center text-brand-sky">
                <MapPin className="w-5 h-5" />
              </div>
            </div>
            {/* Text details */}
            <div className="flex-grow">
              <h3 className="font-sans font-extrabold text-sm md:text-base leading-tight uppercase tracking-tight">
                VIAJE DE NEGOCIOS CHINA 2026
              </h3>
              <p className="text-[10px] text-brand-sky/80 uppercase tracking-widest font-semibold mt-0.5 font-mono">
                Misión de Sourcing • Importa de Cantón & Yiwu
              </p>
            </div>
          </motion.button>

          {/* Button 2: IMPORTAMOS PACAS */}
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => setActiveDrawer("paca")}
            className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white p-4.5 rounded-3xl shadow-md border border-brand-sky/20 text-left relative overflow-hidden transition-all flex items-center group cursor-pointer"
            id="btn-paca-calculator"
          >
            {/* Visual Thumbnail */}
            <div className="w-11 h-11 bg-white p-[2px] rounded-full shadow-inner flex-shrink-0 mr-4 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-brand-sky/10 rounded-full flex items-center justify-center text-brand-sky">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
            <div className="flex-grow">
              <h3 className="font-sans font-extrabold text-sm md:text-base leading-tight uppercase tracking-tight">
                IMPORTAMOS POR TI
              </h3>
              <p className="text-[10px] text-brand-sky/80 uppercase tracking-widest font-semibold mt-0.5 font-mono">
                Amazon, eBay, Shein, Zara & más
              </p>
            </div>
          </motion.button>

          {/* Button 3: IMPORTAS POR TU CUENTA */}
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => setActiveDrawer("custom")}
            className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white p-4.5 rounded-3xl shadow-md border border-brand-sky/20 text-left relative overflow-hidden transition-all flex items-center group cursor-pointer"
            id="btn-custom-import"
          >
            <div className="w-11 h-11 bg-white p-[2px] rounded-full shadow-inner flex-shrink-0 mr-4 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-brand-sky/10 rounded-full flex items-center justify-center text-brand-sky">
                <Compass className="w-5 h-5" />
              </div>
            </div>
            <div className="flex-grow">
              <h3 className="font-sans font-extrabold text-sm md:text-base leading-tight uppercase tracking-tight">
                ¿IMPORTAS POR TU CUENTA?
              </h3>
              <p className="text-[10px] text-brand-sky/80 uppercase tracking-widest font-semibold mt-0.5 font-mono">
                Casillero de Carga • Tasas de Aduanas & Guía
              </p>
            </div>
          </motion.button>

          {/* Button 4: PREGÚNTALE A MI ASISTENTE DE IMPORTACIÓN */}
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => setActiveDrawer("chat")}
            className="w-full bg-gradient-to-r from-brand-navy via-brand-sky/90 to-brand-sky hover:brightness-110 text-white p-4.5 rounded-3xl shadow-lg border border-brand-sky/30 text-left relative overflow-hidden transition-all flex items-center group cursor-pointer"
            id="btn-ai-chat"
          >
            {/* Sparkle border trace */}
            <div className="absolute inset-0 border border-yellow-300/40 rounded-3xl pointer-events-none"></div>
            
            <div className="w-11 h-11 bg-white p-[2px] rounded-full shadow-inner flex-shrink-0 mr-4 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
            </div>
            <div className="flex-grow">
              <h3 className="font-sans font-extrabold text-sm md:text-base leading-tight uppercase tracking-tight flex items-center gap-1">
                ASESOR INTELIGENTE EN VIVO
              </h3>
              <p className="text-[10px] text-yellow-100 uppercase tracking-widest font-semibold mt-0.5 font-mono">
                Chat con Gemini • Aduanas y Negocios Online
              </p>
            </div>
          </motion.button>
        </section>

        {/* Newsletter Subscription Opt-in card under the buttons */}
        <section className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4" id="subscription-card">
          <div className="text-center space-y-1">
            <h4 className="font-sans font-bold text-gray-900 text-xs uppercase tracking-wide">
              Boletín de Sourcing & Aduanas
            </h4>
            <p className="text-[11px] text-gray-500 max-w-xs mx-auto">
              Recibe alertas exclusivas sobre remates de aduana y nuevos contenedores de pacas directos en tu correo.
            </p>
          </div>

          {!isSubbed ? (
            <form onSubmit={handleSubscribe} className="flex gap-2" id="sub-form">
              <input
                type="email"
                required
                placeholder="tu@correo.com"
                value={emailSub}
                onChange={(e) => setEmailSub(e.target.value)}
                className="flex-grow text-xs bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-sky focus:bg-white transition"
              />
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl px-4 py-2.5 shadow transition flex items-center gap-1 font-mono uppercase cursor-pointer"
                id="subscribe-btn"
              >
                Unirme <Send className="w-3 h-3" />
              </button>
            </form>
          ) : (
            <div className="bg-emerald-50 text-emerald-800 text-[11px] px-3 py-2.5 rounded-2xl border border-emerald-100/80 flex items-center justify-center gap-2 font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>¡Suscrito! Te enviaremos alertas comerciales.</span>
            </div>
          )}
        </section>

        {/* Footer Brand Credentials */}
        <footer className="text-center text-gray-400 text-[10px] pt-4 font-mono uppercase tracking-wider space-y-1">
          <p>© 2026 ST IMPORTACIONES</p>
          <div className="flex justify-center space-x-2 text-gray-300">
            <span>ADUANAS</span>
            <span>•</span>
            <span>LOGÍSTICA</span>
            <span>•</span>
            <span>DISTRIBUCIÓN</span>
          </div>
        </footer>

      </main>



      {/* Drawers / Overlays */}
      <PanamaTripDrawer 
        isOpen={activeDrawer === "panama"} 
        onClose={() => setActiveDrawer(null)} 
      />
      <PacaCalculatorDrawer 
        isOpen={activeDrawer === "paca"} 
        onClose={() => setActiveDrawer(null)} 
      />
      <CustomImportDrawer 
        isOpen={activeDrawer === "custom"} 
        onClose={() => setActiveDrawer(null)} 
      />
      <GeminiChatDrawer 
        isOpen={activeDrawer === "chat"} 
        onClose={() => setActiveDrawer(null)} 
      />

    </div>
  );
}
