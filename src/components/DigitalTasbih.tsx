import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { soundEngine, triggerHaptic } from '../utils/audio';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Vibrate,
  Sparkles,
  Trophy,
  Play,
  Pause,
  Award,
  Info,
  ChevronDown,
  ChevronUp,
  Palette,
  Flame,
  CheckCircle2,
  Layers,
  Heart,
  BookOpen,
  Sliders,
  Compass
} from 'lucide-react';
import { GlassButton } from './GlassButton';

// Extended Dhikr List with Categories & Hadith Virtues
interface DhikrItem {
  ar: string;
  en: string;
  category: string;
  virtueAr: string;
  virtueEn: string;
  recommendedGoal?: number;
}

const DHIKR_CATEGORIES = [
  'الكل',
  'التسبيح والتحميد',
  'الاستغفار والتوبة',
  'الصلاة على النبي',
  'الأدعية الجامعة'
];

const EXTENDED_DHIKR: DhikrItem[] = [
  {
    ar: 'سُبْحَانَ اللَّهِ',
    en: 'Subhanallah (Glory be to Allah)',
    category: 'التسبيح والتحميد',
    virtueAr: '«من قال: سبحان الله مائة مرة كُتبت له ألف حسنة أو حُطت عنه ألف خطيئة» [رواه مسلم: 2698]',
    virtueEn: '1000 good deeds written or 1000 sins erased [Sahih Muslim].',
    recommendedGoal: 33
  },
  {
    ar: 'الْحَمْدُ لِلَّهِ',
    en: 'Alhamdulillah (Praise be to Allah)',
    category: 'التسبيح والتحميد',
    virtueAr: '«والحمد لله تملأ الميزان، وهي أحب الكلام إلى الله» [رواه مسلم: 223]',
    virtueEn: 'Fills the scale of good deeds [Sahih Muslim].',
    recommendedGoal: 33
  },
  {
    ar: 'اللَّهُ أَكْبَرُ',
    en: 'Allahu Akbar (Allah is the Greatest)',
    category: 'التسبيح والتحميد',
    virtueAr: '«تكبيرة واحدة خير من الدنيا وما فيها، وتملأ ما بين السماء والأرض» [رواه البخاري ومسلم]',
    virtueEn: 'Magnifies Allah and earns immense heavenly reward.',
    recommendedGoal: 33
  },
  {
    ar: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    en: 'Subhanallahi wa Bihamdihi, Subhanallahil Azeem',
    category: 'التسبيح والتحميد',
    virtueAr: '«كلمتان خفيفتان على اللسان، ثقيلتان في الميزان، حبيبتان إلى الرحمن» [رواه البخاري: 6406 ومسلم: 2694]',
    virtueEn: 'Two phrases light on the tongue, heavy on the scales, beloved to the Most Merciful [Bukhari & Muslim].',
    recommendedGoal: 100
  },
  {
    ar: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ ، لَهُ المُلْكُ وَلَهُ الحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    en: 'La Ilaha Illallah Wahdahu La Shareeka Lah',
    category: 'التسبيح والتحميد',
    virtueAr: '«من قالها مائة مرة كانت له عدل عشر رقاب، وكتبت له مائة حسنة، ومحيت عنه مائة سيئة، وكان له حرز من الشيطان» [رواه البخاري: 3293 ومسلم: 2691]',
    virtueEn: 'Equivalent to freeing 10 slaves, 100 good deeds written, 100 sins erased, shield from Shaytan [Bukhari & Muslim].',
    recommendedGoal: 100
  },
  {
    ar: 'أَسْتَغْفِرُ اللَّهَ العَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الحَيُّ القَيُّومُ وَأَتُوبُ إِلَيْهِ',
    en: 'Astaghfirullahal Azeem (Supreme Forgiveness)',
    category: 'الاستغفار والتوبة',
    virtueAr: '«من قالها غُفرت ذنوبه وإن كان فاراً من الزحف» [رواه أبو داود والترمذي وحسنه البخاري]',
    virtueEn: 'Sins are forgiven even if one fled from combat.',
    recommendedGoal: 100
  },
  {
    ar: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ',
    en: 'Sayyid al-Istighfar (Master of Forgiveness)',
    category: 'الاستغفار والتوبة',
    virtueAr: '«سيد الاستغفار: من قالها موقناً بها من النهار أو الليل فمات دخل الجنة» [رواه البخاري: 6306]',
    virtueEn: 'The Master of Forgiveness guarantees Paradise for the faithful reciter [Sahih Bukhari].',
    recommendedGoal: 3
  },
  {
    ar: 'اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
    en: 'Allahumma Salli Ala Muhammad (Blessings upon the Prophet)',
    category: 'الصلاة على النبي',
    virtueAr: '«من صلى عليّ صلاة واحدة صلى الله عليه بها عشراً، وحُطت عنه عشر خطيئات، ورفعت له عشر درجات» [رواه مسلم: 408]',
    virtueEn: '10 divine blessings, 10 sins erased, and raised 10 spiritual ranks [Sahih Muslim].',
    recommendedGoal: 100
  },
  {
    ar: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ العَلِيِّ العَظِيمِ',
    en: 'La Hawla Wala Quwwata Illa Billah',
    category: 'الأدعية الجامعة',
    virtueAr: '«ألا أدلك على كنز من كنوز الجنة؟ لا حول ولا قوة إلا بالله» [رواه البخاري: 6384 ومسلم: 2704]',
    virtueEn: 'A treasure from the treasures of Paradise [Bukhari & Muslim].',
    recommendedGoal: 33
  },
  {
    ar: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ',
    en: 'Subhanallah, Alhamdulillah, La Ilaha Illallah, Allahu Akbar',
    category: 'التسبيح والتحميد',
    virtueAr: '«لأن أقول سبحان الله والحمد لله ولا إله إلا الله والله أكبر أحب إلي مما طلعت عليه الشمس» [رواه مسلم: 2695]',
    virtueEn: 'Beloved to the Prophet more than everything the sun shines upon [Sahih Muslim].',
    recommendedGoal: 33
  },
  {
    ar: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ',
    en: 'Subhanallahi wa Bihamdihi Adada Khalqihi',
    category: 'الأدعية الجامعة',
    virtueAr: '«لقد قلت بعدك أربع كلمات ثلاث مرات لو وزنت بما قلت منذ اليوم لوزنتهن» [رواه مسلم: 2726]',
    virtueEn: 'Weighs heavier in reward than hours of continuous remembrance [Sahih Muslim].',
    recommendedGoal: 3
  },
  {
    ar: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ',
    en: 'Ya Hayyu Ya Qayyumu Bi-rahmatika Astagheeth',
    category: 'الأدعية الجامعة',
    virtueAr: 'دعاء النبي ﷺ عند الكرب والهموم، يحيي القلوب ويصلح الأحوال [رواه الترمذي وصححه الألباني]',
    virtueEn: 'Prophetic prayer in distress for divine guidance and relief.',
    recommendedGoal: 7
  }
];

// 3D Material Styles
interface BeadMaterial {
  id: string;
  nameAr: string;
  nameEn: string;
  beadBg: string;
  beadShadow: string;
  ringGlow: string;
  threadColor: string;
  textColor: string;
  iconBg: string;
}

const BEAD_MATERIALS: BeadMaterial[] = [
  {
    id: 'emerald',
    nameAr: 'الزمرد الملكي 💎',
    nameEn: 'Royal Emerald',
    beadBg: 'radial-gradient(circle at 35% 35%, #d1fae5 0%, #10b981 45%, #047857 75%, #022c22 100%)',
    beadShadow: '0 10px 22px rgba(16, 185, 129, 0.5), inset -3px -5px 10px rgba(0, 0, 0, 0.8), inset 3px 5px 8px rgba(255, 255, 255, 0.8)',
    ringGlow: 'rgba(16, 185, 129, 0.7)',
    threadColor: '#f59e0b',
    textColor: 'text-emerald-300',
    iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
  },
  {
    id: 'amber-agate',
    nameAr: 'العقيق اليماني 🔥',
    nameEn: 'Yemeni Agate',
    beadBg: 'radial-gradient(circle at 35% 35%, #fef08a 0%, #ea580c 45%, #9a3412 75%, #451a03 100%)',
    beadShadow: '0 10px 22px rgba(234, 88, 12, 0.55), inset -3px -5px 10px rgba(0, 0, 0, 0.85), inset 3px 5px 8px rgba(254, 240, 138, 0.8)',
    ringGlow: 'rgba(234, 88, 12, 0.7)',
    threadColor: '#fbbf24',
    textColor: 'text-orange-300',
    iconBg: 'bg-orange-500/20 text-orange-400 border-orange-500/40'
  },
  {
    id: 'mahogany',
    nameAr: 'خشب الأندلس 🪵',
    nameEn: 'Andalusian Wood',
    beadBg: 'radial-gradient(circle at 35% 35%, #fef3c7 0%, #d97706 45%, #78350f 75%, #291003 100%)',
    beadShadow: '0 10px 20px rgba(180, 83, 9, 0.55), inset -3px -5px 10px rgba(0, 0, 0, 0.85), inset 3px 5px 8px rgba(254, 243, 199, 0.65)',
    ringGlow: 'rgba(217, 119, 6, 0.7)',
    threadColor: '#f59e0b',
    textColor: 'text-amber-400',
    iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40'
  },
  {
    id: 'onyx',
    nameAr: 'العقيق الأسود 🖤',
    nameEn: 'Black Onyx',
    beadBg: 'radial-gradient(circle at 35% 35%, #cbd5e1 0%, #334155 45%, #0f172a 75%, #020617 100%)',
    beadShadow: '0 10px 22px rgba(15, 23, 42, 0.95), inset -3px -5px 10px rgba(0, 0, 0, 0.95), inset 3px 5px 8px rgba(255, 255, 255, 0.6)',
    ringGlow: 'rgba(148, 163, 184, 0.7)',
    threadColor: '#38bdf8',
    textColor: 'text-slate-200',
    iconBg: 'bg-slate-700/50 text-slate-200 border-slate-600'
  },
  {
    id: 'pearl',
    nameAr: 'اللؤلؤ الناصع 👑',
    nameEn: 'Shimmering Pearl',
    beadBg: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #f1f5f9 45%, #cbd5e1 75%, #64748b 100%)',
    beadShadow: '0 10px 22px rgba(255, 255, 255, 0.6), inset -3px -5px 10px rgba(100, 116, 139, 0.6), inset 3px 5px 8px rgba(255, 255, 255, 0.95)',
    ringGlow: 'rgba(255, 255, 255, 0.85)',
    threadColor: '#fbbf24',
    textColor: 'text-amber-200',
    iconBg: 'bg-white/20 text-white border-white/40'
  },
  {
    id: 'lapis',
    nameAr: 'اللازورد الملكي 🌌',
    nameEn: 'Royal Lapis',
    beadBg: 'radial-gradient(circle at 35% 35%, #bfdbfe 0%, #2563eb 45%, #1e3a8a 75%, #0f172a 100%)',
    beadShadow: '0 10px 22px rgba(37, 99, 235, 0.6), inset -3px -5px 10px rgba(0, 0, 0, 0.85), inset 3px 5px 8px rgba(191, 219, 254, 0.85)',
    ringGlow: 'rgba(59, 130, 246, 0.7)',
    threadColor: '#f59e0b',
    textColor: 'text-blue-300',
    iconBg: 'bg-blue-500/20 text-blue-400 border-blue-500/40'
  }
];

export const DigitalTasbih: React.FC = () => {
  const {
    language,
    theme,
    totalDhikrCount,
    incrementGlobalDhikr,
    soundEnabled,
    setSoundEnabled,
    vibrationEnabled,
    setVibrationEnabled,
    showToast
  } = useApp();

  const [currentCount, setCurrentCount] = useState<number>(0);
  const [targetGoal, setTargetGoal] = useState<number | 'free'>(33);
  const [selectedDhikr, setSelectedDhikr] = useState<DhikrItem>(EXTENDED_DHIKR[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [customDhikrText, setCustomDhikrText] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [roundsCompleted, setRoundsCompleted] = useState<number>(0);
  const [activeMaterial, setActiveMaterial] = useState<BeadMaterial>(BEAD_MATERIALS[0]);

  // 3D Visualizer state
  const [beadRotation, setBeadRotation] = useState<number>(0);
  const [burstRipples, setBurstRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [showVirtue, setShowVirtue] = useState<boolean>(true);

  // Auto Tasbeeh Mode
  const [isAutoCounting, setIsAutoCounting] = useState<boolean>(false);
  const [autoSpeed, setAutoSpeed] = useState<number>(1500);
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Achievement Milestones
  const [sessionPeakStreak, setSessionPeakStreak] = useState<number>(0);

  // Active Tab for Organized Controls ("counter", "dhikr", "materials")
  const [activeTab, setActiveTab] = useState<'counter' | 'dhikr' | 'materials'>('counter');

  // Filter Dhikr by Category
  const filteredDhikr = selectedCategory === 'الكل'
    ? EXTENDED_DHIKR
    : EXTENDED_DHIKR.filter((d) => d.category === selectedCategory);

  // Auto Tasbeeh Effect
  useEffect(() => {
    if (isAutoCounting) {
      autoTimerRef.current = setInterval(() => {
        handleTapCount();
      }, autoSpeed);
    } else {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    }
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, [isAutoCounting, autoSpeed, currentCount, targetGoal]);

  const handleTapCount = (e?: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(20);

    incrementGlobalDhikr();
    const nextCount = currentCount + 1;
    setBeadRotation((prev) => prev + (360 / 33));

    if (nextCount > sessionPeakStreak) {
      setSessionPeakStreak(nextCount);
    }

    // Ripple effect
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rippleId = Date.now();
      setBurstRipples((prev) => [...prev, { id: rippleId, x, y }]);
      setTimeout(() => {
        setBurstRipples((prev) => prev.filter((r) => r.id !== rippleId));
      }, 700);
    }

    if (targetGoal !== 'free' && nextCount >= targetGoal) {
      soundEngine.playCompletion();
      if (vibrationEnabled) triggerHaptic(90);
      setRoundsCompleted((prev) => prev + 1);
      setCurrentCount(0);
      setIsAutoCounting(false);

      showToast(
        language === 'ar' ? '🎉 تقبل الله! أتممت الدورة' : 'MashaAllah! Goal Completed',
        language === 'ar'
          ? `أكملت ${targetGoal} تسبيحة من "${isCustomMode ? customDhikrText : selectedDhikr.ar}".`
          : `You completed ${targetGoal} counts of Dhikr.`
      );
    } else {
      setCurrentCount(nextCount);
    }
  };

  const handleReset = () => {
    setCurrentCount(0);
    setIsAutoCounting(false);
    showToast(
      language === 'ar' ? 'تمت إعادة ضبط العداد' : 'Counter Reset',
      language === 'ar' ? 'بدء جلسة ذكر جديدة.' : 'Fresh session started.'
    );
  };

  const progressPercent =
    targetGoal === 'free' ? 100 : Math.min(100, Math.round((currentCount / targetGoal) * 100));

  // Render 33 beads in a 3D perspective circle
  const totalBeadsInRing = 33;
  const beadElements = Array.from({ length: totalBeadsInRing }).map((_, idx) => {
    const angle = (idx * (360 / totalBeadsInRing) + beadRotation) * (Math.PI / 180);
    const radiusX = 125;
    const radiusY = 52;
    const x = Math.cos(angle) * radiusX;
    const y = Math.sin(angle) * radiusY;
    
    const depthScale = 0.6 + ((y + radiusY) / (2 * radiusY)) * 0.55;
    const opacity = 0.45 + ((y + radiusY) / (2 * radiusY)) * 0.55;
    const isCurrentActive = idx === (currentCount % totalBeadsInRing);
    const isSeparator = idx === 10 || idx === 21;
    const isImamBead = idx === 32;

    return (
      <div
        key={idx}
        onClick={(e) => {
          e.stopPropagation();
          handleTapCount(e);
        }}
        className="absolute transition-all duration-300 ease-out flex items-center justify-center pointer-events-auto cursor-pointer"
        style={{
          transform: `translate3d(${x}px, ${y}px, 0) scale(${isCurrentActive ? depthScale * 1.35 : depthScale})`,
          zIndex: Math.round(y + 100),
          opacity: opacity
        }}
      >
        <div
          className={`rounded-full flex items-center justify-center transition-all ${
            isImamBead
              ? 'w-9 h-11 rounded-3xl border-2 border-amber-300 shadow-2xl bg-gradient-to-b from-amber-200 via-amber-600 to-amber-900'
              : isSeparator
              ? 'w-8 h-8 border-2 border-amber-400 shadow-xl bg-gradient-to-tr from-amber-300 via-amber-600 to-amber-800'
              : 'w-6 h-6'
          } ${isCurrentActive ? 'ring-4 ring-amber-300 shadow-2xl scale-125' : ''}`}
          style={{
            background: isImamBead
              ? 'radial-gradient(ellipse at 30% 20%, #fef08a 0%, #d97706 60%, #451a03 100%)'
              : isSeparator
              ? 'radial-gradient(circle at 30% 30%, #fef08a 0%, #b45309 60%, #78350f 100%)'
              : activeMaterial.beadBg,
            boxShadow: isImamBead || isSeparator
              ? '0 10px 22px rgba(217, 119, 6, 0.7), inset -2px -4px 6px rgba(0, 0, 0, 0.8), inset 2px 4px 6px rgba(254, 240, 138, 0.9)'
              : activeMaterial.beadShadow
          }}
        >
          {isImamBead && (
            <div className="w-1.5 h-6 rounded-full bg-amber-200/60 blur-[0.5px]" />
          )}
          {isCurrentActive && !isImamBead && (
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
          )}
        </div>
      </div>
    );
  });

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5 pb-24 select-none">
      {/* Sleek Top Banner with Real-time Counters */}
      <div
        className={`p-4 sm:p-5 rounded-3xl border backdrop-blur-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 transition-all ${
          theme === 'light'
            ? 'bg-white/95 border-slate-200 text-slate-800'
            : theme === 'sepia'
            ? 'bg-[#2b1e16]/95 border-amber-800/40 text-amber-50'
            : 'bg-slate-900/95 border-slate-800 text-slate-100'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl border shadow-inner ${activeMaterial.iconBg}`}>
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold font-cairo">
                {language === 'ar' ? 'السبحة الإلكترونية 3D' : 'Interactive 3D Digital Tasbeeh'}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                3D Live
              </span>
            </div>
            <p className="text-xs opacity-75 font-cairo">
              {language === 'ar'
                ? 'خامات الكريستال التفاعلية مع خيار التسبيح التلقائي'
                : '3D Rosary with materials & auto-count'}
            </p>
          </div>
        </div>

        {/* Counters Badges */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-center shadow-inner">
            <span className="text-[10px] block opacity-70 font-cairo font-bold">
              {language === 'ar' ? 'إجمالي الجلسة' : 'Session Total'}
            </span>
            <span className="text-sm font-extrabold text-emerald-400 font-mono">
              {totalDhikrCount.toLocaleString()}
            </span>
          </div>

          <div className="px-3.5 py-1.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-center shadow-inner">
            <span className="text-[10px] block opacity-70 font-cairo font-bold">
              {language === 'ar' ? 'الدورات' : 'Rounds'}
            </span>
            <span className="text-sm font-extrabold text-amber-400 font-mono">
              {roundsCompleted} 🏅
            </span>
          </div>
        </div>
      </div>

      {/* ORGANIZED SEGMENTED CONTROL TABS */}
      <div className="flex items-center justify-center gap-1.5 p-1 bg-slate-900/80 rounded-2xl border border-slate-800 backdrop-blur-md">
        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveTab('counter');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-cairo flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'counter'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>العداد الكريستالي</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveTab('dhikr');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-cairo flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'dhikr'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>اختيار الذكر والفضل</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveTab('materials');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-cairo flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'materials'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>خامات السبحة 3D</span>
        </button>
      </div>

      {/* TAB 1: MAIN 3D COUNTER CANVAS */}
      {activeTab === 'counter' && (
        <div className="space-y-4">
          {/* Active Dhikr Display Header */}
          <div
            className={`p-4 rounded-2xl border backdrop-blur-xl text-center space-y-1.5 transition-all ${
              theme === 'light'
                ? 'bg-white/85 border-slate-200 text-slate-800'
                : theme === 'sepia'
                ? 'bg-[#261a12]/85 border-amber-800/40 text-amber-50'
                : 'bg-slate-900/85 border-slate-800 text-slate-100'
            }`}
          >
            <p className="text-xl sm:text-2xl font-bold font-amiri text-emerald-400 leading-relaxed">
              {isCustomMode
                ? customDhikrText || (language === 'ar' ? 'ورد مخصص...' : 'Custom dhikr...')
                : selectedDhikr.ar}
            </p>

            {/* Target Goal Selector */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] text-slate-400 font-cairo font-semibold">الهدف:</span>
              {[33, 99, 100, 500, 'free'].map((goal) => (
                <button
                  key={goal.toString()}
                  onClick={() => {
                    soundEngine.playClick();
                    setTargetGoal(goal as typeof targetGoal);
                    setCurrentCount(0);
                  }}
                  className={`px-2.5 py-1 rounded-xl border text-[11px] font-cairo font-bold transition-all cursor-pointer ${
                    targetGoal === goal
                      ? 'border-emerald-400 bg-emerald-500/25 text-emerald-300 shadow-sm'
                      : 'border-slate-800 bg-slate-800/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {goal === 'free' ? 'مفتوح' : goal === 33 ? '33 (السُّنة)' : `${goal}`}
                </button>
              ))}
            </div>
          </div>

          {/* Auto Tasbeeh Floating Control */}
          <div className="flex items-center justify-between bg-slate-900/90 p-2.5 px-4 rounded-2xl border border-slate-800 backdrop-blur-md">
            <button
              onClick={() => {
                soundEngine.playClick();
                setIsAutoCounting(!isAutoCounting);
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-cairo font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isAutoCounting
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
              }`}
            >
              {isAutoCounting ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoCounting ? 'إيقاف التلقائي' : 'تشغيل أوتوماتيك ⚡'}</span>
            </button>

            {/* Speed selector */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl">
              <span className="text-[10px] text-slate-400 font-cairo px-1">السرعة:</span>
              {([1000, 1500, 2000] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => setAutoSpeed(spd)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    autoSpeed === spd ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {spd / 1000}s
                </button>
              ))}
            </div>
          </div>

          {/* 3D CIRCULAR ROSARY RING CONTAINER */}
          <div className="flex flex-col items-center justify-center my-6 relative">
            <div
              onClick={handleTapCount}
              className="relative w-80 h-80 flex items-center justify-center cursor-pointer perspective-1000"
            >
              {/* 3D Ring Orbit Thread */}
              <div
                className="absolute inset-4 rounded-full border-2 border-dashed opacity-40 pointer-events-none transition-all duration-500"
                style={{
                  borderColor: activeMaterial.threadColor,
                  transform: 'rotateX(65deg) scale(1.05)'
                }}
              />

              {/* Render 3D Beads (Interactive Tapping) */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ transformStyle: 'preserve-3d', transform: 'rotateX(20deg)' }}
              >
                {beadElements}
              </div>

              {/* Center Counter Number directly inside the Bead Rosary (No surrounding circles) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                {/* Burst Ripples */}
                {burstRipples.map((r) => (
                  <span
                    key={r.id}
                    className="absolute rounded-full pointer-events-none animate-ping bg-emerald-400/40"
                    style={{
                      left: r.x - 25,
                      top: r.y - 25,
                      width: 50,
                      height: 50
                    }}
                  />
                ))}

                {/* Big Standalone Counter Number inside beads */}
                <motion.span
                  key={currentCount}
                  initial={{ scale: 0.8, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="text-6xl sm:text-7xl font-extrabold font-mono tracking-tight text-emerald-300 drop-shadow-[0_0_20px_rgba(52,211,153,0.4)] my-1"
                >
                  {currentCount}
                </motion.span>

                {/* Goal Subtitle */}
                <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-900/60 text-[11px] font-cairo text-slate-300">
                  <span className="text-emerald-400 font-bold">السبحة 📿</span>
                  <span>•</span>
                  <span>{targetGoal === 'free' ? 'تسبيح حر' : `الهدف: ${targetGoal}`}</span>
                </div>
              </div>

              {/* Dangling Traditional Tassel (الكركوشة المذهبة والشرابة الأندلسية) */}
              <motion.div
                animate={{ rotate: [0, (currentCount % 2 === 0 ? 6 : -6), 0] }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="absolute -bottom-14 flex flex-col items-center pointer-events-none z-30"
              >
                {/* Braided Gold Thread */}
                <div className="w-1 h-6 bg-gradient-to-b from-amber-300 to-amber-600 shadow-sm" />
                {/* Gold Crown Cap */}
                <div className="w-5 h-3 rounded-t-full bg-gradient-to-r from-amber-200 via-amber-400 to-amber-700 shadow-md border border-amber-300/60" />
                {/* Silk Fringe Tassel */}
                <div className="w-8 h-10 rounded-b-2xl bg-gradient-to-b from-amber-500 via-amber-700 to-amber-900 opacity-90 shadow-2xl flex justify-around px-0.5 overflow-hidden border-t border-amber-300/40">
                  <span className="w-0.5 h-full bg-amber-200/50" />
                  <span className="w-0.5 h-full bg-amber-300/60" />
                  <span className="w-0.5 h-full bg-amber-200/50" />
                  <span className="w-0.5 h-full bg-amber-400/70" />
                  <span className="w-0.5 h-full bg-amber-200/50" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <GlassButton variant="secondary" onClick={handleReset} size="sm">
              <RotateCcw className="w-4 h-4 text-rose-400" />
              <span>إعادة ضبط</span>
            </GlassButton>

            <GlassButton
              variant={soundEnabled ? 'primary' : 'ghost'}
              onClick={() => setSoundEnabled(!soundEnabled)}
              size="sm"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 opacity-50" />}
              <span>الصوت</span>
            </GlassButton>

            <GlassButton
              variant={vibrationEnabled ? 'primary' : 'ghost'}
              onClick={() => setVibrationEnabled(!vibrationEnabled)}
              size="sm"
            >
              <Vibrate className={`w-4 h-4 ${vibrationEnabled ? 'text-amber-400' : 'opacity-50'}`} />
              <span>الاهتزاز</span>
            </GlassButton>
          </div>
        </div>
      )}

      {/* TAB 2: DHIKR & VIRTUES SELECTOR */}
      {activeTab === 'dhikr' && (
        <div className="space-y-4 p-4 rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl">
          {/* Category Chips */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            {DHIKR_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1.5 text-xs rounded-xl border transition-all font-cairo cursor-pointer ${
                  selectedCategory === cat
                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 font-bold'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Dhikr Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredDhikr.map((d, i) => (
              <div
                key={i}
                onClick={() => {
                  soundEngine.playClick();
                  setIsCustomMode(false);
                  setSelectedDhikr(d);
                  setCurrentCount(0);
                  setActiveTab('counter');
                  showToast('تم اختيار الذكر', d.ar);
                }}
                className={`p-3 rounded-2xl border text-right space-y-1.5 transition-all cursor-pointer ${
                  !isCustomMode && selectedDhikr.ar === d.ar
                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow-lg'
                    : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold font-amiri text-emerald-300">{d.ar}</span>
                  {d.recommendedGoal && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                      {d.recommendedGoal}x
                    </span>
                  )}
                </div>
                {d.virtueAr && (
                  <p className="text-[11px] text-slate-400 font-cairo line-clamp-2 leading-relaxed">
                    ✨ {d.virtueAr}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Custom Dhikr Input */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <h4 className="text-xs font-bold font-cairo text-amber-400">كتابة ورد مخصص:</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={customDhikrText}
                onChange={(e) => setCustomDhikrText(e.target.value)}
                placeholder="اكتب وردك أو دعاءك المخصص..."
                className="flex-1 px-4 py-2 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-cairo text-emerald-300 outline-none"
              />
              <button
                onClick={() => {
                  if (customDhikrText.trim()) {
                    setIsCustomMode(true);
                    setActiveTab('counter');
                  }
                }}
                className="px-4 py-2 rounded-2xl bg-amber-500 text-slate-950 font-bold font-cairo text-xs cursor-pointer"
              >
                اعتماد
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 3D MATERIAL SELECTOR */}
      {activeTab === 'materials' && (
        <div className="space-y-3 p-4 rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl">
          <h3 className="text-xs font-bold font-cairo text-slate-200 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-emerald-400" />
            <span>اختر خامة ونوع خرز السُّبحة ثلاثية الأبعاد:</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BEAD_MATERIALS.map((mat) => (
              <div
                key={mat.id}
                onClick={() => {
                  soundEngine.playClick();
                  setActiveMaterial(mat);
                  setActiveTab('counter');
                }}
                className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
                  activeMaterial.id === mat.id
                    ? 'border-emerald-400 bg-emerald-500/20 shadow-lg ring-2 ring-emerald-500/30'
                    : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-full shadow-lg border border-white/30 flex items-center justify-center shrink-0"
                  style={{ background: mat.beadBg, boxShadow: mat.beadShadow }}
                />
                <div>
                  <h4 className="text-sm font-bold font-cairo text-slate-100">{mat.nameAr}</h4>
                  <p className="text-[11px] text-slate-400 font-cairo">{mat.nameEn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements Footer */}
      <div className="p-4 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-cairo text-slate-200">
              إنجازات التسبيح والمداومة
            </h4>
            <p className="text-[11px] text-slate-400 font-cairo">
              أعلى تتابع تسبيح في هذه الجلسة: {sessionPeakStreak} مرة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {totalDhikrCount >= 100 && (
            <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-cairo font-bold flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>مبتدئ (100)</span>
            </span>
          )}
          {totalDhikrCount >= 1000 && (
            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-cairo font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>حافظ الذكر (1000)</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
