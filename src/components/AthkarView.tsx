import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ATHKAR_CATEGORIES } from '../data/athkarData';
import { soundEngine, triggerHaptic } from '../utils/audio';
import {
  Sun,
  Moon,
  BedDouble,
  Sparkles,
  ShieldCheck,
  Check,
  CheckCircle2,
  Copy,
  Bookmark,
  RotateCcw,
  Volume2,
  ChevronDown,
  ChevronUp,
  Languages
} from 'lucide-react';
import { GlassButton } from './GlassButton';
import { motion, AnimatePresence } from 'motion/react';

export const AthkarView: React.FC = () => {
  const {
    language,
    theme,
    fontFamily,
    fontSize,
    selectedAthkarCategoryId,
    setSelectedAthkarCategoryId,
    addBookmark,
    isBookmarked,
    incrementGlobalDhikr,
    soundEnabled,
    vibrationEnabled,
    showToast
  } = useApp();

  const activeCategory =
    ATHKAR_CATEGORIES.find((c) => c.id === selectedAthkarCategoryId) || ATHKAR_CATEGORIES[0];

  // State to track counts for each item
  const [counts, setCounts] = useState<{ [id: string]: number }>({});
  const [showTransliteration, setShowTransliteration] = useState<{ [id: string]: boolean }>({});

  const getCategoryIcon = (name: string) => {
    switch (name) {
      case 'Sun':
        return <Sun className="w-5 h-5" />;
      case 'Moon':
        return <Moon className="w-5 h-5" />;
      case 'BedDouble':
        return <BedDouble className="w-5 h-5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const handleItemCount = (itemId: string, maxCount: number) => {
    const current = counts[itemId] || 0;
    if (current >= maxCount) return;

    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(15);
    incrementGlobalDhikr();

    const next = current + 1;
    setCounts((prev) => ({ ...prev, [itemId]: next }));

    if (next >= maxCount) {
      soundEngine.playCompletion();
      if (vibrationEnabled) triggerHaptic(50);
      showToast(
        language === 'ar' ? 'أحسنت! أتممت هذا الذكر' : 'Athkar Completed',
        language === 'ar' ? 'جزاك الله خيراً، تقبل الله طاعتك.' : 'May Allah reward you for your remembrance.'
      );
    }
  };

  const resetCurrentCategory = () => {
    const newCounts = { ...counts };
    activeCategory.items.forEach((item) => {
      delete newCounts[item.id];
    });
    setCounts(newCounts);
    showToast(
      language === 'ar' ? 'إعادة ضبط الأذكار' : 'Category Reset',
      language === 'ar' ? 'تمت إعادة ضبط عدادات هذه الفئة.' : 'Counters reset for this category.'
    );
  };

  const completedCount = activeCategory.items.filter(
    (item) => (counts[item.id] || 0) >= item.count
  ).length;
  const progressPercent = Math.round((completedCount / activeCategory.items.length) * 100);

  const copyAthkar = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(
      language === 'ar' ? 'تم النسخ' : 'Copied',
      language === 'ar' ? 'تم نسخ الذكر إلى الحافظة.' : 'Athkar copied to clipboard.'
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24">
      {/* Category Tabs Carousel */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {ATHKAR_CATEGORIES.map((cat) => {
          const isSelected = activeCategory.id === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedAthkarCategoryId(cat.id)}
              className={`px-4 py-3 rounded-2xl border transition-all flex items-center gap-2.5 shrink-0 cursor-pointer ${
                isSelected
                  ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 font-bold shadow-lg shadow-emerald-950/40'
                  : 'border-white/10 bg-white/5 opacity-70 hover:opacity-100'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl ${
                  isSelected ? 'bg-emerald-500/25 text-emerald-300' : 'bg-white/10 text-slate-400'
                }`}
              >
                {getCategoryIcon(cat.iconName)}
              </div>
              <div className="text-right">
                <span className="text-sm font-cairo block">
                  {language === 'ar' ? cat.titleAr : cat.titleEn}
                </span>
                <span className="text-[10px] opacity-70 font-cairo">
                  {cat.items.length} {language === 'ar' ? 'أذكار' : 'items'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Category Header Card */}
      <div
        className={`p-6 rounded-3xl border backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 ${
          theme === 'light'
            ? 'bg-white/80 border-slate-200 text-slate-800'
            : theme === 'sepia'
            ? 'bg-[#2b1f17]/80 border-amber-800/40 text-amber-50'
            : 'bg-slate-900/80 border-slate-800 text-slate-100'
        }`}
      >
        <div>
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            {getCategoryIcon(activeCategory.iconName)}
            <h2 className="text-xl font-bold font-cairo">
              {language === 'ar' ? activeCategory.titleAr : activeCategory.titleEn}
            </h2>
          </div>
          <p className="text-xs opacity-75 font-cairo">
            {language === 'ar' ? activeCategory.descriptionAr : activeCategory.descriptionEn}
          </p>
        </div>

        {/* Progress & Reset */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="text-center md:text-right">
            <span className="text-xs font-cairo opacity-70 block">
              {language === 'ar' ? 'نسبة الإنجاز' : 'Progress'}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-24 md:w-32 h-2.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {completedCount}/{activeCategory.items.length}
              </span>
            </div>
          </div>

          <GlassButton variant="secondary" size="sm" onClick={resetCurrentCategory}>
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-xs">{language === 'ar' ? 'إعادة البدء' : 'Reset'}</span>
          </GlassButton>
        </div>
      </div>

      {/* Athkar Items List */}
      <div className="space-y-4">
        {activeCategory.items.map((item, idx) => {
          const currentCount = counts[item.id] || 0;
          const isDone = currentCount >= item.count;
          const remaining = Math.max(0, item.count - currentCount);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-6 rounded-3xl border backdrop-blur-xl shadow-lg transition-all ${
                isDone
                  ? 'border-emerald-500/40 bg-emerald-500/10'
                  : theme === 'light'
                  ? 'bg-white/85 border-slate-200 text-slate-800'
                  : theme === 'sepia'
                  ? 'bg-[#291c14]/85 border-amber-800/40 text-amber-50'
                  : 'bg-slate-900/80 border-slate-800/80 text-slate-100'
              }`}
            >
              {/* Item Header Toolbar */}
              <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-white/10">
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-lg bg-white/10 text-emerald-400">
                  #{idx + 1}
                </span>

                <div className="flex items-center gap-1">
                  {/* Transliteration / Translation toggle */}
                  <button
                    onClick={() =>
                      setShowTransliteration((prev) => ({
                        ...prev,
                        [item.id]: !prev[item.id]
                      }))
                    }
                    className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-emerald-300 transition-colors"
                    title={language === 'ar' ? 'الترجمة والنطق' : 'Transliteration'}
                  >
                    <Languages className="w-4 h-4" />
                  </button>

                  {/* Bookmark Button */}
                  <button
                    onClick={() =>
                      addBookmark({
                        type: 'athkar',
                        titleAr: activeCategory.titleAr,
                        titleEn: activeCategory.titleEn,
                        snippetAr: item.textAr,
                        snippetEn: item.textEn,
                        targetId: item.id
                      })
                    }
                    className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-colors"
                    title={language === 'ar' ? 'حفظ الذكر' : 'Bookmark'}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${isBookmarked(item.id) ? 'fill-amber-400 text-amber-400' : ''}`}
                    />
                  </button>

                  {/* Copy Button */}
                  <button
                    onClick={() => copyAthkar(item.textAr)}
                    className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-emerald-400 transition-colors"
                    title={language === 'ar' ? 'نسخ الذكر' : 'Copy'}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Athkar Arabic Text */}
              <p
                className={`leading-relaxed text-right font-${fontFamily} ${
                  fontSize === 'sm'
                    ? 'text-base'
                    : fontSize === 'md'
                    ? 'text-lg md:text-xl'
                    : fontSize === 'lg'
                    ? 'text-xl md:text-2xl'
                    : fontSize === 'xl'
                    ? 'text-2xl md:text-3xl'
                    : 'text-3xl md:text-4xl'
                } ${isDone ? 'opacity-80' : ''}`}
              >
                {item.textAr}
              </p>

              {/* Transliteration & English */}
              <AnimatePresence>
                {(showTransliteration[item.id] || language === 'en') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-white/10 space-y-1.5 text-xs opacity-80"
                  >
                    {item.transliteration && (
                      <p className="italic font-sans text-teal-300/90">{item.transliteration}</p>
                    )}
                    <p className="font-sans text-slate-300">{item.textEn}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Virtues & Reference Banner */}
              {(item.fadlAr || item.referenceAr) && (
                <div className="mt-4 p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs font-cairo">
                  {item.fadlAr && (
                    <span className="text-amber-400">
                      <strong>{language === 'ar' ? 'الفضل:' : 'Virtue:'}</strong>{' '}
                      {language === 'ar' ? item.fadlAr : item.fadlEn}
                    </span>
                  )}
                  {item.referenceAr && (
                    <span className="opacity-60 text-slate-300 whitespace-nowrap">
                      {language === 'ar' ? item.referenceAr : item.referenceEn}
                    </span>
                  )}
                </div>
              )}

              {/* Bottom Interactive Circular Count Trigger */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-cairo opacity-70">
                  {language === 'ar' ? 'التكرار المطلوب:' : 'Required count:'}{' '}
                  <strong className="text-emerald-400 font-mono text-sm">{item.count}</strong>
                </span>

                {/* Glass Interactive Count Button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleItemCount(item.id, item.count)}
                  className={`px-5 py-2.5 rounded-2xl border flex items-center gap-2.5 font-cairo font-bold transition-all shadow-lg cursor-pointer ${
                    isDone
                      ? 'border-emerald-500 bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                      : 'border-emerald-500/40 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 shadow-emerald-950/40'
                  }`}
                >
                  {isDone ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>{language === 'ar' ? 'تم بحمد الله' : 'Completed'}</span>
                    </>
                  ) : (
                    <>
                      <span className="w-6 h-6 rounded-full bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center font-mono text-xs">
                        {currentCount}
                      </span>
                      <span>
                        {language === 'ar' ? 'اضغط للذكر' : 'Recited'} ({remaining})
                      </span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
