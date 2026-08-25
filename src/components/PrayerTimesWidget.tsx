import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  CITIES_PRAYERS,
  CALCULATION_METHODS,
  POST_PRAYER_ATHKAR,
  getFormattedHijriDate
} from '../data/prayerData';
import { CityPrayer } from '../types';
import {
  Clock,
  Compass,
  MapPin,
  Calendar,
  Sparkles,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  CloudSun,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldCheck,
  Flame,
  Award,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine, triggerHaptic } from '../utils/audio';

export const PrayerTimesWidget: React.FC = () => {
  const { language, theme, showToast, soundEnabled, vibrationEnabled } = useApp();

  // Local state persisted in localStorage
  const [selectedCity, setSelectedCity] = useState<CityPrayer>(() => {
    const saved = localStorage.getItem('sakinah_prayer_city');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const match = CITIES_PRAYERS.find((c) => c.cityEn === parsed.cityEn);
        if (match) return match;
      } catch {}
    }
    return CITIES_PRAYERS[0]; // Cairo default
  });

  // Summer / Winter Time Toggle (DST: Daylight Saving Time = +1 hr)
  const [isSummerTime, setIsSummerTime] = useState<boolean>(() => {
    const saved = localStorage.getItem('sakinah_prayer_dst');
    return saved ? JSON.parse(saved) : false;
  });

  // Calculation Method
  const [selectedMethodId, setSelectedMethodId] = useState<string>(() => {
    return localStorage.getItem('sakinah_prayer_method') || 'egypt';
  });

  // Asr Method: standard (Shafi'i/Maliki/Hanbali) or hanafi (+25-35 mins)
  const [asrMethod, setAsrMethod] = useState<'standard' | 'hanafi'>(() => {
    return (localStorage.getItem('sakinah_prayer_asr_method') as any) || 'standard';
  });

  // Hijri Date offset (+/- days)
  const [hijriOffset, setHijriOffset] = useState<number>(() => {
    const saved = localStorage.getItem('sakinah_hijri_offset');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Per-Prayer manual fine-tune minute offsets
  const [minuteOffsets, setMinuteOffsets] = useState<{ [key: string]: number }>(() => {
    const saved = localStorage.getItem('sakinah_prayer_offsets');
    return saved
      ? JSON.parse(saved)
      : { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 };
  });

  // Daily Prayer Checklist tracker (Today)
  const todayKey = new Date().toISOString().slice(0, 10);
  const [completedPrayers, setCompletedPrayers] = useState<{ [key: string]: boolean }>(() => {
    const saved = localStorage.getItem(`sakinah_prayers_done_${todayKey}`);
    return saved ? JSON.parse(saved) : {};
  });

  // UI Panels
  const [activeTab, setActiveTab] = useState<'times' | 'tracker' | 'adhkar' | 'settings'>('times');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPlayingAdhan, setIsPlayingAdhan] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const adhanAudioRef = useRef<HTMLAudioElement | null>(null);

  // Adhkar counter state
  const [athkarCounts, setAthkarCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('sakinah_prayer_city', JSON.stringify(selectedCity));
  }, [selectedCity]);

  useEffect(() => {
    localStorage.setItem('sakinah_prayer_dst', JSON.stringify(isSummerTime));
  }, [isSummerTime]);

  useEffect(() => {
    localStorage.setItem('sakinah_prayer_method', selectedMethodId);
  }, [selectedMethodId]);

  useEffect(() => {
    localStorage.setItem('sakinah_prayer_asr_method', asrMethod);
  }, [asrMethod]);

  useEffect(() => {
    localStorage.setItem('sakinah_hijri_offset', hijriOffset.toString());
  }, [hijriOffset]);

  useEffect(() => {
    localStorage.setItem('sakinah_prayer_offsets', JSON.stringify(minuteOffsets));
  }, [minuteOffsets]);

  useEffect(() => {
    localStorage.setItem(`sakinah_prayers_done_${todayKey}`, JSON.stringify(completedPrayers));
  }, [completedPrayers, todayKey]);

  // Adjust time string by hours and minutes
  const adjustTimeString = (timeStr: string, hourAdd: number, minAdd: number): string => {
    const [h, m] = timeStr.split(':').map(Number);
    let totalMinutes = h * 60 + m + hourAdd * 60 + minAdd;
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    totalMinutes = totalMinutes % (24 * 60);
    const newH = Math.floor(totalMinutes / 60);
    const newM = totalMinutes % 60;
    return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
  };

  // Compute actual prayer times with DST + Asr Juristic + Fine Tune
  const dstHour = isSummerTime ? 1 : 0;
  const asrExtraMin = asrMethod === 'hanafi' ? 35 : 0;

  const rawPrayers = [
    {
      key: 'fajr',
      nameAr: 'الفجر',
      nameEn: 'Fajr',
      rawTime: selectedCity.fajr,
      time: adjustTimeString(selectedCity.fajr, dstHour, minuteOffsets.fajr || 0),
      icon: <Sunrise className="w-5 h-5 text-amber-300" />,
      color: 'from-amber-500/20 to-teal-500/20'
    },
    {
      key: 'sunrise',
      nameAr: 'الشروق',
      nameEn: 'Sunrise',
      rawTime: selectedCity.sunrise,
      time: adjustTimeString(selectedCity.sunrise, dstHour, minuteOffsets.sunrise || 0),
      icon: <Sun className="w-5 h-5 text-amber-400" />,
      color: 'from-amber-400/20 to-orange-500/20'
    },
    {
      key: 'dhuhr',
      nameAr: 'الظهر',
      nameEn: 'Dhuhr',
      rawTime: selectedCity.dhuhr,
      time: adjustTimeString(selectedCity.dhuhr, dstHour, minuteOffsets.dhuhr || 0),
      icon: <Sun className="w-5 h-5 text-amber-300" />,
      color: 'from-yellow-500/20 to-emerald-500/20'
    },
    {
      key: 'asr',
      nameAr: 'العصر',
      nameEn: 'Asr',
      rawTime: selectedCity.asr,
      time: adjustTimeString(selectedCity.asr, dstHour, (minuteOffsets.asr || 0) + asrExtraMin),
      icon: <CloudSun className="w-5 h-5 text-sky-400" />,
      color: 'from-sky-500/20 to-blue-500/20'
    },
    {
      key: 'maghrib',
      nameAr: 'المغرب',
      nameEn: 'Maghrib',
      rawTime: selectedCity.maghrib,
      time: adjustTimeString(selectedCity.maghrib, dstHour, minuteOffsets.maghrib || 0),
      icon: <Sunset className="w-5 h-5 text-orange-400" />,
      color: 'from-orange-500/20 to-rose-500/20'
    },
    {
      key: 'isha',
      nameAr: 'العشاء',
      nameEn: 'Isha',
      rawTime: selectedCity.isha,
      time: adjustTimeString(selectedCity.isha, dstHour, minuteOffsets.isha || 0),
      icon: <Moon className="w-5 h-5 text-indigo-400" />,
      color: 'from-indigo-500/20 to-purple-500/20'
    }
  ];

  // Calculate Next Prayer & Countdown
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
  const hijriDate = getFormattedHijriDate(language, hijriOffset);

  // Adhan Audio Toggle
  const handleToggleAdhan = () => {
    if (isPlayingAdhan) {
      if (adhanAudioRef.current) {
        adhanAudioRef.current.pause();
        adhanAudioRef.current.currentTime = 0;
      }
      setIsPlayingAdhan(false);
    } else {
      if (!adhanAudioRef.current) {
        adhanAudioRef.current = new Audio('https://server8.mp3quran.net/athan/001.mp3');
        adhanAudioRef.current.onended = () => setIsPlayingAdhan(false);
      }
      adhanAudioRef.current.play().catch(() => {
        showToast(
          language === 'ar' ? 'تعذر تشغيل الصوت' : 'Audio Unavailable',
          language === 'ar' ? 'يرجى التحقق من اتصال الإنترنت.' : 'Check internet connection.'
        );
      });
      setIsPlayingAdhan(true);
      showToast(
        language === 'ar' ? 'أذان الحرم المكي الشريف' : 'Makkah Adhan Playing',
        language === 'ar' ? 'استمع لنداء الصلاة الخاشع بصوت ندي.' : 'Listening to peaceful call to prayer.'
      );
    }
  };

  // Toggle Daily Checklist Item
  const handleTogglePrayerDone = (key: string) => {
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(15);
    const updated = { ...completedPrayers, [key]: !completedPrayers[key] };
    setCompletedPrayers(updated);
  };

  // Tracker Items
  const trackerItems = [
    { key: 'fajr_sunnah', nameAr: 'سُنّة الفجر (ركعتان)', nameEn: 'Fajr Sunnah (2 Rak’ahs)', fadlAr: 'خيرٌ من الدنيا وما فيها' },
    { key: 'fajr', nameAr: 'صلاة الفجر (فرض)', nameEn: 'Fajr Obligatory Prayer', fadlAr: 'في ذمة الله وحفظه' },
    { key: 'duha', nameAr: 'صلاة الضحى (ركعتان فأكثر)', nameEn: 'Duha Forenoon Prayer', fadlAr: 'صدقة عن كل مفصل في جسدك' },
    { key: 'dhuhr_rawatib', nameAr: 'سُنّة الظهر (٤ قبلها و ٢ بعدها)', nameEn: 'Dhuhr Sunnah (4 before, 2 after)', fadlAr: 'حُرّم على النار' },
    { key: 'dhuhr', nameAr: 'صلاة الظهر (فرض)', nameEn: 'Dhuhr Obligatory Prayer', fadlAr: 'فُتحت له أبواب السماء' },
    { key: 'asr', nameAr: 'صلاة العصر (الصلاة الوسطى)', nameEn: 'Asr Obligatory Prayer', fadlAr: 'من صلاها دخل الجنة' },
    { key: 'maghrib', nameAr: 'صلاة المغرب (فرض)', nameEn: 'Maghrib Obligatory Prayer', fadlAr: 'أول صلاة بالليل' },
    { key: 'maghrib_sunnah', nameAr: 'سُنّة المغرب (ركعتان بعدها)', nameEn: 'Maghrib Sunnah (2 Rak’ahs)', fadlAr: 'تُرفع في عليين' },
    { key: 'isha', nameAr: 'صلاة العشاء (فرض)', nameEn: 'Isha Obligatory Prayer', fadlAr: 'من صلاها في جماعة فكأنما قام نصف الليل' },
    { key: 'isha_sunnah', nameAr: 'سُنّة العشاء (ركعتان بعدها)', nameEn: 'Isha Sunnah (2 Rak’ahs)', fadlAr: 'من الرواتب المؤكدة' },
    { key: 'witr', nameAr: 'صلاة الشفع والوتر', nameEn: 'Witr Prayer', fadlAr: 'إن الله وتر يحب الوتر' },
    { key: 'qiyam', nameAr: 'قيام الليل والتهجد', nameEn: 'Night Vigil (Tahajjud)', fadlAr: 'أشرف صلاة بعد الفريضة' }
  ];

  const totalTrackerCount = trackerItems.length;
  const completedTrackerCount = trackerItems.filter((item) => completedPrayers[item.key]).length;
  const trackerPercentage = Math.round((completedTrackerCount / totalTrackerCount) * 100);

  return (
    <div id="prayer-times-view" className="w-full max-w-5xl mx-auto space-y-6 pb-24">
      {/* Top Header Card with City, Hijri Date, and DST Badge */}
      <div
        className={`relative overflow-hidden p-6 sm:p-7 rounded-3xl border backdrop-blur-2xl shadow-xl transition-all ${
          theme === 'light'
            ? 'bg-white/85 border-slate-200 text-slate-800'
            : theme === 'sepia'
            ? 'bg-[#2b1e15]/85 border-amber-800/40 text-amber-50'
            : 'bg-slate-900/85 border-slate-800 text-slate-100'
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 mb-1.5">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <h1 className="text-xl sm:text-2xl font-bold font-cairo">
                {language === 'ar' ? 'مواقيت الصلاة والقبلة الشريفة' : 'Prayer Times & Qibla'}
              </h1>
            </div>

            {/* Hijri Date Display with Day Adjuster */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs sm:text-sm font-cairo text-amber-300 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                {hijriDate}
              </span>
              <div className="flex items-center gap-1 bg-slate-800/70 rounded-full px-2 py-0.5 border border-slate-700 text-[10px]">
                <button
                  onClick={() => setHijriOffset(hijriOffset - 1)}
                  title={language === 'ar' ? 'تأخير يوم' : 'Minus 1 day'}
                  className="px-1 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="text-slate-400">{hijriOffset === 0 ? '٠' : `${hijriOffset > 0 ? '+' : ''}${hijriOffset}`}</span>
                <button
                  onClick={() => setHijriOffset(hijriOffset + 1)}
                  title={language === 'ar' ? 'تقديم يوم' : 'Plus 1 day'}
                  className="px-1 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* City Selector & DST Controls */}
          <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
            {/* City Selector */}
            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 rounded-2xl px-3 py-1.5 flex-1 md:flex-initial">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <select
                value={selectedCity.cityEn}
                onChange={(e) => {
                  const match = CITIES_PRAYERS.find((c) => c.cityEn === e.target.value);
                  if (match) setSelectedCity(match);
                }}
                className="bg-transparent text-xs font-cairo font-bold text-slate-100 outline-none cursor-pointer w-full"
              >
                {CITIES_PRAYERS.map((city) => (
                  <option key={city.cityEn} value={city.cityEn} className="bg-slate-900 text-slate-100">
                    {language === 'ar' ? `${city.cityAr} (${city.countryAr})` : `${city.cityEn}, ${city.countryEn}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Summer / Winter Time (DST) Toggle Button */}
            <button
              onClick={() => {
                soundEngine.playClick();
                triggerHaptic(10);
                const nextState = !isSummerTime;
                setIsSummerTime(nextState);
                showToast(
                  nextState
                    ? (language === 'ar' ? '☀️ تم تفعيل التوقيت الصيفي (+١ ساعة)' : '☀️ Summer Time Enabled (+1 hr)')
                    : (language === 'ar' ? '❄️ تم تفعيل التوقيت الشتوي (القياسي)' : '❄️ Winter / Standard Time Active'),
                  nextState
                    ? (language === 'ar' ? 'تمت إضافة ساعة كاملة لجميع مواعيد الصلوات.' : 'All prayer times adjusted +1 hour.')
                    : (language === 'ar' ? 'عادت مواعيد الصلوات للوقت القياسي.' : 'Prayer times reverted to standard timetable.')
                );
              }}
              title={language === 'ar' ? 'التبديل بين التوقيت الصيفي والشتوي' : 'Toggle Daylight Saving Time'}
              className={`px-3 py-1.5 rounded-2xl border text-xs font-bold font-cairo flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                isSummerTime
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-amber-500/20'
                  : 'bg-slate-800/90 text-slate-300 hover:text-emerald-300 border-slate-700'
              }`}
            >
              {isSummerTime ? <Sun className="w-4 h-4 fill-current" /> : <Moon className="w-4 h-4 text-sky-400" />}
              <span>
                {isSummerTime
                  ? (language === 'ar' ? 'التوقيت الصيفي (+١ س)' : 'Summer Time (+1h)')
                  : (language === 'ar' ? 'التوقيت الشتوي' : 'Winter Time')}
              </span>
            </button>

            {/* Settings & Fine-tune Modal Trigger */}
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              title={language === 'ar' ? 'إعدادات المواقيت والمذهب' : 'Calculation & Asr Settings'}
              className="p-2 rounded-2xl bg-slate-800/90 border border-slate-700 text-slate-300 hover:text-emerald-300 hover:bg-slate-700 transition-all cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Mode Navigation Tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-700/40 overflow-x-auto pb-1">
          {[
            { id: 'times', labelAr: 'مواقيت الصلوات الخمس', labelEn: 'Prayer Times', icon: <Clock className="w-4 h-4" /> },
            { id: 'tracker', labelAr: 'جدول محاسبة الصلوات اليومية', labelEn: 'Daily Tracker', icon: <CheckCircle2 className="w-4 h-4" /> },
            { id: 'adhkar', labelAr: 'أذكار ما بعد الصلاة', labelEn: 'Post-Prayer Athkar', icon: <BookOpen className="w-4 h-4" /> },
            { id: 'settings', labelAr: 'ضبط المذهب والتعديل اليدوي', labelEn: 'Fine-tune & Madhab', icon: <Sliders className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundEngine.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-cairo flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
              }`}
            >
              {tab.icon}
              <span>{language === 'ar' ? tab.labelAr : tab.labelEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Tab 1: Prayer Times Overview */}
      {activeTab === 'times' && (
        <div className="space-y-6">
          {/* Hero Glowing Next Prayer Banner */}
          <div
            className={`relative overflow-hidden p-6 sm:p-8 rounded-3xl border-2 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 ${
              theme === 'light'
                ? 'bg-gradient-to-r from-emerald-600/90 via-teal-700/90 to-emerald-800/90 border-emerald-400/60 text-white shadow-emerald-900/20'
                : theme === 'sepia'
                ? 'bg-gradient-to-r from-amber-900/90 via-[#3d271a]/90 to-amber-950/90 border-amber-500/50 text-amber-50 shadow-black/70'
                : 'bg-gradient-to-r from-[#041c18] via-[#083029] to-[#041c18] border-emerald-500/50 text-slate-100 shadow-emerald-950/70'
            }`}
          >
            <div className="space-y-2.5 text-center md:text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold font-cairo tracking-wide border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'ar' ? 'الصلاة القادمة' : 'Next Prayer'}</span>
                <span>•</span>
                <span className="text-emerald-300">{selectedCity.cityAr}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-cairo tracking-tight">
                {language === 'ar' ? `صلاة ${nextInfo.prayer.nameAr}` : nextInfo.prayer.nameEn}
              </h2>

              <div className="flex items-center justify-center md:justify-start gap-2 text-xs sm:text-sm opacity-90 font-cairo">
                <span>{language === 'ar' ? 'متبقي على الأذان:' : 'Time until Adhan:'}</span>
                <strong className="text-amber-300 font-bold font-mono text-base bg-black/30 px-2.5 py-0.5 rounded-lg border border-amber-400/30">
                  {nextInfo.hoursLeft} {language === 'ar' ? 'س' : 'h'} : {nextInfo.minsLeft} {language === 'ar' ? 'د' : 'm'} : {nextInfo.secsLeft} {language === 'ar' ? 'ث' : 's'}
                </strong>
              </div>
            </div>

            {/* Right: Prayer Time Big Digital Display & Audio Play Adhan button */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="px-6 py-4 rounded-2xl bg-black/30 backdrop-blur-md border border-emerald-400/30 text-center min-w-[140px]">
                <span className="text-[11px] block opacity-75 font-cairo text-emerald-300 font-semibold">
                  {language === 'ar' ? 'موعد الأذان' : 'Adhan Time'}
                </span>
                <span className="text-4xl font-extrabold font-mono text-emerald-300 tracking-wider">
                  {nextInfo.prayer.time}
                </span>
                <span className="text-[10px] text-amber-300/80 block mt-0.5 font-cairo">
                  {isSummerTime ? (language === 'ar' ? 'توقيت صيفي' : 'DST (+1h)') : (language === 'ar' ? 'توقيت شتوي' : 'Standard')}
                </span>
              </div>

              {/* Adhan Audio Listen Button */}
              <button
                onClick={handleToggleAdhan}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg ${
                  isPlayingAdhan
                    ? 'bg-amber-500 text-slate-950 border-amber-300 animate-pulse'
                    : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
                }`}
                title={language === 'ar' ? 'استماع لصوت الأذان' : 'Play Adhan'}
              >
                {isPlayingAdhan ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                <span className="text-[10px] font-bold font-cairo">
                  {isPlayingAdhan ? (language === 'ar' ? 'إيقاف الأذان' : 'Stop Adhan') : (language === 'ar' ? 'سماع الأذان' : 'Play Adhan')}
                </span>
              </button>
            </div>
          </div>

          {/* 6 Prayers Grid (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {rawPrayers.map((p) => {
              const isNext = p.key === nextInfo.prayer.key;
              const isDone = completedPrayers[p.key];

              return (
                <motion.div
                  key={p.key}
                  whileHover={{ y: -3 }}
                  className={`relative p-4 rounded-3xl border backdrop-blur-xl shadow-lg text-center flex flex-col items-center justify-between gap-3 transition-all ${
                    isNext
                      ? 'border-emerald-400 bg-gradient-to-b from-emerald-500/25 to-teal-500/10 text-emerald-300 ring-2 ring-emerald-500/30 shadow-emerald-950/40'
                      : theme === 'light'
                      ? 'bg-white/80 border-slate-200 text-slate-800'
                      : theme === 'sepia'
                      ? 'bg-[#291c14]/80 border-amber-800/40 text-amber-50'
                      : 'bg-slate-900/80 border-slate-800 text-slate-100'
                  }`}
                >
                  {isNext && (
                    <span className="absolute -top-2.5 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[9px] font-cairo shadow-sm">
                      {language === 'ar' ? 'القادمة' : 'Next'}
                    </span>
                  )}

                  <div className={`p-2.5 rounded-2xl ${isNext ? 'bg-emerald-500/30 text-emerald-300' : 'bg-white/10 text-slate-400'}`}>
                    {p.icon}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold font-cairo">
                      {language === 'ar' ? p.nameAr : p.nameEn}
                    </h3>
                    <p className="text-lg font-extrabold font-mono text-emerald-400 mt-0.5">
                      {p.time}
                    </p>
                    {p.key === 'asr' && asrMethod === 'hanafi' && (
                      <span className="text-[9px] text-amber-400 block font-cairo">مذهب حنفي</span>
                    )}
                  </div>

                  {/* Prayer Done Checkbox quick-tap */}
                  {p.key !== 'sunrise' && (
                    <button
                      onClick={() => handleTogglePrayerDone(p.key)}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-cairo font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                        isDone
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Circle className="w-3 h-3" />}
                      <span>{isDone ? (language === 'ar' ? 'أُدِّيت' : 'Done') : (language === 'ar' ? 'تسجيل' : 'Log')}</span>
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Interactive Qibla Compass Widget */}
          <div
            className={`p-6 sm:p-7 rounded-3xl border backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 ${
              theme === 'light'
                ? 'bg-white/80 border-slate-200 text-slate-800'
                : theme === 'sepia'
                ? 'bg-[#2b1f17]/80 border-amber-800/40 text-amber-50'
                : 'bg-slate-900/80 border-slate-800 text-slate-100'
            }`}
          >
            <div className="space-y-1.5 text-center md:text-right">
              <div className="flex items-center justify-center md:justify-start gap-2 text-amber-400 mb-1">
                <Compass className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold font-cairo">
                  {language === 'ar' ? 'بوصلة اتجاه القبلة نحو الكعبة المشرفة' : 'Qibla Direction to Kaaba'}
                </h3>
              </div>
              <p className="text-xs opacity-80 font-cairo max-w-md">
                {language === 'ar'
                  ? `زاوية القبلة الدقيقة من ${selectedCity.cityAr} هي ${selectedCity.qiblaAngle}° درجة باتجاه الكعبة المشرفة بمكة المكرمة.`
                  : `The exact Qibla azimuth from ${selectedCity.cityEn} is ${selectedCity.qiblaAngle}° toward Makkah Al-Mukarramah.`}
              </p>
              <div className="inline-flex items-center gap-2 pt-2 text-[11px] text-emerald-400 font-bold font-cairo">
                <span>🕋 {language === 'ar' ? 'مكة المكرمة' : 'Makkah'}: {selectedCity.qiblaAngle}°</span>
                <span>•</span>
                <span>{language === 'ar' ? 'الموقع الجغرافي:' : 'City:'} {selectedCity.cityAr}</span>
              </div>
            </div>

            {/* Precision Animated Compass */}
            <div className="relative w-32 h-32 rounded-full border-2 border-emerald-500/40 flex items-center justify-center bg-black/40 backdrop-blur-md shadow-inner shadow-emerald-500/20 shrink-0">
              <span className="absolute top-1.5 text-[10px] font-bold text-slate-400">N</span>
              <span className="absolute bottom-1.5 text-[10px] font-bold text-slate-400">S</span>
              <span className="absolute right-2 text-[10px] font-bold text-slate-400">E</span>
              <span className="absolute left-2 text-[10px] font-bold text-slate-400">W</span>

              {/* Kaaba Direction Marker */}
              <motion.div
                animate={{ rotate: selectedCity.qiblaAngle }}
                transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                className="w-full h-full flex items-center justify-center pointer-events-none"
              >
                <div className="w-1.5 h-24 bg-gradient-to-t from-transparent via-emerald-400 to-amber-400 relative">
                  {/* Kaaba Golden Needle Head */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="w-3.5 h-3.5 bg-amber-400 rotate-45 rounded-xs shadow-md shadow-amber-500/70" />
                    <span className="text-[8px] font-bold text-amber-300 mt-0.5">🕋</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 2: Daily Prayer & Sunnah Checklist Tracker */}
      {activeTab === 'tracker' && (
        <div className="space-y-6">
          {/* Tracker Progress Banner */}
          <div className="p-6 rounded-3xl border bg-gradient-to-br from-emerald-950/40 via-slate-900/60 to-teal-950/40 border-emerald-500/30 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center sm:text-right">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold font-cairo">
                <Flame className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'سجل المحاسبة اليومي للصلوات والسنن' : 'Daily Prayer & Sunnah Checklist'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-cairo text-slate-100">
                {language === 'ar' ? 'حاسبوا أنفسكم قبل أن تحاسبوا' : 'Track Your Daily Prayers'}
              </h2>
              <p className="text-xs text-slate-300">
                {language === 'ar'
                  ? `أنجزت اليوم ${completedTrackerCount} من أصل ${totalTrackerCount} من الفرائض والسنن المؤكدة.`
                  : `Completed ${completedTrackerCount} of ${totalTrackerCount} prayers and sunnahs today.`}
              </p>
            </div>

            {/* Circular Progress Display */}
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-400 transition-all duration-500 ease-out"
                    strokeDasharray={`${trackerPercentage}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute font-bold font-mono text-emerald-400 text-sm">{trackerPercentage}%</span>
              </div>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  setCompletedPrayers({});
                  showToast(
                    language === 'ar' ? 'تمت إعادة ضبط السجل' : 'Reset Tracker',
                    language === 'ar' ? 'تم تصفير سجل صلوات اليوم.' : 'Today’s checklist has been cleared.'
                  );
                }}
                title={language === 'ar' ? 'إعادة ضبط اليوم' : 'Reset Today'}
                className="p-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-rose-300 hover:bg-slate-700 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Checklist Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {trackerItems.map((item) => {
              const isDone = completedPrayers[item.key];

              return (
                <div
                  key={item.key}
                  onClick={() => handleTogglePrayerDone(item.key)}
                  className={`p-4 rounded-2xl border backdrop-blur-xl transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm ${
                    isDone
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                      : theme === 'light'
                      ? 'bg-white/80 border-slate-200 text-slate-800 hover:border-emerald-400/50'
                      : 'bg-slate-900/60 border-slate-800 text-slate-100 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl transition-colors ${isDone ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                      {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold font-cairo ${isDone ? 'text-emerald-300 line-through opacity-80' : 'text-slate-100'}`}>
                        {language === 'ar' ? item.nameAr : item.nameEn}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-cairo">{item.fadlAr}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Tab 3: Post-Prayer Athkar */}
      {activeTab === 'adhkar' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl border bg-slate-900/70 border-slate-800 backdrop-blur-xl">
            <h2 className="text-lg font-bold font-cairo text-amber-300 mb-1">
              {language === 'ar' ? 'أذكار ما بعد الصلاة المكتوبة (المأثورة عن النبي ﷺ)' : 'Authentic Supplications After Obligatory Prayer'}
            </h2>
            <p className="text-xs text-slate-300">
              {language === 'ar'
                ? 'يُسن للمسلم بعد التسليم من الفريضة الإتيان بهذه الأذكار المباركة لنيل عظيم الأجر والمغفرة.'
                : 'Recommended sunnah supplications to recite directly after completing obligatory prayers.'}
            </p>
          </div>

          <div className="space-y-3">
            {POST_PRAYER_ATHKAR.map((athkar) => {
              const currentCount = athkarCounts[athkar.id] || 0;
              const isCompleted = currentCount >= athkar.count;

              return (
                <div
                  key={athkar.id}
                  className={`p-5 rounded-3xl border backdrop-blur-xl transition-all ${
                    isCompleted
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : theme === 'light'
                      ? 'bg-white/85 border-slate-200 text-slate-800'
                      : 'bg-slate-900/75 border-slate-800 text-slate-100'
                  }`}
                >
                  <p dir="rtl" className="text-right font-quran text-xl sm:text-2xl font-bold leading-relaxed mb-3 text-slate-100">
                    {athkar.textAr}
                  </p>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
                    <span className="text-xs text-emerald-400 font-cairo">{athkar.fadlAr}</span>

                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        triggerHaptic(12);
                        const next = (currentCount + 1) > athkar.count ? 0 : currentCount + 1;
                        setAthkarCounts({ ...athkarCounts, [athkar.id]: next });
                      }}
                      className={`px-4 py-2 rounded-2xl font-cairo font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                          : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {language === 'ar' ? 'التكرار:' : 'Count:'} {currentCount} / {athkar.count}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Tab 4: Fine-tune & Calculation Method Settings */}
      {(activeTab === 'settings' || isSettingsOpen) && (
        <div className="p-6 rounded-3xl border bg-slate-900/90 border-slate-800 backdrop-blur-2xl shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold font-cairo">
              <Sliders className="w-5 h-5" />
              <h3 className="text-lg">{language === 'ar' ? 'إعدادات طريقة الحساب والتعديل اليدوي' : 'Calculation & Fine-Tuning'}</h3>
            </div>
            {isSettingsOpen && activeTab !== 'settings' && (
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-200 font-cairo cursor-pointer"
              >
                ✕ {language === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            )}
          </div>

          {/* 1. Calculation Method Authority */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-amber-300 font-cairo block">
              {language === 'ar' ? 'طريقة الحساب المعتمدة (زوايا الفجر والعشاء):' : 'Calculation Method (Fajr & Isha Angles):'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CALCULATION_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedMethodId(method.id);
                  }}
                  className={`p-3 rounded-2xl border text-right font-cairo transition-all cursor-pointer ${
                    selectedMethodId === method.id
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="font-bold text-xs block text-slate-100">{method.nameAr}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{method.descriptionAr}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Asr Juristic School Method */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-amber-300 font-cairo block">
              {language === 'ar' ? 'فقه صلاة العصر (طريقة حساب ظل القامة):' : 'Asr Juristic Method:'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={() => setAsrMethod('standard')}
                className={`p-3 rounded-2xl border text-right font-cairo transition-all cursor-pointer ${
                  asrMethod === 'standard'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                }`}
              >
                <span className="text-xs block text-slate-100">جمهور العلماء (الشافعي، المالكي، الحنبلي)</span>
                <span className="text-[10px] text-slate-400">ظل الشيء مثله (المعتمد في معظم العالم الإسلامي)</span>
              </button>

              <button
                onClick={() => setAsrMethod('hanafi')}
                className={`p-3 rounded-2xl border text-right font-cairo transition-all cursor-pointer ${
                  asrMethod === 'hanafi'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                }`}
              >
                <span className="text-xs block text-slate-100">المذهب الحنفي (ظل الشيء مثليه)</span>
                <span className="text-[10px] text-slate-400">يتأخر وقت العصر بحوالي ٣٥ دقيقة</span>
              </button>
            </div>
          </div>

          {/* 3. Manual Minutes Adjuster Per Prayer */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-amber-300 font-cairo block">
              {language === 'ar' ? 'التعديل اليدوي بالدقائق (+/- دقيقة لمطابقة مسجد حيك):' : 'Manual Minute Offsets (+/- Minutes):'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'].map((key) => {
                const nameArMap: { [k: string]: string } = {
                  fajr: 'الفجر',
                  sunrise: 'الشروق',
                  dhuhr: 'الظهر',
                  asr: 'العصر',
                  maghrib: 'المغرب',
                  isha: 'العشاء'
                };
                const val = minuteOffsets[key] || 0;

                return (
                  <div key={key} className="p-2.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-center font-cairo">
                    <span className="text-xs font-bold text-slate-200 block mb-1">{nameArMap[key]}</span>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setMinuteOffsets({ ...minuteOffsets, [key]: val - 1 })}
                        className="w-6 h-6 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-mono font-bold text-emerald-300 min-w-[24px]">
                        {val > 0 ? `+${val}` : val}
                      </span>
                      <button
                        onClick={() => setMinuteOffsets({ ...minuteOffsets, [key]: val + 1 })}
                        className="w-6 h-6 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
