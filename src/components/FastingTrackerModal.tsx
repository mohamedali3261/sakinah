import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  SUNNAH_FASTING_TYPES,
  FASTING_DUAS,
  getNextUpcomingFasting,
  FastingOccasion
} from '../data/fastingData';
import {
  X,
  Calendar,
  Sparkles,
  Heart,
  Clock,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Flame,
  Award,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine, triggerHaptic } from '../utils/audio';

interface FastingTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FastingTrackerModal: React.FC<FastingTrackerModalProps> = ({ isOpen, onClose }) => {
  const { language, theme, showToast, soundEnabled, vibrationEnabled } = useApp();

  const todayKey = new Date().toISOString().slice(0, 10);

  // Persisted list of fasted dates in localStorage
  const [fastedDates, setFastedDates] = useState<string[]>(() => {
    const saved = localStorage.getItem('sakinah_fasted_dates');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<'tracker' | 'occasions' | 'duas'>('tracker');
  const [copiedDuaId, setCopiedDuaId] = useState<string | null>(null);

  const isFastingToday = fastedDates.includes(todayKey);
  const nextFasting = getNextUpcomingFasting();

  useEffect(() => {
    localStorage.setItem('sakinah_fasted_dates', JSON.stringify(fastedDates));
  }, [fastedDates]);

  if (!isOpen) return null;

  const handleToggleTodayFasting = () => {
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(20);

    let updated: string[];
    if (isFastingToday) {
      updated = fastedDates.filter((d) => d !== todayKey);
      showToast(
        language === 'ar' ? 'تم إلغاء تسجيل صيام اليوم' : 'Fasting Record Removed',
        language === 'ar' ? 'يمكنك تحديث سجلك في أي وقت.' : 'Updated your fasting log.'
      );
    } else {
      updated = [...fastedDates, todayKey];
      if (soundEnabled) soundEngine.playSuccess();
      showToast(
        language === 'ar' ? 'تقبل الله صيامك وطاعتك! 🌿' : 'May Allah accept your fast!',
        language === 'ar' ? '«للصائم عند فطره دعوة لا ترد» استغل هذا اليوم المبارك.' : 'Fasting recorded successfully for today.'
      );
    }
    setFastedDates(updated);
  };

  const handleCopyDua = (duaText: string, id: string) => {
    if (soundEnabled) soundEngine.playClick();
    navigator.clipboard.writeText(duaText);
    setCopiedDuaId(id);
    showToast(
      language === 'ar' ? 'تم نسخ الدعاء المبارك' : 'Dua Copied',
      language === 'ar' ? 'احفظه وردده عند الفطر أو الإمساك.' : 'Copied to clipboard.'
    );
    setTimeout(() => setCopiedDuaId(null), 2000);
  };

  // Generate current month days for calendar preview
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col my-auto transition-all ${
          theme === 'light'
            ? 'bg-white border-slate-200 text-slate-800'
            : theme === 'sepia'
            ? 'bg-[#2b1e15] border-amber-800/40 text-amber-50'
            : 'bg-slate-900 border-slate-800 text-slate-100'
        }`}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-700/50 flex items-center justify-between bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-cairo flex items-center gap-2">
                <span>{language === 'ar' ? 'تتبع صيام السُّنّة والتطوع 🌙' : 'Sunnah & Voluntary Fasting'}</span>
              </h2>
              <p className="text-[11px] opacity-70 font-cairo">
                {language === 'ar' ? 'الإثنين والخميس، الأيام البيض، عاشوراء، وعرفة' : 'Mondays, Thursdays, White Days & Special Seasons'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Tabs */}
        <div className="p-3 bg-black/20 border-b border-slate-800 flex items-center gap-2">
          {[
            { id: 'tracker', labelAr: 'سجل الصيام والتذكير', labelEn: 'Tracker & Reminder', icon: <Calendar className="w-4 h-4" /> },
            { id: 'occasions', labelAr: 'مواسم وفضائل الصيام', labelEn: 'Fasting Occasions', icon: <Award className="w-4 h-4" /> },
            { id: 'duas', labelAr: 'أدعية الإفطار والسحور', labelEn: 'Iftar & Suhoor Duas', icon: <Sparkles className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (soundEnabled) soundEngine.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-cairo flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
              }`}
            >
              {tab.icon}
              <span>{language === 'ar' ? tab.labelAr : tab.labelEn}</span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* TAB 1: Fasting Status & Tracker */}
          {activeTab === 'tracker' && (
            <div className="space-y-5">
              {/* Today Fasting Status Glow Card */}
              <div
                className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${
                  isFastingToday
                    ? 'bg-gradient-to-r from-emerald-900/60 via-slate-900 to-teal-900/60 border-emerald-400 shadow-xl shadow-emerald-950/50'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center gap-3.5 text-center sm:text-right">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      isFastingToday
                        ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                        : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    <Moon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-cairo text-slate-100">
                      {isFastingToday
                        ? (language === 'ar' ? 'أنت صائم اليوم، هنيئاً لك الأجر! 🌿' : 'You are fasting today!')
                        : (language === 'ar' ? 'هل أنت صائم اليوم؟' : 'Are you fasting today?')}
                    </h3>
                    <p className="text-xs text-slate-400 font-cairo">
                      {isFastingToday
                        ? (language === 'ar' ? '«للصائم فرحتان: فرحة عند فطره، وفرحة عند لقاء ربه»' : 'Recorded in your voluntary fasting journey.')
                        : (language === 'ar' ? 'سجّل صيامك بنقرة واحدة لتتبع أيام التطوع' : 'Tap to log your voluntary fast for today.')}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleToggleTodayFasting}
                  className={`px-5 py-2.5 rounded-2xl font-bold font-cairo text-xs transition-all cursor-pointer flex items-center gap-2 ${
                    isFastingToday
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isFastingToday
                      ? (language === 'ar' ? 'إلغاء تسجيل الصيام' : 'Cancel Fast')
                      : (language === 'ar' ? 'نويت وأنا صائم اليوم 🌿' : 'I am Fasting Today')}
                  </span>
                </button>
              </div>

              {/* Upcoming Sunnah Fasting Notification Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold font-cairo text-amber-300 block">
                      {language === 'ar' ? 'موعد الصيام المستحب القادم:' : 'Next Sunnah Fasting Opportunity:'}
                    </span>
                    <span className="text-sm font-extrabold font-cairo text-slate-100">
                      {language === 'ar' ? nextFasting.nameAr : nextFasting.nameEn}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {nextFasting.daysLeft === 0 ? 'اليوم!' : `خلال ${nextFasting.daysLeft} أيام`}
                </span>
              </div>

              {/* Fasting Calendar Grid (Current Month) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold font-cairo text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'ar' ? 'سجل أيام الصيام لهذا الشهر' : 'Fasted Days This Month'}</span>
                  </h4>
                  <span className="text-xs font-cairo text-emerald-400 font-bold">
                    {fastedDates.length} {language === 'ar' ? 'أيام تم صيامها' : 'days fasted'}
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                  {['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'].map((dayName, idx) => (
                    <div key={idx} className={`p-1 font-bold text-[10px] font-cairo ${idx === 1 || idx === 4 ? 'text-amber-400' : 'text-slate-500'}`}>
                      {dayName}
                      {(idx === 1 || idx === 4) && ' 🌿'}
                    </div>
                  ))}

                  {monthDays.map((dayNum) => {
                    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                    const isFasted = fastedDates.includes(dateStr);
                    const isToday = dayNum === now.getDate();
                    const dayOfWeek = new Date(currentYear, currentMonth, dayNum).getDay();
                    const isSunnahDay = dayOfWeek === 1 || dayOfWeek === 4; // Mon or Thu

                    return (
                      <div
                        key={dayNum}
                        onClick={() => {
                          if (soundEnabled) soundEngine.playClick();
                          let updated: string[];
                          if (isFasted) {
                            updated = fastedDates.filter((d) => d !== dateStr);
                          } else {
                            updated = [...fastedDates, dateStr];
                          }
                          setFastedDates(updated);
                        }}
                        className={`p-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border flex flex-col items-center justify-center gap-0.5 ${
                          isFasted
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                            : isToday
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                            : isSunnahDay
                            ? 'bg-white/5 border-amber-500/20 text-amber-200 hover:bg-white/10'
                            : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        <span>{dayNum}</span>
                        {isFasted ? (
                          <span className="text-[9px]">🌙</span>
                        ) : isSunnahDay ? (
                          <span className="text-[7px] text-amber-400/80 font-cairo">سُنّة</span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Fasting Occasions & Virtues */}
          {activeTab === 'occasions' && (
            <div className="space-y-4">
              {SUNNAH_FASTING_TYPES.map((occ) => (
                <div
                  key={occ.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm sm:text-base font-bold font-cairo text-emerald-300">
                      {language === 'ar' ? occ.titleAr : occ.titleEn}
                    </h4>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold font-cairo">
                      {language === 'ar' ? occ.badgeAr : occ.badgeEn}
                    </span>
                  </div>

                  <p className="text-xs font-cairo text-slate-300 leading-relaxed">
                    {language === 'ar' ? occ.descriptionAr : occ.descriptionEn}
                  </p>

                  <div className="p-3 rounded-xl bg-black/30 border border-white/5 text-xs font-cairo text-amber-200" dir="rtl">
                    <p>{language === 'ar' ? occ.hadithAr : occ.hadithEn}</p>
                  </div>

                  <div className="text-[11px] font-cairo text-emerald-400/90 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>
                      <strong>{language === 'ar' ? 'فضل وأجر الصيام: ' : 'Reward: '}</strong>
                      {language === 'ar' ? occ.rewardAr : occ.rewardEn}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Authentic Iftar & Suhoor Duas */}
          {activeTab === 'duas' && (
            <div className="space-y-4">
              {FASTING_DUAS.map((dua) => (
                <div
                  key={dua.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold font-cairo text-amber-300">
                        {language === 'ar' ? dua.titleAr : dua.titleEn}
                      </h4>
                    </div>

                    <button
                      onClick={() => handleCopyDua(dua.textAr, dua.id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                      title={language === 'ar' ? 'نسخ الدعاء' : 'Copy'}
                    >
                      {copiedDuaId === dua.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <p
                    dir="rtl"
                    className="text-right text-sm sm:text-base font-bold font-cairo leading-relaxed text-slate-100 p-3 rounded-xl bg-black/20"
                  >
                    {dua.textAr}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-cairo text-slate-400 pt-1">
                    <span>{dua.referenceAr}</span>
                    <span className="text-emerald-400">
                      {dua.when === 'iftar' ? 'عند الإفطار 🌅' : dua.when === 'suhoor' ? 'عند السحور 🌙' : 'عقد النية 🤍'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-700/50 bg-white/5 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-100 font-semibold font-cairo text-xs transition-all cursor-pointer"
          >
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
