import React from 'react';
import { useApp } from '../context/AppContext';
import { ATHKAR_CATEGORIES } from '../data/athkarData';
import { BOOKS_DATA } from '../data/booksData';
import { CITIES_PRAYERS, getFormattedHijriDate } from '../data/prayerData';
import { DailyInspirationCard } from './DailyInspirationCard';
import {
  Sun,
  Moon,
  Sparkles,
  BookOpen,
  CircleDot,
  Clock,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  BedDouble,
  Layers,
  Compass
} from 'lucide-react';
import { GlassButton } from './GlassButton';
import { motion } from 'motion/react';
import { soundEngine, triggerHaptic } from '../utils/audio';

export const HomeView: React.FC = () => {
  const {
    language,
    theme,
    setActiveTab,
    setSelectedAthkarCategoryId,
    setSelectedBook,
    setSelectedChapter,
    totalDhikrCount,
    incrementGlobalDhikr,
    soundEnabled,
    vibrationEnabled
  } = useApp();

  const hijriDate = getFormattedHijriDate(language);
  const featuredBook = BOOKS_DATA[0]; // Forty Nawawi
  const makkahPrayer = CITIES_PRAYERS[0];

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) {
      return language === 'ar' ? 'صباح السكينة والطمأنينة ☀️' : 'Good Morning & Peace ☀️';
    } else if (hours < 18) {
      return language === 'ar' ? 'مساء النور والبركة 🌤️' : 'Good Afternoon & Blessings 🌤️';
    } else {
      return language === 'ar' ? 'مساء السكينة والذكر 🌙' : 'Peaceful Evening 🌙';
    }
  };

  const handleQuickDhikrTap = () => {
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(18);
    incrementGlobalDhikr();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 sm:space-y-6 pb-24">
      {/* Hero Welcome Glass Card */}
      <div
        className={`relative overflow-hidden p-5 sm:p-7 md:p-8 rounded-3xl border backdrop-blur-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 ${
          theme === 'light'
            ? 'bg-gradient-to-br from-white/90 via-emerald-50/50 to-teal-50/70 border-emerald-200/60 text-slate-800'
            : theme === 'sepia'
            ? 'bg-gradient-to-br from-[#332319]/90 via-[#271a12]/80 to-[#1e130c]/90 border-amber-800/40 text-amber-50'
            : 'bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-emerald-950/40 border-emerald-500/20 text-slate-100'
        }`}
      >
        <div className="space-y-2 text-center md:text-right">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-cairo font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{hijriDate}</span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-cairo tracking-tight pt-1">
            {getGreeting()}
          </h1>

          <p className="text-xs opacity-75 font-cairo max-w-md">
            {language === 'ar'
              ? 'مرحباً بك في سَكِينَة. واحتك اليومية لتلاوة القرآن الكريم، الأذكار المستقلة، ومدارسة أمهات الكتب.'
              : 'Welcome to Sakīnah. Your tranquil haven for Quran recitations, comprehensive Athkar and Islamic library.'}
          </p>
        </div>

        {/* Quick Digital Subha Mini Widget */}
        <div className="w-full md:w-auto flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <span className="text-[10px] font-bold font-cairo text-emerald-400 mb-1">
            {language === 'ar' ? 'تسبيح سريع 📿' : 'Quick Tasbih 📿'}
          </span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleQuickDhikrTap}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 flex flex-col items-center justify-center cursor-pointer shadow-lg shadow-emerald-950/40"
          >
            <span className="text-lg sm:text-xl font-extrabold font-mono">{totalDhikrCount}</span>
            <span className="text-[8px] font-cairo opacity-75">{language === 'ar' ? 'اضغط' : 'Tap'}</span>
          </motion.button>
          <button
            onClick={() => setActiveTab('tasbih')}
            className="text-[10px] text-amber-300/80 hover:text-amber-300 font-cairo mt-2 underline cursor-pointer"
          >
            {language === 'ar' ? 'فتح السُّبحة الكاملة' : 'Open Full Tasbih'}
          </button>
        </div>
      </div>

      {/* Primary Feature Quick Navigation Hub */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <button
          onClick={() => setActiveTab('quran')}
          className="p-3.5 sm:p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/30 hover:bg-emerald-900/40 text-slate-100 transition-all flex items-center gap-3 cursor-pointer group text-right"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
            <BookOpen className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-xs font-bold font-cairo block text-emerald-300">
              {language === 'ar' ? 'المصحف الشريف' : 'Holy Quran'}
            </span>
            <span className="text-[10px] text-slate-400">
              {language === 'ar' ? '١١٤ سورة وتلاوات' : '114 Surahs & Audio'}
            </span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('index')}
          className="p-3.5 sm:p-4 rounded-2xl border border-teal-500/30 bg-teal-950/30 hover:bg-teal-900/40 text-slate-100 transition-all flex items-center gap-3 cursor-pointer group text-right"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-300 group-hover:scale-105 transition-transform shrink-0">
            <Layers className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-xs font-bold font-cairo block text-teal-300">
              {language === 'ar' ? 'الفهرس الشامل' : 'Master Index'}
            </span>
            <span className="text-[10px] text-slate-400">
              {language === 'ar' ? 'بحث وتصفح مبوب' : 'Categorized TOC'}
            </span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className="p-3.5 sm:p-4 rounded-2xl border border-amber-500/30 bg-amber-950/30 hover:bg-amber-900/40 text-slate-100 transition-all flex items-center gap-3 cursor-pointer group text-right"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shrink-0">
            <Compass className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-xs font-bold font-cairo block text-amber-300">
              {language === 'ar' ? 'المكتبة والحديث' : 'Islamic Library'}
            </span>
            <span className="text-[10px] text-slate-400">
              {language === 'ar' ? 'أمهات الكتب' : 'Hadith Books'}
            </span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('prayers')}
          className="p-3.5 sm:p-4 rounded-2xl border border-sky-500/30 bg-sky-950/30 hover:bg-sky-900/40 text-slate-100 transition-all flex items-center gap-3 cursor-pointer group text-right"
        >
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform shrink-0">
            <Clock className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-xs font-bold font-cairo block text-sky-300">
              {language === 'ar' ? 'مواقيت الصلاة' : 'Prayer Times'}
            </span>
            <span className="text-[10px] text-slate-400">
              {language === 'ar' ? 'القبلة والأذان' : 'Qibla & Adhan'}
            </span>
          </div>
        </button>
      </div>

      {/* Daily Quran & Tadabbur Inspiration */}
      <DailyInspirationCard />

      {/* Athkar Quick Category Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm sm:text-base font-bold font-cairo flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{language === 'ar' ? 'الأذكار والأدعية اليومية' : 'Daily Athkar & Fortifications'}</span>
          </h2>

          <button
            onClick={() => setActiveTab('athkar')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-cairo font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>{language === 'ar' ? 'عرض الكل' : 'View All'}</span>
            {language === 'ar' ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {ATHKAR_CATEGORIES.slice(0, 4).map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -3 }}
              onClick={() => {
                setSelectedAthkarCategoryId(cat.id);
                setActiveTab('athkar');
              }}
              className={`p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border backdrop-blur-xl shadow-md transition-all cursor-pointer flex flex-col justify-between group ${
                theme === 'light'
                  ? 'bg-white/80 border-slate-200 text-slate-800 hover:border-emerald-400'
                  : theme === 'sepia'
                  ? 'bg-[#291c14]/80 border-amber-800/40 text-amber-50 hover:border-amber-500'
                  : 'bg-slate-900/80 border-slate-800 text-slate-100 hover:border-emerald-500/40'
              }`}
            >
              <div className="p-2 sm:p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-400 w-fit mb-2.5 sm:mb-3 group-hover:scale-110 transition-transform">
                {cat.id === 'morning' ? (
                  <Sun className="w-4.5 h-4.5" />
                ) : cat.id === 'evening' ? (
                  <Moon className="w-4.5 h-4.5" />
                ) : cat.id === 'sleep' ? (
                  <BedDouble className="w-4.5 h-4.5" />
                ) : (
                  <ShieldCheck className="w-4.5 h-4.5" />
                )}
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-bold font-cairo group-hover:text-emerald-300 transition-colors">
                  {language === 'ar' ? cat.titleAr : cat.titleEn}
                </h3>
                <p className="text-[10px] opacity-60 font-cairo mt-0.5">
                  {cat.items.length} {language === 'ar' ? 'أذكار مشكّلة' : 'invocations'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Featured Book Spotlight */}
      <div
        className={`p-5 sm:p-6 rounded-3xl border backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 ${
          theme === 'light'
            ? 'bg-white/80 border-slate-200 text-slate-800'
            : theme === 'sepia'
            ? 'bg-[#2b1f17]/80 border-amber-800/40 text-amber-50'
            : 'bg-slate-900/80 border-slate-800 text-slate-100'
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold font-cairo text-amber-400 uppercase">
              {language === 'ar' ? 'كتاب مختار للقراءة' : 'Featured Book'}
            </span>
            <h3 className="text-base sm:text-lg font-bold font-cairo mt-0.5">
              {language === 'ar' ? featuredBook.titleAr : featuredBook.titleEn}
            </h3>
            <p className="text-xs opacity-70 font-cairo">{featuredBook.authorAr}</p>
            <p className="text-xs opacity-85 font-cairo mt-1.5 line-clamp-2 max-w-lg">
              {language === 'ar' ? featuredBook.descriptionAr : featuredBook.descriptionEn}
            </p>
          </div>
        </div>

        <GlassButton
          variant="primary"
          size="md"
          onClick={() => {
            setSelectedBook(featuredBook);
            setSelectedChapter(featuredBook.chapters[0]);
            setActiveTab('library');
          }}
          className="shrink-0 w-full md:w-auto text-xs"
        >
          <BookOpen className="w-4 h-4" />
          <span>{language === 'ar' ? 'قراءة الكتاب' : 'Read Now'}</span>
        </GlassButton>
      </div>

      {/* Next Prayer Preview Shortcut */}
      <div
        onClick={() => setActiveTab('prayers')}
        className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-white/10 hover:border-emerald-500/40 bg-white/5 backdrop-blur-xl flex items-center justify-between gap-3 cursor-pointer transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Clock className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-cairo text-emerald-400">
              {language === 'ar' ? 'مواقيت الصلاة اليوم' : 'Today’s Prayer Times'}
            </h4>
            <p className="text-[11px] sm:text-xs font-cairo opacity-80 mt-0.5">
              {language === 'ar'
                ? `الفجر ${makkahPrayer.fajr} • الظهر ${makkahPrayer.dhuhr} • العصر ${makkahPrayer.asr} • المغرب ${makkahPrayer.maghrib} • العشاء ${makkahPrayer.isha}`
                : `Fajr ${makkahPrayer.fajr} • Dhuhr ${makkahPrayer.dhuhr} • Asr ${makkahPrayer.asr} • Maghrib ${makkahPrayer.maghrib} • Isha ${makkahPrayer.isha}`}
            </p>
          </div>
        </div>

        <div className="p-1.5 rounded-xl bg-white/5 text-slate-400 shrink-0">
          {language === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </div>
      </div>
    </div>
  );
};
