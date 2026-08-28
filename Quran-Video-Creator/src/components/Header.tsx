import React from 'react';
import { Sparkles, Globe, Moon, BookOpen } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
}

export const Header: React.FC<HeaderProps> = ({ lang, onToggleLang }) => {
  const t = TRANSLATIONS[lang];
  const isAr = lang === 'ar';

  return (
    <header className="relative z-30 border-b border-emerald-900/40 bg-neutral-950/80 backdrop-blur-md">
      {/* Subtle gold top border highlight */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 border border-amber-400/40 shadow-lg shadow-emerald-950/50">
            <BookOpen className="w-5 h-5 text-amber-300" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
                {isAr ? 'تِـلَاوَة' : 'Tilawah'}
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {isAr ? 'تلقائي' : 'Auto Video'}
              </span>
            </div>
            <p className="text-xs text-neutral-400 hidden sm:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Right actions: Language switcher and peaceful badge */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-300">
            <Moon className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'الرسم العثماني المعتمد' : 'Authentic Uthmani Script'}</span>
          </div>

          <button
            id="language-toggle-btn"
            onClick={onToggleLang}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 hover:text-white border border-emerald-700/50 transition-all text-xs sm:text-sm font-medium shadow-sm active:scale-95"
            title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <Globe className="w-4 h-4 text-amber-400" />
            <span>{t.languageToggle}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
