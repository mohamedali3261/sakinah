import React, { useState } from 'react';
import { QuranSurah, QuranVerse } from '../types';
import { useApp } from '../context/AppContext';
import { getPaperThemeById } from '../data/paperThemes';
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Copy,
  BookOpen,
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
  Volume2,
  Eye,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine, triggerHaptic } from '../utils/audio';
import { AyahEndMarker } from './AyahEndMarker';
import { MushafSurahHeader } from './MushafSurahHeader';
import { QuranImagePageView } from './QuranImagePageView';

interface QuranPageViewProps {
  surah: QuranSurah;
  currentPageNumber: number;
  pagesInSurah: number[];
  onPageChange: (newPage: number, direction: number) => void;
  direction: number;
  fontFamily: string;
  fontSize: string;
  theme: string;
  language: 'ar' | 'en';
  onAyahClick: (verse: QuranVerse) => void;
  onCopyAyah: (verse: QuranVerse) => void;
  onToggleBookmark: (verse: QuranVerse) => void;
  isBookmarked: (id: string) => boolean;
  selectedAyahNumber: number | null;
}

export const QuranPageView: React.FC<QuranPageViewProps> = ({
  surah,
  currentPageNumber,
  pagesInSurah,
  onPageChange,
  direction,
  fontFamily,
  fontSize,
  theme,
  language,
  onAyahClick,
  onCopyAyah,
  onToggleBookmark,
  isBookmarked,
  selectedAyahNumber
}) => {
  const { quranPaperTheme, setIsPaperThemeModalOpen } = useApp();
  const paperTheme = getPaperThemeById(quranPaperTheme);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [isImageMode, setIsImageMode] = useState<boolean>(false);

  // Verses belonging to current page
  const pageVerses = surah.verses.filter((v) => (v.page || pagesInSurah[0] || 1) === currentPageNumber);
  
  // If no verses matched directly (e.g. initial fallback), show all or chunk
  const activeVerses = pageVerses.length > 0 ? pageVerses : surah.verses;
  
  const currentJuz = activeVerses[0]?.juz || surah.juzStart || 1;
  const isFirstPageOfSurah = activeVerses[0]?.verseNumber === 1;

  const currentIndex = pagesInSurah.indexOf(currentPageNumber);
  const hasPrevPage = currentIndex > 0;
  const hasNextPage = currentIndex < pagesInSurah.length - 1;

  const goToPrevPage = () => {
    if (hasPrevPage) {
      soundEngine.playClick();
      triggerHaptic(12);
      onPageChange(pagesInSurah[currentIndex - 1], -1);
    }
  };

  const goToNextPage = () => {
    if (hasNextPage) {
      soundEngine.playClick();
      triggerHaptic(12);
      onPageChange(pagesInSurah[currentIndex + 1], 1);
    }
  };

  // Swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    // In Arabic RTL: Swipe Left is Next Page, Swipe Right is Previous Page
    if (isLeftSwipe && hasNextPage) {
      goToNextPage();
    } else if (isRightSwipe && hasPrevPage) {
      goToPrevPage();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  const getArabicFontClass = () => {
    switch (fontFamily) {
      case 'quran':
        return 'font-quran';
      case 'amiri':
        return 'font-amiri';
      case 'noto-naskh':
        return 'font-naskh';
      default:
        return 'font-quran';
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-lg sm:text-xl leading-[2.4]';
      case 'md':
        return 'text-xl sm:text-2xl leading-[2.6]';
      case 'lg':
        return 'text-2xl sm:text-3xl leading-[2.8]';
      case 'xl':
        return 'text-3xl sm:text-4xl leading-[3.0]';
      case '2xl':
        return 'text-4xl sm:text-5xl leading-[3.2]';
      default:
        return 'text-xl sm:text-2xl leading-[2.6]';
    }
  };

  const pageVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
      rotateY: dir > 0 ? -4 : 4,
      scale: 0.985
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
      scale: 1,
      transition: {
        x: { type: 'spring', damping: 28, stiffness: 280 },
        opacity: { duration: 0.28 },
        scale: { duration: 0.28 },
        rotateY: { duration: 0.28 }
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0,
      rotateY: dir > 0 ? 4 : -4,
      scale: 0.985,
      transition: {
        x: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.18 },
        scale: { duration: 0.22 },
        rotateY: { duration: 0.22 }
      }
    })
  };

  return (
    <div className="space-y-4 select-none" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      {/* Top Page Bar & Quick Jump Controls */}
      <div className="flex items-center justify-between px-2 py-2 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-emerald-400 font-cairo">
            {language === 'ar' ? `الجزء ${currentJuz}` : `Juz ${currentJuz}`}
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300 font-cairo">
            {language === 'ar' ? `صفحة ${currentPageNumber}` : `Page ${currentPageNumber}`}
          </span>
          {pagesInSurah.length > 1 && (
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              ({language === 'ar' ? `صفحة ${currentIndex + 1} من ${pagesInSurah.length} للسورة` : `${currentIndex + 1} of ${pagesInSurah.length}`})
            </span>
          )}
        </div>

        {/* Page Slider / Selector */}
        {pagesInSurah.length > 1 && (
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={pagesInSurah.length - 1}
              value={currentIndex}
              onChange={(e) => {
                const newIdx = parseInt(e.target.value, 10);
                const newDir = newIdx > currentIndex ? 1 : -1;
                onPageChange(pagesInSurah[newIdx], newDir);
              }}
              className="w-24 sm:w-36 accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>
        )}

        {/* Page Turn Actions & Image Mode Toggle */}
        <div className="flex items-center gap-1.5">
          {/* Toggle Paper Theme & Ambient Sounds Quick Actions */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setIsPaperThemeModalOpen(true);
            }}
            title={language === 'ar' ? 'ألوان ورق المصحف' : 'Paper Themes'}
            className="p-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs font-bold font-cairo flex items-center gap-1 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'ar' ? 'ورق المصحف' : 'Paper'}</span>
          </button>

          {/* Toggle between Digital Text and Quran.com Page Image */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setIsImageMode(!isImageMode);
            }}
            title={isImageMode ? (language === 'ar' ? 'التبديل إلى النص الرقمي' : 'Digital Text') : (language === 'ar' ? 'التبديل إلى مصورة quran.com-images' : 'Quran Image')}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold font-cairo flex items-center gap-1 transition-all cursor-pointer ${
              isImageMode
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-emerald-300 hover:border-emerald-500/40'
            }`}
          >
            {isImageMode ? <FileText className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden md:inline">
              {isImageMode
                ? (language === 'ar' ? 'النص الرقمي' : 'Digital Text')
                : (language === 'ar' ? 'مصورة quran.com-images' : 'Quran Image')}
            </span>
          </button>

          <button
            onClick={goToPrevPage}
            disabled={!hasPrevPage}
            title={language === 'ar' ? 'الصفحة السابقة' : 'Previous Page'}
            className={`p-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              hasPrevPage
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-emerald-300'
                : 'bg-slate-900/40 border-slate-800/40 text-slate-600 cursor-not-allowed opacity-50'
            }`}
          >
            <ChevronRight className={`w-4 h-4 ${language === 'en' ? 'rotate-180' : ''}`} />
            <span className="hidden sm:inline">{language === 'ar' ? 'السابقة' : 'Prev'}</span>
          </button>

          <button
            onClick={goToNextPage}
            disabled={!hasNextPage}
            title={language === 'ar' ? 'الصفحة التالية' : 'Next Page'}
            className={`p-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              hasNextPage
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                : 'bg-slate-900/40 border-slate-800/40 text-slate-600 cursor-not-allowed opacity-50'
            }`}
          >
            <span className="hidden sm:inline">{language === 'ar' ? 'التالية' : 'Next'}</span>
            <ChevronLeft className={`w-4 h-4 ${language === 'en' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* If Image Mode is toggled: Render QuranImagePageView directly */}
      {isImageMode ? (
        <QuranImagePageView
          pageNumber={currentPageNumber}
          onPageChange={onPageChange}
          direction={direction}
          theme={theme}
          language={language}
          surahNameAr={surah.nameAr}
          juzNumber={currentJuz}
        />
      ) : (
        <>
          <div className="relative overflow-hidden perspective-1000 min-h-[460px] sm:min-h-[540px]">
            <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPageNumber}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className={`relative w-full rounded-3xl border-2 p-4 sm:p-7 md:p-9 shadow-2xl transition-all ${paperTheme.bgClass} ${paperTheme.borderClass} ${paperTheme.textClass}`}
          >
            {/* Inner Ornate Framing Line */}
            <div className={`absolute inset-2 sm:inset-3 border rounded-2xl pointer-events-none transition-colors ${paperTheme.innerBorderClass}`} />

            {/* Islamic Floral Decorative Corner Accents */}
            <div className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 border-t-2 border-r-2 rounded-tr-lg pointer-events-none flex items-center justify-center ${paperTheme.innerBorderClass}`}>
              <span className={`text-[9px] ${paperTheme.rosetteClass}`}>❖</span>
            </div>
            <div className={`absolute top-3 left-3 sm:top-4 sm:left-4 w-7 h-7 border-t-2 border-l-2 rounded-tl-lg pointer-events-none flex items-center justify-center ${paperTheme.innerBorderClass}`}>
              <span className={`text-[9px] ${paperTheme.rosetteClass}`}>❖</span>
            </div>
            <div className={`absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-7 h-7 border-b-2 border-r-2 rounded-br-lg pointer-events-none flex items-center justify-center ${paperTheme.innerBorderClass}`}>
              <span className={`text-[9px] ${paperTheme.rosetteClass}`}>❖</span>
            </div>
            <div className={`absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-7 h-7 border-b-2 border-l-2 rounded-bl-lg pointer-events-none flex items-center justify-center ${paperTheme.innerBorderClass}`}>
              <span className={`text-[9px] ${paperTheme.rosetteClass}`}>❖</span>
            </div>

            {/* Mushaf Page Header */}
            <div className="relative z-10 flex items-center justify-between border-b pb-2 mb-4 text-xs font-cairo opacity-80 border-amber-500/20 px-2">
              <div className="flex items-center gap-1 text-emerald-400 font-bold">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'ar' ? `سُورَةُ ${surah.nameAr}` : `Surah ${surah.nameEn}`}</span>
              </div>
              <span className="font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                {language === 'ar' ? `الجزء ${currentJuz}` : `Juz ${currentJuz}`}
              </span>
              <span className="text-[11px] text-slate-400">
                {surah.revelationType === 'Meccan' ? (language === 'ar' ? 'مَكِّيَّةٌ 🕋' : 'Meccan') : (language === 'ar' ? 'مَدَنِيَّةٌ 🕌' : 'Medinan')}
              </span>
            </div>

            {/* Surah Title Banner (Shown on first page of Surah) */}
            {isFirstPageOfSurah && (
              <MushafSurahHeader
                surah={surah}
                showBismillah={true}
                theme={theme}
                language={language}
              />
            )}

            {/* Page Verses Continuous Justified Arabic Text in Mushaf Style */}
            <div
              dir="rtl"
              className={`relative z-10 mushaf-layout px-1 sm:px-3 py-1 select-text ${getArabicFontClass()} ${getFontSizeClass()}`}
            >
              {activeVerses.map((verse) => {
                const isSelected = selectedAyahNumber === verse.verseNumber;
                const bookmarkId = `quran_${surah.number}_${verse.verseNumber}`;
                const saved = isBookmarked(bookmarkId);

                return (
                  <span
                    key={verse.id || verse.verseNumber}
                    onClick={() => onAyahClick(verse)}
                    className={`inline transition-all cursor-pointer rounded-lg px-0.5 py-0.5 ${
                      isSelected
                        ? 'bg-emerald-500/30 text-emerald-200 shadow-sm'
                        : 'hover:bg-emerald-500/15 hover:text-emerald-300'
                    }`}
                  >
                    {verse.textAr}{' '}
                    <AyahEndMarker
                      verseNumber={verse.verseNumber}
                      isBookmarked={saved}
                      isSelected={isSelected}
                      onClick={() => onAyahClick(verse)}
                    />{' '}
                  </span>
                );
              })}
            </div>

            {/* Mushaf Page Footer */}
            <div className="relative z-10 mt-8 pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs font-cairo opacity-75 px-2">
              <span className="text-[11px] text-slate-400">
                {language === 'ar' ? `الحزب ${Math.ceil(currentJuz * 2)}` : `Hizb ${Math.ceil(currentJuz * 2)}`}
              </span>
              <div className="px-4 py-0.5 rounded-full border border-amber-400/40 bg-amber-500/10 text-amber-300 font-bold font-mono text-xs shadow-inner">
                ﴿ {currentPageNumber} ﴾
              </div>
              <span className="text-[11px] text-slate-400 font-cairo">
                {language === 'ar' ? 'مصحف المدينة المنورة' : 'Madinah Mushaf'}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Page Flip Quick Action Buttons (Left & Right) */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={goToPrevPage}
          disabled={!hasPrevPage}
          className={`flex-1 py-3 px-4 rounded-2xl border font-cairo font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            hasPrevPage
              ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200 hover:text-emerald-300 shadow-md'
              : 'bg-slate-900/30 border-slate-800/30 text-slate-600 opacity-40 cursor-not-allowed'
          }`}
        >
          <ChevronRight className={`w-4 h-4 ${language === 'en' ? 'rotate-180' : ''}`} />
          <span>{language === 'ar' ? 'الصفحة السابقة' : 'Previous Page'}</span>
        </button>

        <div className="px-3 text-center">
          <span className="text-[11px] text-slate-400 font-cairo block">
            {language === 'ar' ? 'اسحب لتقليب الصفحة 📲' : 'Swipe to turn page 📲'}
          </span>
        </div>

        <button
          onClick={goToNextPage}
          disabled={!hasNextPage}
          className={`flex-1 py-3 px-4 rounded-2xl border font-cairo font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            hasNextPage
              ? 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-500/40 text-emerald-300 shadow-md'
              : 'bg-slate-900/30 border-slate-800/30 text-slate-600 opacity-40 cursor-not-allowed'
          }`}
        >
          <span>{language === 'ar' ? 'الصفحة التالية' : 'Next Page'}</span>
          <ChevronLeft className={`w-4 h-4 ${language === 'en' ? 'rotate-180' : ''}`} />
        </button>
      </div>
        </>
      )}
    </div>
  );
};
