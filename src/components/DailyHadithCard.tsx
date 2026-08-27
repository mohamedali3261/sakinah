import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DAILY_HADITHS_COLLECTION, getTodayHadith, DailyHadith } from '../data/dailyHadithData';
import {
  BookOpen,
  Sparkles,
  Copy,
  Check,
  Share2,
  Bookmark,
  RefreshCw,
  Award,
  ChevronLeft,
  ChevronRight,
  HeartHandshake
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine, triggerHaptic } from '../utils/audio';

export const DailyHadithCard: React.FC = () => {
  const { language, theme, fontFamily, fontSize, addBookmark, isBookmarked, showToast, soundEnabled, vibrationEnabled } = useApp();
  
  const [currentHadithIndex, setCurrentHadithIndex] = useState<number>(() => {
    const today = getTodayHadith();
    const idx = DAILY_HADITHS_COLLECTION.findIndex(h => h.id === today.id);
    return idx !== -1 ? idx : 0;
  });

  const [copied, setCopied] = useState(false);
  const [isExplanationOpen, setIsExplanationOpen] = useState(true);

  const hadith = DAILY_HADITHS_COLLECTION[currentHadithIndex];

  const handleNextHadith = () => {
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(10);
    setCurrentHadithIndex((prev) => (prev + 1) % DAILY_HADITHS_COLLECTION.length);
  };

  const handlePrevHadith = () => {
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(10);
    setCurrentHadithIndex((prev) => (prev - 1 + DAILY_HADITHS_COLLECTION.length) % DAILY_HADITHS_COLLECTION.length);
  };

  const handleCopy = () => {
    if (soundEnabled) soundEngine.playClick();
    const textToCopy = `💫 حديث شريف:\n${hadith.textAr}\n\n📖 التخريج: ${hadith.sourceAr}\n\n💡 التطبيق العملي:\n${hadith.practicalActionAr}\n\nمن تطبيق يَقِين 🕊️`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    showToast(
      language === 'ar' ? 'تم نسخ الحديث الشريف' : 'Hadith Copied to Clipboard',
      language === 'ar' ? 'يمكنك مشاركة هذا النور النبوي مع أحبابك لنيل الأجر.' : 'You can share this prophetic light with your loved ones.'
    );
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmark = () => {
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(15);
    addBookmark({
      type: 'hadith',
      titleAr: `حديث: ${hadith.topicAr}`,
      titleEn: `Hadith: ${hadith.topicEn}`,
      snippetAr: hadith.textAr.slice(0, 120) + '...',
      snippetEn: hadith.textEn.slice(0, 120) + '...',
      targetId: hadith.id
    });
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-5 sm:p-7 border backdrop-blur-2xl shadow-xl transition-all ${
        theme === 'light'
          ? 'bg-gradient-to-br from-amber-50/90 via-white/80 to-emerald-50/70 border-amber-200/70 text-slate-800'
          : theme === 'sepia'
          ? 'bg-gradient-to-br from-[#38261a]/95 via-[#2b1d14]/85 to-[#1c120c]/95 border-amber-800/40 text-amber-50'
          : 'bg-gradient-to-br from-[#1c150c]/90 via-slate-900/90 to-[#06201a]/80 border-amber-500/30 text-slate-100'
      }`}
    >
      {/* Decorative ambient corner glow */}
      <div className="absolute top-0 right-0 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold font-cairo text-amber-400 tracking-wide">
                {language === 'ar' ? 'حديث اليوم الشريف 📜' : 'Hadith of the Day'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                {language === 'ar' ? 'صحيح ومحقق' : 'Verified Sahih'}
              </span>
            </div>
            <span className="text-[10px] opacity-75 font-cairo block">
              {language === 'ar' ? hadith.topicAr : hadith.topicEn}
            </span>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-1.5">
          {/* Change Hadith / Navigation */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-0.5">
            <button
              onClick={handlePrevHadith}
              title={language === 'ar' ? 'الحديث السابق' : 'Previous Hadith'}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
            >
              {language === 'ar' ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>
            <span className="text-[10px] font-mono px-1.5 text-slate-400">
              {currentHadithIndex + 1}/{DAILY_HADITHS_COLLECTION.length}
            </span>
            <button
              onClick={handleNextHadith}
              title={language === 'ar' ? 'الحديث التالي' : 'Next Hadith'}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
            >
              {language === 'ar' ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button
            onClick={handleBookmark}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
            title={language === 'ar' ? 'حفظ في المفضلة' : 'Bookmark Hadith'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked(hadith.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>

          <button
            onClick={handleCopy}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
            title={language === 'ar' ? 'نسخ الحديث والشرح' : 'Copy'}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Hadith Text Box */}
      <AnimatePresence mode="wait">
        <motion.div
          key={hadith.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 space-y-4"
        >
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <p
              dir="rtl"
              className={`text-right font-bold text-amber-200 leading-loose ${
                fontFamily === 'scheherazade'
                  ? 'font-scheherazade text-xl sm:text-2xl'
                  : fontFamily === 'amiri'
                  ? 'font-amiri text-lg sm:text-xl'
                  : 'font-cairo text-base sm:text-lg'
              }`}
            >
              {hadith.textAr}
            </p>

            {/* Narrator & Source Footnote */}
            <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-cairo">
              <span className="text-slate-400">
                <strong className="text-slate-300">{language === 'ar' ? 'التخريج: ' : 'Source: '}</strong>
                {language === 'ar' ? hadith.sourceAr : hadith.sourceEn}
              </span>
              <span className="text-emerald-400 font-medium">
                {language === 'ar' ? hadith.authenticityAr : hadith.authenticityEn}
              </span>
            </div>
          </div>

          {/* Practical Application & Spiritual Action */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 border border-emerald-500/30 backdrop-blur-md">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0 mt-0.5">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-extrabold font-cairo text-emerald-300 block">
                  {language === 'ar' ? 'التطبيق والعمل بالحديث في واقع الحياة' : 'Practical Daily Application'}
                </span>
                <p className="text-xs sm:text-sm font-cairo leading-relaxed opacity-95 text-slate-200">
                  {language === 'ar' ? hadith.practicalActionAr : hadith.practicalActionEn}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Explanation / Tafseer Drawer Toggle */}
          <div className="pt-1">
            <button
              onClick={() => setIsExplanationOpen(!isExplanationOpen)}
              className="text-xs font-bold font-cairo text-amber-400/90 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>{isExplanationOpen ? (language === 'ar' ? 'إخفاء الشرح والمعنى الإجمالي' : 'Hide Explanation') : (language === 'ar' ? 'عرض الشرح والمعنى الإجمالي' : 'Show Explanation')}</span>
              <span className="text-[10px]">{isExplanationOpen ? '▲' : '▼'}</span>
            </button>

            {isExplanationOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2.5 p-3.5 rounded-2xl bg-black/20 border border-white/5 text-xs sm:text-sm font-cairo leading-relaxed text-slate-300"
              >
                <p>{language === 'ar' ? hadith.explanationAr : hadith.explanationEn}</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
