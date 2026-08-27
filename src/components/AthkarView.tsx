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
  ChevronLeft,
  ChevronRight,
  Languages,
  ArrowLeft,
  ArrowRight
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
  const [selectedAthkarId, setSelectedAthkarId] = useState<string | null>(null);

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

  // If an athkar item is selected, show details view
  if (selectedAthkarId) {
    const selectedItem = activeCategory.items.find((item) => item.id === selectedAthkarId);
    if (!selectedItem) {
      setSelectedAthkarId(null);
      return null;
    }

    const currentCount = counts[selectedItem.id] || 0;
    const isDone = currentCount >= selectedItem.count;
    const remaining = Math.max(0, selectedItem.count - currentCount);
    const itemIndex = activeCategory.items.findIndex((item) => item.id === selectedAthkarId);
    const prevItem = itemIndex > 0 ? activeCategory.items[itemIndex - 1] : null;
    const nextItem = itemIndex < activeCategory.items.length - 1 ? activeCategory.items[itemIndex + 1] : null;

    return (
      <div className="w-full max-w-4xl mx-auto space-y-6 pb-24">
        {/* Back Button */}
        <button
          onClick={() => setSelectedAthkarId(null)}
          className="relative z-10 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-emerald-300 transition-all text-xs font-cairo font-bold"
        >
          {language === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{language === 'ar' ? 'العودة للأذكار' : 'Back to List'}</span>
        </button>

        {/* Athkar Detail Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative z-10 p-6 md:p-8 rounded-3xl border backdrop-blur-xl shadow-lg transition-all ${
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold font-mono px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                #{itemIndex + 1}
              </span>
              <span className="text-sm font-cairo opacity-60">
                {language === 'ar' ? 'التكرار:' : 'Count:'} {selectedItem.count}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Transliteration / Translation toggle */}
              <button
                onClick={() =>
                  setShowTransliteration((prev) => ({
                    ...prev,
                    [selectedItem.id]: !prev[selectedItem.id]
                  }))
                }
                className="relative z-10 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/30 text-slate-400 hover:text-emerald-300 transition-all text-xs font-cairo font-bold"
                title={language === 'ar' ? 'الترجمة والنطق' : 'Transliteration'}
              >
                <Languages className="w-4 h-4" />
                <span>{language === 'ar' ? 'ترجمة' : 'Trans'}</span>
              </button>

              {/* Bookmark Button */}
              <button
                onClick={() =>
                  addBookmark({
                    type: 'athkar',
                    titleAr: activeCategory.titleAr,
                    titleEn: activeCategory.titleEn,
                    snippetAr: selectedItem.textAr,
                    snippetEn: selectedItem.textEn,
                    targetId: selectedItem.id
                  })
                }
                className="relative z-10 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/30 text-slate-400 hover:text-amber-400 transition-all text-xs font-cairo font-bold"
                title={language === 'ar' ? 'حفظ الذكر' : 'Bookmark'}
              >
                <Bookmark
                  className={`w-4 h-4 ${isBookmarked(selectedItem.id) ? 'fill-amber-400 text-amber-400' : ''}`}
                />
                <span>{language === 'ar' ? 'حفظ' : 'Save'}</span>
              </button>

              {/* Copy Button */}
              <button
                onClick={() => copyAthkar(selectedItem.textAr)}
                className="relative z-10 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/30 text-slate-400 hover:text-emerald-400 transition-all text-xs font-cairo font-bold"
                title={language === 'ar' ? 'نسخ الذكر' : 'Copy'}
              >
                <Copy className="w-4 h-4" />
                <span>{language === 'ar' ? 'نسخ' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Main Athkar Arabic Text */}
          <p
            className={`leading-relaxed text-right font-${fontFamily} mb-6 ${
              fontSize === 'sm'
                ? 'text-lg'
                : fontSize === 'md'
                ? 'text-xl md:text-2xl'
                : fontSize === 'lg'
                ? 'text-2xl md:text-3xl'
                : fontSize === 'xl'
                ? 'text-3xl md:text-4xl'
                : 'text-4xl md:text-5xl'
            } ${isDone ? 'opacity-80' : ''}`}
          >
            {selectedItem.textAr}
          </p>

          {/* Transliteration & English */}
          <AnimatePresence>
            {(showTransliteration[selectedItem.id] || language === 'en') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 pb-4 border-b border-white/10 space-y-2 text-sm opacity-80"
              >
                {selectedItem.transliteration && (
                  <p className="italic font-sans text-teal-300/90">{selectedItem.transliteration}</p>
                )}
                <p className="font-sans text-slate-300">{selectedItem.textEn}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Virtues & Reference Banner */}
          {(selectedItem.fadlAr || selectedItem.referenceAr) && (
            <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-sm font-cairo">
              {selectedItem.fadlAr && (
                <span className="text-amber-400">
                  <strong>{language === 'ar' ? 'الفضل:' : 'Virtue:'}</strong>{' '}
                  {language === 'ar' ? selectedItem.fadlAr : selectedItem.fadlEn}
                </span>
              )}
              {selectedItem.referenceAr && (
                <span className="opacity-60 text-slate-300 whitespace-nowrap">
                  {language === 'ar' ? selectedItem.referenceAr : selectedItem.referenceEn}
                </span>
              )}
            </div>
          )}

          {/* Bottom Interactive Circular Count Trigger */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-cairo opacity-70">
                {language === 'ar' ? 'المتبقي:' : 'Remaining:'}
              </span>
              <span className="text-lg font-mono font-bold text-emerald-400">
                {remaining}/{selectedItem.count}
              </span>
            </div>

            {/* Glass Interactive Count Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleItemCount(selectedItem.id, selectedItem.count)}
              className={`relative z-10 px-8 py-4 rounded-2xl border flex items-center justify-center gap-3 font-cairo font-bold transition-all shadow-lg cursor-pointer ${
                isDone
                  ? 'border-emerald-500 bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                  : 'border-emerald-500/40 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 shadow-emerald-950/40'
              }`}
            >
              {isDone ? (
                <>
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="text-base">{language === 'ar' ? 'تم بحمد الله' : 'Completed'}</span>
                </>
              ) : (
                <>
                  <span className="w-10 h-10 rounded-full bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center font-mono text-lg font-bold">
                    {currentCount}
                  </span>
                  <span className="text-base">
                    {language === 'ar' ? 'اضغط للذكر' : 'Tap to Count'}
                  </span>
                </>
              )}
            </motion.button>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between gap-4">
            {prevItem ? (
              <button
                onClick={() => setSelectedAthkarId(prevItem.id)}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-emerald-300 text-sm font-cairo font-bold transition-all"
              >
                {language === 'ar' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                <span>{language === 'ar' ? 'السابق' : 'Previous'}</span>
              </button>
            ) : (
              <div />
            )}

            {nextItem ? (
              <button
                onClick={() => setSelectedAthkarId(nextItem.id)}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-sm font-cairo font-bold transition-all"
              >
                <span>{language === 'ar' ? 'التالي' : 'Next'}</span>
                {language === 'ar' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
            ) : (
              <div />
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24">
      {/* Category Tabs Carousel */}
      <div className="relative z-10 flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {ATHKAR_CATEGORIES.map((cat) => {
          const isSelected = activeCategory.id === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedAthkarCategoryId(cat.id)}
              className={`relative z-10 px-4 py-3 rounded-2xl border transition-all flex items-center gap-2.5 shrink-0 cursor-pointer ${
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
        className={`relative z-10 p-6 rounded-3xl border backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 ${
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

      {/* Athkar Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeCategory.items.map((item, idx) => {
          const currentCount = counts[item.id] || 0;
          const isDone = currentCount >= item.count;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedAthkarId(item.id)}
              className={`relative z-10 p-5 rounded-3xl border backdrop-blur-xl shadow-lg transition-all cursor-pointer group ${
                isDone
                  ? 'border-emerald-500/40 bg-emerald-500/10'
                  : theme === 'light'
                  ? 'bg-white/85 border-slate-200 text-slate-800 hover:border-emerald-400/60'
                  : theme === 'sepia'
                  ? 'bg-[#291c14]/85 border-amber-800/40 text-amber-50 hover:border-amber-500/60'
                  : 'bg-slate-900/80 border-slate-800/80 text-slate-100 hover:border-emerald-500/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    #{idx + 1}
                  </span>
                  {isDone && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                </div>
                <span className="text-xs font-cairo opacity-60">
                  {currentCount}/{item.count}
                </span>
              </div>

              <p
                className={`leading-relaxed text-right font-${fontFamily} mb-3 line-clamp-3 ${
                  fontSize === 'sm'
                    ? 'text-sm'
                    : fontSize === 'md'
                    ? 'text-base'
                    : fontSize === 'lg'
                    ? 'text-lg'
                    : fontSize === 'xl'
                    ? 'text-xl'
                    : 'text-2xl'
                }`}
              >
                {item.textAr}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <span className="text-xs font-cairo opacity-60">
                  {language === 'ar' ? 'اضغط للتفاصيل' : 'Tap for details'}
                </span>
                <div className="flex items-center gap-1 text-emerald-400 group-hover:translate-x-[-4px] transition-transform">
                  <span className="text-xs font-cairo font-bold">
                    {language === 'ar' ? 'افتح' : 'Open'}
                  </span>
                  {language === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
