import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Play, 
  Pause, 
  Sliders, 
  Loader2, 
  SkipForward, 
  SkipBack, 
  Repeat, 
  BookOpen, 
  Volume2, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Check, 
  RotateCcw,
  ChevronDown,
  Search,
  Clock,
  ArrowRight,
  ArrowLeft,
  Headphones,
  Zap,
  Layers,
  Sun,
  Moon,
  Mic2,
  FileText
} from 'lucide-react';
import { SURAHS_METADATA, RECITERS_LIST, fetchFullSurah } from '../data/quranData';
import { SURAH_START_PAGES } from './QuranImagePageView';
import { QuranReciterModal } from './QuranReciterModal';
import { QuranVerse, Reciter, QuranSurah } from '../types';
import { soundEngine, triggerHaptic } from '../utils/audio';

interface QuranRepeatPageProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
  language: 'ar' | 'en';
}

const PAUSE_PRESETS = [
  { value: 0, labelAr: 'بدون توقف', labelEn: 'No Pause' },
  { value: 1500, labelAr: '١.٥ ثانية', labelEn: '1.5s' },
  { value: 3000, labelAr: '٣ ثوانٍ', labelEn: '3s' },
  { value: 5000, labelAr: '٥ ثوانٍ', labelEn: '5s' },
  { value: 10000, labelAr: '١٠ ثوانٍ', labelEn: '10s' },
  { value: -1, labelAr: 'بقدر الآية', labelEn: 'Ayah Length' }
];

// Helper to get image sources for a Mushaf page
const getMushafPageSources = (page: number) => {
  const p3 = String(page).padStart(3, '0');
  return [
    `https://quran.islam-db.com/public/data/pages/quranpages_1024/images/page${p3}.png`,
    `https://cdn.quran.com/images/pages/1200/${page}.png`,
    `https://raw.githubusercontent.com/QuranHub/quran-pages-images/main/Hafs/page${p3}.png`,
    `https://raw.githubusercontent.com/GovarJabbar/Quran-PNG/main/images/page${p3}.png`
  ];
};

// Subcomponent: High-definition Madani Mushaf Page Viewer
const MushafPageViewer: React.FC<{
  pageNumber: number;
  theme: string;
  isNightFilter: boolean;
  onToggleNightFilter: () => void;
}> = ({ pageNumber, isNightFilter, onToggleNightFilter }) => {
  const [srcIndex, setSrcIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const sources = getMushafPageSources(pageNumber);

  useEffect(() => {
    setSrcIndex(0);
    setIsLoading(true);
    setHasError(false);
  }, [pageNumber]);

  return (
    <div className="relative w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center justify-center">
      {/* Top Page Badge & Night Toggle */}
      <div className="w-full flex items-center justify-between px-1 mb-1.5 text-[10px] sm:text-xs font-cairo">
        <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1">
          <BookOpen className="w-3 h-3" />
          <span>صفحة {pageNumber} من ٦٠٤</span>
        </span>
        <button
          type="button"
          onClick={onToggleNightFilter}
          className="px-2 py-0.5 rounded-lg border border-slate-700/80 bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer text-[10px] sm:text-xs"
        >
          {isNightFilter ? <Sun className="w-3 h-3 text-amber-400" /> : <Moon className="w-3 h-3 text-slate-400" />}
          <span>{isNightFilter ? 'وضع النهار' : 'القراءة الليلية'}</span>
        </button>
      </div>

      {/* Frame Container */}
      <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border border-amber-900/30 bg-[#fbf8ee] dark:bg-slate-950 flex items-center justify-center min-h-[260px] sm:min-h-[380px] w-full">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/20 backdrop-blur-xs z-10">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mb-1.5" />
            <span className="text-[11px] font-cairo text-slate-400">جاري تحميل صفحة المصحف...</span>
          </div>
        )}

        <img
          src={sources[srcIndex]}
          alt={`صفحة المصحف الشريف رقم ${pageNumber}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            if (srcIndex < sources.length - 1) {
              setSrcIndex(prev => prev + 1);
            } else {
              setIsLoading(false);
              setHasError(true);
            }
          }}
          className={`w-full max-h-[46vh] sm:max-h-[58vh] object-contain transition-all duration-300 ${
            isNightFilter ? 'invert hue-rotate-180 brightness-90 contrast-125' : ''
          }`}
        />

        {hasError && (
          <div className="p-4 text-center text-[11px] text-amber-400 font-cairo bg-slate-900/80 rounded-xl m-2">
            تعذر تحميل صورة الصفحة، يمكنك التبديل إلى وضع "آية مكتوبة".
          </div>
        )}
      </div>
    </div>
  );
};

export const QuranRepeatPage: React.FC<QuranRepeatPageProps> = ({ isOpen, onClose, theme, language }) => {
  // Mode: By Ayahs (written) vs By Pages (Mushaf image)
  const [repeatMode, setRepeatMode] = useState<'ayah' | 'page'>('ayah');
  const [displayMode, setDisplayMode] = useState<'written' | 'mushaf'>('written');
  const [isPageNightFilter, setIsPageNightFilter] = useState<boolean>(theme === 'dark');

  // Configuration State
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [startAyah, setStartAyah] = useState<number>(1);
  const [endAyah, setEndAyah] = useState<number>(7);
  const [surahSearchQuery, setSurahSearchQuery] = useState<string>('');
  const [isSurahDropdownOpen, setIsSurahDropdownOpen] = useState<boolean>(false);
  
  // Page mode state
  const [selectedPage, setSelectedPage] = useState<number>(1);

  // Reciter State & Modal Popup
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(RECITERS_LIST[0]);
  const [isReciterModalOpen, setIsReciterModalOpen] = useState<boolean>(false);

  // Repetition Counts (like From Ayah to Ayah with steppers)
  const [ayahRepeatCount, setAyahRepeatCount] = useState<number>(3);
  const [rangeRepeatCount, setRangeRepeatCount] = useState<number>(2);
  const [pauseDuration, setPauseDuration] = useState<number>(0);
  const [hideTextForTesting, setHideTextForTesting] = useState<boolean>(false);
  const [revealedCurrentAyah, setRevealedCurrentAyah] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // Playback Session State
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [surahData, setSurahData] = useState<QuranSurah | null>(null);
  const [pageVerses, setPageVerses] = useState<QuranVerse[]>([]);
  
  const [currentAyahIndex, setCurrentAyahIndex] = useState<number>(0);
  const [currentAyahRepeat, setCurrentAyahRepeat] = useState<number>(0);
  const [currentRangeRepeat, setCurrentRangeRepeat] = useState<number>(0);
  const [isWaitingPause, setIsWaitingPause] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const waitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const surahPickerRef = useRef<HTMLDivElement | null>(null);
  
  const surahMeta = SURAHS_METADATA.find(s => s.number === selectedSurah) || SURAHS_METADATA[0];

  // Close surah picker dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (surahPickerRef.current && !surahPickerRef.current.contains(e.target as Node)) {
        setIsSurahDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Fetch full surah data when surah selection changes (for Ayah mode)
  useEffect(() => {
    let mounted = true;
    setStartAyah(1);
    setEndAyah(Math.min(7, surahMeta.versesCount));
    
    setIsLoading(true);
    fetchFullSurah(selectedSurah).then(data => {
      if (mounted) {
        setSurahData(data);
        setIsLoading(false);
      }
    }).catch(() => {
      if (mounted) setIsLoading(false);
    });
    return () => { mounted = false; };
  }, [selectedSurah, surahMeta.versesCount]);

  // Fetch page ayahs when page selection changes (for Page mode)
  useEffect(() => {
    if (repeatMode !== 'page') return;
    let mounted = true;
    setIsLoading(true);
    
    fetch(`https://api.alquran.cloud/v1/page/${selectedPage}/quran-uthmani`)
      .then(res => res.json())
      .then(json => {
        if (!mounted) return;
        const ayahs = json.data?.ayahs || [];
        const mapped: QuranVerse[] = ayahs.map((a: any) => ({
          id: a.number,
          verseNumber: a.numberInSurah,
          surahNumber: a.surah?.number || 1,
          textAr: a.text,
          textEn: '',
          juz: a.juz || 1,
          page: selectedPage
        }));
        setPageVerses(mapped);
        setIsLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        // Fallback verses
        let sNum = 1;
        for (let s = 114; s >= 1; s--) {
          if (SURAH_START_PAGES[s] && SURAH_START_PAGES[s] <= selectedPage) {
            sNum = s;
            break;
          }
        }
        const sMeta = SURAHS_METADATA.find(s => s.number === sNum) || SURAHS_METADATA[0];
        setPageVerses([
          {
            id: selectedPage,
            verseNumber: 1,
            surahNumber: sNum,
            textAr: `صفحة رقم ${selectedPage} - ${sMeta.nameAr}`,
            textEn: `Page ${selectedPage}`,
            juz: sMeta.juzStart,
            page: selectedPage
          }
        ]);
        setIsLoading(false);
      });

    return () => { mounted = false; };
  }, [selectedPage, repeatMode]);

  // Active verses list depending on repeat mode
  const activeVerses = repeatMode === 'ayah'
    ? (surahData?.verses.filter(v => v.verseNumber >= startAyah && v.verseNumber <= endAyah) || [])
    : pageVerses;

  const currentVerse = activeVerses[currentAyahIndex] || activeVerses[0];

  // Current page number for Mushaf display
  const currentMushafPage = repeatMode === 'page'
    ? selectedPage
    : (currentVerse?.page || SURAH_START_PAGES[selectedSurah] || 1);

  // Reciter Audio Mapping for EveryAyah CDN
  const getReciterSubfolder = (reciterId: string): string => {
    if (reciterId.includes('minshawi_mujawwad')) return 'Minshawy_Mujawwad_192kbps';
    if (reciterId.includes('minshawi')) return 'Minshawy_Murattal_128kbps';
    if (reciterId.includes('hussary_mujawwad')) return 'Husary_Mujawwad_128kbps';
    if (reciterId.includes('hussary_moalim') || reciterId.includes('moalim')) return 'Husary_Muallim_128kbps';
    if (reciterId.includes('hussary')) return 'Husary_128kbps';
    if (reciterId.includes('abdulbasit_mujawwad')) return 'Abdul_Basit_Mujawwad_128kbps';
    if (reciterId.includes('abdulbasit')) return 'Abdul_Basit_Murattal_192kbps';
    if (reciterId.includes('ghamdi')) return 'Ghamadi_40kbps';
    if (reciterId.includes('maher')) return 'Maher_AlMuaiqly_64kbps';
    if (reciterId.includes('dosari') || reciterId.includes('dussary')) return 'Yasser_Ad-Dussary_128kbps';
    if (reciterId.includes('sudais')) return 'Abdurrahmaan_As-Sudais_192kbps';
    if (reciterId.includes('shuraim') || reciterId.includes('shuraym')) return 'Saood_ash-Shuraym_128kbps';
    if (reciterId.includes('shatri')) return 'Abu_Bakr_Ash-Shaatree_128kbps';
    if (reciterId.includes('ajmi')) return 'Ahmed_ibn_Ali_al-Ajamy_128kbps';
    return 'Alafasy_128kbps';
  };

  const playVerseAudio = (verseNum: number, surahNumToPlay?: number) => {
    if (!audioRef.current) return;
    const targetSurah = surahNumToPlay || currentVerse?.surahNumber || selectedSurah;
    const sNum = String(targetSurah).padStart(3, '0');
    const aNum = String(verseNum).padStart(3, '0');
    const reciterSub = getReciterSubfolder(selectedReciter.id);
    
    const audioUrl = `https://everyayah.com/data/${reciterSub}/${sNum}${aNum}.mp3`;
    audioRef.current.src = audioUrl;
    audioRef.current.playbackRate = playbackSpeed;
    audioRef.current.play().then(() => {
      setIsPlaying(true);
      setIsWaitingPause(false);
    }).catch(() => {
      setIsPlaying(false);
    });
  };

  const handleStartSession = () => {
    if (activeVerses.length === 0) return;
    soundEngine.playClick();
    triggerHaptic(50);
    setIsSessionActive(true);
    setCurrentAyahIndex(0);
    setCurrentAyahRepeat(0);
    setCurrentRangeRepeat(0);
    setRevealedCurrentAyah(false);
    setIsPlaying(true);
    
    // Set initial display mode based on repeat mode
    setDisplayMode(repeatMode === 'page' ? 'mushaf' : 'written');

    setTimeout(() => {
      const first = activeVerses[0];
      playVerseAudio(first.verseNumber, first.surahNumber || selectedSurah);
    }, 200);
  };

  const handleStopSession = () => {
    soundEngine.playClick();
    if (audioRef.current) audioRef.current.pause();
    if (waitTimeoutRef.current) clearTimeout(waitTimeoutRef.current);
    setIsSessionActive(false);
    setIsPlaying(false);
    setIsWaitingPause(false);
  };

  const handlePausePlay = () => {
    soundEngine.playClick();
    triggerHaptic(30);
    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      if (waitTimeoutRef.current) clearTimeout(waitTimeoutRef.current);
      setIsPlaying(false);
    } else {
      if (isWaitingPause) {
        handleAudioEnded();
      } else {
        setIsPlaying(true);
        if (audioRef.current && audioRef.current.src) {
          audioRef.current.playbackRate = playbackSpeed;
          audioRef.current.play().catch(() => {
            const v = activeVerses[currentAyahIndex];
            playVerseAudio(v.verseNumber, v.surahNumber || selectedSurah);
          });
        } else {
          const v = activeVerses[currentAyahIndex];
          playVerseAudio(v.verseNumber, v.surahNumber || selectedSurah);
        }
      }
    }
  };

  const nextAyah = () => {
    if (waitTimeoutRef.current) clearTimeout(waitTimeoutRef.current);
    setIsWaitingPause(false);
    setRevealedCurrentAyah(false);
    
    const isLastAyahInRange = currentAyahIndex >= activeVerses.length - 1;
    
    if (isLastAyahInRange) {
      const nextRangeRepeat = currentRangeRepeat + 1;
      if (rangeRepeatCount === -1 || nextRangeRepeat < rangeRepeatCount) {
        setCurrentRangeRepeat(nextRangeRepeat);
        setCurrentAyahIndex(0);
        setCurrentAyahRepeat(0);
        const v = activeVerses[0];
        playVerseAudio(v.verseNumber, v.surahNumber || selectedSurah);
      } else {
        setIsPlaying(false);
        soundEngine.playSuccess();
        triggerHaptic(100);
      }
    } else {
      const nextIdx = currentAyahIndex + 1;
      setCurrentAyahIndex(nextIdx);
      setCurrentAyahRepeat(0);
      const v = activeVerses[nextIdx];
      playVerseAudio(v.verseNumber, v.surahNumber || selectedSurah);
    }
  };

  const prevAyah = () => {
    if (waitTimeoutRef.current) clearTimeout(waitTimeoutRef.current);
    setIsWaitingPause(false);
    setRevealedCurrentAyah(false);
    const prevIdx = currentAyahIndex - 1;
    if (prevIdx >= 0) {
      setCurrentAyahIndex(prevIdx);
      setCurrentAyahRepeat(0);
      const v = activeVerses[prevIdx];
      playVerseAudio(v.verseNumber, v.surahNumber || selectedSurah);
    }
  };

  const restartCurrentAyah = () => {
    if (waitTimeoutRef.current) clearTimeout(waitTimeoutRef.current);
    setIsWaitingPause(false);
    setCurrentAyahRepeat(0);
    const v = activeVerses[currentAyahIndex];
    playVerseAudio(v.verseNumber, v.surahNumber || selectedSurah);
  };

  const handleAudioEnded = () => {
    if (!isPlaying) return;
    
    let delayMs = 0;
    if (pauseDuration === -1 && audioRef.current) {
      delayMs = (audioRef.current.duration || 3) * 1000;
    } else if (pauseDuration > 0) {
      delayMs = pauseDuration;
    }

    const proceedToNext = () => {
      const nextAyahRepeat = currentAyahRepeat + 1;
      
      if (ayahRepeatCount === -1 || nextAyahRepeat < ayahRepeatCount) {
        setCurrentAyahRepeat(nextAyahRepeat);
        const v = activeVerses[currentAyahIndex];
        playVerseAudio(v.verseNumber, v.surahNumber || selectedSurah);
      } else {
        nextAyah();
      }
    };

    if (delayMs > 0) {
      setIsWaitingPause(true);
      waitTimeoutRef.current = setTimeout(() => {
        setIsWaitingPause(false);
        proceedToNext();
      }, delayMs);
    } else {
      proceedToNext();
    }
  };

  const changePlaybackSpeed = (speed: number) => {
    soundEngine.playClick();
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  if (!isOpen) return null;

  const isRtl = language === 'ar';

  const containerBgClass = theme === 'light'
    ? 'bg-slate-100 text-slate-900'
    : theme === 'sepia'
    ? 'bg-[#1e150f] text-amber-50'
    : 'bg-slate-950 text-slate-100';

  const cardBgClass = theme === 'light'
    ? 'bg-white/95 border-slate-200/80 shadow-md text-slate-800'
    : theme === 'sepia'
    ? 'bg-[#291c14]/90 border-amber-800/40 shadow-xl text-amber-50'
    : 'bg-slate-900/90 border-slate-800/80 shadow-xl text-slate-100';

  const filteredSurahs = SURAHS_METADATA.filter(s => 
    s.nameAr.includes(surahSearchQuery) || 
    s.nameEn.toLowerCase().includes(surahSearchQuery.toLowerCase()) ||
    String(s.number).includes(surahSearchQuery)
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className={`fixed inset-0 z-50 flex flex-col overflow-hidden ${containerBgClass}`}
        >
          {/* Audio Engine Element */}
          <audio
            ref={audioRef}
            onEnded={handleAudioEnded}
            preload="auto"
            className="hidden"
          />

          {/* Reciter Popup Modal */}
          <QuranReciterModal
            isOpen={isReciterModalOpen}
            onClose={() => setIsReciterModalOpen(false)}
            selectedReciter={selectedReciter}
            onSelectReciter={(r) => setSelectedReciter(r)}
            theme={theme}
            language={language}
          />

          {/* Top Floating Glass Header */}
          <div className="shrink-0 px-3 py-2 sm:px-5 sm:py-2.5 border-b border-slate-800/40 backdrop-blur-xl bg-slate-950/40 flex items-center justify-between z-30">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20">
                <Repeat className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-xs sm:text-sm font-bold font-cairo flex items-center gap-1.5">
                  <span>{language === 'ar' ? 'التكرار المخصص للقرآن' : 'Quran Repeat & Memorization'}</span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {repeatMode === 'ayah' ? (language === 'ar' ? 'آيات' : 'Ayahs') : (language === 'ar' ? 'صفحات' : 'Pages')}
                  </span>
                </h1>
                <p className="text-[10px] text-slate-400 font-cairo">
                  {selectedReciter.nameAr} • {repeatMode === 'ayah' ? `${surahMeta.nameAr} (${startAyah} - ${endAyah})` : `صفحة ${selectedPage}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {isSessionActive && (
                <button
                  type="button"
                  onClick={handleStopSession}
                  className="px-2.5 py-1 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-[11px] font-cairo font-bold transition-all cursor-pointer"
                >
                  {language === 'ar' ? 'إنهاء' : 'Exit'}
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  handleStopSession();
                  onClose();
                }}
                className="p-1.5 sm:p-2 rounded-xl border border-slate-700/60 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title={language === 'ar' ? 'إغلاق' : 'Close'}
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Main Scrollable Canvas */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-2.5 sm:p-4 md:p-5">
            {!isSessionActive ? (
              /* Setup Screen */
              <div className="max-w-2xl mx-auto space-y-2.5 sm:space-y-3 pb-8">

                {/* 1. Mode Switcher: By Ayahs (Written) vs By Pages (Mushaf Image) */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      triggerHaptic(15);
                      setRepeatMode('ayah');
                    }}
                    className={`flex-1 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-bold font-cairo flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      repeatMode === 'ayah'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md font-extrabold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'تكرار حسب الآيات (نص مكتوب)' : 'By Ayahs (Written)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      triggerHaptic(15);
                      setRepeatMode('page');
                    }}
                    className={`flex-1 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-bold font-cairo flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      repeatMode === 'page'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md font-extrabold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'تكرار حسب الصفحات (صور المصحف)' : 'By Pages (Mushaf)'}</span>
                  </button>
                </div>

                {/* 2. Surah & Ayah / Page Selection Card */}
                {repeatMode === 'ayah' ? (
                  <div className={`relative ${isSurahDropdownOpen ? 'z-40' : 'z-10'} p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border backdrop-blur-xl transition-all space-y-2.5 ${cardBgClass}`}>
                    
                    {/* Surah Dropdown Trigger */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <label className="text-[11px] sm:text-xs font-bold font-cairo flex items-center gap-1.5 text-emerald-500">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'السورة الكريمة' : 'Surah Selection'}</span>
                        </label>
                        <span className="text-[10px] font-cairo text-slate-400">
                          {surahMeta.versesCount} {language === 'ar' ? 'آية' : 'Ayahs'} • {surahMeta.revelationType === 'Meccan' ? (language === 'ar' ? 'مكية' : 'Meccan') : (language === 'ar' ? 'مدنية' : 'Medinan')}
                        </span>
                      </div>

                      <div className={`relative ${isSurahDropdownOpen ? 'z-50' : 'z-10'}`} ref={surahPickerRef}>
                        <button
                          type="button"
                          onClick={() => setIsSurahDropdownOpen(!isSurahDropdownOpen)}
                          className={`w-full p-2 sm:p-2.5 rounded-xl border flex items-center justify-between text-right transition-all cursor-pointer ${
                            theme === 'light' ? 'bg-slate-50 hover:bg-white border-slate-200' : 'bg-slate-950/60 hover:bg-slate-950 border-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-mono font-bold text-[10px] sm:text-xs">
                              {surahMeta.number}
                            </div>
                            <div>
                              <div className="font-bold text-xs sm:text-sm font-cairo text-emerald-400">
                                {language === 'ar' ? surahMeta.nameAr : surahMeta.nameEn}
                              </div>
                              <div className="text-[10px] text-slate-400 font-sans">
                                Surah {surahMeta.nameEn} ({surahMeta.englishMeaning})
                              </div>
                            </div>
                          </div>
                          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isSurahDropdownOpen ? 'rotate-180 text-emerald-500' : ''}`} />
                        </button>

                        {/* Surah Dropdown Menu */}
                        <AnimatePresence>
                          {isSurahDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 8, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 8, scale: 0.98 }}
                              className={`absolute top-full mt-1.5 left-0 right-0 z-50 p-2.5 rounded-xl border shadow-2xl max-h-64 flex flex-col ${
                                theme === 'light' ? 'bg-white border-slate-200 text-slate-800 shadow-slate-900/20' : 'bg-slate-900 border-slate-700 text-slate-100 shadow-black/80'
                              }`}
                            >
                              <div className="relative mb-2 shrink-0">
                                <Search className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 ${isRtl ? 'right-2.5' : 'left-2.5'}`} />
                                <input
                                  type="text"
                                  value={surahSearchQuery}
                                  onChange={(e) => setSurahSearchQuery(e.target.value)}
                                  placeholder={language === 'ar' ? 'ابحث باسم السورة أو رقمها...' : 'Search surah name or number...'}
                                  className={`w-full py-1.5 rounded-lg text-xs border outline-none ${
                                    isRtl ? 'pr-8 pl-2.5' : 'pl-8 pr-2.5'
                                  } ${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-700'}`}
                                />
                              </div>

                              <div className="overflow-y-auto space-y-1 pr-1">
                                {filteredSurahs.map(s => {
                                  const isSelected = s.number === selectedSurah;
                                  return (
                                    <button
                                      key={s.number}
                                      type="button"
                                      onClick={() => {
                                        soundEngine.playClick();
                                        setSelectedSurah(s.number);
                                        setIsSurahDropdownOpen(false);
                                        setSurahSearchQuery('');
                                      }}
                                      className={`w-full p-1.5 rounded-lg text-xs font-cairo flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                                        isSelected
                                          ? 'bg-emerald-500 text-slate-950 font-bold'
                                          : theme === 'light'
                                          ? 'hover:bg-slate-100 text-slate-700'
                                          : 'hover:bg-slate-800/70 text-slate-200'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[9px] ${
                                          isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-emerald-500/10 text-emerald-500'
                                        }`}>
                                          {s.number}
                                        </span>
                                        <span>{language === 'ar' ? s.nameAr : s.nameEn}</span>
                                      </div>
                                      <span className={`text-[9px] ${isSelected ? 'text-slate-900/80' : 'text-slate-400'}`}>
                                        {s.versesCount} {language === 'ar' ? 'آية' : 'Ayahs'}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Ayah Range Steppers (From / To) */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <label className="text-[11px] sm:text-xs font-bold font-cairo flex items-center gap-1.5 text-amber-500">
                          <Zap className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'نطاق الآيات المحدد' : 'Ayah Range Selection'}</span>
                        </label>
                        <span className="text-[10px] font-cairo font-bold text-amber-500">
                          {endAyah - startAyah + 1} {language === 'ar' ? 'آيات مختارة' : 'Ayahs Selected'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* From Ayah */}
                        <div className={`p-2 sm:p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                          theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/50 border-slate-800'
                        }`}>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-slate-400 font-cairo">{language === 'ar' ? 'من آية:' : 'From:'}</span>
                            <span className="text-sm sm:text-base font-bold font-mono text-emerald-500">{startAyah}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                soundEngine.playClick();
                                setStartAyah(Math.max(1, startAyah - 1));
                              }}
                              disabled={startAyah <= 1}
                              className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-lg border flex items-center justify-center font-bold text-xs bg-slate-800/40 border-slate-700/60 disabled:opacity-30 cursor-pointer hover:bg-emerald-500/20"
                            >
                              -
                            </button>
                            <select
                              value={startAyah}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setStartAyah(val);
                                if (val > endAyah) setEndAyah(val);
                              }}
                              className={`px-1.5 py-1 rounded-lg border text-xs font-mono font-bold outline-none ${
                                theme === 'light' ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-700 text-slate-100'
                              }`}
                            >
                              {Array.from({ length: surahMeta.versesCount }).map((_, i) => (
                                <option key={i+1} value={i+1}>{i+1}</option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => {
                                soundEngine.playClick();
                                const next = Math.min(surahMeta.versesCount, startAyah + 1);
                                setStartAyah(next);
                                if (next > endAyah) setEndAyah(next);
                              }}
                              disabled={startAyah >= surahMeta.versesCount}
                              className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-lg border flex items-center justify-center font-bold text-xs bg-slate-800/40 border-slate-700/60 disabled:opacity-30 cursor-pointer hover:bg-emerald-500/20"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* To Ayah */}
                        <div className={`p-2 sm:p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                          theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/50 border-slate-800'
                        }`}>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-slate-400 font-cairo">{language === 'ar' ? 'إلى آية:' : 'To:'}</span>
                            <span className="text-sm sm:text-base font-bold font-mono text-emerald-500">{endAyah}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                soundEngine.playClick();
                                setEndAyah(Math.max(startAyah, endAyah - 1));
                              }}
                              disabled={endAyah <= startAyah}
                              className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-lg border flex items-center justify-center font-bold text-xs bg-slate-800/40 border-slate-700/60 disabled:opacity-30 cursor-pointer hover:bg-emerald-500/20"
                            >
                              -
                            </button>
                            <select
                              value={endAyah}
                              onChange={(e) => setEndAyah(Number(e.target.value))}
                              className={`px-1.5 py-1 rounded-lg border text-xs font-mono font-bold outline-none ${
                                theme === 'light' ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-700 text-slate-100'
                              }`}
                            >
                              {Array.from({ length: surahMeta.versesCount }).map((_, i) => (
                                <option key={i+1} value={i+1} disabled={i+1 < startAyah}>{i+1}</option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => {
                                soundEngine.playClick();
                                setEndAyah(Math.min(surahMeta.versesCount, endAyah + 1));
                              }}
                              disabled={endAyah >= surahMeta.versesCount}
                              className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-lg border flex items-center justify-center font-bold text-xs bg-slate-800/40 border-slate-700/60 disabled:opacity-30 cursor-pointer hover:bg-emerald-500/20"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                ) : (
                  /* Page Mode Selection Card */
                  <div className={`relative z-10 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border backdrop-blur-xl transition-all space-y-2.5 ${cardBgClass}`}>
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-[11px] sm:text-xs font-bold font-cairo flex items-center gap-1.5 text-emerald-500">
                        <Layers className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'اختيار صفحة المصحف' : 'Mushaf Page Selection'}</span>
                      </label>
                      <span className="text-[10px] font-cairo text-slate-400">
                        {language === 'ar' ? 'ص ١ إلى ٦٠٤' : 'Pages 1 - 604'}
                      </span>
                    </div>

                    {/* Page Stepper like Ayah Stepper */}
                    <div className={`p-2 sm:p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                      theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/50 border-slate-800'
                    }`}>
                      <div>
                        <span className="text-[10px] text-slate-400 font-cairo block">{language === 'ar' ? 'رقم الصفحة:' : 'Page:'}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-base font-bold font-mono text-emerald-400">{selectedPage}</span>
                          <span className="text-[10px] text-slate-400 font-cairo">
                            (من ٦٠٤)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playClick();
                            triggerHaptic(15);
                            setSelectedPage(Math.max(1, selectedPage - 1));
                          }}
                          disabled={selectedPage <= 1}
                          className="w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs bg-slate-800/40 border-slate-700/60 disabled:opacity-30 cursor-pointer hover:bg-emerald-500/20"
                        >
                          -
                        </button>
                        <select
                          value={selectedPage}
                          onChange={(e) => setSelectedPage(Number(e.target.value))}
                          className={`px-2 py-1 rounded-lg border text-xs font-mono font-bold outline-none ${
                            theme === 'light' ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-700 text-slate-100'
                          }`}
                        >
                          {Array.from({ length: 604 }).map((_, i) => (
                            <option key={i+1} value={i+1}>صفحة {i+1}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playClick();
                            triggerHaptic(15);
                            setSelectedPage(Math.min(604, selectedPage + 1));
                          }}
                          disabled={selectedPage >= 604}
                          className="w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs bg-slate-800/40 border-slate-700/60 disabled:opacity-30 cursor-pointer hover:bg-emerald-500/20"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Quick Jump by Surah Start Page */}
                    <div className="flex items-center justify-between text-[11px] font-cairo pt-1 border-t border-slate-800/40">
                      <span className="text-slate-400">{language === 'ar' ? 'الانتقال لبداية سورة:' : 'Jump to Surah:'}</span>
                      <select
                        value={selectedSurah}
                        onChange={(e) => {
                          const sNum = Number(e.target.value);
                          setSelectedSurah(sNum);
                          const startP = SURAH_START_PAGES[sNum] || 1;
                          setSelectedPage(startP);
                        }}
                        className={`px-2 py-0.5 rounded-lg border text-[11px] font-cairo outline-none ${
                          theme === 'light' ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-700 text-slate-200'
                        }`}
                      >
                        {SURAHS_METADATA.map(s => (
                          <option key={s.number} value={s.number}>
                            {s.number}. {s.nameAr} (ص {SURAH_START_PAGES[s.number] || 1})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* 3. Reciter Selection in a Popup Modal Button */}
                <div className={`relative z-0 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border backdrop-blur-xl transition-all ${cardBgClass}`}>
                  <label className="text-[11px] sm:text-xs font-bold font-cairo flex items-center gap-1.5 mb-1.5 text-indigo-400">
                    <Mic2 className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'القارئ المعتمد للتكرار (قائمة منبثقة)' : 'Quran Reciter (Popup Picker)'}</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      triggerHaptic(20);
                      setIsReciterModalOpen(true);
                    }}
                    className={`w-full p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      theme === 'light'
                        ? 'bg-slate-50 hover:bg-white border-slate-200 hover:border-indigo-400'
                        : 'bg-slate-950/60 hover:bg-slate-950 border-slate-800 hover:border-indigo-500/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xs sm:text-sm font-cairo text-indigo-400 flex items-center gap-1.5">
                          <span>{language === 'ar' ? selectedReciter.nameAr : selectedReciter.nameEn}</span>
                          <span className="px-1 py-0.5 rounded text-[8px] sm:text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {selectedReciter.nameAr.includes('مجود') ? 'مجود' : selectedReciter.nameAr.includes('المعلم') ? 'معلم' : 'مرتل'}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans">
                          {selectedReciter.nameEn}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-cairo font-bold">
                      <span>{language === 'ar' ? 'تغيير' : 'Change'}</span>
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </button>
                </div>

                {/* 4. Repetition Counts (Steppers like Ayah Range with +/- buttons) */}
                <div className={`relative z-0 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border backdrop-blur-xl space-y-2.5 ${cardBgClass}`}>
                  <label className="text-[11px] sm:text-xs font-bold font-cairo flex items-center gap-1.5 text-teal-400">
                    <Repeat className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'إعدادات عدد التكرار (بالضغط)' : 'Repetition Count Settings'}</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* A. Ayah Repetition Stepper */}
                    <div className={`p-2 sm:p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                      theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/50 border-slate-800'
                    }`}>
                      <div>
                        <span className="text-[10px] text-slate-400 font-cairo block">{language === 'ar' ? 'تكرار كل آية:' : 'Repeat each ayah:'}</span>
                        <span className="text-xs sm:text-sm font-bold font-mono text-teal-400">
                          {ayahRepeatCount === -1 ? (language === 'ar' ? '∞ لا نهائي' : 'Infinite') : `${ayahRepeatCount} ${language === 'ar' ? 'مرات' : 'times'}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playClick();
                            triggerHaptic(15);
                            if (ayahRepeatCount === -1) {
                              setAyahRepeatCount(10);
                            } else {
                              setAyahRepeatCount(Math.max(1, ayahRepeatCount - 1));
                            }
                          }}
                          disabled={ayahRepeatCount === 1}
                          className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-lg border flex items-center justify-center font-bold text-xs bg-slate-800/40 border-slate-700/60 disabled:opacity-30 cursor-pointer hover:bg-teal-500/20"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playClick();
                            triggerHaptic(15);
                            setAyahRepeatCount(ayahRepeatCount === -1 ? 3 : -1);
                          }}
                          className={`px-1.5 py-1 rounded-lg border text-xs font-mono font-bold cursor-pointer transition-colors ${
                            ayahRepeatCount === -1
                              ? 'bg-teal-500 text-slate-950 border-teal-400 font-extrabold'
                              : 'bg-slate-800/40 border-slate-700 text-slate-300 hover:bg-teal-500/20'
                          }`}
                          title="تكرار لا نهائي"
                        >
                          ∞
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playClick();
                            triggerHaptic(15);
                            if (ayahRepeatCount === -1) {
                              setAyahRepeatCount(1);
                            } else {
                              setAyahRepeatCount(Math.min(50, ayahRepeatCount + 1));
                            }
                          }}
                          disabled={ayahRepeatCount >= 50}
                          className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-lg border flex items-center justify-center font-bold text-xs bg-slate-800/40 border-slate-700/60 disabled:opacity-30 cursor-pointer hover:bg-teal-500/20"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* B. Range / Section Repetition Stepper */}
                    <div className={`p-2 sm:p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                      theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/50 border-slate-800'
                    }`}>
                      <div>
                        <span className="text-[10px] text-slate-400 font-cairo block">{language === 'ar' ? 'تكرار المقطع:' : 'Repeat section:'}</span>
                        <span className="text-xs sm:text-sm font-bold font-mono text-teal-400">
                          {rangeRepeatCount === -1 ? (language === 'ar' ? '∞ لا نهائي' : 'Infinite') : `${rangeRepeatCount} ${language === 'ar' ? 'مرات' : 'times'}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playClick();
                            triggerHaptic(15);
                            if (rangeRepeatCount === -1) {
                              setRangeRepeatCount(10);
                            } else {
                              setRangeRepeatCount(Math.max(1, rangeRepeatCount - 1));
                            }
                          }}
                          disabled={rangeRepeatCount === 1}
                          className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-lg border flex items-center justify-center font-bold text-xs bg-slate-800/40 border-slate-700/60 disabled:opacity-30 cursor-pointer hover:bg-teal-500/20"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playClick();
                            triggerHaptic(15);
                            setRangeRepeatCount(rangeRepeatCount === -1 ? 2 : -1);
                          }}
                          className={`px-1.5 py-1 rounded-lg border text-xs font-mono font-bold cursor-pointer transition-colors ${
                            rangeRepeatCount === -1
                              ? 'bg-teal-500 text-slate-950 border-teal-400 font-extrabold'
                              : 'bg-slate-800/40 border-slate-700 text-slate-300 hover:bg-teal-500/20'
                          }`}
                          title="تكرار لا نهائي"
                        >
                          ∞
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playClick();
                            triggerHaptic(15);
                            if (rangeRepeatCount === -1) {
                              setRangeRepeatCount(1);
                            } else {
                              setRangeRepeatCount(Math.min(50, rangeRepeatCount + 1));
                            }
                          }}
                          disabled={rangeRepeatCount >= 50}
                          className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-lg border flex items-center justify-center font-bold text-xs bg-slate-800/40 border-slate-700/60 disabled:opacity-30 cursor-pointer hover:bg-teal-500/20"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* C. Pause Duration Stepper */}
                    <div className={`p-2 sm:p-2.5 rounded-xl border flex items-center justify-between gap-2 sm:col-span-2 ${
                      theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/50 border-slate-800'
                    }`}>
                      <div>
                        <span className="text-[10px] text-slate-400 font-cairo block">{language === 'ar' ? 'فترة الترديد والاستذكار:' : 'Recitation Pause:'}</span>
                        <span className="text-xs font-bold font-cairo text-amber-400">
                          {PAUSE_PRESETS.find(p => p.value === pauseDuration)?.[language === 'ar' ? 'labelAr' : 'labelEn']}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playClick();
                            triggerHaptic(15);
                            const curIdx = PAUSE_PRESETS.findIndex(p => p.value === pauseDuration);
                            if (curIdx > 0) setPauseDuration(PAUSE_PRESETS[curIdx - 1].value);
                          }}
                          disabled={pauseDuration === PAUSE_PRESETS[0].value}
                          className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-lg border flex items-center justify-center font-bold text-xs bg-slate-800/40 border-slate-700/60 disabled:opacity-30 cursor-pointer hover:bg-amber-500/20"
                        >
                          -
                        </button>
                        <div className="px-2 py-0.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[11px] font-cairo text-slate-200">
                          {PAUSE_PRESETS.find(p => p.value === pauseDuration)?.[language === 'ar' ? 'labelAr' : 'labelEn']}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playClick();
                            triggerHaptic(15);
                            const curIdx = PAUSE_PRESETS.findIndex(p => p.value === pauseDuration);
                            if (curIdx < PAUSE_PRESETS.length - 1) setPauseDuration(PAUSE_PRESETS[curIdx + 1].value);
                          }}
                          disabled={pauseDuration === PAUSE_PRESETS[PAUSE_PRESETS.length - 1].value}
                          className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-lg border flex items-center justify-center font-bold text-xs bg-slate-800/40 border-slate-700/60 disabled:opacity-30 cursor-pointer hover:bg-amber-500/20"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Memory Self-Testing Toggle */}
                <div className={`relative z-0 p-2.5 sm:p-3 rounded-xl border backdrop-blur-xl flex items-center justify-between gap-3 cursor-pointer ${cardBgClass}`}
                  onClick={() => {
                    soundEngine.playClick();
                    setHideTextForTesting(!hideTextForTesting);
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      hideTextForTesting ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {hideTextForTesting ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <span className="text-[11px] sm:text-xs font-bold font-cairo block">
                        {language === 'ar' ? 'وضع الاختبار الذاتي (إخفاء النص)' : 'Self-Test Mode (Hide Text)'}
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-slate-400 font-cairo">
                        {language === 'ar' ? 'تعتيم الآيات لتتلو من حفظك مع إمكانية الكشف بالنقر' : 'Blur verse text to recite from memory'}
                      </span>
                    </div>
                  </div>
                  <div className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                    hideTextForTesting ? 'bg-purple-500' : 'bg-slate-700'
                  }`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      hideTextForTesting ? (isRtl ? '-translate-x-4' : 'translate-x-4') : 'translate-x-0'
                    }`} />
                  </div>
                </div>

                {/* 6. Start Repetition Button */}
                <div className="pt-1 pb-4">
                  <button
                    type="button"
                    onClick={handleStartSession}
                    disabled={isLoading || activeVerses.length === 0}
                    className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold font-cairo text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{language === 'ar' ? 'جاري تجهيز الآيات...' : 'Preparing Ayahs...'}</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>{language === 'ar' ? 'بدء جلسة التكرار والحفظ' : 'Start Memorization Session'}</span>
                        <span className="text-[10px] bg-slate-950/20 px-2 py-0.5 rounded-full font-mono font-bold">
                          {repeatMode === 'ayah' ? `${endAyah - startAyah + 1} آيات` : `صفحة ${selectedPage}`}
                        </span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            ) : (
              /* Active Recitation Canvas */
              <div className="max-w-2xl mx-auto h-full flex flex-col justify-between p-1 sm:p-2 md:p-4 space-y-2.5 sm:space-y-3.5">
                
                {/* Progress Indicators Bar */}
                <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border backdrop-blur-xl space-y-2 ${cardBgClass}`}>
                  <div className="flex items-center justify-between gap-2 text-[11px] font-cairo">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-emerald-500">
                        {language === 'ar' ? surahMeta.nameAr : surahMeta.nameEn}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-300">
                        {language === 'ar' ? 'آية' : 'Ayah'} {currentVerse?.verseNumber}
                      </span>
                      {repeatMode === 'page' && (
                        <>
                          <span className="text-slate-400">•</span>
                          <span className="text-amber-400 font-bold">
                            صفحة {selectedPage}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-xs font-bold">
                        {language === 'ar' ? 'الآية:' : 'Ayah:'} {currentAyahRepeat + 1}/{ayahRepeatCount === -1 ? '∞' : ayahRepeatCount}
                      </span>
                      <span className="px-1.5 py-0.5 rounded-md bg-teal-500/15 border border-teal-500/30 text-teal-400 text-[10px] sm:text-xs font-bold">
                        {language === 'ar' ? 'المقطع:' : 'Sec:'} {currentRangeRepeat + 1}/{rangeRepeatCount === -1 ? '∞' : rangeRepeatCount}
                      </span>
                    </div>
                  </div>

                  {/* Progress Line */}
                  <div className="w-full h-1 sm:h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${((currentAyahIndex + 1) / Math.max(1, activeVerses.length)) * 100}%`
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Central Display: Toggle between Written Ayah and Mushaf Page Image */}
                <div className={`flex-1 flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl border backdrop-blur-xl relative overflow-hidden text-center min-h-[250px] sm:min-h-[380px] ${cardBgClass}`}>
                  
                  {/* Top Switcher: Written Ayah vs Mushaf Page */}
                  <div className="mb-2.5 inline-flex p-0.5 rounded-lg bg-slate-900/80 border border-slate-800 z-10">
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setDisplayMode('written');
                      }}
                      className={`px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-cairo font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        displayMode === 'written'
                          ? 'bg-emerald-500 text-slate-950 shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>{language === 'ar' ? 'آية مكتوبة' : 'Written'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setDisplayMode('mushaf');
                      }}
                      className={`px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-cairo font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        displayMode === 'mushaf'
                          ? 'bg-emerald-500 text-slate-950 shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Layers className="w-3 h-3" />
                      <span>{language === 'ar' ? 'صفحة المصحف' : 'Mushaf'}</span>
                    </button>
                  </div>

                  {/* Status Overlay Badge during Pause */}
                  {isWaitingPause && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-2 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] sm:text-xs font-cairo font-bold flex items-center gap-1 animate-pulse"
                    >
                      <Clock className="w-3 h-3" />
                      <span>{language === 'ar' ? 'فترة الترديد والاستذكار...' : 'Recite now...'}</span>
                    </motion.div>
                  )}

                  {/* Mode 1: Written Ayah Display */}
                  {displayMode === 'written' ? (
                    <div className="my-auto max-w-xl px-2 py-2">
                      {currentVerse?.verseNumber === 1 && selectedSurah !== 1 && selectedSurah !== 9 && (
                        <div className="text-emerald-500/80 font-quran text-base sm:text-lg mb-2">
                          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                        </div>
                      )}

                      <p
                        onClick={() => {
                          if (hideTextForTesting) {
                            soundEngine.playClick();
                            setRevealedCurrentAyah(!revealedCurrentAyah);
                          }
                        }}
                        className={`text-lg sm:text-2xl md:text-3xl leading-relaxed sm:leading-loose font-quran transition-all select-none ${
                          hideTextForTesting && !revealedCurrentAyah
                            ? 'blur-md opacity-40 cursor-pointer hover:opacity-60'
                            : 'opacity-100'
                        }`}
                      >
                        {currentVerse?.textAr || currentVerse?.textEn || 'جاري تحميل نص الآية الكريمة...'}
                        <span className="inline-flex items-center justify-center mx-1.5 text-emerald-500 text-base sm:text-lg font-mono">
                          ﴿{currentVerse?.verseNumber}﴾
                        </span>
                      </p>

                      {hideTextForTesting && !revealedCurrentAyah && (
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playClick();
                            setRevealedCurrentAyah(true);
                          }}
                          className="mt-3 px-3 py-1 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[11px] font-cairo font-bold inline-flex items-center gap-1 hover:bg-purple-500/30 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>{language === 'ar' ? 'انقر لإظهار الآية والتأكد' : 'Tap to reveal'}</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    /* Mode 2: Real Madani Mushaf Page Image Display */
                    <MushafPageViewer
                      pageNumber={currentMushafPage}
                      theme={theme}
                      isNightFilter={isPageNightFilter}
                      onToggleNightFilter={() => setIsPageNightFilter(!isPageNightFilter)}
                    />
                  )}

                  {/* Reciter indicator badge */}
                  <div className="mt-2 text-[10px] sm:text-[11px] text-slate-400 font-cairo flex items-center gap-1">
                    <Volume2 className="w-3 h-3 text-emerald-400" />
                    <span>{language === 'ar' ? selectedReciter.nameAr : selectedReciter.nameEn}</span>
                  </div>
                </div>

                {/* Bottom Full Control Dock */}
                <div className={`p-2.5 sm:p-3.5 rounded-2xl border backdrop-blur-2xl space-y-2.5 ${cardBgClass}`}>
                  
                  {/* Speed Selector & Restart */}
                  <div className="flex items-center justify-between gap-2 text-[11px] font-cairo">
                    <button
                      type="button"
                      onClick={restartCurrentAyah}
                      className="px-2.5 py-1 rounded-lg border flex items-center gap-1 text-slate-400 hover:text-slate-200 cursor-pointer transition-colors text-[10px] sm:text-[11px]"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{language === 'ar' ? 'إعادة الآية' : 'Restart'}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {[0.75, 1.0, 1.25].map((speed) => (
                        <button
                          key={speed}
                          type="button"
                          onClick={() => changePlaybackSpeed(speed)}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                            playbackSpeed === speed
                              ? 'bg-emerald-500 text-slate-950'
                              : 'text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleStopSession}
                      className="px-2.5 py-1 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 cursor-pointer transition-colors font-bold text-[10px] sm:text-[11px]"
                    >
                      {language === 'ar' ? 'إنهاء' : 'End'}
                    </button>
                  </div>

                  {/* Main Playback Bar */}
                  <div className="flex items-center justify-center gap-4 sm:gap-6 pt-0.5">
                    <button
                      type="button"
                      onClick={prevAyah}
                      disabled={currentAyahIndex === 0}
                      className="p-2 sm:p-2.5 rounded-xl border transition-all disabled:opacity-30 cursor-pointer hover:scale-105 active:scale-95 text-slate-300 hover:text-white"
                      title={language === 'ar' ? 'الآية السابقة' : 'Previous Ayah'}
                    >
                      {isRtl ? <SkipForward className="w-4 h-4" /> : <SkipBack className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={handlePausePlay}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      title={isPlaying ? (language === 'ar' ? 'إيقاف مؤقت' : 'Pause') : (language === 'ar' ? 'تشغيل' : 'Play')}
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={nextAyah}
                      className="p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer hover:scale-105 active:scale-95 text-slate-300 hover:text-white"
                      title={language === 'ar' ? 'الآية التالية' : 'Next Ayah'}
                    >
                      {isRtl ? <SkipBack className="w-4 h-4" /> : <SkipForward className="w-4 h-4" />}
                    </button>
                  </div>

                </div>

              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
