import React, { useState, useEffect } from 'react';
import { KhatmahPlan } from '../types';
import {
  BookOpen,
  Calendar,
  Sparkles,
  CheckCircle2,
  Plus,
  Trash2,
  Flame,
  Clock,
  Award,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check,
  TrendingUp,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine, triggerHaptic } from '../utils/audio';

interface KhatmahTrackerProps {
  theme: string;
  language: 'ar' | 'en';
  onNavigateToQuranPage?: (page: number) => void;
}

const DEFAULT_PLANS: KhatmahPlan[] = [
  {
    id: 'khatmah-ramadan-30',
    title: 'ختمة الشهر الفضيل (٣٠ يوماً)',
    durationDays: 30,
    startDate: new Date().toISOString(),
    totalPages: 604,
    pagesRead: 42,
    completedDays: [0, 1],
    dailyTargetPages: 20, // approximately 1 juz per day (20 pages)
    lastReadPage: 42,
    isCompleted: false,
    notes: 'قراءة جزء كامل يومياً بعد صلاة الفجر والعصر'
  }
];

export const KhatmahTracker: React.FC<KhatmahTrackerProps> = ({
  theme,
  language,
  onNavigateToQuranPage
}) => {
  const [plans, setPlans] = useState<KhatmahPlan[]>(() => {
    const saved = localStorage.getItem('sakinah_khatmah_plans');
    return saved ? JSON.parse(saved) : DEFAULT_PLANS;
  });

  const [activePlanId, setActivePlanId] = useState<string>(() => {
    return plans[0]?.id || '';
  });

  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('ختمة مباركة جديدة');
  const [newDuration, setNewDuration] = useState<number>(30); // 7, 14, 30, 60
  const [newTargetMethod, setNewTargetMethod] = useState<'pages' | 'juz'>('pages');

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('sakinah_khatmah_plans', JSON.stringify(plans));
  }, [plans]);

  const activePlan = plans.find((p) => p.id === activePlanId) || plans[0];

  const handleCreatePlan = () => {
    soundEngine.playSuccess();
    triggerHaptic(25);
    const dailyTarget = Math.ceil(604 / newDuration);
    const newPlan: KhatmahPlan = {
      id: `khatmah-${Date.now()}`,
      title: newTitle.trim() || `ختمة الـ ${newDuration} يوماً`,
      durationDays: newDuration,
      startDate: new Date().toISOString(),
      totalPages: 604,
      pagesRead: 0,
      completedDays: [],
      dailyTargetPages: dailyTarget,
      lastReadPage: 1,
      isCompleted: false,
      notes: ''
    };

    setPlans([newPlan, ...plans]);
    setActivePlanId(newPlan.id);
    setIsCreatingNew(false);
  };

  const handleDeletePlan = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playClick();
    const updated = plans.filter((p) => p.id !== id);
    setPlans(updated);
    if (activePlanId === id && updated.length > 0) {
      setActivePlanId(updated[0].id);
    }
  };

  const handleUpdateProgress = (newPage: number) => {
    if (!activePlan) return;
    soundEngine.playClick();
    triggerHaptic(15);
    const clampedPage = Math.max(1, Math.min(604, newPage));
    const isFinished = clampedPage >= 604;

    const updated = plans.map((p) => {
      if (p.id === activePlan.id) {
        return {
          ...p,
          pagesRead: clampedPage,
          lastReadPage: clampedPage,
          isCompleted: isFinished
        };
      }
      return p;
    });

    setPlans(updated);
    if (isFinished) {
      soundEngine.playSuccess();
    }
  };

  const toggleDayCompletion = (dayIndex: number) => {
    if (!activePlan) return;
    soundEngine.playClick();
    triggerHaptic(18);

    const exists = activePlan.completedDays.includes(dayIndex);
    const newCompleted = exists
      ? activePlan.completedDays.filter((d) => d !== dayIndex)
      : [...activePlan.completedDays, dayIndex];

    const updated = plans.map((p) => {
      if (p.id === activePlan.id) {
        const estPages = Math.min(604, newCompleted.length * p.dailyTargetPages);
        return {
          ...p,
          completedDays: newCompleted,
          pagesRead: Math.max(p.pagesRead, estPages),
          isCompleted: newCompleted.length >= p.durationDays
        };
      }
      return p;
    });

    setPlans(updated);
  };

  const progressPercentage = activePlan
    ? Math.min(100, Math.round((activePlan.pagesRead / activePlan.totalPages) * 100))
    : 0;

  // Calculate current estimated Day
  const getElapsedDays = () => {
    if (!activePlan) return 1;
    const start = new Date(activePlan.startDate).getTime();
    const now = new Date().getTime();
    const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, Math.min(activePlan.durationDays, diffDays));
  };

  const elapsedDay = getElapsedDays();

  return (
    <div className="w-full space-y-6">
      {/* Top Banner & Plan Selector */}
      <div
        className={`p-5 sm:p-7 rounded-3xl border backdrop-blur-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 ${
          theme === 'light'
            ? 'bg-gradient-to-br from-emerald-50/90 via-teal-50/70 to-white/90 border-emerald-200 text-slate-800'
            : theme === 'sepia'
            ? 'bg-gradient-to-br from-[#332319]/90 via-[#271a12]/80 to-[#1e130c]/90 border-amber-800/40 text-amber-50'
            : 'bg-gradient-to-br from-emerald-950/60 via-slate-900/90 to-slate-900 border-emerald-500/30 text-slate-100'
        }`}
      >
        <div className="space-y-1.5 text-center md:text-right">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-cairo font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>منظم الختمات القرآنية المباركة</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-cairo text-slate-100">
            {activePlan ? activePlan.title : 'خطة الختمة'}
          </h2>
          <p className="text-xs text-slate-400 font-cairo">
            تتبع وردك القرآني اليومي، واختم كتاب الله بانتظام وتدبر ويقين
          </p>
        </div>

        {/* Action: New Plan Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreatingNew(!isCreatingNew)}
            className="px-4 py-2.5 rounded-2xl bg-emerald-500 text-slate-950 font-bold font-cairo text-xs sm:text-sm flex items-center gap-2 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>خطة ختمة جديدة</span>
          </button>
        </div>
      </div>

      {/* Plan Creation Form Drawer */}
      <AnimatePresence>
        {isCreatingNew && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-5 sm:p-6 rounded-3xl border bg-slate-900/90 border-emerald-500/30 space-y-4"
          >
            <h3 className="font-bold text-sm font-cairo text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>إعداد خطة الختمة القرآنية</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 font-cairo mb-1.5">عنوان الختمة</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: ختمة شهر رمضان المبارك"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 font-cairo focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-cairo mb-1.5">مدة الختمة المقترحة</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { days: 7, label: 'أسبوع (٧ أيام)' },
                    { days: 14, label: 'أسبوعين' },
                    { days: 30, label: 'شهر (٣٠ يوماً)' },
                    { days: 60, label: 'شهرين (٦٠ يوماً)' }
                  ].map((item) => (
                    <button
                      key={item.days}
                      onClick={() => setNewDuration(item.days)}
                      className={`p-2 rounded-xl text-xs font-bold font-cairo transition-all cursor-pointer ${
                        newDuration === item.days
                          ? 'bg-emerald-500 text-slate-950 shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-between text-xs font-cairo">
              <span className="text-slate-300">
                الورد اليومي المطلوب:{' '}
                <strong className="text-emerald-400 font-bold font-mono">
                  {Math.ceil(604 / newDuration)} صفحة / يوم
                </strong>{' '}
                (حوالي {Math.round((604 / newDuration / 20) * 10) / 10} جزء يومياً)
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCreatingNew(false)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleCreatePlan}
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400"
                >
                  إنشاء الخطة
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Khatmah Progress Card */}
      {activePlan && (
        <div className="space-y-6">
          {/* Main Progress Indicator */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border backdrop-blur-xl shadow-xl space-y-6 ${
              theme === 'light'
                ? 'bg-white/90 border-slate-200 text-slate-800'
                : 'bg-slate-900/80 border-slate-800 text-slate-100'
            }`}
          >
            {/* Progress Header & Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Circular Percentage Dial */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-500 transition-all duration-700"
                      strokeDasharray={`${progressPercentage}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-lg sm:text-xl font-extrabold font-mono text-emerald-400">
                      {progressPercentage}%
                    </span>
                    <span className="text-[9px] text-slate-400 font-cairo">منجز</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-cairo text-slate-100">
                    {activePlan.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-cairo mt-1">
                    <span className="text-amber-400 font-bold font-mono">
                      {activePlan.pagesRead} / 604 صفحة
                    </span>
                    <span>•</span>
                    <span>
                      ورد اليوم: <strong className="text-emerald-400">{activePlan.dailyTargetPages} صفحة</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Update Button & Reading Shortcuts */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {onNavigateToQuranPage && (
                  <button
                    onClick={() => onNavigateToQuranPage(activePlan.lastReadPage || 1)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 font-bold font-cairo text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>مواصلة التلاوة من صـ {activePlan.lastReadPage}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Increment Page Slider / Controls */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-cairo">
                <span className="text-slate-300">تحديث آخر صفحة قرأتها:</span>
                <span className="text-emerald-400 font-bold font-mono text-sm">
                  الصفحة {activePlan.pagesRead} من ٦٠٤
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="604"
                value={activePlan.pagesRead}
                onChange={(e) => handleUpdateProgress(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => handleUpdateProgress(activePlan.pagesRead - 1)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-cairo font-bold cursor-pointer"
                >
                  - صفحة
                </button>

                <button
                  onClick={() => handleUpdateProgress(activePlan.pagesRead + activePlan.dailyTargetPages)}
                  className="px-4 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/30 text-emerald-300 text-xs font-cairo font-bold cursor-pointer"
                >
                  + قراءة ورد اليوم ({activePlan.dailyTargetPages} ص)
                </button>

                <button
                  onClick={() => handleUpdateProgress(activePlan.pagesRead + 1)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-cairo font-bold cursor-pointer"
                >
                  + صفحة
                </button>
              </div>
            </div>

            {/* Daily Days Tracker Grid (Day 1 to Duration) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-cairo">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>تتبع الأيام ({activePlan.completedDays.length} / {activePlan.durationDays} يوماً منجزاً)</span>
                </span>
                <span className="text-[11px] text-slate-400">انقر على اليوم لتأكيد إنجازه</span>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {Array.from({ length: activePlan.durationDays }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const isDone = activePlan.completedDays.includes(idx);
                  const isCurrent = dayNum === elapsedDay;

                  return (
                    <button
                      key={idx}
                      onClick={() => toggleDayCompletion(idx)}
                      title={`اليوم ${dayNum}: قراءة الصفحات ${(idx * activePlan.dailyTargetPages) + 1} إلى ${Math.min(604, (idx + 1) * activePlan.dailyTargetPages)}`}
                      className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer relative ${
                        isDone
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20 font-extrabold'
                          : isCurrent
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-[10px] font-mono font-bold">يوم {dayNum}</span>
                      {isDone ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <span className="text-[9px] font-mono opacity-60">
                          {(idx * activePlan.dailyTargetPages) + 1}ص
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
