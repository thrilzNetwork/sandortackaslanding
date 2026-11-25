import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

function useWide() {
  const query = "(min-width: 900px)";
  const [wide, setWide] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setWide(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return wide;
}

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/** Bottom sheet on phones, side panel on desktop. */
export default function Sheet({ open, onClose, title, subtitle, children, footer }: SheetProps) {
  const wide = useWide();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const hidden = wide ? { x: "100%", y: 0 } : { x: 0, y: "100%" };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-hull/70"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={hidden}
            animate={{ x: 0, y: 0 }}
            exit={hidden}
            transition={{ type: "tween", duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            className={
              "fixed z-50 flex flex-col bg-paper text-ink shadow-[0_0_60px_rgba(8,38,64,0.35)] " +
              (wide ? "top-0 right-0 h-dvh w-[560px]" : "inset-x-0 bottom-0 max-h-[92dvh] rounded-t-[20px]")
            }
          >
            <header className="flex items-start justify-between gap-4 border-b border-[#c3d0db] bg-white px-5 py-4 max-[899px]:rounded-t-[20px]">
              <div>
                <h2 className="font-display text-[1.35rem] font-bold leading-tight text-hull">{title}</h2>
                {subtitle && <p className="hint mt-1.5">{subtitle}</p>}
              </div>
              <button onClick={onClose} aria-label="Cerrar" className="-mr-2 -mt-1 grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full text-ink hover:bg-paper">
                <X className="h-6 w-6" />
              </button>
            </header>
            <div className="flex-1 space-y-6 overflow-y-auto overscroll-contain px-5 py-6">{children}</div>
            {footer && <div className="border-t border-[#c3d0db] bg-white px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">{footer}</div>}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
