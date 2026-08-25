import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toastMessage, closeToast, theme } = useApp();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md pointer-events-auto"
        >
          <div
            className={`p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-start gap-3 ${
              theme === 'light'
                ? 'bg-white/90 border-emerald-300/60 text-slate-800 shadow-emerald-900/10'
                : theme === 'sepia'
                ? 'bg-amber-950/90 border-amber-500/30 text-amber-100 shadow-black/40'
                : 'bg-slate-900/90 border-emerald-500/40 text-slate-100 shadow-emerald-950/60'
            }`}
          >
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold font-cairo text-emerald-400">{toastMessage.title}</h4>
              <p className="text-xs mt-0.5 opacity-90 leading-relaxed font-cairo break-words">
                {toastMessage.body}
              </p>
            </div>

            <button
              onClick={closeToast}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
