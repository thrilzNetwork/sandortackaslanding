import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Sparkles, MessageCircle, RefreshCw, Compass } from "lucide-react";
import { ChatMessage } from "../types";

interface GeminiChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GeminiChatDrawer({ isOpen, onClose }: GeminiChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "¡Hola! Soy tu Asistente de Sourcing y Logística en ST IMPORTACIONES. ⚡ Te guío en cómo funcionan tus importaciones de Amazon, eBay, Shein o Zara, y cómo unirte a nuestro espectacular Viaje de Negocios a China 2026 (Guangzhou & Yiwu). ¿Qué mercancía o producto te gustaría cotizar hoy?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "🇨🇳 ¿Cómo importo de China fácil?",
    "📦 Costos flete de Amazon o eBay",
    "⛩️ Info sobre el Viaje a China 2026",
    "👔 ¿Qué mercancía tiene mejor margen?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsgId = Date.now().toString();
    const newMsg: ChatMessage = {
      id: userMsgId,
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Map ChatMessage structure to server simplified model
      const simplifiedPayload = [...messages, newMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: simplifiedPayload }),
      });

      if (!res.ok) {
        throw new Error("Failed to receive stream response");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.text || "Disculpa, no obtuve respuesta.",
        },
      ]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: "¡Oops! Tuve un pequeño retraso en la conexión con el servidor. Te sugiero darle click al botón superior para chatear directo conmigo por WhatsApp.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const resetChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "¡Hola de nuevo! Reiniciamos nuestra asesoría de Emprendelandia. ¿Hacemos cálculos de flete o te interesa saber de aduanas marítimas?",
      },
    ]);
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
            id="chat-overlay"
          />

          {/* Sliding drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-white rounded-t-3xl shadow-2xl z-50 h-[88vh] overflow-y-auto pointer-events-auto flex flex-col"
            id="chat-drawer-container"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10" id="chat-header">
              <div className="flex items-center space-x-2">
                <span className="p-2 bg-gradient-to-r from-brand-navy to-brand-sky rounded-xl text-white shadow-md shadow-brand-sky/20 px-3 py-2.5">
                  <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                </span>
                <div>
                  <h2 className="font-sans font-bold text-base text-gray-900 tracking-tight">Asistente Inteligente</h2>
                  <p className="text-[10px] uppercase tracking-wider text-brand-sky font-extrabold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Emprendelandia AI Consejero
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={resetChat}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition"
                  title="Reiniciar chat"
                  id="reset-chat-btn"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition"
                  aria-label="Cerrar"
                  id="close-chat-drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Message Thread Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50" id="chat-message-list">
              {messages.map((m) => {
                const isAI = m.role === "assistant";
                return (
                  <div
                    key={m.id}
                    className={`flex ${isAI ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[85%] text-xs rounded-2xl px-4 py-3 shadow-sm ${
                        isAI
                          ? "bg-white text-gray-800 border border-gray-100 rounded-tl-none leading-relaxed"
                          : "bg-brand-navy text-white rounded-tr-none leading-relaxed font-semibold"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 text-gray-500 text-xs rounded-2xl rounded-tl-none px-4 py-3 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-sky animate-spin" />
                    <span className="font-mono text-[10px]">Asesor analizando fletes...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Panel */}
            <div className="bg-white border-t border-gray-100 px-6 py-3" id="quick-prompts-bar">
              <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-gray-400 block mb-2 flex items-center gap-1">
                <Compass className="w-3 h-3 text-brand-sky" /> Consultas Rápidas Recomendadas:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    className="text-left text-[11px] bg-slate-50 hover:bg-brand-sky/10 hover:text-brand-sky hover:border-brand-sky/20 px-3 py-1.5 rounded-full border border-gray-100 text-gray-600 transition"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4" id="chat-input-panel">
              <form onSubmit={handleFormSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Escribe tu duda sobre aduanas o mercadería..."
                  className="flex-grow text-xs bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-sky focus:bg-white focus:border-transparent transition"
                  maxLength={500}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-brand-navy hover:bg-brand-navy/95 text-white rounded-xl p-3 shadow-lg shadow-brand-navy/10 transition disabled:opacity-40 cursor-pointer"
                  aria-label="Enviar mensaje"
                  id="send-chat-message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
