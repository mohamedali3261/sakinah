import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language } = useApp();
  const isAr = language === 'ar';

  return (
    <footer className="relative z-10 border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-md py-6 text-center text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2">
        <p className="flex items-center gap-2 justify-center flex-wrap text-sm">
          <span className="text-slate-300">
            {isAr
              ? 'تطوير محمد علي • نسألكم الدعاء له ولوالديه بالخير والرحمة والقبول • صدقة جارية'
              : 'Developed by Mohammad Ali • Please pray for him and his parents • Sadakah Jariyah'}
          </span>
          <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400/20 inline animate-pulse" />
        </p>
      </div>
    </footer>
  );
};
