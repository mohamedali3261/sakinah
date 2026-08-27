import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Eye,
  AlignJustify,
  Repeat,
  Sliders,
  Sparkles,
  Headphones,
  Pause,
  Play,
  Music,
} from 'lucide-react';
import { motion } from 'motion/react';
import { QuranSurah, Reciter } from '../../types';
import { soundEngine } from '../../utils/audio';

interface QuranSurahToolbarProps {
  theme: string;
  language: string;
  currentSurahData: QuranSurah | null;
  onBack: () => void;
  viewMode: 'page' | 'mushaf_image' | 'continuous';
  setViewMode: (mode: 'page' | 'mushaf_image' | 'continuous') => void;
  setIsMemorizeModalOpen: (open: boolean) => void;
  setIsRepeatPageOpen: (open: boolean) => void;
  setIsPaperThemeModalOpen: (open: boolean) => void;
  setIsReciterModalOpen: (open: boolean) => void;
  selectedReciter: Reciter;
  isPlaying: boolean;
  handleTogglePlay: () => void;
  audioCurrentTime: number;
  audioDuration: number;
  audioProgress: number;
  handleSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formatTime: (seconds: number) => string;
}

export const QuranSurahToolbar: React.FC<QuranSurahToolbarProps> = ({
  theme,
  language,
  currentSurahData,
  onBack,
  viewMode,
  setViewMode,
  setIsMemorizeModalOpen,
  setIsRepeatPageOpen,
  setIsPaperThemeModalOpen,
  setIsReciterModalOpen,
  selectedReciter,
  isPlaying,
  handleTogglePlay,
  audioCurrentTime,
  audioDuration,
  audioProgress,
  handleSeek,
  formatTime,
}) => {
  return (
    <>
      {/* Top Sticky Surah Toolbar */}
      <div
        className={`sticky top-2 z-30 p-3.5 sm:p-4 rounded-3xl border backdrop-blur-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 transition-all ${
          theme === 'light'
            ? 'bg-white/90 border-slate-200 text-slate-800'
            : theme === 'sepia'
            ? 'bg-[#291c13]/90 border-amber-800/40 text-amber-50'
            : 'bg-slate-900/90 border-slate-800 text-slate-100'
        }`}
      >
        {/* Left: Back Button & Surah Title */}
        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-2xl bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all cursor-pointer flex items-center gap-1 text-xs font-bold font-cairo"
          >
            <ArrowRight className={`w-4 h-4 ${language === 'en' ? 'rotate-180' : ''}`} />
            <span>{language === 'ar' ? 'الفهرس' : 'Index'}</span>
          </button>

          {currentSurahData && (
            <div>
              <h2 className="text-base sm:text-lg font-bold font-cairo text-slate-100">
                {language === 'ar' ? `سورة ${currentSurahData.nameAr}` : `Surah ${currentSurahData.nameEn}`}
              </h2>
              <span className="text-[11px] text-emerald-400 font-cairo block">
                {currentSurahData.versesCount} {language === 'ar' ? 'آية' : 'Ayahs'} •{' '}
                {currentSurahData.revelationType === 'Meccan'
                  ? language === 'ar'
                    ? 'مكية 🕋'
                    : 'Meccan'
                  : language === 'ar'
                  ? 'مدنية 🕌'
                  : 'Medinan'}
              </span>
            </div>
          )}
        </div>

        {/* Right: Reading Modes & Reciter Player */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Reading Mode Tabs */}
          <div className="relative z-10 flex items-center gap-1 bg-slate-800/90 p-1 rounded-2xl border border-slate-700/80">
            {[
              { id: 'page', labelAr: 'صفحة بصفحة', labelEn: 'By Page', icon: <BookOpen className="w-3.5 h-3.5" /> },
              {
                id: 'mushaf_image',
                labelAr: 'مصحف الصور',
                labelEn: 'Quran Images',
                icon: <Eye className="w-3.5 h-3.5 text-amber-400" />,
              },
              {
                id: 'continuous',
                labelAr: 'السورة كاملة',
                labelEn: 'Full Surah',
                icon: <AlignJustify className="w-3.5 h-3.5" />,
              },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  soundEngine.playClick();
                  setViewMode(mode.id as any);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-cairo flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === mode.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:text-slate-100'
                }`}
              >
                {mode.icon}
                <span className="hidden sm:inline">{language === 'ar' ? mode.labelAr : mode.labelEn}</span>
              </button>
            ))}
          </div>

          {/* Memorization Mode Button */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setIsMemorizeModalOpen(true);
            }}
            title={language === 'ar' ? 'وضع تحفيز وتكرار الآيات' : 'Memorization Mode'}
            className="relative z-10 px-3 py-1.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-xs font-bold font-cairo flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Repeat className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'ar' ? 'تحفيز الآيات' : 'Memorize'}</span>
          </button>

          {/* Custom Repeat Page Button */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setIsRepeatPageOpen(true);
            }}
            title={language === 'ar' ? 'صفحة التكرار المخصص' : 'Custom Repeat Page'}
            className="relative z-10 px-3 py-1.5 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-300 hover:bg-teal-500/25 text-xs font-bold font-cairo flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'ar' ? 'تكرار مخصص' : 'Custom Repeat'}</span>
          </button>

          {/* Quran Paper Theme Selector Button */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setIsPaperThemeModalOpen(true);
            }}
            title={language === 'ar' ? 'ألوان وخلفيات ورق المصحف' : 'Quran Paper Themes'}
            className="relative z-10 px-3 py-1.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-xs font-bold font-cairo flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">{language === 'ar' ? 'ورق المصحف' : 'Paper'}</span>
          </button>

          {/* Reciter Selector Button */}
          <button
            onClick={() => setIsReciterModalOpen(true)}
            title={language === 'ar' ? 'اختيار القارئ' : 'Select Reciter'}
            className="px-3 py-1.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 text-xs font-bold font-cairo flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span className="max-w-[90px] truncate">
              {language === 'ar' ? selectedReciter.nameAr : selectedReciter.nameEn}
            </span>
          </button>

          {/* Audio Play/Pause Button */}
          <button
            onClick={handleTogglePlay}
            title={
              isPlaying
                ? language === 'ar'
                  ? 'إيقاف مؤقت'
                  : 'Pause'
                : language === 'ar'
                ? 'تشغيل السورة'
                : 'Play Surah'
            }
            className={`p-1.5 sm:p-2 rounded-2xl border transition-all cursor-pointer shadow-md ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-emerald-500 text-slate-950 border-emerald-400 hover:scale-105'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
            )}
          </button>
        </div>
      </div>

      {/* Audio Player Progress Mini-Bar (When playing) */}
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-2xl border bg-emerald-950/60 border-emerald-500/30 backdrop-blur-xl flex items-center gap-3 text-xs font-cairo"
        >
          <div className="flex items-center gap-2 text-emerald-400 shrink-0">
            <Music className="w-4 h-4 animate-pulse" />
            <span className="font-bold">{language === 'ar' ? selectedReciter.nameAr : selectedReciter.nameEn}</span>
          </div>

          <span className="font-mono text-[11px] text-slate-400">{formatTime(audioCurrentTime)}</span>

          <input
            type="range"
            min="0"
            max="100"
            value={audioProgress || 0}
            onChange={handleSeek}
            className="flex-1 accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />

          <span className="font-mono text-[11px] text-slate-400">{formatTime(audioDuration)}</span>

          <button
            onClick={handleTogglePlay}
            className="p-1 rounded-lg bg-white/10 text-slate-200 hover:bg-white/20 cursor-pointer"
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </>
  );
};
