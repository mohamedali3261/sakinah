import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { calculateAstronomicalPrayers, fetchLivePrayerTimes } from '../utils/prayerCalculator';
import { ATHKAR_CATEGORIES } from '../data/athkarData';
import { BOOKS_DATA } from '../data/booksData';
import { CITIES_PRAYERS, getFormattedHijriDate } from '../data/prayerData';
import { getNextUpcomingFasting } from '../data/fastingData';
import { DailyInspirationCard } from './DailyInspirationCard';
import { DailyHadithCard } from './DailyHadithCard';
import { IslamicQuizModal } from './IslamicQuizModal';
import { FastingTrackerModal } from './FastingTrackerModal';
import { SalawatWelcomeBanner } from './SalawatWelcomeBanner';
import {
  Sun,
  Moon,
  Sparkles,
  BookOpen,
  Sliders,
  CircleDot,
  Clock,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  BedDouble,
  Layers,
  Compass,
  Trophy,
  Calendar,
  HelpCircle,
  Search,
  Sunrise,
  CloudSun,
  Sunset,
  Radio
} from 'lucide-react';
import { GlassButton } from './GlassButton';
import { motion } from 'motion/react';
import { soundEngine, triggerHaptic } from '../utils/audio';
import { CityPrayer } from '../types';

export const HomeView: React.FC = () => {
  const {
    language,
    theme,
    setActiveTab,
    setSelectedAthkarCategoryId,
    setSelectedBook,
    setSelectedChapter,
    soundEnabled,
    vibrationEnabled,
    setIsSearchOpen,
    setIsRepeatPageOpen
  } = useApp();

  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isFastingModalOpen, setIsFastingModalOpen] = useState(false);

  const hijriDate = getFormattedHijriDate(language);
  const featuredBook = BOOKS_DATA[0]; // Forty Nawawi
  const makkahPrayer = CITIES_PRAYERS[0];
  const nextFasting = getNextUpcomingFasting();

  // Selected City with fallback coordinates for the compact prayer times bar
  const [city] = useState<CityPrayer>(() => {
    const saved = localStorage.getItem('sakinah_prayer_city');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const match = CITIES_PRAYERS.find((c) => c.cityEn === parsed.cityEn);
        if (match) return match;
        return parsed; // Fallback to custom/GPS parsed city!
      } catch {}
    }
    return CITIES_PRAYERS[0]; // Cairo default
  });

  const [isSummerTime] = useState<boolean>(() => {
    const saved = localStorage.getItem('sakinah_prayer_dst');
    return saved ? JSON.parse(saved) : true; // Default to true (Summer Time) as requested
  });

  const [selectedMethodId] = useState<string>(() => {
    return localStorage.getItem('sakinah_prayer_method') || 'egypt';
  });

  const [asrMethod] = useState<'standard' | 'hanafi'>(() => {
    return (localStorage.getItem('sakinah_prayer_asr_method') as any) || 'standard';
  });

  const [minuteOffsets] = useState<{ [key: string]: number }>(() => {
    try {
      const saved = localStorage.getItem('sakinah_prayer_offsets');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            fajr: typeof parsed.fajr === 'number' ? parsed.fajr : 0,
            sunrise: typeof parsed.sunrise === 'number' ? parsed.sunrise : 0,
            dhuhr: typeof parsed.dhuhr === 'number' ? parsed.dhuhr : 0,
            asr: typeof parsed.asr === 'number' ? parsed.asr : 0,
            maghrib: typeof parsed.maghrib === 'number' ? parsed.maghrib : 0,
            isha: typeof parsed.isha === 'number' ? parsed.isha : 0
          };
        }
      }
    } catch {}
    return { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 };
  });

  const [computedTimes, setComputedTimes] = useState<{
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  }>(() => {
    const lat = city.latitude || 30.0444;
    const lng = city.longitude || 31.2357;
    return calculateAstronomicalPrayers(lat, lng, new Date(), selectedMethodId, asrMethod);
  });

  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const lat = city.latitude || 30.0444;
    const lng = city.longitude || 31.2357;
    const calculated = calculateAstronomicalPrayers(lat, lng, new Date(), selectedMethodId, asrMethod);
    setComputedTimes(calculated);

    fetchLivePrayerTimes(city.cityEn, city.countryEn || '', selectedMethodId, lat, lng)
      .then((live) => {
        if (live) {
          setComputedTimes((prev) => ({
            ...prev,
            fajr: live.fajr || prev.fajr,
            sunrise: live.sunrise || prev.sunrise,
            dhuhr: live.dhuhr || prev.dhuhr,
            asr: asrMethod === 'hanafi' ? prev.asr : live.asr || prev.asr,
            maghrib: live.maghrib || prev.maghrib,
            isha: live.isha || prev.isha
          }));
        }
      })
      .catch(() => {});
  }, [city, selectedMethodId, asrMethod]);

  const adjustTimeString = (timeStr: string, hourAdd: number, minAdd: number): string => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    let totalMinutes = h * 60 + m + hourAdd * 60 + minAdd;
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    totalMinutes = totalMinutes % (24 * 60);
    const newH = Math.floor(totalMinutes / 60);
    const newM = totalMinutes % 60;
    return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
  };

  const formatTime12h = (time24: string): string => {
    if (!time24) return '';
    const parts = time24.split(':');
    let h = parseInt(parts[0], 10);
    const m = parts[1] || '00';
    const isPM = h >= 12;
    h = h % 12;
    if (h === 0) h = 12;
    const period = language === 'ar' ? (isPM ? 'م' : 'ص') : (isPM ? 'PM' : 'AM');
    return `${String(h).padStart(2, '0')}:${m} ${period}`;
  };

  const dstHour = isSummerTime ? 1 : 0;

  const rawPrayers = [
    {
      key: 'fajr',
      nameAr: 'الفجر',
      nameEn: 'Fajr',
      rawTime: computedTimes.fajr,
      time: adjustTimeString(computedTimes.fajr, dstHour, minuteOffsets.fajr || 0),
      icon: <Sunrise className="w-4 h-4 text-sky-400" />
    },
    {
      key: 'sunrise',
      nameAr: 'الشروق',
      nameEn: 'Sunrise',
      rawTime: computedTimes.sunrise,
      time: adjustTimeString(computedTimes.sunrise, dstHour, minuteOffsets.sunrise || 0),
      icon: <Sun className="w-4 h-4 text-amber-300" />
    },
    {
      key: 'dhuhr',
      nameAr: 'الظهر',
      nameEn: 'Dhuhr',
      rawTime: computedTimes.dhuhr,
      time: adjustTimeString(computedTimes.dhuhr, dstHour, minuteOffsets.dhuhr || 0),
      icon: <Sun className="w-4 h-4 text-amber-400" />
    },
    {
      key: 'asr',
      nameAr: 'العصر',
      nameEn: 'Asr',
      rawTime: computedTimes.asr,
      time: adjustTimeString(computedTimes.asr, dstHour, minuteOffsets.asr || 0),
      icon: <CloudSun className="w-4 h-4 text-emerald-400" />
    },
    {
      key: 'maghrib',
      nameAr: 'المغرب',
      nameEn: 'Maghrib',
      rawTime: computedTimes.maghrib,
      time: adjustTimeString(computedTimes.maghrib, dstHour, minuteOffsets.maghrib || 0),
      icon: <Sunset className="w-4 h-4 text-orange-400" />
    },
    {
      key: 'isha',
      nameAr: 'العشاء',
      nameEn: 'Isha',
      rawTime: computedTimes.isha,
      time: adjustTimeString(computedTimes.isha, dstHour, minuteOffsets.isha || 0),
      icon: <Moon className="w-4 h-4 text-indigo-400" />
    }
  ];

  const getNextPrayer = () => {
    const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const nowSeconds = currentTime.getSeconds();

    for (const p of rawPrayers) {
      if (p.key === 'sunrise') continue;
      const [h, m] = p.time.split(':').map(Number);
      const prayerMinutes = h * 60 + m;
      if (prayerMinutes > nowMinutes || (prayerMinutes === nowMinutes && nowSeconds === 0)) {
        const diffSecs = (prayerMinutes - nowMinutes) * 60 - nowSeconds;
        const hoursLeft = Math.floor(diffSecs / 3600);
        const minsLeft = Math.floor((diffSecs % 3600) / 60);
        const secsLeft = diffSecs % 60;
        return { prayer: p, hoursLeft, minsLeft, secsLeft, totalMinutes: prayerMinutes - nowMinutes };
      }
    }

    // Wrap to Next Day's Fajr
    const [fajrH, fajrM] = rawPrayers[0].time.split(':').map(Number);
    const diffSecs = (24 * 60 - nowMinutes + (fajrH * 60 + fajrM)) * 60 - nowSeconds;
    const hoursLeft = Math.floor(diffSecs / 3600);
    const minsLeft = Math.floor((diffSecs % 3600) / 60);
    const secsLeft = diffSecs % 60;
    return { prayer: rawPrayers[0], hoursLeft, minsLeft, secsLeft, totalMinutes: 180 };
  };

  const nextInfo = getNextPrayer();

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) {
      return language === 'ar' ? 'صباح اليقين والطمأنينة ☀️' : 'Good Morning & Peace ☀️';
    } else if (hours < 18) {
      return language === 'ar' ? 'مساء النور والبركة 🌤️' : 'Good Afternoon & Blessings 🌤️';
    } else {
      return language === 'ar' ? 'مساء اليقين والذكر 🌙' : 'Peaceful Evening 🌙';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 sm:space-y-6 pb-24 relative z-10">
      {/* Hero Welcome Glass Card */}
      <div
        className={`relative overflow-hidden p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl border backdrop-blur-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 ${
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
              ? 'مرحباً بك في يَقِين. واحتك اليومية لتلاوة القرآن الكريم، الأذكار المستقلة، ومدارسة أمهات الكتب.'
              : 'Welcome to Yaqeen. Your tranquil haven for Quran recitations, comprehensive Athkar and Islamic library.'}
          </p>
        </div>
      </div>

      {/* Dynamic Compact Prayer Times Row */}
      <div 
        onClick={() => {
          if (soundEnabled) soundEngine.playClick();
          setActiveTab('prayers');
        }}
        className={`p-3 sm:p-4 rounded-2xl sm:rounded-2xl sm:rounded-3xl border backdrop-blur-xl transition-all cursor-pointer hover:border-emerald-500/40 relative overflow-hidden group shadow-md ${
          theme === 'light'
            ? 'bg-white/80 border-slate-200'
            : theme === 'sepia'
            ? 'bg-[#2b1f17]/80 border-amber-800/40 text-amber-50'
            : 'bg-slate-900/80 border-slate-800/80 text-slate-100'
        }`}
      >
        <div className="flex flex-col items-center justify-center text-center mb-3 sm:mb-4 px-1 gap-1.5">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            <Clock className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-400" />
            <h3 className="text-xs sm:text-sm font-bold font-cairo">
              {language === 'ar' ? `مواقيت الصلاة (${city.cityAr})` : `Prayer Times (${city.cityEn})`}
            </h3>
          </div>
          <span className="text-[9px] sm:text-[10px] text-emerald-400/80 font-bold font-cairo flex items-center justify-center gap-1 group-hover:underline group-hover:text-emerald-500 transition-colors">
            <span>{language === 'ar' ? 'عرض التفاصيل' : 'View Details'}</span>
            {language === 'ar' ? <ChevronLeft className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
          </span>
        </div>

        {/* Premium Countdown to Next Prayer Row */}
        <div className={`relative overflow-hidden mb-3 sm:mb-5 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border flex flex-col items-center justify-center text-center gap-4 sm:gap-5 transition-all ${
          theme === 'light'
            ? 'bg-gradient-to-br from-emerald-50/70 via-emerald-50/40 to-teal-50/50 border-emerald-200/50'
            : theme === 'sepia'
            ? 'bg-gradient-to-br from-[#1e130c]/50 to-[#271910]/40 border-amber-900/30'
            : 'bg-gradient-to-br from-emerald-950/20 via-slate-900/40 to-emerald-950/15 border-emerald-500/10'
        }`}>
          {/* Subtle background ambient glow for the upcoming prayer */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col items-center justify-center z-10 w-full">
            <div className="flex items-center justify-center gap-1.5 mb-1.5">
              {React.cloneElement(nextInfo.prayer.icon, { className: "w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 animate-pulse" })}
              <span className={`text-[10px] sm:text-xs uppercase font-bold font-cairo tracking-wider ${
                theme === 'light' ? 'text-slate-500' : 'text-slate-400'
              }`}>
                {language === 'ar' ? 'الصلاة القادمة' : 'Next Prayer'}
              </span>
            </div>
            
            <span className={`text-xl sm:text-2xl font-extrabold font-cairo block mb-1 ${
              theme === 'light' ? 'text-emerald-950' : theme === 'sepia' ? 'text-amber-100' : 'text-emerald-300'
            }`}>
              {language === 'ar' ? nextInfo.prayer.nameAr : nextInfo.prayer.nameEn}
            </span>
            <span className={`text-[9px] sm:text-[10px] block font-cairo font-medium mb-3 sm:mb-4 ${
                theme === 'light' ? 'text-slate-500' : 'text-slate-400'
              }`}>
              {language === 'ar' ? 'الوقت المتبقي للأذان' : 'Time remaining'}
            </span>

            {/* Separated Digital Time Boxes - Centered */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2">
              {/* Hours Box */}
              <div className={`flex flex-col items-center justify-center w-10 h-11 sm:w-12 sm:h-14 rounded-lg sm:rounded-xl border shadow-sm ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-950/80 border-white/5'
              }`}>
                <span className={`text-sm sm:text-lg font-extrabold font-mono tracking-tight ${
                  theme === 'light' ? 'text-slate-800' : 'text-emerald-400'
                }`}>
                  {String(nextInfo.hoursLeft).padStart(2, '0')}
                </span>
                <span className="text-[7px] sm:text-[9px] font-cairo opacity-60 sm:-mt-1 font-bold">
                  {language === 'ar' ? 'س' : 'H'}
                </span>
              </div>

              <span className="text-emerald-400/70 font-extrabold text-sm sm:text-base">:</span>

              {/* Minutes Box */}
              <div className={`flex flex-col items-center justify-center w-10 h-11 sm:w-12 sm:h-14 rounded-lg sm:rounded-xl border shadow-sm ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-950/80 border-white/5'
              }`}>
                <span className={`text-sm sm:text-lg font-extrabold font-mono tracking-tight ${
                  theme === 'light' ? 'text-slate-800' : 'text-emerald-400'
                }`}>
                  {String(nextInfo.minsLeft).padStart(2, '0')}
                </span>
                <span className="text-[7px] sm:text-[9px] font-cairo opacity-60 sm:-mt-1 font-bold">
                  {language === 'ar' ? 'د' : 'M'}
                </span>
              </div>

              <span className="text-emerald-400/70 font-extrabold text-sm sm:text-base">:</span>

              {/* Seconds Box */}
              <div className={`flex flex-col items-center justify-center w-10 h-11 sm:w-12 sm:h-14 rounded-lg sm:rounded-xl border shadow-sm bg-gradient-to-b ${
                theme === 'light' 
                  ? 'from-white to-emerald-50/30 border-slate-200' 
                  : 'from-slate-950/80 to-emerald-950/20 border-emerald-500/20'
              }`}>
                <span className={`text-sm sm:text-lg font-extrabold font-mono tracking-tight ${
                  theme === 'light' ? 'text-emerald-600' : 'text-emerald-300'
                }`}>
                  {String(nextInfo.secsLeft).padStart(2, '0')}
                </span>
                <span className="text-[7px] sm:text-[9px] font-cairo opacity-60 sm:-mt-1 font-bold">
                  {language === 'ar' ? 'ث' : 'S'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5">
          {[
            { key: 'fajr', nameAr: 'الفجر', nameEn: 'Fajr', raw: computedTimes.fajr, icon: <Sunrise className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" /> },
            { key: 'dhuhr', nameAr: 'الظهر', nameEn: 'Dhuhr', raw: computedTimes.dhuhr, icon: <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> },
            { key: 'asr', nameAr: 'العصر', nameEn: 'Asr', raw: computedTimes.asr, icon: <CloudSun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" /> },
            { key: 'maghrib', nameAr: 'المغرب', nameEn: 'Maghrib', raw: computedTimes.maghrib, icon: <Sunset className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" /> },
            { key: 'isha', nameAr: 'العشاء', nameEn: 'Isha', raw: computedTimes.isha, icon: <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" /> },
          ].map((pr, index) => {
            const adjusted24 = adjustTimeString(pr.raw, dstHour, minuteOffsets[pr.key] || 0);
            const displayTime = formatTime12h(adjusted24);
            return (
              <div
                key={index}
                className={`p-2 sm:p-3 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                  theme === 'light'
                    ? 'bg-slate-50 border-slate-200/60'
                    : theme === 'sepia'
                    ? 'bg-[#1e130c]/50 border-amber-900/20'
                    : 'bg-slate-950/40 border-white/5'
                }`}
              >
                <div className="mb-1 rounded-lg bg-white/5">
                  {pr.icon}
                </div>
                <span className={`text-[10px] sm:text-xs font-bold font-cairo ${
                  theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  {language === 'ar' ? pr.nameAr : pr.nameEn}
                </span>
                <span className={`text-[9px] sm:text-xs font-bold font-mono mt-1 ${
                  theme === 'light' ? 'text-slate-800' : 'text-slate-200'
                }`}>
                  {displayTime}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Salawat Welcome Banner */}
      <SalawatWelcomeBanner />

      {/* Prominent Islamic-themed Smart Search Bar */}
      <div 
        onClick={() => {
          soundEngine.playClick();
          if (vibrationEnabled) triggerHaptic(10);
          setIsSearchOpen(true);
        }}
        className={`w-full p-3 sm:p-4 rounded-2xl sm:rounded-2xl sm:rounded-3xl border cursor-pointer transition-all hover:scale-[1.01] flex items-center justify-between gap-3 shadow-md hover:shadow-lg relative z-10 ${
          theme === 'light'
            ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/30 text-slate-800 hover:border-emerald-500/60'
            : theme === 'sepia'
            ? 'bg-gradient-to-r from-amber-950/40 to-amber-900/40 border-amber-800/40 text-amber-50 hover:border-amber-500/60'
            : 'bg-gradient-to-r from-slate-900/80 to-emerald-950/40 border-emerald-500/30 text-slate-200 hover:border-emerald-500/60'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 shadow-md shrink-0">
            <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="text-right min-w-0">
            <span className={`text-xs sm:text-sm font-bold font-cairo block ${
              theme === 'light' ? 'text-emerald-800' : theme === 'sepia' ? 'text-amber-300' : 'text-emerald-400'
            }`}>
              {language === 'ar' ? 'البحث القرآني والحديثي الذكي' : 'Smart Quran & Hadith Search'}
            </span>
            <span className={`text-[10px] sm:text-xs truncate block ${
              theme === 'light' ? 'text-slate-600' : theme === 'sepia' ? 'text-amber-200/70' : 'text-slate-400'
            }`}>
              {language === 'ar' ? 'ابحث بالكلمة، الآية، اسم السورة أو الحديث الشريف...' : 'Search by word, ayah, surah name, or hadith...'}
            </span>
          </div>
        </div>
        <kbd className="hidden sm:inline-flex px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/50 text-[10px] font-mono text-emerald-300">
          ⌘K
        </kbd>
      </div>

      {/* Primary Feature Quick Navigation Hub */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {/* Quran */}
        <button
          onClick={() => setActiveTab('quran')}
          className={`p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border backdrop-blur-2xl transition-all flex flex-col items-center justify-center gap-2 sm:gap-2.5 cursor-pointer group text-center shadow-lg hover:shadow-xl hover:-translate-y-1 ${
            theme === 'light'
              ? 'bg-white/40 border-white/60 hover:bg-white/60 hover:border-emerald-500/30'
              : 'bg-slate-900/40 border-white/10 hover:bg-white/5 hover:border-emerald-500/30'
          }`}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform duration-300">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className={`text-xs sm:text-sm font-bold font-cairo block mb-1 ${
              theme === 'light' ? 'text-slate-800' : 'text-slate-100'
            }`}>
              {language === 'ar' ? 'المصحف الشريف' : 'Holy Quran'}
            </span>
            <span className={`text-[10px] sm:text-[11px] block ${
              theme === 'light' ? 'text-slate-500' : 'text-slate-400'
            }`}>
              {language === 'ar' ? 'تلاوات وتفسير' : 'Audio & Tafsir'}
            </span>
          </div>
        </button>

        {/* Custom Repeat */}
        <button
          onClick={() => setIsRepeatPageOpen(true)}
          className={`p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border backdrop-blur-2xl transition-all flex flex-col items-center justify-center gap-2 sm:gap-2.5 cursor-pointer group text-center shadow-lg hover:shadow-xl hover:-translate-y-1 ${
            theme === 'light'
              ? 'bg-white/40 border-white/60 hover:bg-white/60 hover:border-teal-500/30'
              : 'bg-slate-900/40 border-white/10 hover:bg-white/5 hover:border-teal-500/30'
          }`}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform duration-300">
            <Sliders className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className={`text-xs sm:text-sm font-bold font-cairo block mb-1 ${
              theme === 'light' ? 'text-slate-800' : 'text-slate-100'
            }`}>
              {language === 'ar' ? 'التكرار المخصص' : 'Custom Repeat'}
            </span>
            <span className={`text-[10px] sm:text-[11px] block ${
              theme === 'light' ? 'text-slate-500' : 'text-slate-400'
            }`}>
              {language === 'ar' ? 'تخصيص الحفظ' : 'Customize Hifz'}
            </span>
          </div>
        </button>

        {/* Athkar */}
        <button
          onClick={() => setActiveTab('athkar')}
          className={`p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border transition-all flex flex-col items-center justify-center gap-2 sm:gap-2.5 cursor-pointer group text-center shadow-sm hover:shadow-lg hover:-translate-y-1 ${
            theme === 'light'
              ? 'bg-gradient-to-b from-white to-amber-50/30 border-amber-100 hover:border-amber-300'
              : theme === 'sepia'
              ? 'bg-gradient-to-b from-[#150d08] to-amber-950/20 border-amber-900/30 hover:border-amber-700/50'
              : 'bg-gradient-to-b from-slate-900 to-slate-800 border-amber-500/20 hover:border-amber-500/40'
          }`}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform duration-300">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className={`text-xs sm:text-sm font-bold font-cairo block mb-1 ${
              theme === 'light' ? 'text-amber-950' : 'text-amber-300'
            }`}>
              {language === 'ar' ? 'حصن المسلم' : 'Hisn Al-Muslim'}
            </span>
            <span className={`text-[10px] sm:text-[11px] block ${
              theme === 'light' ? 'text-slate-500' : 'text-slate-400'
            }`}>
              {language === 'ar' ? 'أذكار وأدعية' : 'Athkar & Duas'}
            </span>
          </div>
        </button>

        {/* Library */}
        <button
          onClick={() => setActiveTab('library')}
          className={`p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border transition-all flex flex-col items-center justify-center gap-2 sm:gap-2.5 cursor-pointer group text-center shadow-sm hover:shadow-lg hover:-translate-y-1 ${
            theme === 'light'
              ? 'bg-gradient-to-b from-white to-fuchsia-50/30 border-fuchsia-100 hover:border-fuchsia-300'
              : theme === 'sepia'
              ? 'bg-gradient-to-b from-[#150d08] to-fuchsia-950/20 border-fuchsia-900/30 hover:border-fuchsia-700/50'
              : 'bg-gradient-to-b from-slate-900 to-slate-800 border-fuchsia-500/20 hover:border-fuchsia-500/40'
          }`}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-500 group-hover:scale-110 transition-transform duration-300">
            <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className={`text-xs sm:text-sm font-bold font-cairo block mb-1 ${
              theme === 'light' ? 'text-fuchsia-950' : 'text-fuchsia-300'
            }`}>
              {language === 'ar' ? 'المكتبة الإسلامية' : 'Islamic Library'}
            </span>
            <span className={`text-[10px] sm:text-[11px] block ${
              theme === 'light' ? 'text-slate-500' : 'text-slate-400'
            }`}>
              {language === 'ar' ? 'أمهات الكتب' : 'Hadith Books'}
            </span>
          </div>
        </button>

        {/* Prayers */}
        <button
          onClick={() => setActiveTab('prayers')}
          className={`p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border transition-all flex flex-col items-center justify-center gap-2 sm:gap-2.5 cursor-pointer group text-center shadow-sm hover:shadow-lg hover:-translate-y-1 ${
            theme === 'light'
              ? 'bg-gradient-to-b from-white to-sky-50/30 border-sky-100 hover:border-sky-300'
              : theme === 'sepia'
              ? 'bg-gradient-to-b from-[#150d08] to-sky-950/20 border-sky-900/30 hover:border-sky-700/50'
              : 'bg-gradient-to-b from-slate-900 to-slate-800 border-sky-500/20 hover:border-sky-500/40'
          }`}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform duration-300">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className={`text-xs sm:text-sm font-bold font-cairo block mb-1 ${
              theme === 'light' ? 'text-sky-950' : 'text-sky-300'
            }`}>
              {language === 'ar' ? 'مواقيت الصلاة' : 'Prayer Times'}
            </span>
            <span className={`text-[10px] sm:text-[11px] block ${
              theme === 'light' ? 'text-slate-500' : 'text-slate-400'
            }`}>
              {language === 'ar' ? 'القبلة والأذان' : 'Qibla & Adhan'}
            </span>
          </div>
        </button>

        {/* Radio */}
        <button
          onClick={() => setActiveTab('radio')}
          className={`p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border transition-all flex flex-col items-center justify-center gap-2 sm:gap-2.5 cursor-pointer group text-center shadow-sm hover:shadow-lg hover:-translate-y-1 ${
            theme === 'light'
              ? 'bg-gradient-to-b from-white to-teal-50/30 border-teal-100 hover:border-teal-300'
              : theme === 'sepia'
              ? 'bg-gradient-to-b from-[#150d08] to-teal-950/20 border-teal-900/30 hover:border-teal-700/50'
              : 'bg-gradient-to-b from-slate-900 to-slate-800 border-teal-500/20 hover:border-teal-500/40'
          }`}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-500 group-hover:scale-110 transition-transform duration-300">
            <Radio className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className={`text-xs sm:text-sm font-bold font-cairo block mb-1 ${
              theme === 'light' ? 'text-teal-950' : 'text-teal-300'
            }`}>
              {language === 'ar' ? 'الإذاعات المباشرة' : 'Live Radio'}
            </span>
            <span className={`text-[10px] sm:text-[11px] block ${
              theme === 'light' ? 'text-slate-500' : 'text-slate-400'
            }`}>
              {language === 'ar' ? 'قرآن، فتاوى' : 'Quran & Fatwas'}
            </span>
          </div>
        </button>
      </div>

      {/* Daily Quran & Tadabbur Inspiration */}
      <DailyInspirationCard />

      {/* Daily Authentic Hadith Card with Explanation */}
      <DailyHadithCard />

      {/* Islamic Knowledge Interactive Hub: Quiz & Voluntary Fasting Tracker */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* 1. Islamic Quiz Card */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => {
            if (soundEnabled) soundEngine.playClick();
            if (vibrationEnabled) triggerHaptic(12);
            setIsQuizModalOpen(true);
          }}
          className={`p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border backdrop-blur-xl transition-all cursor-pointer flex items-center justify-between group shadow-md ${
            theme === 'light'
              ? 'bg-gradient-to-r from-amber-500/10 via-amber-50/50 to-orange-500/10 border-amber-200 hover:border-amber-400 text-slate-800'
              : 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/20 border-amber-500/30 hover:border-amber-400 text-slate-100'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0 shadow-inner">
              <Trophy className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold font-cairo block text-amber-300">
                  {language === 'ar' ? 'مسابقات وبنك الأسئلة الإسلامية' : 'Islamic Quiz & Knowledge Bank'}
                </span>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full font-bold">
                  {language === 'ar' ? 'تفاعلي' : 'Interactive'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-cairo line-clamp-1 mt-0.5">
                {language === 'ar' ? 'اختبر معلوماتك في السيرة، الأنبياء والقرآن' : 'Test your knowledge in Seerah & Quran'}
              </span>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-white/5 group-hover:bg-amber-500/20 text-amber-400 transition-colors shrink-0">
            {language === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
        </motion.div>

        {/* 2. Fasting Tracker Card */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => {
            if (soundEnabled) soundEngine.playClick();
            if (vibrationEnabled) triggerHaptic(12);
            setIsFastingModalOpen(true);
          }}
          className={`p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border backdrop-blur-xl transition-all cursor-pointer flex items-center justify-between group shadow-md ${
            theme === 'light'
              ? 'bg-gradient-to-r from-teal-500/10 via-emerald-50/50 to-teal-500/10 border-teal-200 hover:border-teal-400 text-slate-800'
              : 'bg-gradient-to-r from-teal-950/40 via-slate-900 to-teal-950/20 border-teal-500/30 hover:border-teal-400 text-slate-100'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0 shadow-inner">
              <Calendar className="w-6 h-6 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold font-cairo block text-teal-300">
                  {language === 'ar' ? 'تتبع صيام السُّنّة والتطوع' : 'Sunnah Fasting Calendar'}
                </span>
                {nextFasting.daysLeft === 0 && (
                  <span className="text-[9px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.2 rounded-full font-bold animate-pulse">
                    {language === 'ar' ? 'اليوم صيام!' : 'Fast Today!'}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 font-cairo line-clamp-1 mt-0.5">
                {language === 'ar'
                  ? `أقرب موعد: ${nextFasting.nameAr} (${nextFasting.daysLeft === 0 ? 'اليوم' : `بعد ${nextFasting.daysLeft} يوم`})`
                  : `Next: ${nextFasting.nameEn} in ${nextFasting.daysLeft}d`}
              </span>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-white/5 group-hover:bg-teal-500/20 text-teal-400 transition-colors shrink-0">
            {language === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
        </motion.div>
      </div>

      {/* Quick Khatmah & Memorization Feature Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          onClick={() => setActiveTab('quran')}
          className={`p-4 rounded-2xl sm:rounded-3xl border backdrop-blur-xl transition-all cursor-pointer flex items-center justify-between group ${
            theme === 'light'
              ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 hover:border-emerald-400 text-slate-800'
              : 'bg-gradient-to-r from-emerald-950/40 to-slate-900 border-emerald-500/30 hover:border-emerald-400 text-slate-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold font-cairo block text-emerald-300">
                {language === 'ar' ? 'منظم الختمات القرآنية' : 'Khatmah Tracker'}
              </span>
              <span className="text-[10px] text-slate-400 font-cairo">
                {language === 'ar' ? 'تتبع وردك اليومي وختم المصحف' : 'Track daily reading goals'}
              </span>
            </div>
          </div>
          <div className="p-1.5 rounded-xl bg-white/5 text-emerald-400">
            {language === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
        </div>

        <div
          onClick={() => setActiveTab('quran')}
          className={`p-4 rounded-2xl sm:rounded-3xl border backdrop-blur-xl transition-all cursor-pointer flex items-center justify-between group ${
            theme === 'light'
              ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 hover:border-amber-400 text-slate-800'
              : 'bg-gradient-to-r from-amber-950/40 to-slate-900 border-amber-500/30 hover:border-amber-400 text-slate-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold font-cairo block text-amber-300">
                {language === 'ar' ? 'تفسير الآيات والتحفيظ' : 'Tafsir & Memorization'}
              </span>
              <span className="text-[10px] text-slate-400 font-cairo">
                {language === 'ar' ? 'التفسير الميسر وتكرار الآيات' : 'Ayah meanings and audio repeats'}
              </span>
            </div>
          </div>
          <div className="p-1.5 rounded-xl bg-white/5 text-amber-400">
            {language === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
        </div>
      </div>

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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {ATHKAR_CATEGORIES.slice(0, 4).map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -3 }}
              onClick={() => {
                setSelectedAthkarCategoryId(cat.id);
                setActiveTab('athkar');
              }}
              className={`p-3.5 sm:p-4 rounded-2xl sm:rounded-2xl sm:rounded-3xl border backdrop-blur-xl shadow-md transition-all cursor-pointer flex flex-col justify-between group ${
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
        className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl border backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 ${
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
        className="p-3.5 sm:p-4 rounded-2xl sm:rounded-2xl sm:rounded-3xl border border-white/10 hover:border-emerald-500/40 bg-white/5 backdrop-blur-xl flex items-center justify-between gap-3 cursor-pointer transition-all"
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

      {/* Islamic Knowledge Quiz Interactive Modal */}
      <IslamicQuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
      />

      {/* Sunnah & Voluntary Fasting Calendar Tracker Modal */}
      <FastingTrackerModal
        isOpen={isFastingModalOpen}
        onClose={() => setIsFastingModalOpen(false)}
      />
    </div>
  );
};
