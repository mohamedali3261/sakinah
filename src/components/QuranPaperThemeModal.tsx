import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { QURAN_PAPER_THEMES, QuranPaperThemeId } from '../data/paperThemes';
import { Palette, X, Check, Sparkles, BookOpen, Eye } from 'lucide-react';
import { soundEngine, triggerHaptic } from '../utils/audio';
import { GlassButton } from './GlassButton';

interface QuranPaperThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuranPaperThemeModal: React.FC<QuranPaperThemeModalProps> = ({ isOpen, onClose }) => {
  const { language, theme, quranPaperTheme, setQuranPaperTheme, soundEnabled, vibrationEnabled } = useApp();

  const handleSelectTheme = (id: QuranPaperThemeId) => {
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(15);
    setQuranPaperTheme(id);
  };

  const selectedThemeObj = QURAN_PAPER_THEMES.find((t) => t.id === quranPaperTheme) || QURAN_PAPER_THEMES[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 15 }}
            transition={{ type: 'spring', damping: 26, stiffness: 340 }}
            className={`relative w-full max-w-xl rounded-3xl p-5 sm:p-7 border shadow-2xl z-10 max-h-[90vh] overflow-y-auto ${
              theme === 'light'
                ? 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300'
                : theme === 'sepia'
                ? 'bg-[#281b13]/95 border-amber-800/40 text-amber-50 shadow-black/70'
                : 'bg-slate-900/95 border-slate-700/60 text-slate-100 shadow-black/80'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-cairo flex items-center gap-2">
                    <span>{language === 'ar' ? 'خلفيات وألوان ورق المصحف' : 'Quran Paper Themes & Textures'}</span>
                    <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                      {language === 'ar' ? 'مريح للعين' : 'Eye Safe'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-cairo mt-0.5">
                    {language === 'ar'
                      ? 'اختر مظهر الورق المفضل لديك (العتيق، الكريمي، الداكن، الزمردي) لراحة تامة أثناء التلاوة'
                      : 'Choose your preferred Quranic parchment aesthetic for maximum reading comfort'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Interactive Preview Box */}
            <div className="mt-5 mb-5">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-bold text-slate-400 font-cairo flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  {language === 'ar' ? 'معاينة مباشرة لمظهر صفحة المصحف:' : 'Live Mushaf Page Preview:'}
                </span>
                <span className="text-xs font-bold text-amber-400 font-cairo">
                  {language === 'ar' ? selectedThemeObj.nameAr : selectedThemeObj.nameEn}
                </span>
              </div>

              <div
                className={`relative p-5 sm:p-7 rounded-2xl border-2 transition-all shadow-lg ${selectedThemeObj.bgClass} ${selectedThemeObj.borderClass} ${selectedThemeObj.textClass}`}
              >
                {/* Inner Border Frame */}
                <div className={`absolute inset-2 border rounded-xl pointer-events-none ${selectedThemeObj.innerBorderClass}`} />

                {/* Corner Rosettes */}
                <div className={`absolute top-2.5 right-2.5 text-[10px] font-bold ${selectedThemeObj.rosetteClass}`}>❖</div>
                <div className={`absolute top-2.5 left-2.5 text-[10px] font-bold ${selectedThemeObj.rosetteClass}`}>❖</div>
                <div className={`absolute bottom-2.5 right-2.5 text-[10px] font-bold ${selectedThemeObj.rosetteClass}`}>❖</div>
                <div className={`absolute bottom-2.5 left-2.5 text-[10px] font-bold ${selectedThemeObj.rosetteClass}`}>❖</div>

                {/* Mini Header */}
                <div className={`flex items-center justify-between text-[11px] font-cairo pb-2 mb-3 border-b ${selectedThemeObj.innerBorderClass}`}>
                  <span className="font-bold flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-amber-500" />
                    سُورَةُ الإِخْلَاصِ
                  </span>
                  <span className="font-mono opacity-80">الجزء ٣٠</span>
                </div>

                {/* Ayahs Text */}
                <div dir="rtl" className="text-center font-quran text-lg sm:text-xl leading-[2.6] select-none py-1">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ <br />
                  قُلْ هُوَ اللَّهُ أَحَدٌ <span className={`${selectedThemeObj.rosetteClass} font-mono text-sm`}>﴿١﴾</span> اللَّهُ الصَّمَدُ <span className={`${selectedThemeObj.rosetteClass} font-mono text-sm`}>﴿٢﴾</span> لَمْ يَلِدْ وَلَمْ يُولَدْ <span className={`${selectedThemeObj.rosetteClass} font-mono text-sm`}>﴿٣﴾</span> وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ <span className={`${selectedThemeObj.rosetteClass} font-mono text-sm`}>﴿٤﴾</span>
                </div>

                {/* Mini Footer */}
                <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[10px] font-cairo opacity-70 ${selectedThemeObj.innerBorderClass}`}>
                  <span>مصحف المدينة</span>
                  <span className="font-mono font-bold">﴿ ٦٠٤ ﴾</span>
                  <span>الحزب ٦٠</span>
                </div>
              </div>
            </div>

            {/* Themes Grid Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-300 font-cairo">
                {language === 'ar' ? 'اختر نمط الورق المناسب لك:' : 'Select your preferred paper background:'}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {QURAN_PAPER_THEMES.map((themeOption) => {
                  const isSelected = quranPaperTheme === themeOption.id;

                  return (
                    <motion.div
                      key={themeOption.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectTheme(themeOption.id)}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-500/15 shadow-md shadow-emerald-950/40 ring-2 ring-emerald-500/30'
                          : 'border-white/10 hover:border-white/20 bg-white/5 opacity-85 hover:opacity-100'
                      }`}
                    >
                      {/* Color Palette Preview Swatch */}
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl border-2 flex items-center justify-center font-quran text-base font-bold shrink-0 shadow-inner"
                          style={{
                            backgroundColor: themeOption.previewBg,
                            borderColor: themeOption.previewBorder,
                            color: themeOption.previewText
                          }}
                        >
                          ن
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs sm:text-sm font-bold font-cairo text-slate-100">
                              {language === 'ar' ? themeOption.nameAr : themeOption.nameEn}
                            </h4>
                            {themeOption.isDark && (
                              <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-md font-mono">
                                {language === 'ar' ? 'ليلي' : 'Night'}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 font-cairo line-clamp-1 mt-0.5">
                            {language === 'ar' ? themeOption.descriptionAr : themeOption.descriptionEn}
                          </p>
                        </div>
                      </div>

                      {/* Selection Checkmark */}
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-white/20 shrink-0" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Footer Action */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-cairo">
                {language === 'ar' ? 'يتم حفظ مظهر الورق تلقائياً لجميع السور' : 'Theme is saved automatically for all Surahs'}
              </span>
              <GlassButton variant="primary" onClick={onClose}>
                {language === 'ar' ? 'تم واعتماد المظهر' : 'Apply & Close'}
              </GlassButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
