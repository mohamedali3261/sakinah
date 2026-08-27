import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  CITIES_PRAYERS,
  CALCULATION_METHODS,
  POST_PRAYER_ATHKAR,
  getFormattedHijriDate
} from '../data/prayerData';
import {
  ADHAN_VOICES,
  DEFAULT_IQAMAH_PRESETS,
  AdhanVoice,
  DUAA_AFTER_ADHAN
} from '../data/adhanData';
import { calculateAstronomicalPrayers, fetchLivePrayerTimes } from '../utils/prayerCalculator';
import { adhanAudioEngine, AdhanPlayState } from '../utils/adhanAudioEngine';
import { AdhanVoiceModal } from './AdhanVoiceModal';
import { SalawatWelcomeBanner } from './SalawatWelcomeBanner';
import { PrayerTrackerSection } from './PrayerTrackerSection';
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
  Square,
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
  BookOpen,
  Music,
  BellRing,
  Navigation,
  Radio,
  Check,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine, triggerHaptic } from '../utils/audio';

export const PrayerTimesWidget: React.FC = () => {
  const { language, theme, showToast, soundEnabled, vibrationEnabled } = useApp();

  // Selected City with fallback coordinates
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

  // Summer / Winter Time (DST)
  const [isSummerTime, setIsSummerTime] = useState<boolean>(() => {
    const saved = localStorage.getItem('sakinah_prayer_dst');
    return saved ? JSON.parse(saved) : true;
  });

  // Calculation Method Authority
  const [selectedMethodId, setSelectedMethodId] = useState<string>(() => {
    return localStorage.getItem('sakinah_prayer_method') || 'egypt';
  });

  // Asr Method: standard (Shafi'i/Maliki/Hanbali) or hanafi
  const [asrMethod, setAsrMethod] = useState<'standard' | 'hanafi'>(() => {
    return (localStorage.getItem('sakinah_prayer_asr_method') as any) || 'standard';
  });

  // Selected Adhan Voice ID
  const [selectedAdhanVoiceId, setSelectedAdhanVoiceId] = useState<string>(() => {
    return localStorage.getItem('sakinah_adhan_voice') || 'makkah';
  });

  // Auto-play adhan when prayer time arrives
  const [autoAdhanEnabled, setAutoAdhanEnabled] = useState<boolean>(() => {
    return localStorage.getItem('sakinah_auto_adhan') === 'true';
  });

  // Iqamah delays per prayer
  const [iqamahDelays, setIqamahDelays] = useState<{ [key: string]: number }>(() => {
    const saved = localStorage.getItem('sakinah_iqamah_delays');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    const defaultObj: { [k: string]: number } = {};
    DEFAULT_IQAMAH_PRESETS.forEach((p) => {
      defaultObj[p.prayerKey] = p.defaultDelayMin;
    });
    return defaultObj;
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

  // Global time offset in minutes (for timezone correction)
  const [globalTimeOffset, setGlobalTimeOffset] = useState<number>(() => {
    const saved = localStorage.getItem('sakinah_global_time_offset');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Daily Prayer Checklist tracker (Today)
  const todayKey = new Date().toISOString().slice(0, 10);
  const [completedPrayers, setCompletedPrayers] = useState<{ [key: string]: boolean }>(() => {
    const saved = localStorage.getItem(`sakinah_prayers_done_${todayKey}`);
    return saved ? JSON.parse(saved) : {};
  });

  // Astronomical / Live Computed Timings
  const [computedTimes, setComputedTimes] = useState<{
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  }>(() => {
    const lat = selectedCity.latitude || 30.0444;
    const lng = selectedCity.longitude || 31.2357;
    return calculateAstronomicalPrayers(lat, lng, new Date(), selectedMethodId, asrMethod, undefined, globalTimeOffset);
  });

  // Dynamic status & Modals
  const [activeTab, setActiveTab] = useState<'times' | 'tracker' | 'adhkar' | 'settings'>('times');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isLocatingGPS, setIsLocatingGPS] = useState<boolean>(false);
  const [isLiveSyncing, setIsLiveSyncing] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [adhanPlayState, setAdhanPlayState] = useState<AdhanPlayState>('idle');
  const [athkarCounts, setAthkarCounts] = useState<{ [key: string]: number }>({});
  const lastTriggeredPrayerRef = useRef<string | null>(null);

  // Subscribe to global Adhan engine
  useEffect(() => {
    const unsubscribe = adhanAudioEngine.subscribe((state) => {
      setAdhanPlayState(state);
    });
    return () => unsubscribe();
  }, []);

  // Clock Ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Re-calculate Astronomical times whenever city, method, or asr juristic rule changes
  useEffect(() => {
    const lat = selectedCity.latitude || 30.0444;
    const lng = selectedCity.longitude || 31.2357;
    const calculated = calculateAstronomicalPrayers(lat, lng, new Date(), selectedMethodId, asrMethod, undefined, globalTimeOffset);
    setComputedTimes(calculated);

    // Asynchronously try live API sync for exact municipal alignment
    setIsLiveSyncing(true);
    fetchLivePrayerTimes(selectedCity.cityEn, selectedCity.countryEn || '', selectedMethodId, lat, lng)
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
      .catch(() => {})
      .finally(() => setIsLiveSyncing(false));
  }, [selectedCity, selectedMethodId, asrMethod, globalTimeOffset]);

  // Persist settings
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
    localStorage.setItem('sakinah_adhan_voice', selectedAdhanVoiceId);
  }, [selectedAdhanVoiceId]);

  useEffect(() => {
    localStorage.setItem('sakinah_auto_adhan', autoAdhanEnabled.toString());
  }, [autoAdhanEnabled]);

  useEffect(() => {
    localStorage.setItem('sakinah_iqamah_delays', JSON.stringify(iqamahDelays));
  }, [iqamahDelays]);

  useEffect(() => {
    localStorage.setItem('sakinah_hijri_offset', hijriOffset.toString());
  }, [hijriOffset]);

  useEffect(() => {
    localStorage.setItem('sakinah_prayer_offsets', JSON.stringify(minuteOffsets));
  }, [minuteOffsets]);

  useEffect(() => {
    localStorage.setItem('sakinah_global_time_offset', globalTimeOffset.toString());
  }, [globalTimeOffset]);

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

  const formatTime12hWithSeconds = (time24: string): string => {
    if (!time24) return '';
    const parts = time24.split(':');
    let h = parseInt(parts[0], 10);
    const m = parts[1] || '00';
    const s = parts[2] || '00';
    const isPM = h >= 12;
    h = h % 12;
    if (h === 0) h = 12;
    const period = language === 'ar' ? (isPM ? 'م' : 'ص') : (isPM ? 'PM' : 'AM');
    return `${String(h).padStart(2, '0')}:${m}:${s} ${period}`;
  };

  // Compute final prayer times with DST + juristic Asr + Fine-tune offsets
  const dstHour = isSummerTime ? 1 : 0;

  const rawPrayers = [
    {
      key: 'fajr',
      nameAr: 'الفجر',
      nameEn: 'Fajr',
      rawTime: computedTimes.fajr,
      time: adjustTimeString(computedTimes.fajr, dstHour, minuteOffsets.fajr || 0),
      icon: <Sunrise className="w-5 h-5 text-amber-300" />,
      color: 'from-amber-500/20 to-teal-500/20'
    },
    {
      key: 'sunrise',
      nameAr: 'الشروق',
      nameEn: 'Sunrise',
      rawTime: computedTimes.sunrise,
      time: adjustTimeString(computedTimes.sunrise, dstHour, minuteOffsets.sunrise || 0),
      icon: <Sun className="w-5 h-5 text-amber-400" />,
      color: 'from-amber-400/20 to-orange-500/20'
    },
    {
      key: 'dhuhr',
      nameAr: 'الظهر',
      nameEn: 'Dhuhr',
      rawTime: computedTimes.dhuhr,
      time: adjustTimeString(computedTimes.dhuhr, dstHour, minuteOffsets.dhuhr || 0),
      icon: <Sun className="w-5 h-5 text-amber-300" />,
      color: 'from-yellow-500/20 to-emerald-500/20'
    },
    {
      key: 'asr',
      nameAr: 'العصر',
      nameEn: 'Asr',
      rawTime: computedTimes.asr,
      time: adjustTimeString(computedTimes.asr, dstHour, minuteOffsets.asr || 0),
      icon: <CloudSun className="w-5 h-5 text-sky-400" />,
      color: 'from-sky-500/20 to-blue-500/20'
    },
    {
      key: 'maghrib',
      nameAr: 'المغرب',
      nameEn: 'Maghrib',
      rawTime: computedTimes.maghrib,
      time: adjustTimeString(computedTimes.maghrib, dstHour, minuteOffsets.maghrib || 0),
      icon: <Sunset className="w-5 h-5 text-orange-400" />,
      color: 'from-orange-500/20 to-rose-500/20'
    },
    {
      key: 'isha',
      nameAr: 'العشاء',
      nameEn: 'Isha',
      rawTime: computedTimes.isha,
      time: adjustTimeString(computedTimes.isha, dstHour, minuteOffsets.isha || 0),
      icon: <Moon className="w-5 h-5 text-indigo-400" />,
      color: 'from-indigo-500/20 to-purple-500/20'
    }
  ];

  // Calculate Next Prayer & Precise Countdown
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
  const currentAdhanVoice = ADHAN_VOICES.find((v) => v.id === selectedAdhanVoiceId) || ADHAN_VOICES[0];
  const nextIqamahDelay = iqamahDelays[nextInfo.prayer.key] || 15;
  const nextIqamahTime = adjustTimeString(nextInfo.prayer.time, 0, nextIqamahDelay);

  // Auto-trigger Adhan if enabled and countdown reaches zero
  useEffect(() => {
    if (
      autoAdhanEnabled &&
      nextInfo.hoursLeft === 0 &&
      nextInfo.minsLeft === 0 &&
      nextInfo.secsLeft === 0
    ) {
      const triggerKey = `${nextInfo.prayer.key}_${todayKey}_${nextInfo.prayer.time}`;
      if (lastTriggeredPrayerRef.current !== triggerKey) {
        lastTriggeredPrayerRef.current = triggerKey;
        // If Fajr, prefer Fajr voice
        const voiceToUse =
          nextInfo.prayer.key === 'fajr'
            ? 'fajr_makkah'
            : selectedAdhanVoiceId;
        adhanAudioEngine.playAdhan(voiceToUse, nextInfo.prayer.nameAr, true);

        showToast(
          language === 'ar' ? `حان الآن موعد أذان ${nextInfo.prayer.nameAr} 🕌` : `Adhan time for ${nextInfo.prayer.nameEn} 🕌`,
          language === 'ar' ? 'الله أكبر، الله أكبر... تقبل الله طاعتكم.' : 'Allahu Akbar... May Allah accept your prayers.'
        );
      }
    }
  }, [nextInfo, autoAdhanEnabled, todayKey, selectedAdhanVoiceId, language, showToast]);

  // GPS Auto-Detection Handler
  const handleDetectGPS = () => {
    soundEngine.playClick();
    triggerHaptic();

    if (!('geolocation' in navigator)) {
      showToast(
        language === 'ar' ? 'الموقع الجغرافي غير مدعوم' : 'Geolocation Not Supported',
        language === 'ar' ? 'يرجى اختيار مدينتك يدوياً من القائمة.' : 'Please select your city manually.'
      );
      return;
    }

    setIsLocatingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        // Calculate Kaaba distance / Qibla angle
        const kaabaLat = 21.4225 * (Math.PI / 180);
        const kaabaLng = 39.8262 * (Math.PI / 180);
        const userLat = latitude * (Math.PI / 180);
        const userLng = longitude * (Math.PI / 180);
        const dLng = kaabaLng - userLng;

        const y = Math.sin(dLng);
        const x = Math.cos(userLat) * Math.tan(kaabaLat) - Math.sin(userLat) * Math.cos(dLng);
        let qibla = Math.atan2(y, x) * (180 / Math.PI);
        qibla = Math.round((qibla + 360) % 360);

        const customCity: CityPrayer = {
          cityAr: 'موقعي الحالي (GPS)',
          cityEn: 'Current GPS Location',
          countryAr: 'إحداثيات حية',
          countryEn: 'Live Coordinates',
          fajr: computedTimes.fajr,
          sunrise: computedTimes.sunrise,
          dhuhr: computedTimes.dhuhr,
          asr: computedTimes.asr,
          maghrib: computedTimes.maghrib,
          isha: computedTimes.isha,
          qiblaAngle: qibla,
          latitude,
          longitude,
          timezone: Math.round(-new Date().getTimezoneOffset() / 60)
        };

        setSelectedCity(customCity);
        setIsLocatingGPS(false);

        showToast(
          language === 'ar' ? 'تم تحديد موقعك بدقة 📍' : 'Location Detected 📍',
          language === 'ar'
            ? `تم حساب مواقيت الصلاة بدقة فلكية فائقة لإحداثياتك (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°).`
            : `Prayer times computed accurately for (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°).`
        );
      },
      (err) => {
        setIsLocatingGPS(false);
        showToast(
          language === 'ar' ? 'تعذر جلب إحداثيات GPS' : 'GPS Permission Denied',
          language === 'ar' ? 'يرجى تفعيل صلاحية الموقع أو اختيار مدينتك من القائمة.' : 'Please allow location permission.'
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Toggle Daily Checklist Item
  const handleTogglePrayerDone = (key: string) => {
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(15);
    const updated = { ...completedPrayers, [key]: !completedPrayers[key] };
    setCompletedPrayers(updated);
  };

  const isPlayingAdhan = adhanPlayState === 'playing';

  return (
    <div id="prayer-times-view" className="w-full max-w-5xl mx-auto space-y-5 pb-24">
      {/* 1. Salawat on the Prophet (صلى الله عليه وسلم) Welcome Audio & Banner */}
      <SalawatWelcomeBanner />

      {/* 2. Top Header Card: City, GPS, Hijri Date, DST, Auto-Adhan & Voice Trigger */}
      <div
        className={`relative overflow-hidden p-5 sm:p-7 rounded-3xl border backdrop-blur-2xl shadow-xl transition-all ${
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
                {language === 'ar' ? 'مواقيت الصلاة الدقيقة والأذان الشريف' : 'Accurate Prayer Times & Adhan'}
              </h1>
              {isLiveSyncing && (
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono animate-pulse">
                  <Radio className="w-3 h-3 animate-spin" />
                  <span>{language === 'ar' ? 'مزامنة فلكية حية' : 'Live Sync'}</span>
                </span>
              )}
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
                <span className="text-slate-400 font-mono">
                  {hijriOffset === 0 ? '٠' : `${hijriOffset > 0 ? '+' : ''}${hijriOffset}`}
                </span>
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

          {/* City Selector, GPS Locate, DST, and Settings Controls */}
          <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
            {/* GPS Auto Detect Button */}
            <button
              onClick={handleDetectGPS}
              disabled={isLocatingGPS}
              title={language === 'ar' ? 'تحديد مواقيت الصلاة بدقة GPS' : 'Auto Detect GPS Coordinates'}
              className="p-2 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-cairo flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Navigation className={`w-4 h-4 text-emerald-400 ${isLocatingGPS ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{language === 'ar' ? 'موقعي (GPS)' : 'GPS'}</span>
            </button>

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

            {/* DST Toggle Button */}
            <button
              onClick={() => {
                soundEngine.playClick();
                triggerHaptic(10);
                const nextState = !isSummerTime;
                setIsSummerTime(nextState);
                showToast(
                  nextState
                    ? language === 'ar'
                      ? '☀️ تم تفعيل التوقيت الصيفي (+١ ساعة)'
                      : '☀️ Summer Time Enabled (+1 hr)'
                    : language === 'ar'
                    ? '❄️ تم تفعيل التوقيت الشتوي (القياسي)'
                    : '❄️ Winter / Standard Time Active',
                  nextState
                    ? language === 'ar'
                      ? 'تمت إضافة ساعة كاملة لجميع مواعيد الصلوات.'
                      : 'All prayer times adjusted +1 hour.'
                    : language === 'ar'
                    ? 'عادت مواعيد الصلوات للوقت القياسي.'
                    : 'Prayer times reverted to standard timetable.'
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
                  ? language === 'ar'
                    ? 'صيفي (+١س)'
                    : 'Summer (+1h)'
                  : language === 'ar'
                  ? 'شتوي'
                  : 'Winter'}
              </span>
            </button>

            {/* Auto-Adhan Master Toggle */}
            <button
              onClick={() => {
                soundEngine.playClick();
                triggerHaptic(12);
                const nextState = !autoAdhanEnabled;
                setAutoAdhanEnabled(nextState);
                adhanAudioEngine.setAutoAdhanEnabled(nextState);
                showToast(
                  nextState
                    ? language === 'ar'
                      ? '🔔 تم تفعيل الأذان التلقائي عند دخول الوقت'
                      : '🔔 Auto-Adhan Enabled'
                    : language === 'ar'
                    ? '🔕 تم إيقاف وكتم الأذان التلقائي'
                    : '🔕 Auto-Adhan Disabled',
                  nextState
                    ? language === 'ar'
                      ? 'سيصدح الأذان الشريف تلقائياً في موعد كل صلاة.'
                      : 'Adhan will play automatically at prayer times.'
                    : language === 'ar'
                    ? 'لن يتم تشغيل أي صوت أذان تلقائياً.'
                    : 'Adhan will not play automatically.'
                );
              }}
              title={language === 'ar' ? 'تفعيل/إيقاف الأذان التلقائي' : 'Toggle Auto-Adhan'}
              className={`px-3 py-1.5 rounded-2xl border text-xs font-bold font-cairo flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                autoAdhanEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10'
                  : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
              }`}
            >
              {autoAdhanEnabled ? <BellRing className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
              <span>{autoAdhanEnabled ? (language === 'ar' ? 'الأذان التلقائي 🔔' : 'Auto: On') : (language === 'ar' ? 'الأذان متوقف 🔕' : 'Auto: Off')}</span>
            </button>

            {/* Adhan Voices Modal Button */}
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              title={language === 'ar' ? 'اختيار صوت المؤذن والأذان' : 'Choose Adhan Voice'}
              className="px-3 py-1.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold font-cairo flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Music className="w-4 h-4 text-amber-400" />
              <span>{language === 'ar' ? 'أصوات الأذان' : 'Adhan Voices'}</span>
            </button>

            {/* Fine-tune & Settings Drawer Trigger */}
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

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs sm:text-sm opacity-90 font-cairo">
                <span>{language === 'ar' ? 'متبقي على الأذان:' : 'Time until Adhan:'}</span>
                <strong className="text-amber-300 font-bold font-mono text-base bg-black/30 px-2.5 py-0.5 rounded-lg border border-amber-400/30">
                  {nextInfo.hoursLeft} {language === 'ar' ? 'س' : 'h'} : {nextInfo.minsLeft} {language === 'ar' ? 'د' : 'm'} : {nextInfo.secsLeft} {language === 'ar' ? 'ث' : 's'}
                </strong>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30 font-cairo">
                  🕌 الإقامة: {nextIqamahTime} (+{nextIqamahDelay}د)
                </span>
              </div>
            </div>

            {/* Right: Prayer Time Big Digital Display & Audio Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="px-6 py-4 rounded-2xl bg-black/30 backdrop-blur-md border border-emerald-400/30 text-center min-w-[140px]">
                <span className="text-[11px] block opacity-75 font-cairo text-emerald-300 font-semibold">
                  {language === 'ar' ? 'موعد الأذان' : 'Adhan Time'}
                </span>
                <span className="text-4xl font-extrabold font-mono text-emerald-300 tracking-wider">
                  {nextInfo.prayer.time}
                </span>
                <span className="text-[10px] text-amber-300/80 block mt-0.5 font-cairo">
                  {isSummerTime ? (language === 'ar' ? 'توقيت صيفي (+١س)' : 'DST (+1h)') : (language === 'ar' ? 'توقيت شتوي' : 'Standard')}
                </span>
              </div>

              {/* Instant Adhan Play & Stop Buttons */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      if (isPlayingAdhan) {
                        adhanAudioEngine.stop();
                        showToast(
                          language === 'ar' ? 'تم إيقاف صوت الأذان ⏹️' : 'Adhan Stopped ⏹️',
                          ''
                        );
                      } else {
                        adhanAudioEngine.playAdhan(selectedAdhanVoiceId, nextInfo.prayer.nameAr);
                      }
                    }}
                    className={`px-4 py-2.5 rounded-2xl border flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                      isPlayingAdhan
                        ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white border-rose-400 animate-pulse shadow-rose-950/60 font-bold'
                        : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
                    }`}
                    title={language === 'ar' ? (isPlayingAdhan ? 'إيقاف صوت الأذان فوراً' : 'استماع لصوت الأذان') : 'Adhan Control'}
                  >
                    {isPlayingAdhan ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    <span className="text-xs font-bold font-cairo">
                      {isPlayingAdhan
                        ? language === 'ar'
                          ? 'إيقاف الأذان ⏹️'
                          : 'Stop Adhan'
                        : language === 'ar'
                          ? 'سماع الأذان'
                          : 'Play Adhan'}
                    </span>
                  </button>

                  {isPlayingAdhan && (
                    <button
                      onClick={() => adhanAudioEngine.toggleMute()}
                      className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 cursor-pointer transition-colors"
                      title={language === 'ar' ? 'كتم/تشغيل' : 'Mute/Unmute'}
                    >
                      {adhanAudioEngine.getIsMuted() ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                {/* Voice Picker Trigger */}
                <button
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-[10px] font-bold font-cairo text-slate-200 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Music className="w-3 h-3 text-amber-300" />
                  <span className="truncate max-w-[120px]">
                    {language === 'ar' ? currentAdhanVoice.nameAr : currentAdhanVoice.nameEn}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* 6 Prayers Grid (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {rawPrayers.map((p) => {
              const isNext = p.key === nextInfo.prayer.key;
              const isDone = completedPrayers[p.key];
              const isPrayerMuted = adhanAudioEngine.isPrayerMuted(p.nameAr);

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

                  <div className="flex items-center justify-between w-full">
                    <div
                      className={`p-2 rounded-2xl ${
                        isNext ? 'bg-emerald-500/30 text-emerald-300' : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {p.icon}
                    </div>

                    {/* Instant Preview Adhan & Per-Prayer Mute */}
                    {p.key !== 'sunrise' && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            const newMute = !isPrayerMuted;
                            adhanAudioEngine.setPrayerMuted(p.nameAr, newMute);
                            showToast(
                              newMute
                                ? language === 'ar'
                                  ? `تم كتم أذان ${p.nameAr} 🔕`
                                  : `${p.nameEn} Muted 🔕`
                                : language === 'ar'
                                ? `تم تفعيل أذان ${p.nameAr} 🔔`
                                : `${p.nameEn} Unmuted 🔔`,
                              ''
                            );
                          }}
                          className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                            isPrayerMuted
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-white/5 hover:bg-white/10 text-slate-400'
                          }`}
                          title={language === 'ar' ? (isPrayerMuted ? `أذان ${p.nameAr} مكتوم، اضغط للتفعيل` : `كتم أذان ${p.nameAr}`) : 'Mute/Unmute'}
                        >
                          {isPrayerMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => {
                            if (isPlayingAdhan) {
                              adhanAudioEngine.stop();
                            } else {
                              const voice = p.key === 'fajr' ? 'fajr_makkah' : selectedAdhanVoiceId;
                              adhanAudioEngine.playAdhan(voice, p.nameAr);
                            }
                          }}
                          className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                            isPlayingAdhan
                              ? 'bg-rose-600 text-white animate-pulse'
                              : 'bg-white/5 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300'
                          }`}
                          title={language === 'ar' ? (isPlayingAdhan ? 'إيقاف الأذان' : `سماع أذان ${p.nameAr}`) : 'Adhan'}
                        >
                          {isPlayingAdhan ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold font-cairo">
                      {language === 'ar' ? p.nameAr : p.nameEn}
                    </h3>
                    <p className="text-lg font-extrabold font-mono text-emerald-400 mt-0.5 animate-fade-in">
                      {formatTime12hWithSeconds(p.time)}
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
                <span>{language === 'ar' ? 'الموقع:' : 'Location:'} {selectedCity.cityAr}</span>
              </div>
            </div>

            {/* Precision Animated Compass */}
            <div className="relative w-32 h-32 rounded-full border-2 border-emerald-500/40 flex items-center justify-center bg-black/40 backdrop-blur-md shadow-inner shadow-emerald-500/20 shrink-0">
              <span className="absolute top-1.5 text-[10px] font-bold text-slate-400 font-mono">N</span>
              <span className="absolute bottom-1.5 text-[10px] font-bold text-slate-400 font-mono">S</span>
              <span className="absolute right-2 text-[10px] font-bold text-slate-400 font-mono">E</span>
              <span className="absolute left-2 text-[10px] font-bold text-slate-400 font-mono">W</span>

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
      {activeTab === 'tracker' && <PrayerTrackerSection />}

      {/* Main Tab 3: Post-Prayer Athkar */}
      {activeTab === 'adhkar' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl border bg-slate-900/70 border-slate-800 backdrop-blur-xl">
            <h2 className="text-lg font-bold font-cairo text-amber-300 mb-1">
              {language === 'ar' ? 'أذكار ما بعد الصلاة المكتوبة (المأثورة عن النبي ﷺ)' : 'Authentic Supplications After Obligatory Prayer'}
            </h2>
            <p className="text-xs text-slate-300 font-cairo">
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
                        const next = currentCount + 1 > athkar.count ? 0 : currentCount + 1;
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
              <h3 className="text-lg">
                {language === 'ar' ? 'إعدادات الأذان والإقامة وحساب المواقيت' : 'Adhan, Iqamah & Calculation Settings'}
              </h3>
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

          {/* Auto Adhan & Sound Notification Toggle */}
          <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <BellRing className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold font-cairo text-amber-200">
                  {language === 'ar' ? 'تشغيل الأذان التلقائي عند دخول وقت الصلاة' : 'Auto-Play Adhan on Prayer Time'}
                </h4>
                <p className="text-xs text-slate-400 font-cairo">
                  {language === 'ar'
                    ? 'سيتم تشغيل نداء الأذان بصوت المؤذن المختار فور انتهاء العد التنازلي.'
                    : 'Plays selected adhan automatically when prayer arrives.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const next = !autoAdhanEnabled;
                setAutoAdhanEnabled(next);
                showToast(
                  next
                    ? language === 'ar'
                      ? 'تم تفعيل الأذان التلقائي 🔔'
                      : 'Auto Adhan Enabled'
                    : language === 'ar'
                    ? 'تم تعطيل الأذان التلقائي'
                    : 'Auto Adhan Disabled',
                  next
                    ? language === 'ar'
                      ? 'سيصدح الأذان تلقائياً عند حلول موعد كل صلاة.'
                      : 'Adhan will play upon prayer time.'
                    : ''
                );
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                autoAdhanEnabled ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  autoAdhanEnabled ? 'translate-x-6 bg-slate-950' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 1. Adhan Voice Modal Trigger */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-300 font-cairo block">
                {language === 'ar' ? 'صوت الأذان المعتمد:' : 'Preferred Adhan Sound:'}
              </label>
              <button
                onClick={() => setIsVoiceModalOpen(true)}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 font-cairo cursor-pointer"
              >
                <Music className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'تغيير واستعراض جميع الأصوات (١١)' : 'Browse Voices (11)'}</span>
              </button>
            </div>

            <div className="p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs block text-slate-100 font-cairo">
                    {language === 'ar' ? currentAdhanVoice.nameAr : currentAdhanVoice.nameEn}
                  </span>
                  <span className="text-[10px] text-amber-300/80 block font-scheherazade">
                    {language === 'ar' ? currentAdhanVoice.muezzinAr : currentAdhanVoice.muezzinEn}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => adhanAudioEngine.toggle(currentAdhanVoice.id)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold font-cairo flex items-center gap-1 cursor-pointer"
                >
                  {isPlayingAdhan ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isPlayingAdhan ? (language === 'ar' ? 'إيقاف' : 'Stop') : (language === 'ar' ? 'تجربة الصوت' : 'Test')}</span>
                </button>
                <button
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold font-cairo cursor-pointer"
                >
                  {language === 'ar' ? 'تغيير' : 'Change'}
                </button>
              </div>
            </div>
          </div>

          {/* 2. Iqamah Delays Per Prayer */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-300 font-cairo block">
              {language === 'ar' ? 'فارق وقت الإقامة بعد الأذان (بالدقائق):' : 'Iqamah Delays After Adhan (Minutes):'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { key: 'fajr', nameAr: 'الفجر' },
                { key: 'dhuhr', nameAr: 'الظهر' },
                { key: 'asr', nameAr: 'العصر' },
                { key: 'maghrib', nameAr: 'المغرب' },
                { key: 'isha', nameAr: 'العشاء' }
              ].map((p) => {
                const val = iqamahDelays[p.key] || 15;
                return (
                  <div key={p.key} className="p-2.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-center font-cairo">
                    <span className="text-xs font-bold text-slate-200 block mb-1">{p.nameAr}</span>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setIqamahDelays({ ...iqamahDelays, [p.key]: Math.max(5, val - 5) })}
                        className="w-6 h-6 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-mono font-bold text-emerald-300 min-w-[28px]">
                        {val}د
                      </span>
                      <button
                        onClick={() => setIqamahDelays({ ...iqamahDelays, [p.key]: Math.min(60, val + 5) })}
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

          {/* 3. Global Time Offset (Timezone Correction) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-300 font-cairo block">
              {language === 'ar' ? 'الفرق الزمني العام (تصحيح التوقيت المحلي):' : 'Global Time Offset (Timezone Correction):'}
            </label>
            <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs block text-slate-100 font-cairo">
                    {language === 'ar' ? 'تعديل التوقيت' : 'Time Adjustment'}
                  </span>
                  <span className="text-[10px] text-emerald-300/80 block font-cairo">
                    {globalTimeOffset === 0 
                      ? (language === 'ar' ? 'بدون تعديل' : 'No adjustment') 
                      : `${globalTimeOffset > 0 ? '+' : ''}${globalTimeOffset} ${language === 'ar' ? 'دقيقة' : 'min'}`}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setGlobalTimeOffset(Math.max(-120, globalTimeOffset - 5))}
                  className="w-8 h-8 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold cursor-pointer text-slate-200"
                >
                  -5
                </button>
                <button
                  onClick={() => setGlobalTimeOffset(Math.max(-120, globalTimeOffset - 1))}
                  className="w-8 h-8 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold cursor-pointer text-slate-200"
                >
                  -1
                </button>
                <button
                  onClick={() => setGlobalTimeOffset(0)}
                  className="w-8 h-8 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-xs font-bold cursor-pointer text-emerald-300"
                >
                  0
                </button>
                <button
                  onClick={() => setGlobalTimeOffset(Math.min(120, globalTimeOffset + 1))}
                  className="w-8 h-8 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold cursor-pointer text-slate-200"
                >
                  +1
                </button>
                <button
                  onClick={() => setGlobalTimeOffset(Math.min(120, globalTimeOffset + 5))}
                  className="w-8 h-8 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold cursor-pointer text-slate-200"
                >
                  +5
                </button>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-cairo">
              {language === 'ar' 
                ? 'استخدم هذا الخيار إذا كان التوقيت المحلي لجهازك غير دقيق بالنسبة لمدينتك.' 
                : 'Use this option if your device local time is inaccurate for your city.'}
            </p>
          </div>

          {/* 4. Calculation Method Authority */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-amber-300 font-cairo block">
              {language === 'ar' ? 'طريقة الحساب الفلكية المعتمدة (زوايا الفجر والعشاء):' : 'Astronomical Calculation Method:'}
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

          {/* 4. Asr Juristic School Method */}
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

          {/* 5. Manual Minutes Adjuster Per Prayer */}
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

      {/* Adhan Voice Picker Modal */}
      <AdhanVoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        selectedVoiceId={selectedAdhanVoiceId}
        onSelectVoice={(voiceId) => setSelectedAdhanVoiceId(voiceId)}
      />
    </div>
  );
};
