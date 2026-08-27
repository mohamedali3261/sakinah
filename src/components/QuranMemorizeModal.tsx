import React, { useState, useEffect, useRef } from 'react';
import { MemorizationConfig, QuranVerse, Reciter } from '../types';
import { RECITERS_LIST } from '../data/quranData';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Sliders,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Headphones,
  BookOpen,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine, triggerHaptic } from '../utils/audio';

interface QuranMemorizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahNumber: number;
  surahNameAr: string;
  verses: QuranVerse[];
  theme: string;
  language: 'ar' | 'en';
}

export const QuranMemorizeModal: React.FC<QuranMemorizeModalProps> = ({
  isOpen,
  onClose,
  surahNumber,
  surahNameAr,
  verses,
  theme,
  language
}) => {
  const maxAyah = verses.length > 0 ? verses[verses.length - 1].verseNumber : 1;

  // Settings
  const [fromAyah, setFromAyah] = useState<number>(1);
  const [toAyah, setToAyah] = useState<number>(Math.min(5, maxAyah));
  const [repeatPerAyah, setRepeatPerAyah] = useState<number>(3);
  const [repeatWholeRange, setRepeatWholeRange] = useState<number>(2);
  const [delayBetweenRepeatsSec, setDelayBetweenRepeatsSec] = useState<number>(1);
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(RECITERS_LIST[0]);
  const [hideTextForTesting, setHideTextForTesting] = useState<boolean>(false);

  // Playback Progress State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentAyahIndex, setCurrentAyahIndex] = useState<number>(0);
  const [currentAyahRepeatCount, setCurrentAyahRepeatCount] = useState<number>(1);
  const [currentRangeLoopCount, setCurrentRangeLoopCount] = useState<number>(1);
  const [isWaitingDelay, setIsWaitingDelay] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Filtered active range of verses
  const activeVerses = verses.filter(
    (v) => v.verseNumber >= fromAyah && v.verseNumber <= toAyah
  );

  const currentVerse = activeVerses[currentAyahIndex] || activeVerses[0];

  // Sync toAyah when max changes
  useEffect(() => {
    if (verses.length > 0) {
      setFromAyah(1);
      setToAyah(Math.min(5, verses.length));
    }
  }, [verses, surahNumber]);

  // Handle Playback Logic
  const playVerseAudio = (verseNum: number) => {
    if (!audioRef.current) return;
    // Format verse audio url using EveryAyah.com or AlQuran Cloud audio CDN
    // EveryAyah structure: https://everyayah.com/data/Alafasy_128kbps/001001.mp3
    const sNum = String(surahNumber).padStart(3, '0');
    const aNum = String(verseNum).padStart(3, '0');
    
    // Choose reciter folder
    let reciterSub = 'Alafasy_128kbps';
    if (selectedReciter.id.includes('minshawi')) reciterSub = 'Minshawy_Murattal_128kbps';
    else if (selectedReciter.id.includes('hussary')) reciterSub = 'Husary_128kbps';
    else if (selectedReciter.id.includes('abdulbasit')) reciterSub = 'Abdul_Basit_Murattal_192kbps';
    else if (selectedReciter.id.includes('ghamdi')) reciterSub = 'Ghamadi_40kbps';
    else if (selectedReciter.id.includes('maher')) reciterSub = 'Maher_AlMuaiqly_64kbps';

    const audioUrl = `https://everyayah.com/data/${reciterSub}/${sNum}${aNum}.mp3`;

    audioRef.current.src = audioUrl;
    audioRef.current.play().catch(() => {
      // If error or blocked, try fallback
    });
  };

  const handleStartSession = () => {
    if (activeVerses.length === 0) return;
    soundEngine.playClick();
    triggerHaptic(20);
    setIsRunning(true);
    setCurrentAyahIndex(0);
    setCurrentAyahRepeatCount(1);
    setCurrentRangeLoopCount(1);
    playVerseAudio(activeVerses[0].verseNumber);
  };

  const handlePauseSession = () => {
    setIsRunning(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleResetSession = () => {
    setIsRunning(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setCurrentAyahIndex(0);
    setCurrentAyahRepeatCount(1);
    setCurrentRangeLoopCount(1);
    setIsWaitingDelay(false);
  };

  const handleAudioEnded = () => {
    if (!isRunning) return;

    // Check if we need more repeats for this individual ayah
    if (currentAyahRepeatCount < repeatPerAyah) {
      setIsWaitingDelay(true);
      setTimeout(() => {
        setIsWaitingDelay(false);
        setCurrentAyahRepeatCount((prev) => prev + 1);
        if (currentVerse) {
          playVerseAudio(currentVerse.verseNumber);
        }
      }, delayBetweenRepeatsSec * 1000);
      return;
    }

    // Finished repeats for this ayah, move to next ayah in range
    if (currentAyahIndex < activeVerses.length - 1) {
      setIsWaitingDelay(true);
      setTimeout(() => {
        setIsWaitingDelay(false);
        const nextIdx = currentAyahIndex + 1;
        setCurrentAyahIndex(nextIdx);
        setCurrentAyahRepeatCount(1);
        playVerseAudio(activeVerses[nextIdx].verseNumber);
      }, delayBetweenRepeatsSec * 1000);
      return;
    }

    // Finished all verses in range! Check if we need to repeat the whole range
    if (currentRangeLoopCount < repeatWholeRange) {
      setIsWaitingDelay(true);
      setTimeout(() => {
        setIsWaitingDelay(false);
        setCurrentRangeLoopCount((prev) => prev + 1);
        setCurrentAyahIndex(0);
        setCurrentAyahRepeatCount(1);
        playVerseAudio(activeVerses[0].verseNumber);
      }, (delayBetweenRepeatsSec + 1) * 1000);
      return;
    }

    // Completely finished whole repetition plan!
    setIsRunning(false);
    soundEngine.playSuccess();
    triggerHaptic(50);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className={`w-full max-w-2xl max-h-[90vh] rounded-t-3xl sm:rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${
            theme === 'light'
              ? 'bg-[#fbf9f4] border-emerald-300 text-slate-800'
              : theme === 'sepia'
              ? 'bg-[#291b12] border-amber-800/60 text-amber-50'
              : 'bg-slate-900 border-emerald-500/30 text-slate-100'
          }`}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-emerald-500/20 flex items-center justify-between bg-emerald-950/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base sm:text-lg font-cairo text-slate-100 flex items-center gap-2">
                  <span>وضع تحفيظ وتثبيت القرآن</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    سورة {surahNameAr}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 font-cairo">
                  تكرار الآيات تلقائياً وتثبيت الحفظ بإتقان مع كبار القراء
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                handleResetSession();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* 1. Range & Repetition Controls (When not in full focus play) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-cairo text-emerald-400 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>تحديد نطاق الآيات والتكرار</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {activeVerses.length} آيات محددة
                </span>
              </div>

              {/* Range Selectors */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-black/20 border border-white/5">
                  <label className="block text-[11px] text-slate-400 font-cairo mb-1">من الآية</label>
                  <select
                    disabled={isRunning}
                    value={fromAyah}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFromAyah(val);
                      if (val > toAyah) setToAyah(val);
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg py-1 px-2 text-center text-sm font-bold font-mono text-emerald-300 focus:outline-none"
                  >
                    {verses.map((v) => (
                      <option key={v.verseNumber} value={v.verseNumber}>
                        {v.verseNumber}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-2.5 rounded-xl bg-black/20 border border-white/5">
                  <label className="block text-[11px] text-slate-400 font-cairo mb-1">إلى الآية</label>
                  <select
                    disabled={isRunning}
                    value={toAyah}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setToAyah(val);
                      if (val < fromAyah) setFromAyah(val);
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg py-1 px-2 text-center text-sm font-bold font-mono text-emerald-300 focus:outline-none"
                  >
                    {verses.map((v) => (
                      <option key={v.verseNumber} value={v.verseNumber}>
                        {v.verseNumber}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-2.5 rounded-xl bg-black/20 border border-white/5">
                  <label className="block text-[11px] text-slate-400 font-cairo mb-1">تكرار الآية</label>
                  <select
                    disabled={isRunning}
                    value={repeatPerAyah}
                    onChange={(e) => setRepeatPerAyah(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg py-1 px-2 text-center text-sm font-bold font-mono text-amber-300 focus:outline-none"
                  >
                    {[1, 2, 3, 5, 7, 10, 15, 20].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'مرة' : 'مرات'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-2.5 rounded-xl bg-black/20 border border-white/5">
                  <label className="block text-[11px] text-slate-400 font-cairo mb-1">تكرار المقطع</label>
                  <select
                    disabled={isRunning}
                    value={repeatWholeRange}
                    onChange={(e) => setRepeatWholeRange(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg py-1 px-2 text-center text-sm font-bold font-mono text-amber-300 focus:outline-none"
                  >
                    {[1, 2, 3, 5, 7, 10].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'مرة' : 'جولات'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reciter & Options */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10 text-xs font-cairo">
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-400">القارئ:</span>
                  <select
                    disabled={isRunning}
                    value={selectedReciter.id}
                    onChange={(e) => {
                      const rec = RECITERS_LIST.find((r) => r.id === e.target.value);
                      if (rec) setSelectedReciter(rec);
                    }}
                    className="bg-slate-800 border border-slate-700 rounded-lg py-1 px-2 text-xs font-bold text-slate-200 focus:outline-none"
                  >
                    {RECITERS_LIST.slice(0, 8).map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nameAr}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hide Text Toggle for Self-Testing */}
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setHideTextForTesting(!hideTextForTesting);
                  }}
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                    hideTextForTesting
                      ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {hideTextForTesting ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{hideTextForTesting ? 'إخفاء النص لاختبار الحفظ' : 'إظهار النص'}</span>
                </button>
              </div>
            </div>

            {/* 2. Active Ayah Focus Card */}
            {currentVerse && (
              <div
                dir="rtl"
                className={`p-6 rounded-3xl border-2 text-center relative transition-all shadow-xl ${
                  isRunning
                    ? 'bg-gradient-to-b from-emerald-950/40 via-slate-900 to-emerald-950/20 border-emerald-400/50 shadow-emerald-950/60'
                    : 'bg-slate-800/40 border-slate-700'
                }`}
              >
                {/* Repetition Indicators Badge */}
                <div className="flex items-center justify-between mb-4 text-xs font-cairo">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      الآية {currentVerse.verseNumber}
                    </span>
                    {isRunning && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                        تكرار {currentAyahRepeatCount} / {repeatPerAyah}
                      </span>
                    )}
                  </div>

                  {isRunning && (
                    <span className="text-slate-400 font-mono">
                      جولة المقطع {currentRangeLoopCount} / {repeatWholeRange}
                    </span>
                  )}
                </div>

                {/* Ayah Text / Blur for Testing */}
                <div className="min-h-[100px] flex items-center justify-center my-2">
                  <p
                    className={`font-quran font-bold text-xl sm:text-2xl sm:leading-loose text-slate-100 transition-all ${
                      hideTextForTesting && isRunning ? 'blur-md select-none opacity-40' : ''
                    }`}
                  >
                    «{currentVerse.textAr}»
                  </p>
                </div>

                {/* Delay Spinner Feedback */}
                {isWaitingDelay && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 text-xs text-amber-400 font-cairo flex items-center justify-center gap-1.5"
                  >
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span>استمع وكرر بلسانك...</span>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="p-4 sm:p-5 border-t border-white/10 bg-black/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetSession}
                title="إعادة ضبط"
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Big Primary Play/Pause Button */}
            {!isRunning ? (
              <button
                onClick={handleStartSession}
                className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold font-cairo text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>بدء جلسة التحفيظ</span>
              </button>
            ) : (
              <button
                onClick={handlePauseSession}
                className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold font-cairo text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Pause className="w-5 h-5" />
                <span>إيقاف مؤقت</span>
              </button>
            )}

            <button
              onClick={() => {
                handleResetSession();
                onClose();
              }}
              className="px-4 py-3 rounded-2xl bg-white/10 text-slate-300 font-bold font-cairo text-xs hover:bg-white/20 transition-all cursor-pointer"
            >
              تم
            </button>
          </div>

          {/* Hidden Audio Element */}
          <audio ref={audioRef} onEnded={handleAudioEnded} className="hidden" />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
