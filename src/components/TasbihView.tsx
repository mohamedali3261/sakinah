import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { soundEngine, triggerHaptic } from '../utils/audio';
import {
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  Vibrate,
  Settings,
  Target,
  Flame,
  Award,
  Play,
  Pause,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface BeadStyle {
  id: string;
  nameAr: string;
  gradient: string;
  glow: string;
  shadow: string;
}

const BEAD_STYLES: BeadStyle[] = [
  {
    id: 'emerald',
    nameAr: 'الزمرد الملكي 💎',
    gradient: 'radial-gradient(circle at 30% 30%, #d1fae5, #10b981, #047857, #022c22)',
    glow: 'rgba(16, 185, 129, 0.6)',
    shadow: '0 20px 40px rgba(16, 185, 129, 0.4)'
  },
  {
    id: 'amber',
    nameAr: 'العقيق اليماني 🔥',
    gradient: 'radial-gradient(circle at 30% 30%, #fef08a, #f59e0b, #d97706, #78350f)',
    glow: 'rgba(245, 158, 11, 0.6)',
    shadow: '0 20px 40px rgba(245, 158, 11, 0.4)'
  },
  {
    id: 'sapphire',
    nameAr: 'الياقوت الأزرق 🌌',
    gradient: 'radial-gradient(circle at 30% 30%, #bfdbfe, #3b82f6, #1e40af, #1e3a8a)',
    glow: 'rgba(59, 130, 246, 0.6)',
    shadow: '0 20px 40px rgba(59, 130, 246, 0.4)'
  },
  {
    id: 'pearl',
    nameAr: 'اللؤلؤ الأبيض 🤍',
    gradient: 'radial-gradient(circle at 30% 30%, #ffffff, #f8fafc, #e2e8f0, #94a3b8)',
    glow: 'rgba(255, 255, 255, 0.8)',
    shadow: '0 20px 40px rgba(148, 163, 184, 0.5)'
  },
  {
    id: 'ruby',
    nameAr: 'الياقوت الأحمر ❤️',
    gradient: 'radial-gradient(circle at 30% 30%, #fecdd3, #f43f5e, #be123c, #7f1d1d)',
    glow: 'rgba(244, 63, 94, 0.6)',
    shadow: '0 20px 40px rgba(244, 63, 94, 0.4)'
  }
];

const DHIKR_PHRASES = [
  { ar: 'سُبْحَانَ اللَّهِ', en: 'SubhanAllah', recommended: 33 },
  { ar: 'الْحَمْدُ لِلَّهِ', en: 'Alhamdulillah', recommended: 33 },
  { ar: 'اللَّهُ أَكْبَرُ', en: 'Allahu Akbar', recommended: 33 },
  { ar: 'لَا إِلَٰهَ إِلَّا اللَّهُ', en: 'La ilaha illallah', recommended: 100 },
  { ar: 'أَسْتَغْفِرُ اللَّهَ', en: 'Astaghfirullah', recommended: 100 }
];

export const TasbihView: React.FC = () => {
  const {
    language,
    totalDhikrCount,
    incrementGlobalDhikr,
    soundEnabled,
    setSoundEnabled,
    vibrationEnabled,
    setVibrationEnabled,
    showToast
  } = useApp();

  // States
  const [count, setCount] = useState(0);
  const [targetGoal, setTargetGoal] = useState(33);
  const [selectedBead, setSelectedBead] = useState<BeadStyle>(BEAD_STYLES[0]);
  const [selectedDhikr, setSelectedDhikr] = useState(DHIKR_PHRASES[0]);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [autoSpeed, setAutoSpeed] = useState(1500);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [sessionBest, setSessionBest] = useState(0);
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto mode effect
  useEffect(() => {
    if (isAutoMode) {
      autoTimerRef.current = setInterval(() => {
        handleCount();
      }, autoSpeed);
    } else {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    }
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, [isAutoMode, autoSpeed, count, targetGoal]);

  const handleCount = (e?: React.MouseEvent) => {
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(25);

    incrementGlobalDhikr();
    const nextCount = count + 1;

    // Create ripple effect
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rippleId = Date.now();
      setRipples((prev) => [...prev, { id: rippleId, x, y }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== rippleId));
      }, 800);
    }

    if (nextCount >= targetGoal) {
      soundEngine.playCompletion();
      if (vibrationEnabled) triggerHaptic(100);
      setRoundsCompleted((prev) => prev + 1);
      setCount(0);
      setIsAutoMode(false);
      showToast(
        language === 'ar' ? '✨ ما شاء الله! اكتمل الهدف' : '✨ MashaAllah! Goal Completed',
        language === 'ar' ? `أتممت ${targetGoal} تسبيحة` : `Completed ${targetGoal} counts`
      );
      
      if (nextCount > sessionBest) {
        setSessionBest(nextCount);
      }
    } else {
      setCount(nextCount);
      if (nextCount > sessionBest) {
        setSessionBest(nextCount);
      }
    }
  };

  const handleReset = () => {
    setCount(0);
    setIsAutoMode(false);
    if (soundEnabled) soundEngine.playClick();
    showToast(
      language === 'ar' ? 'تم إعادة ضبط العداد' : 'Counter Reset',
      language === 'ar' ? 'بدء جلسة جديدة' : 'New session started'
    );
  };

  const progressPercent = Math.min(100, (count / targetGoal) * 100);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-24 px-4">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 backdrop-blur-3xl bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 p-6 shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10" />
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-white/10 shadow-lg">
              <Sparkles className="w-8 h-8 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-cairo">
                {language === 'ar' ? 'السبحة الإلكترونية' : 'Digital Tasbih'}
              </h1>
              <p className="text-sm text-slate-300 font-cairo mt-1">
                {language === 'ar' ? 'تصميم أنيق وسهل الاستخدام' : 'Elegant & Easy Design'}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="text-center px-5 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <div className="text-xs text-slate-400 font-cairo">{language === 'ar' ? 'الإجمالي' : 'Total'}</div>
              <div className="text-xl font-bold text-emerald-300 font-mono">{totalDhikrCount}</div>
            </div>
            <div className="text-center px-5 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <div className="text-xs text-slate-400 font-cairo">{language === 'ar' ? 'الدورات' : 'Rounds'}</div>
              <div className="text-xl font-bold text-amber-300 font-mono">{roundsCompleted}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Tasbih Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 backdrop-blur-3xl bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 shadow-2xl"
      >
        {/* Ambient glow effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 lg:p-10">
          {/* Current Dhikr Display */}
          <div className="text-center space-y-4 mb-8">
            <motion.p
              key={selectedDhikr.ar}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-emerald-300 font-amiri leading-relaxed"
            >
              {selectedDhikr.ar}
            </motion.p>
            <p className="text-sm text-slate-400 font-cairo">{selectedDhikr.en}</p>
            
            {/* Goal selector */}
            <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
              {[33, 99, 100, 1000].map((goal) => (
                <button
                  key={goal}
                  onClick={() => {
                    setTargetGoal(goal);
                    setCount(0);
                    if (soundEnabled) soundEngine.playClick();
                  }}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold font-cairo transition-all ${
                    targetGoal === goal
                      ? 'bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/50'
                      : 'bg-white/10 text-slate-300 border border-white/20 hover:bg-white/20'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          {/* Main Counter Display - Big Button Style */}
          <div className="flex flex-col items-center justify-center gap-6">
            {/* Big Clickable Counter Button */}
            <button
              onClick={handleCount}
              className="group relative"
            >
              {/* Ripple effects */}
              {ripples.map((r) => (
                <motion.div
                  key={r.id}
                  initial={{ scale: 0, opacity: 0.6 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${selectedBead.glow}, transparent)`
                  }}
                />
              ))}

              {/* Main Counter Circle */}
              <div 
                className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full border-8 flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-active:scale-95"
                style={{
                  background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.15), rgba(15,23,42,0.3))`,
                  borderColor: selectedBead.glow,
                  boxShadow: `0 0 60px ${selectedBead.glow}, 0 20px 60px rgba(0,0,0,0.4), inset 0 0 40px rgba(0,0,0,0.3)`
                }}
              >
                {/* Inner decorative circles */}
                <div 
                  className="absolute inset-4 rounded-full border-4 opacity-40"
                  style={{ borderColor: selectedBead.glow }}
                />
                <div 
                  className="absolute inset-8 rounded-full border-2 opacity-20"
                  style={{ borderColor: selectedBead.glow }}
                />

                {/* Counter Number */}
                <motion.div
                  key={count}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="text-center"
                >
                  <div 
                    className="text-7xl sm:text-8xl lg:text-9xl font-extrabold font-mono text-white drop-shadow-2xl"
                    style={{
                      textShadow: `0 0 30px ${selectedBead.glow}, 0 0 60px ${selectedBead.glow}`
                    }}
                  >
                    {count}
                  </div>
                  <div className="text-sm sm:text-base text-slate-300 font-cairo mt-2">
                    {language === 'ar' ? 'اضغط للتسبيح' : 'Tap to Count'}
                  </div>
                </motion.div>
              </div>

              {/* Decorative dots around the circle */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30) * (Math.PI / 180);
                const radius = 140;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                return (
                  <div
                    key={i}
                    className="absolute w-3 h-3 rounded-full transition-all"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                      background: i < Math.floor((count % targetGoal) / (targetGoal / 12)) 
                        ? selectedBead.glow 
                        : 'rgba(100, 116, 139, 0.3)',
                      boxShadow: i < Math.floor((count % targetGoal) / (targetGoal / 12))
                        ? `0 0 10px ${selectedBead.glow}`
                        : 'none'
                    }}
                  />
                );
              })}
            </button>

            {/* Progress Info */}
            <div className="flex items-center gap-4">
              <div className="px-6 py-3 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/20">
                <div className="text-sm font-cairo text-slate-300 flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <span>
                    {count} / {targetGoal}
                  </span>
                  <span className="text-emerald-400 font-bold">({progressPercent.toFixed(0)}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-2xl mx-auto mt-8">
            <div className="w-full h-4 rounded-full bg-slate-800/50 overflow-hidden border border-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-blue-500 shadow-lg"
                style={{
                  boxShadow: `0 0 20px ${selectedBead.glow}`
                }}
              />
            </div>
          </div>

          {/* Auto Mode Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-white/10 mt-6">
            <button
              onClick={() => {
                setIsAutoMode(!isAutoMode);
                if (soundEnabled) soundEngine.playClick();
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold font-cairo text-sm transition-all ${
                isAutoMode
                  ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/50'
                  : 'bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/50'
              }`}
            >
              {isAutoMode ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{isAutoMode ? 'إيقاف التلقائي' : 'تشغيل تلقائي'}</span>
            </button>

            <div className="flex items-center gap-2 bg-slate-900/50 p-2 rounded-xl">
              <span className="text-xs text-slate-400 font-cairo px-2">السرعة:</span>
              {([1000, 1500, 2000] as const).map((speed) => (
                <button
                  key={speed}
                  onClick={() => setAutoSpeed(speed)}
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                    autoSpeed === speed
                      ? 'bg-emerald-500 text-slate-900'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {speed / 1000}s
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold font-cairo text-sm hover:bg-rose-500/30 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة ضبط</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold font-cairo text-sm transition-all ${
                soundEnabled
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-700/50 border border-slate-600 text-slate-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>الصوت</span>
            </button>

            <button
              onClick={() => setVibrationEnabled(!vibrationEnabled)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold font-cairo text-sm transition-all ${
                vibrationEnabled
                  ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                  : 'bg-slate-700/50 border border-slate-600 text-slate-400'
              }`}
            >
              <Vibrate className="w-4 h-4" />
              <span>الاهتزاز</span>
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 font-bold font-cairo text-sm hover:bg-blue-500/30 transition-all"
            >
              <Settings className="w-4 h-4" />
              {showSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-3xl border border-white/10 backdrop-blur-3xl bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 p-6 shadow-2xl space-y-6">
              {/* Dhikr Selection */}
              <div>
                <h3 className="text-lg font-bold text-white font-cairo mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  {language === 'ar' ? 'اختر الذكر' : 'Select Dhikr'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DHIKR_PHRASES.map((dhikr, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedDhikr(dhikr);
                        setTargetGoal(dhikr.recommended);
                        setCount(0);
                        if (soundEnabled) soundEngine.playClick();
                      }}
                      className={`p-4 rounded-2xl text-right font-amiri transition-all ${
                        selectedDhikr.ar === dhikr.ar
                          ? 'bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-300'
                          : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-lg font-bold mb-1">{dhikr.ar}</div>
                      <div className="text-xs text-slate-400">{dhikr.en}</div>
                      <div className="text-xs text-emerald-400 mt-2">
                        {language === 'ar' ? 'موصى به: ' : 'Recommended: '}
                        {dhikr.recommended}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bead Style Selection */}
              <div>
                <h3 className="text-lg font-bold text-white font-cairo mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  {language === 'ar' ? 'نوع الخرز' : 'Bead Style'}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {BEAD_STYLES.map((bead) => (
                    <button
                      key={bead.id}
                      onClick={() => {
                        setSelectedBead(bead);
                        if (soundEnabled) soundEngine.playClick();
                      }}
                      className={`p-4 rounded-2xl text-center transition-all ${
                        selectedBead.id === bead.id
                          ? 'bg-white/10 border-2 border-white/30 scale-105'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div
                        className="w-16 h-16 rounded-full mx-auto mb-2 transition-transform hover:scale-110"
                        style={{
                          background: bead.gradient,
                          boxShadow: `${bead.shadow}, inset -2px -3px 8px rgba(0,0,0,0.6), inset 2px 3px 6px rgba(255,255,255,0.7)`
                        }}
                      />
                      <div className="text-sm font-cairo text-slate-300">{bead.nameAr}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
