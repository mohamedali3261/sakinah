import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ArabicFont, FontSize, ThemeMode, QuranPaperThemeId } from '../types';
import { QURAN_PAPER_THEMES } from '../data/paperThemes';
import { Type, X, Moon, Sun, Flame, Check, Palette, Headphones } from 'lucide-react';
import { GlassButton } from './GlassButton';

export const FontSettingsModal: React.FC = () => {
  const {
    language,
    theme,
    setTheme,
    fontFamily,
    setFontFamily,
    fontSize,
    setFontSize,
    quranPaperTheme,
    setQuranPaperTheme,
    isFontSettingsOpen,
    setIsFontSettingsOpen
  } = useApp();

  const fontOptions: { id: ArabicFont; nameAr: string; nameEn: string; preview: string }[] = [
    { id: 'amiri', nameAr: 'خط أميري (أصيل ومشكّل)', nameEn: 'Amiri (Classic Naskh)', preview: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
    { id: 'scheherazade', nameAr: 'خط شهرزاد (نسخ قرآني)', nameEn: 'Scheherazade (Quranic)', preview: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ' },
    { id: 'cairo', nameAr: 'خط كايرو (عصري وواضح)', nameEn: 'Cairo (Modern Sans)', preview: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ' },
    { id: 'tajawal', nameAr: 'خط تجوال (أنيق وسلس)', nameEn: 'Tajawal (Clean Geometric)', preview: 'لَا إِلَهَ إِلَّا اللَّهُ' }
  ];

  const sizeOptions: { id: FontSize; labelAr: string; labelEn: string }[] = [
    { id: 'sm', labelAr: 'صغير', labelEn: 'Small' },
    { id: 'md', labelAr: 'متوسط', labelEn: 'Medium' },
    { id: 'lg', labelAr: 'كبير', labelEn: 'Large' },
    { id: 'xl', labelAr: 'كبير جداً', labelEn: 'Extra Large' },
    { id: '2xl', labelAr: 'ضخم', labelEn: 'Huge' }
  ];

  const themes: { id: ThemeMode; labelAr: string; labelEn: string; icon: React.ReactNode }[] = [
    { id: 'dark', labelAr: 'ليلي زمردي', labelEn: 'Night Glass', icon: <Moon className="w-4 h-4" /> },
    { id: 'sepia', labelAr: 'قنديل دافئ', labelEn: 'Warm Lantern', icon: <Flame className="w-4 h-4" /> }
  ];

  return (
    <AnimatePresence>
      {isFontSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsFontSettingsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Dialog Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative w-full max-w-lg rounded-3xl p-6 border shadow-2xl z-10 max-h-[90vh] overflow-y-auto ${
              theme === 'light'
                ? 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300'
                : theme === 'sepia'
                ? 'bg-[#2b1f17]/95 border-amber-800/40 text-amber-50 shadow-black/60'
                : 'bg-slate-900/95 border-slate-700/60 text-slate-100 shadow-black/80'
            }`}
          >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400">
                <Type className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-cairo">
                  {language === 'ar' ? 'تخصيص القراءة والخط' : 'Reading & Font Settings'}
                </h3>
                <p className="text-xs opacity-70 font-cairo">
                  {language === 'ar' ? 'اضبط الخط وحجمه ونمط الإضاءة لراحة العين' : 'Adjust font type, size, and ambient night reading theme'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsFontSettingsOpen(false)}
              className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 space-y-6">
            {/* Ambient Reading Theme */}
            <div>
              <label className="block text-sm font-semibold mb-3 font-cairo">
                {language === 'ar' ? 'نمط الإضاءة والخلفية العامة' : 'General App Theme'}
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`p-3 rounded-2xl border transition-all flex flex-col items-center gap-2 cursor-pointer ${
                      theme === t.id
                        ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 font-bold shadow-lg shadow-emerald-950/30'
                        : 'border-white/10 hover:border-white/20 bg-white/5 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-white/10">{t.icon}</div>
                    <span className="text-xs font-cairo">{language === 'ar' ? t.labelAr : t.labelEn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quran Paper Themes (Paper Themes) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold font-cairo flex items-center gap-2">
                  <Palette className="w-4 h-4 text-amber-400" />
                  <span>{language === 'ar' ? 'لون وخلفية ورق المصحف (Paper Themes)' : 'Quran Paper Themes'}</span>
                </label>
                <span className="text-[10px] text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded-full">
                  {language === 'ar' ? 'مخصص للمصحف' : 'Mushaf Exclusive'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {QURAN_PAPER_THEMES.map((pt) => {
                  const isSelected = quranPaperTheme === pt.id;
                  return (
                    <button
                      key={pt.id}
                      onClick={() => setQuranPaperTheme(pt.id)}
                      className={`p-2.5 rounded-2xl border transition-all text-right flex items-center gap-2.5 cursor-pointer ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/20 text-amber-200 ring-1 ring-amber-400/50 shadow-md font-bold'
                          : 'border-white/10 hover:border-white/20 bg-white/5 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-lg border flex items-center justify-center font-quran text-xs shrink-0 shadow-inner font-bold"
                        style={{
                          backgroundColor: pt.previewBg,
                          borderColor: pt.previewBorder,
                          color: pt.previewText
                        }}
                      >
                        ق
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-cairo block truncate">
                          {language === 'ar' ? pt.nameAr : pt.nameEn}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font Family Selection */}
            <div>
              <label className="block text-sm font-semibold mb-3 font-cairo">
                {language === 'ar' ? 'نوع الخط العربي' : 'Arabic Calligraphy Font'}
              </label>
              <div className="space-y-2">
                {fontOptions.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => setFontFamily(font.id)}
                    className={`w-full p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                      fontFamily === font.id
                        ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300 shadow-md'
                        : 'border-white/10 hover:border-white/20 bg-white/5 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="text-right">
                      <div className="text-sm font-medium font-cairo flex items-center gap-2">
                        <span>{language === 'ar' ? font.nameAr : font.nameEn}</span>
                      </div>
                      <p
                        className={`text-base mt-1 text-slate-300 font-${font.id}`}
                        style={{ fontFamily: font.id }}
                      >
                        {font.preview}
                      </p>
                    </div>
                    {fontFamily === font.id && (
                      <div className="p-1 rounded-full bg-emerald-500 text-slate-950 shrink-0">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size Selection */}
            <div>
              <label className="block text-sm font-semibold mb-3 font-cairo">
                {language === 'ar' ? 'حجم الخط' : 'Font Size'}
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {sizeOptions.map((sz) => (
                  <button
                    key={sz.id}
                    onClick={() => setFontSize(sz.id)}
                    className={`py-2.5 px-2 rounded-xl border text-center transition-all text-xs font-cairo cursor-pointer ${
                      fontSize === sz.id
                        ? 'border-emerald-400 bg-emerald-500/25 text-emerald-300 font-bold'
                        : 'border-white/10 hover:border-white/20 bg-white/5 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {language === 'ar' ? sz.labelAr : sz.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Reading Sample Box */}
            <div className="p-4 rounded-2xl border border-white/10 bg-white/5">
              <span className="text-xs opacity-60 block mb-2 font-cairo">
                {language === 'ar' ? 'معاينة تجريبية للنص:' : 'Live Text Sample Preview:'}
              </span>
              <p
                className={`leading-relaxed transition-all font-${fontFamily} ${
                  fontSize === 'sm'
                    ? 'text-sm'
                    : fontSize === 'md'
                    ? 'text-base'
                    : fontSize === 'lg'
                    ? 'text-xl'
                    : fontSize === 'xl'
                    ? 'text-2xl'
                    : 'text-3xl'
                }`}
              >
                {language === 'ar'
                  ? '﴿رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً إِنَّكَ أَنتَ الْوَهَّابُ﴾'
                  : '"Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy. Indeed, You are the Bestower."'}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
            <GlassButton variant="primary" onClick={() => setIsFontSettingsOpen(false)}>
              {language === 'ar' ? 'حفظ وتطبيق' : 'Apply Settings'}
            </GlassButton>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};
