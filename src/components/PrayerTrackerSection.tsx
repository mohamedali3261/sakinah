import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Circle,
  Award,
  Sparkles,
  Flame,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  Home
} from 'lucide-react';
import { motion } from 'motion/react';
import { soundEngine, triggerHaptic } from '../utils/audio';

export interface PrayerItemConfig {
  key: string;
  nameAr: string;
  nameEn: string;
  category: 'fard' | 'sunnah_rawatib' | 'nawafil';
  categoryAr: string;
  rakahs: number;
  fadlAr: string;
  fadlEn: string;
  hasJamaahOption?: boolean;
}

export const ALL_PRAYER_ITEMS: PrayerItemConfig[] = [
  // --- الفجر ---
  {
    key: 'fajr_sunnah',
    nameAr: 'سُنّة الفجر (ركعتان)',
    nameEn: 'Fajr Sunnah (2 Rak’ahs)',
    category: 'sunnah_rawatib',
    categoryAr: 'سُنّة راتبة',
    rakahs: 2,
    fadlAr: '«ركعتا الفجر خيرٌ من الدنيا وما فيها» [مسلم]',
    fadlEn: 'Better than this world and everything in it.'
  },
  {
    key: 'fajr_fard',
    nameAr: 'صلاة الفجر (فرض)',
    nameEn: 'Fajr Obligatory Prayer',
    category: 'fard',
    categoryAr: 'فريضة',
    rakahs: 2,
    hasJamaahOption: true,
    fadlAr: '«من صلى الصبح فهو في ذمة الله» [مسلم]',
    fadlEn: 'Under the divine protection of Allah.'
  },

  // --- الضحى ---
  {
    key: 'duha',
    nameAr: 'صلاة الضحى (صلاة الأوابين)',
    nameEn: 'Duha Forenoon Prayer',
    category: 'nawafil',
    categoryAr: 'نافلة مؤكدة',
    rakahs: 2,
    fadlAr: 'تُجزئ عن ٣٦٠ صدقة عن كل مَفْصِل في جسدك يومياً',
    fadlEn: 'Charity on behalf of all 360 joints in your body.'
  },

  // --- الظهر ---
  {
    key: 'dhuhr_sunnah_pre',
    nameAr: 'سُنّة الظهر القَبْلية (٤ ركعات)',
    nameEn: 'Dhuhr Sunnah (4 before)',
    category: 'sunnah_rawatib',
    categoryAr: 'سُنّة راتبة',
    rakahs: 4,
    fadlAr: 'تُفتح لها أبواب السماء وهي من الرواتب المؤكدة',
    fadlEn: 'Doors of heaven open for it.'
  },
  {
    key: 'dhuhr_fard',
    nameAr: 'صلاة الظهر (فرض)',
    nameEn: 'Dhuhr Obligatory Prayer',
    category: 'fard',
    categoryAr: 'فريضة',
    rakahs: 4,
    hasJamaahOption: true,
    fadlAr: 'أول صلاة صلاها جبريل عليه السلام بالنبي ﷺ',
    fadlEn: 'First prayer Angel Jibril prayed with the Prophet ﷺ.'
  },
  {
    key: 'dhuhr_sunnah_post',
    nameAr: 'سُنّة الظهر البَعْدية (ركعتان)',
    nameEn: 'Dhuhr Sunnah (2 after)',
    category: 'sunnah_rawatib',
    categoryAr: 'سُنّة راتبة',
    rakahs: 2,
    fadlAr: '«من حافظ على أربع قبل الظهر وأربع بعدها حرّمه الله على النار»',
    fadlEn: 'Protection from the Hellfire.'
  },

  // --- العصر ---
  {
    key: 'asr_fard',
    nameAr: 'صلاة العصر (الصلاة الوسطى)',
    nameEn: 'Asr Obligatory Prayer',
    category: 'fard',
    categoryAr: 'فريضة',
    rakahs: 4,
    hasJamaahOption: true,
    fadlAr: '«من صلى البردين (الفجر والعصر) دخل الجنة» [متفق عليه]',
    fadlEn: 'Whoever prays the two cool prayers enters Jannah.'
  },

  // --- المغرب ---
  {
    key: 'maghrib_fard',
    nameAr: 'صلاة المغرب (فرض)',
    nameEn: 'Maghrib Obligatory Prayer',
    category: 'fard',
    categoryAr: 'فريضة',
    rakahs: 3,
    hasJamaahOption: true,
    fadlAr: 'وتر النهار وأول صلوات الليل المبارك',
    fadlEn: 'The witr (odd) prayer of daytime.'
  },
  {
    key: 'maghrib_sunnah',
    nameAr: 'سُنّة المغرب (ركعتان بعدها)',
    nameEn: 'Maghrib Sunnah (2 after)',
    category: 'sunnah_rawatib',
    categoryAr: 'سُنّة راتبة',
    rakahs: 2,
    fadlAr: 'تُرفع في عليين ومن السنن المؤكدة',
    fadlEn: 'Confirmed Sunnah raised to highest ranks.'
  },

  // --- العشاء والوتر وقيام الليل ---
  {
    key: 'isha_fard',
    nameAr: 'صلاة العشاء (فرض)',
    nameEn: 'Isha Obligatory Prayer',
    category: 'fard',
    categoryAr: 'فريضة',
    rakahs: 4,
    hasJamaahOption: true,
    fadlAr: '«من صلى العشاء في جماعة فكأنما قام نصف الليل» [مسلم]',
    fadlEn: 'Praying in congregation equals praying half the night.'
  },
  {
    key: 'isha_sunnah',
    nameAr: 'سُنّة العشاء (ركعتان بعدها)',
    nameEn: 'Isha Sunnah (2 after)',
    category: 'sunnah_rawatib',
    categoryAr: 'سُنّة راتبة',
    rakahs: 2,
    fadlAr: 'تستكمل بها ١٢ ركعة راتبة ليبنى لك بيت في الجنة',
    fadlEn: 'Completes 12 daily Sunnahs for a palace in Jannah.'
  },
  {
    key: 'witr',
    nameAr: 'صلاة الشفع والوتر',
    nameEn: 'Witr Prayer',
    category: 'nawafil',
    categoryAr: 'نافلة مؤكدة',
    rakahs: 3,
    fadlAr: '«إن الله وتر يحب الوتر فأوتروا يا أهل القرآن» [أبو داود]',
    fadlEn: 'Allah is Witr (One) and loves Witr.'
  },
  {
    key: 'qiyam',
    nameAr: 'قيام الليل والتهجد',
    nameEn: 'Tahajjud & Night Vigil',
    category: 'nawafil',
    categoryAr: 'شرف المؤمن',
    rakahs: 2,
    fadlAr: '«أفضل الصلاة بعد الفريضة صلاة الليل» [مسلم]',
    fadlEn: 'The most virtuous prayer after the obligatory ones.'
  }
];

export const PrayerTrackerSection: React.FC = () => {
  const { language, theme, showToast, soundEnabled, vibrationEnabled } = useApp();

  const todayKey = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<string>(todayKey);

  // State: completed map for selected date: { [prayerKey]: boolean }
  const [completedState, setCompletedState] = useState<{ [key: string]: boolean }>(() => {
    const saved = localStorage.getItem(`sakinah_prayers_done_${todayKey}`);
    return saved ? JSON.parse(saved) : {};
  });

  // State: jamaah map for selected date: { [prayerKey]: boolean }
  const [jamaahState, setJamaahState] = useState<{ [key: string]: boolean }>(() => {
    const saved = localStorage.getItem(`sakinah_prayers_jamaah_${todayKey}`);
    return saved ? JSON.parse(saved) : {};
  });

  // Filter category in tracker tab
  const [activeFilter, setActiveFilter] = useState<'all' | 'fard' | 'sunnah_rawatib' | 'nawafil'>('all');

  // Load state when selected date changes
  useEffect(() => {
    const savedCompleted = localStorage.getItem(`sakinah_prayers_done_${selectedDate}`);
    setCompletedState(savedCompleted ? JSON.parse(savedCompleted) : {});

    const savedJamaah = localStorage.getItem(`sakinah_prayers_jamaah_${selectedDate}`);
    setJamaahState(savedJamaah ? JSON.parse(savedJamaah) : {});
  }, [selectedDate]);

  // Persist state
  const handleToggleDone = (key: string) => {
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(15);

    const updated = { ...completedState, [key]: !completedState[key] };
    setCompletedState(updated);
    localStorage.setItem(`sakinah_prayers_done_${selectedDate}`, JSON.stringify(updated));

    if (updated[key]) {
      showToast(
        language === 'ar' ? 'تقبل الله طاعتك! 🤲' : 'Prayer Recorded!',
        language === 'ar' ? 'تم تسجيل الصلاة في سجلك اليومي.' : 'Recorded in your daily tracker.'
      );
    }
  };

  const handleToggleJamaah = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(10);

    const updated = { ...jamaahState, [key]: !jamaahState[key] };
    setJamaahState(updated);
    localStorage.setItem(`sakinah_prayers_jamaah_${selectedDate}`, JSON.stringify(updated));
  };

  const filteredItems = activeFilter === 'all'
    ? ALL_PRAYER_ITEMS
    : ALL_PRAYER_ITEMS.filter((item) => item.category === activeFilter);

  // Stats calculation
  const fardCount = ALL_PRAYER_ITEMS.filter((i) => i.category === 'fard').length;
  const fardDone = ALL_PRAYER_ITEMS.filter((i) => i.category === 'fard' && completedState[i.key]).length;

  const sunnahCount = ALL_PRAYER_ITEMS.filter((i) => i.category === 'sunnah_rawatib').length;
  const sunnahDone = ALL_PRAYER_ITEMS.filter((i) => i.category === 'sunnah_rawatib' && completedState[i.key]).length;

  const totalDone = ALL_PRAYER_ITEMS.filter((i) => completedState[i.key]).length;
  const overallPercentage = Math.round((totalDone / ALL_PRAYER_ITEMS.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header Stats Overview Card */}
      <div
        className={`p-5 sm:p-6 rounded-3xl border backdrop-blur-2xl transition-all ${
          theme === 'light'
            ? 'bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-emerald-200 text-slate-800 shadow-lg'
            : theme === 'sepia'
            ? 'bg-gradient-to-br from-[#3b2b20]/90 to-[#221610]/90 border-amber-800/40 text-amber-50 shadow-xl'
            : 'bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-emerald-950/40 border-emerald-500/30 text-slate-100 shadow-xl'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-right">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base sm:text-lg font-bold font-cairo text-emerald-400">
                {language === 'ar' ? 'سجل الصلوات والسنن الرواتب والنوافل' : 'Daily Prayers & Nawafil Tracker'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-cairo">
              {language === 'ar'
                ? 'حافظ على صلواتك في وقتها وأكمل ١٢ ركعة من السنن الرواتب ليبنى لك بيت في الجنة.'
                : 'Track daily obligations, 12 Sunnah Rawatib, and night vigils.'}
            </p>
          </div>

          {/* Overall Percentage Circle */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-2xl font-extrabold font-mono text-emerald-400 block">{overallPercentage}%</span>
              <span className="text-[10px] text-slate-400 font-cairo">{totalDone}/{ALL_PRAYER_ITEMS.length} صلاة ونافلة</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 font-bold text-xs font-mono">
              {fardDone}/5
            </div>
          </div>
        </div>

        {/* Breakdown mini metrics */}
        <div className="grid grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-slate-700/40">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
            <span className="text-[10px] text-slate-400 font-cairo block">{language === 'ar' ? 'الفرائض الخمس' : '5 Fard Prayers'}</span>
            <span className="text-sm sm:text-base font-bold font-mono text-emerald-400">{fardDone} / {fardCount}</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
            <span className="text-[10px] text-slate-400 font-cairo block">{language === 'ar' ? 'السنن الرواتب' : 'Sunnah Rawatib'}</span>
            <span className="text-sm sm:text-base font-bold font-mono text-amber-400">{sunnahDone} / {sunnahCount}</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
            <span className="text-[10px] text-slate-400 font-cairo block">{language === 'ar' ? 'صلاة الجماعة' : 'In Congregation'}</span>
            <span className="text-sm sm:text-base font-bold font-mono text-sky-400">
              {Object.values(jamaahState).filter(Boolean).length}
            </span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', labelAr: 'الكل (١٣)', labelEn: 'All (13)' },
          { id: 'fard', labelAr: 'الفرائض الخمس (٥) 🕌', labelEn: '5 Obligatory' },
          { id: 'sunnah_rawatib', labelAr: 'السنن الرواتب (١٢ ركعة) 🌟', labelEn: 'Sunnah Rawatib' },
          { id: 'nawafil', labelAr: 'الضحى والوتر وقيام الليل 🌙', labelEn: 'Duha, Witr & Qiyam' }
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => {
              if (soundEnabled) soundEngine.playClick();
              setActiveFilter(filter.id as any);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-cairo whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === filter.id
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
            }`}
          >
            {language === 'ar' ? filter.labelAr : filter.labelEn}
          </button>
        ))}
      </div>

      {/* Checklist List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredItems.map((item) => {
          const isDone = Boolean(completedState[item.key]);
          const isJamaah = Boolean(jamaahState[item.key]);

          return (
            <div
              key={item.key}
              onClick={() => handleToggleDone(item.key)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isDone
                  ? 'bg-emerald-500/15 border-emerald-400/60 text-slate-100 shadow-md shadow-emerald-950/30'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-transform shrink-0 ${
                    isDone ? 'text-emerald-400 scale-110' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-5 h-5 fill-emerald-500/20" /> : <Circle className="w-5 h-5" />}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-bold font-cairo ${isDone ? 'text-emerald-300' : 'text-slate-100'}`}>
                      {language === 'ar' ? item.nameAr : item.nameEn}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 font-bold font-cairo text-slate-400">
                      {item.rakahs} {language === 'ar' ? 'ركعات' : 'Rak’ahs'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 font-cairo leading-snug">
                    {language === 'ar' ? item.fadlAr : item.fadlEn}
                  </p>
                </div>
              </div>

              {/* Jama'ah Toggle Option for Fard prayers */}
              {item.hasJamaahOption && isDone && (
                <button
                  onClick={(e) => handleToggleJamaah(e, item.key)}
                  title={language === 'ar' ? 'صلاة في المسجد / جماعة' : 'Congregation'}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold font-cairo flex items-center gap-1 transition-all cursor-pointer ${
                    isJamaah
                      ? 'bg-sky-500/25 border border-sky-400 text-sky-300'
                      : 'bg-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Building2 className="w-3 h-3" />
                  <span>{language === 'ar' ? (isJamaah ? 'جماعة 🕌' : 'فردي') : (isJamaah ? 'Jama’ah' : 'Individual')}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
