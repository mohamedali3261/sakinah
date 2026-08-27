import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RotateCcw, Plus, CheckCircle2, Edit3, Trash2, 
  Sparkles, Smartphone, Flame, Maximize2, Minimize2, 
  Check, Award, Zap, HelpCircle, Volume2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { triggerHaptic, soundEngine } from '../utils/audio';

interface SebhaPreset {
  id: string;
  textAr: string;
  textEn: string;
  defaultTarget: number;
  isCustom?: boolean;
}

const DEFAULT_SEBHA_PRESETS: SebhaPreset[] = [
  { id: 'subhan', textAr: 'سُبْحَانَ اللَّهِ', textEn: 'Subhan Allah', defaultTarget: 33 },
  { id: 'alhamdulillah', textAr: 'الْحَمْدُ لِلَّهِ', textEn: 'Alhamdulillah', defaultTarget: 33 },
  { id: 'allahu_akbar', textAr: 'اللَّهُ أَكْبَرُ', textEn: 'Allahu Akbar', defaultTarget: 33 },
  { id: 'la_ilaha', textAr: 'لَا إِلَهَ إِلَّا اللَّهُ', textEn: 'La ilaha illa Allah', defaultTarget: 100 },
  { id: 'istighfar', textAr: 'أَسْتَغْفِرُ اللَّهَ', textEn: 'Astaghfirullah', defaultTarget: 100 },
  { id: 'salawat', textAr: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ', textEn: 'Salawat', defaultTarget: 100 },
  { id: 'hawqala', textAr: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', textEn: 'La hawla wa la quwwata illa billah', defaultTarget: 100 },
  { id: 'open', textAr: 'ذِكْر حُر', textEn: 'Open Dhikr', defaultTarget: 1000 },
];

interface BeadTheme {
  id: string;
  nameAr: string;
  nameEn: string;
  soundType: 'wood' | 'gem' | 'mechanical' | 'soft';
  normalGradient: {
    stop0: string;
    stop30: string;
    stop75: string;
    stop100: string;
  };
  activeGradient: {
    stop0: string;
    stop25: string;
    stop70: string;
    stop100: string;
  };
  threadColor: string;
}

const BEAD_THEMES: BeadTheme[] = [
  {
    id: 'kuka',
    nameAr: 'خشب الكوك الروحي',
    nameEn: 'Mahogany Kuka Wood',
    soundType: 'wood',
    normalGradient: { stop0: '#ffedd5', stop30: '#c2410c', stop75: '#7c2d12', stop100: '#431407' },
    activeGradient: { stop0: '#fef08a', stop25: '#ea580c', stop70: '#9a3412', stop100: '#7c2d12' },
    threadColor: '#d97706'
  },
  {
    id: 'emerald',
    nameAr: 'الزمرد الأخضر',
    nameEn: 'Spiritual Emerald',
    soundType: 'gem',
    normalGradient: { stop0: '#a7f3d0', stop30: '#10b981', stop75: '#047857', stop100: '#022c22' },
    activeGradient: { stop0: '#ecfeff', stop25: '#22d3ee', stop70: '#0891b2', stop100: '#155e75' },
    threadColor: '#10b981'
  },
  {
    id: 'pearl',
    nameAr: 'اللؤلؤ الأبيض النقي',
    nameEn: 'Luminous White Pearl',
    soundType: 'soft',
    normalGradient: { stop0: '#ffffff', stop30: '#e2e8f0', stop75: '#cbd5e1', stop100: '#64748b' },
    activeGradient: { stop0: '#fef08a', stop25: '#facc15', stop70: '#ca8a04', stop100: '#854d0e' },
    threadColor: '#e2e8f0'
  },
  {
    id: 'metallic',
    nameAr: 'العداد الفضي',
    nameEn: 'Silver Clicker',
    soundType: 'mechanical',
    normalGradient: { stop0: '#f8fafc', stop30: '#94a3b8', stop75: '#475569', stop100: '#1e293b' },
    activeGradient: { stop0: '#ecfeff', stop25: '#22d3ee', stop70: '#0891b2', stop100: '#155e75' },
    threadColor: '#94a3b8'
  }
];

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export const SebhaView: React.FC = () => {
  const { 
    language, 
    theme, 
    vibrationEnabled, 
    setVibrationEnabled,
    soundEnabled,
    setSoundEnabled
  } = useApp();
  
  // Custom Preset State
  const [presets, setPresets] = useState<SebhaPreset[]>(DEFAULT_SEBHA_PRESETS);
  const [activePreset, setActivePreset] = useState<SebhaPreset>(DEFAULT_SEBHA_PRESETS[0]);
  const [count, setCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [customTarget, setCustomTarget] = useState<number | null>(null);
  
  // Custom Bead Theme state
  const [selectedThemeId, setSelectedThemeId] = useState<string>(() => {
    return localStorage.getItem('sebha_bead_theme') || 'kuka';
  });
  const currentBeadTheme = BEAD_THEMES.find(t => t.id === selectedThemeId) || BEAD_THEMES[0];

  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleIdRef = useRef(0);
  const [isImmersiveMode, setIsImmersiveMode] = useState(false);
  const [beadRotationAngle, setBeadRotationAngle] = useState(0);
  const [isVisualShaking, setIsVisualShaking] = useState(false);

  // New Preset Creator Controls
  const [isCreatingPreset, setIsCreatingPreset] = useState(false);
  const [newPresetTextAr, setNewPresetTextAr] = useState('');
  const [newPresetTextEn, setNewPresetTextEn] = useState('');
  const [newPresetTarget, setNewPresetTarget] = useState(33);

  // Streak/Consistency States
  const [streak, setStreak] = useState(0);
  const [completedToday, setCompletedToday] = useState<string[]>([]);

  const currentTarget = customTarget || activePreset.defaultTarget;

  // Load Custom Presets & State on mount
  useEffect(() => {
    // Custom presets loading
    const savedCustom = localStorage.getItem('custom_sebha_presets');
    if (savedCustom) {
      try {
        const parsed = JSON.parse(savedCustom) as SebhaPreset[];
        setPresets([...DEFAULT_SEBHA_PRESETS, ...parsed]);
      } catch (e) {
        console.error('Failed parsing custom presets', e);
      }
    }

    // Daily streak loading
    const savedStreak = localStorage.getItem('sebha_streak');
    if (savedStreak) setStreak(parseInt(savedStreak, 10));

    // Daily completed list loading
    const todayStr = new Date().toDateString();
    const savedCompletedDate = localStorage.getItem('sebha_completed_date');
    if (savedCompletedDate === todayStr) {
      const savedCompleted = localStorage.getItem('sebha_completed_list');
      if (savedCompleted) {
        try {
          setCompletedToday(JSON.parse(savedCompleted));
        } catch {}
      }
    } else {
      localStorage.setItem('sebha_completed_date', todayStr);
      localStorage.setItem('sebha_completed_list', JSON.stringify([]));
    }
  }, []);

  // Save/load individual preset count when active preset changes
  useEffect(() => {
    const savedCount = localStorage.getItem(`sebha_count_${activePreset.id}`);
    const savedTotal = localStorage.getItem(`sebha_total_${activePreset.id}`);
    const savedCustomTarget = localStorage.getItem(`sebha_target_${activePreset.id}`);
    
    if (savedCount) setCount(parseInt(savedCount, 10));
    else setCount(0);
    
    if (savedTotal) setTotalCount(parseInt(savedTotal, 10));
    else setTotalCount(0);
    
    if (savedCustomTarget) setCustomTarget(parseInt(savedCustomTarget, 10));
    else setCustomTarget(null);
  }, [activePreset.id]);

  const handleTap = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Trigger visual ripple effect
    const newRippleId = rippleIdRef.current++;
    setRipples(prev => [...prev, { id: newRippleId, x, y }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRippleId));
    }, 600);

    const newCount = count + 1;
    setCount(newCount);
    
    const newTotal = totalCount + 1;
    setTotalCount(newTotal);
    
    // Play realistic bead sound
    soundEngine.playClick(currentBeadTheme.soundType);

    // Rotate the visual bead ring
    setBeadRotationAngle(prev => prev + (360 / 33));

    localStorage.setItem(`sebha_count_${activePreset.id}`, newCount.toString());
    localStorage.setItem(`sebha_total_${activePreset.id}`, newTotal.toString());
    
    const isTargetReached = newCount > 0 && newCount % currentTarget === 0;
    
    // Trigger Visual Shake / Vibration
    setIsVisualShaking(true);
    setTimeout(() => setIsVisualShaking(false), 120);

    // VIBRATION ENGINES WITH MULTI-PLATFORM FALLBACKS
    if (vibrationEnabled) {
      if (isTargetReached) {
        triggerHaptic(100);
        // Secondary vibration pulse for tactile completion cue
        setTimeout(() => triggerHaptic(80), 150);
      } else {
        triggerHaptic(35);
      }
    }

    // TARGET COMPLETED MILESTONE STATE
    if (isTargetReached) {
      if (!completedToday.includes(activePreset.id)) {
        const updated = [...completedToday, activePreset.id];
        setCompletedToday(updated);
        localStorage.setItem('sebha_completed_list', JSON.stringify(updated));

        // Update streak logic
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem('sebha_streak', newStreak.toString());
      }
    }
  };

  const handleReset = () => {
    setCount(0);
    localStorage.setItem(`sebha_count_${activePreset.id}`, '0');
    // Soft reset haptic feedback
    if (vibrationEnabled) triggerHaptic(50);
  };

  const changeTarget = () => {
    const current = customTarget || activePreset.defaultTarget;
    const targets = [33, 100, 1000];
    const nextIndex = (targets.indexOf(current) + 1) % targets.length;
    const nextTarget = targets[nextIndex] || 33;
    setCustomTarget(nextTarget);
    localStorage.setItem(`sebha_target_${activePreset.id}`, nextTarget.toString());
    
    if (vibrationEnabled) triggerHaptic(25);
  };

  const handleSelectPreset = (preset: SebhaPreset) => {
    setActivePreset(preset);
    if (vibrationEnabled) triggerHaptic(20);
  };

  const handleCreatePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetTextAr.trim()) return;

    const newPreset: SebhaPreset = {
      id: `custom_${Date.now()}`,
      textAr: newPresetTextAr,
      textEn: newPresetTextEn || newPresetTextAr,
      defaultTarget: newPresetTarget,
      isCustom: true
    };

    const updatedCustomList = [...presets.filter(p => p.isCustom), newPreset];
    localStorage.setItem('custom_sebha_presets', JSON.stringify(updatedCustomList));
    setPresets([...DEFAULT_SEBHA_PRESETS, ...updatedCustomList]);
    setActivePreset(newPreset);
    
    // Clear inputs
    setNewPresetTextAr('');
    setNewPresetTextEn('');
    setNewPresetTarget(33);
    setIsCreatingPreset(false);

    if (vibrationEnabled) triggerHaptic(40);
  };

  const handleDeletePreset = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid activating the preset on click
    const remainingCustom = presets.filter(p => p.isCustom && p.id !== idToDelete);
    localStorage.setItem('custom_sebha_presets', JSON.stringify(remainingCustom));
    setPresets([...DEFAULT_SEBHA_PRESETS, ...remainingCustom]);
    
    if (activePreset.id === idToDelete) {
      setActivePreset(DEFAULT_SEBHA_PRESETS[0]);
    }

    if (vibrationEnabled) triggerHaptic(30);
  };

  // Check Web Vibration API availability
  const isVibrationSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  // Circular beads coordinates generation (33 beads)
  const renderBeadRing = () => {
    const beadsCount = 33;
    const radius = 43;
    const center = 50;
    const beads = [];

    for (let i = 0; i < beadsCount; i++) {
      const angle = (i * (360 / beadsCount)) * (Math.PI / 180);
      const cx = center + radius * Math.cos(angle);
      const cy = center + radius * Math.sin(angle);
      
      const isCurrentBead = (count % beadsCount) === i;

      beads.push(
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={isCurrentBead ? 3.3 : 2.1}
          fill={isCurrentBead ? "url(#bead-active)" : "url(#bead-normal)"}
          filter={isCurrentBead ? "url(#active-glow)" : "url(#bead-shadow)"}
          className="transition-all duration-300"
        />
      );
    }
    return beads;
  };

  // Progress percentage
  const progress = Math.min((count % currentTarget === 0 && count > 0 ? 100 : (count % currentTarget) / currentTarget * 100), 100);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-32 pt-4 px-4 sm:px-6 transition-all duration-500">
      
      {/* Immersive Screen Fade Controller */}
      <AnimatePresence>
        {isImmersiveMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950 z-50 flex flex-col items-center justify-center p-6 select-none"
          >
            {/* Exit Immersive Button */}
            <button 
              onClick={() => setIsImmersiveMode(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all cursor-pointer"
            >
              <Minimize2 className="w-5 h-5" />
            </button>

            {/* Immersive Content */}
            <div className="text-center space-y-2 mb-8">
              <h3 className="text-3xl font-bold font-amiri text-emerald-400">
                {activePreset.textAr}
              </h3>
              <p className="text-sm opacity-60 font-cairo text-slate-300">
                {activePreset.textEn}
              </p>
            </div>

            {/* Tap Button Center */}
            <div className="relative w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] flex items-center justify-center">
              <svg className="absolute w-full h-full -rotate-90 pointer-events-none drop-shadow-2xl" viewBox="0 0 100 100">
                <defs>
                  {/* Dynamic Normal 3D Bead */}
                  <radialGradient id="bead-normal" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor={currentBeadTheme.normalGradient.stop0} />
                    <stop offset="30%" stopColor={currentBeadTheme.normalGradient.stop30} />
                    <stop offset="75%" stopColor={currentBeadTheme.normalGradient.stop75} />
                    <stop offset="100%" stopColor={currentBeadTheme.normalGradient.stop100} />
                  </radialGradient>
                  
                  {/* Dynamic Active 3D Bead */}
                  <radialGradient id="bead-active" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor={currentBeadTheme.activeGradient.stop0} />
                    <stop offset="25%" stopColor={currentBeadTheme.activeGradient.stop25} />
                    <stop offset="70%" stopColor={currentBeadTheme.activeGradient.stop70} />
                    <stop offset="100%" stopColor={currentBeadTheme.activeGradient.stop100} />
                  </radialGradient>

                  {/* Metallic Gold Tassel */}
                  <radialGradient id="gold-metallic" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="35%" stopColor="#fbbf24" />
                    <stop offset="75%" stopColor="#b45309" />
                    <stop offset="100%" stopColor="#78350f" />
                  </radialGradient>

                  {/* Realistic drop shadow for beads */}
                  <filter id="bead-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="1.2" stdDeviation="0.8" floodColor="#020617" floodOpacity="0.45" />
                  </filter>

                  {/* Ambient glow for active bead */}
                  <filter id="active-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Inner Thread Cord */}
                <circle
                  cx="50"
                  cy="50"
                  r="43"
                  fill="none"
                  stroke={currentBeadTheme.threadColor}
                  strokeWidth="0.5"
                  className="opacity-40"
                />

                {/* Main Beads Group with Spring-based Rotations */}
                <motion.g
                  animate={{ rotate: -count * (360 / 33) + 90 }}
                  transition={{ type: 'spring', stiffness: 90, damping: 15 }}
                  style={{ transformOrigin: '50px 50px' }}
                >
                  {renderBeadRing()}
                </motion.g>

                {/* Golden Tassel at the Top (Anchor) */}
                <g transform="translate(50, 7)" filter="url(#bead-shadow)">
                  <path d="M-1.5,0 L1.5,0 L2,3 L-2,3 Z" fill="url(#gold-metallic)" />
                  <circle cx="0" cy="4.5" r="1.5" fill="url(#gold-metallic)" />
                  {/* Silk Tassels */}
                  <path d="M-0.8,6 L0.8,6 L1.5,13 L-1.5,13 Z" fill="#b45309" opacity="0.95" />
                  <path d="M-0.4,13 L0.4,13 L0.6,18 L-0.6,18 Z" fill="#d97706" />
                  <circle cx="0" cy="19.5" r="0.8" fill="url(#gold-metallic)" />
                </g>
              </svg>

              <motion.button
                animate={isVisualShaking ? {
                  x: [0, -4, 4, -4, 4, -2, 2, 0],
                  y: [0, 2, -2, 2, -2, 1, -1, 0],
                } : {}}
                transition={{ duration: 0.15 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTap}
                className="relative z-10 w-[240px] h-[240px] rounded-full flex flex-col items-center justify-center border-4 border-emerald-500/20 bg-slate-900/80 shadow-[0_20px_50px_rgba(16,185,129,0.15),inset_0_2px_15px_rgba(255,255,255,0.05)] cursor-pointer select-none"
              >
                {ripples.map(ripple => (
                  <motion.span
                    key={ripple.id}
                    initial={{ scale: 0, opacity: 0.6 }}
                    animate={{ scale: 4, opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      left: ripple.x - 10,
                      top: ripple.y - 10,
                      width: 20,
                      height: 20,
                      backgroundColor: 'rgba(16, 185, 129, 0.3)',
                    }}
                  />
                ))}
                <span className="text-7xl font-bold font-mono tracking-tighter text-white drop-shadow-md">
                  {count}
                </span>
                <span className="text-xs font-cairo opacity-40 uppercase tracking-widest mt-1 text-slate-300">
                  / {currentTarget}
                </span>
              </motion.button>
            </div>

            <div className="flex items-center gap-6 mt-10">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="text-xs font-bold font-cairo">{language === 'ar' ? 'تصفير' : 'Reset'}</span>
              </button>

              <div className="px-5 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <span className="text-[10px] block font-cairo opacity-60 text-emerald-400 uppercase tracking-wider">
                  {language === 'ar' ? 'المجموع' : 'Total'}
                </span>
                <span className="text-base font-bold font-mono text-emerald-300">
                  {totalCount.toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header / Title Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-3xl border border-slate-200/40 dark:border-white/5 bg-slate-900/40 backdrop-blur-sm text-center sm:text-right">
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
            <span className="p-1 px-2.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold font-cairo flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {language === 'ar' ? 'المسبحة الروحية المطورة' : 'Interactive Spiritual Sebha'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-cairo tracking-tight text-slate-100">
            {language === 'ar' ? 'المِسْبَحَة الذكية' : 'Smart Sebha'}
          </h2>
        </div>

        {/* Streak and Focus widgets */}
        <div className="flex items-center justify-center gap-2.5">
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-2.5 px-3.5 shadow-sm">
            <Flame className="w-4.5 h-4.5 text-amber-500" />
            <div className="text-right">
              <span className="text-[9px] font-cairo font-bold block opacity-60 text-amber-400">
                {language === 'ar' ? 'المواظبة اليومية' : 'Daily Streak'}
              </span>
              <span className="text-xs font-bold font-mono text-amber-400">
                {streak} {language === 'ar' ? 'يوم' : 'Days'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsImmersiveMode(true)}
            className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all cursor-pointer"
            title={language === 'ar' ? 'نمط التركيز الكامل' : 'Immersive Focus Mode'}
          >
            <Maximize2 className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Center/Right Side: Interactive Beads & Counter (Single Column layout) */}
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-slate-900/60 border border-slate-800/80 rounded-3xl shadow-xl backdrop-blur-md">
          
          {/* Header displaying current dhikr */}
          <div className="text-center w-full max-w-md mb-6">
            <h3 className="text-2xl sm:text-3xl font-bold font-amiri leading-loose mb-1 text-emerald-400 drop-shadow-sm">
              {activePreset.textAr}
            </h3>
            <p className="text-xs sm:text-sm font-cairo opacity-60 text-slate-300">
              {language === 'ar' ? activePreset.textEn : activePreset.textEn}
            </p>
          </div>

          {/* Interactive Bead circle containing Tap counter button */}
          <div className="relative w-[270px] h-[270px] sm:w-[310px] sm:h-[310px] flex items-center justify-center select-none">
            
            {/* Outer Beads Ring SVG */}
            <svg className="absolute w-full h-full -rotate-90 pointer-events-none drop-shadow-xl" viewBox="0 0 100 100">
              <defs>
                {/* Dynamic Normal 3D Bead */}
                <radialGradient id="bead-normal" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor={currentBeadTheme.normalGradient.stop0} />
                  <stop offset="30%" stopColor={currentBeadTheme.normalGradient.stop30} />
                  <stop offset="75%" stopColor={currentBeadTheme.normalGradient.stop75} />
                  <stop offset="100%" stopColor={currentBeadTheme.normalGradient.stop100} />
                </radialGradient>
                
                {/* Dynamic Active 3D Bead */}
                <radialGradient id="bead-active" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor={currentBeadTheme.activeGradient.stop0} />
                  <stop offset="25%" stopColor={currentBeadTheme.activeGradient.stop25} />
                  <stop offset="70%" stopColor={currentBeadTheme.activeGradient.stop70} />
                  <stop offset="100%" stopColor={currentBeadTheme.activeGradient.stop100} />
                </radialGradient>

                {/* Metallic Gold Tassel */}
                <radialGradient id="gold-metallic" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="35%" stopColor="#fbbf24" />
                  <stop offset="75%" stopColor="#b45309" />
                  <stop offset="100%" stopColor="#78350f" />
                </radialGradient>

                {/* Realistic drop shadow for beads */}
                <filter id="bead-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="1.2" stdDeviation="0.8" floodColor="#020617" floodOpacity="0.45" />
                </filter>

                {/* Ambient glow for active bead */}
                <filter id="active-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Inner Thread Cord */}
              <circle
                cx="50"
                cy="50"
                r="43"
                fill="none"
                stroke={currentBeadTheme.threadColor}
                strokeWidth="0.5"
                className="opacity-40"
              />

              {/* Main Beads Group with Spring-based Rotations */}
              <motion.g
                animate={{ rotate: -count * (360 / 33) + 90 }}
                transition={{ type: 'spring', stiffness: 90, damping: 15 }}
                style={{ transformOrigin: '50px 50px' }}
              >
                {renderBeadRing()}
              </motion.g>

              {/* Golden Tassel at the Top (Anchor) */}
              <g transform="translate(50, 7)" filter="url(#bead-shadow)">
                <path d="M-1.5,0 L1.5,0 L2,3 L-2,3 Z" fill="url(#gold-metallic)" />
                <circle cx="0" cy="4.5" r="1.5" fill="url(#gold-metallic)" />
                {/* Silk Tassels */}
                <path d="M-0.8,6 L0.8,6 L1.5,13 L-1.5,13 Z" fill="#b45309" opacity="0.95" />
                <path d="M-0.4,13 L0.4,13 L0.6,18 L-0.6,18 Z" fill="#d97706" />
                <circle cx="0" cy="19.5" r="0.8" fill="url(#gold-metallic)" />
              </g>

              {/* Progress highlight circle on top */}
              <circle
                cx="50"
                cy="50"
                r="43"
                fill="none"
                stroke="url(#bead-active)"
                strokeWidth="0.6"
                strokeLinecap="round"
                strokeDasharray="270.1"
                strokeDashoffset={270.1 - (270.1 * progress) / 100}
                className="opacity-40 transition-all duration-300"
              />
            </svg>

            {/* Main Counter Tap Button with spring scaling and physical vibration shake */}
            <motion.button
              animate={isVisualShaking ? {
                x: [0, -3, 3, -3, 3, -2, 2, 0],
                y: [0, 2, -2, 2, -2, 1, -1, 0],
              } : {}}
              transition={{ duration: 0.12 }}
              whileTap={{ 
                scale: 0.96,
                boxShadow: 'inset 0 10px 25px rgba(0,0,0,0.15)'
              }}
              onClick={handleTap}
              className="relative z-10 w-[200px] h-[200px] sm:w-[230px] sm:h-[230px] rounded-full flex flex-col items-center justify-center border-4 border-emerald-500/20 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 shadow-[0_15px_35px_-10px_rgba(16,185,129,0.2),inset_0_2px_15px_rgba(255,255,255,0.05)] hover:border-emerald-500/30 transition-all cursor-pointer select-none overflow-hidden"
            >
              {/* Absolute ripples list for tap feedbacks */}
              {ripples.map(ripple => (
                <motion.span
                  key={ripple.id}
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: 3.5, opacity: 0 }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    left: ripple.x - 10,
                    top: ripple.y - 10,
                    width: 20,
                    height: 20,
                    backgroundColor: 'rgba(52, 211, 153, 0.35)',
                  }}
                />
              ))}

              {/* Subtle Inner gloss overlay */}
              <div className="absolute top-0 left-1/4 w-1/2 h-1/4 bg-white opacity-[0.01] rounded-full blur-xl pointer-events-none"></div>

              <span className="text-5xl sm:text-6xl font-bold font-mono tracking-tighter mb-1.5 bg-clip-text text-transparent bg-gradient-to-b from-emerald-400 to-teal-500 drop-shadow-sm z-10">
                {count}
              </span>
              
              <div className="flex items-center gap-1.5 opacity-60 z-10">
                <span className="text-xs font-cairo tracking-wider font-bold text-slate-300">
                  / {currentTarget}
                </span>
              </div>
            </motion.button>
          </div>

          {/* Quick Actions Tray */}
          <div className="flex items-center justify-between w-full max-w-md mt-8 border-t border-slate-800 pt-5 gap-3.5">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all cursor-pointer text-xs font-bold font-cairo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تصفير' : 'Reset'}</span>
            </button>

            <button
              onClick={changeTarget}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all cursor-pointer text-xs font-bold font-cairo"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? `الهدف: ${currentTarget}` : `Target: ${currentTarget}`}</span>
            </button>

            <div className="flex flex-col items-end px-3.5 py-1.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <span className="text-[9px] font-cairo text-emerald-400 font-bold uppercase tracking-wider">
                {language === 'ar' ? 'المجموع الكلي' : 'Total Count'}
              </span>
              <span className="text-sm font-bold font-mono text-emerald-400">
                {totalCount.toLocaleString()}
              </span>
            </div>
          </div>

        </div>

        {/* Device Settings Tray (Compact, centering vibration) */}
        <div className="p-5 rounded-3xl bg-slate-900/40 border border-slate-800/80 shadow-md space-y-5">
          {/* Material & Sound Customization */}
          <div className="space-y-2.5 pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold font-cairo text-slate-200">
                {language === 'ar' ? 'خامة المسبحة وصوت الخرز' : 'Bead Material & Click Sound'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {BEAD_THEMES.map(t => {
                const isActive = t.id === selectedThemeId;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedThemeId(t.id);
                      localStorage.setItem('sebha_bead_theme', t.id);
                      soundEngine.playClick(t.soundType);
                      if (vibrationEnabled) triggerHaptic(25);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-2xl border text-right font-cairo transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold' 
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    {/* Small color indicator sphere representing the bead */}
                    <span 
                      className="w-3 h-3 rounded-full shadow-inner block shrink-0" 
                      style={{
                        background: `radial-gradient(circle at 35% 35%, ${t.normalGradient.stop0} 0%, ${t.normalGradient.stop30} 40%, ${t.normalGradient.stop100} 100%)`
                      }}
                    />
                    <span className="text-[11px] truncate">
                      {language === 'ar' ? t.nameAr : t.nameEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            {/* Sounds Switch */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/40">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-xs font-bold font-cairo block text-slate-200">
                    {language === 'ar' ? 'أصوات الخرز' : 'Bead Tap Sounds'}
                  </span>
                  <span className="text-[10px] opacity-60 font-cairo block text-slate-300">
                    {language === 'ar' ? 'تفعيل المؤثرات الصوتية عند نقر خرز المسبحة' : 'Enable audio feedback upon tapping beads'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  const next = !soundEnabled;
                  setSoundEnabled(next);
                  if (next) soundEngine.playClick();
                }}
                className="w-11 h-6 rounded-full p-0.5 transition-all relative cursor-pointer bg-slate-800"
                style={{
                  backgroundColor: soundEnabled ? '#10b981' : '#1e293b'
                }}
              >
                <motion.div
                  layout
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
                  style={{
                    left: soundEnabled ? '22px' : '2px'
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {/* Haptic Switch */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-xs font-bold font-cairo block text-slate-200">
                    {language === 'ar' ? 'اهتزاز المسبحة' : 'Haptic Vibration'}
                  </span>
                  <span className="text-[10px] opacity-60 font-cairo block text-slate-300">
                    {language === 'ar' ? 'تفعيل اهتزاز مادي وبصري مرن عند كل تسبيحة' : 'Enable tactile physical & visual haptic pulse'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  const next = !vibrationEnabled;
                  setVibrationEnabled(next);
                  if (next) triggerHaptic(45);
                }}
                className="w-11 h-6 rounded-full p-0.5 transition-all relative cursor-pointer bg-slate-800"
                style={{
                  backgroundColor: vibrationEnabled ? '#10b981' : '#1e293b'
                }}
              >
                <motion.div
                  layout
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
                  style={{
                    left: vibrationEnabled ? '22px' : '2px'
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </div>

          {/* Explanation box on iOS limits */}
          {!isVibrationSupported && vibrationEnabled && (
            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-[10.5px] font-cairo leading-relaxed opacity-90 text-blue-400">
              {language === 'ar' 
                ? 'ℹ️ بما أن بعض الأجهزة (مثل الآيفون iOS) تقيّد الاهتزاز المادي داخل متصفح الويب، فقد قمنا بدمج "اهتزاز بصري ارتدادي" متطور في المسبحة يحاكي النبض المادي الحقيقي بذكاء على الشاشة!'
                : 'ℹ️ Since iOS (iPhone) restricts physical Vibration API inside web browsers, we integrated an advanced responsive visual shake haptic that perfectly replicates physical pulses!'}
            </div>
          )}
        </div>
      </div>

      {/* Suggested Dhikr & Custom Dhikr Creator (Bottom Module) */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-5 sm:p-6 space-y-6 shadow-md">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
          <h4 className="text-base sm:text-lg font-bold font-cairo flex items-center justify-center sm:justify-start gap-2 text-slate-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            {language === 'ar' ? 'أذكار وأوراد المسبحة' : 'Suggested Dhikr & Tasks'}
          </h4>

          {/* Add custom Dhikr Button */}
          <button
            onClick={() => setIsCreatingPreset(!isCreatingPreset)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-cairo text-xs font-bold cursor-pointer shadow-sm transition-all self-center sm:self-start"
          >
            <Plus className="w-3.5 h-3.5" />
            {language === 'ar' ? 'إضافة ورد مخصص' : 'Add Custom Dhikr'}
          </button>
        </div>

        {/* Dynamic Form to Add Custom Presets */}
        <AnimatePresence>
          {isCreatingPreset && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleCreatePreset}
              className="p-4.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5 text-right">
                  <label className="text-xs font-bold font-cairo opacity-70 text-slate-300">
                    {language === 'ar' ? 'الذكر باللغة العربية *' : 'Dhikr in Arabic *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: سبحان الله وبحمده"
                    value={newPresetTextAr}
                    onChange={(e) => setNewPresetTextAr(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:border-emerald-500 focus:outline-none font-amiri text-lg text-right"
                  />
                </div>

                <div className="space-y-1.5 text-right">
                  <label className="text-xs font-bold font-cairo opacity-70 text-slate-300">
                    {language === 'ar' ? 'الذكر باللغة الإنجليزية (اختياري)' : 'Translation / English (Optional)'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SubhanAllahi wa bihamdih"
                    value={newPresetTextEn}
                    onChange={(e) => setNewPresetTextEn(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 text-right">
                  <label className="text-xs font-bold font-cairo opacity-70 text-slate-300">
                    {language === 'ar' ? 'الهدف المفضل للمرة' : 'Preferred Target'}
                  </label>
                  <select
                    value={newPresetTarget}
                    onChange={(e) => setNewPresetTarget(parseInt(e.target.value, 10))}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value={33}>33 {language === 'ar' ? 'مرة' : 'Times'}</option>
                    <option value={100}>100 {language === 'ar' ? 'مرة' : 'Times'}</option>
                    <option value={1000}>1000 {language === 'ar' ? 'مرة' : 'Times'}</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreatingPreset(false)}
                  className="px-3.5 py-1.5 text-xs font-bold font-cairo rounded-xl bg-slate-800 text-slate-300 cursor-pointer"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4.5 py-1.5 text-xs font-bold font-cairo rounded-xl bg-emerald-500 text-white cursor-pointer hover:bg-emerald-600"
                >
                  {language === 'ar' ? 'حفظ وإضافة الذكر' : 'Save & Select'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Presets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {presets.map((preset) => {
            const isCompleted = completedToday.includes(preset.id);
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`relative p-4.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2.5 min-h-[105px] cursor-pointer ${
                  activePreset.id === preset.id
                    ? 'border-emerald-400 bg-emerald-500/10 shadow-md ring-1 ring-emerald-500/30'
                    : 'border-slate-800 bg-slate-900/30 hover:border-emerald-500/30 hover:bg-slate-900/50'
                }`}
              >
                {/* Delete button for custom presets */}
                {preset.isCustom && (
                  <button
                    onClick={(e) => handleDeletePreset(preset.id, e)}
                    className="absolute top-2 right-2 p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors z-20 cursor-pointer"
                    title={language === 'ar' ? 'حذف الذكر المخصص' : 'Delete Custom Dhikr'}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}

                {/* Achieved Indicator badge */}
                {isCompleted && (
                  <div className="absolute top-2 left-2 flex items-center justify-center text-emerald-400" title={language === 'ar' ? 'تم إنجاز الورد اليوم' : 'Completed Today'}>
                    <Award className="w-4 h-4" />
                  </div>
                )}

                <span className={`text-base font-bold font-amiri leading-relaxed block ${
                  activePreset.id === preset.id ? 'text-emerald-400' : 'text-slate-200'
                }`}>
                  {preset.textAr}
                </span>

                <div className="flex items-center gap-1.5 opacity-60">
                  {activePreset.id === preset.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  <span className="text-[10px] font-cairo font-bold text-slate-300">
                    {preset.defaultTarget} {language === 'ar' ? 'مرة' : 'Times'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

      </div>

    </div>
  );
};
