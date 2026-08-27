import React from 'react';
import { QuranSurah, QuranVerse } from '../../types';
import { MushafSurahHeader } from '../MushafSurahHeader';
import { AyahEndMarker } from '../AyahEndMarker';
import { QuranPaperTheme } from '../../data/paperThemes';

interface QuranContinuousViewProps {
  currentSurahData: QuranSurah;
  paperTheme: QuranPaperTheme;
  theme: string;
  language: string;
  fontFamily: string;
  fontSize: string;
  inspectedAyah: QuranVerse | null;
  setInspectedAyah: (verse: QuranVerse | null) => void;
  setIsTafsirModalOpen: (open: boolean) => void;
  isBookmarked: (id: string) => boolean;
}

export const QuranContinuousView: React.FC<QuranContinuousViewProps> = ({
  currentSurahData,
  paperTheme,
  theme,
  language,
  fontFamily,
  fontSize,
  inspectedAyah,
  setInspectedAyah,
  setIsTafsirModalOpen,
  isBookmarked,
}) => {
  const getArabicFontClass = () => {
    switch (fontFamily) {
      case 'amiri':
        return 'font-quran';
      case 'scheherazade':
        return 'font-scheherazade';
      case 'tajawal':
        return 'font-tajawal';
      default:
        return 'font-quran';
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-lg sm:text-xl leading-[2.4]';
      case 'lg':
        return 'text-2xl sm:text-3xl md:text-4xl leading-[2.9]';
      case 'xl':
        return 'text-3xl sm:text-4xl md:text-5xl leading-[3.2]';
      default:
        return 'text-xl sm:text-2xl md:text-3xl leading-[2.6]';
    }
  };

  return (
    <div className="space-y-4">
      {/* Ornate Header Component */}
      <MushafSurahHeader
        surah={currentSurahData}
        showBismillah={true}
        theme={theme}
        language={language}
      />

      {/* Full Continuous Flow Container in Authentic Double Border */}
      <div
        className={`relative p-5 sm:p-9 md:p-11 rounded-3xl border-2 shadow-2xl transition-all ${paperTheme.bgClass} ${paperTheme.borderClass} ${paperTheme.textClass}`}
      >
        {/* Inner Framing Line */}
        <div
          className={`absolute inset-2 sm:inset-3 border rounded-2xl pointer-events-none ${paperTheme.innerBorderClass}`}
        />

        {/* Corner Floral Rosettes */}
        <div className={`absolute top-3 right-3 sm:top-4 sm:right-4 text-[9px] pointer-events-none ${paperTheme.rosetteClass}`}>
          ❖
        </div>
        <div className={`absolute top-3 left-3 sm:top-4 sm:left-4 text-[9px] pointer-events-none ${paperTheme.rosetteClass}`}>
          ❖
        </div>
        <div className={`absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-[9px] pointer-events-none ${paperTheme.rosetteClass}`}>
          ❖
        </div>
        <div className={`absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-[9px] pointer-events-none ${paperTheme.rosetteClass}`}>
          ❖
        </div>

        {/* Justified Quran Text */}
        <div
          dir="rtl"
          className={`relative z-10 mushaf-layout px-1 sm:px-3 py-1 select-text ${getArabicFontClass()} ${getFontSizeClass()}`}
        >
          {currentSurahData.verses.map((verse) => {
            const bookmarkId = `quran_${currentSurahData.number}_${verse.verseNumber}`;
            const saved = isBookmarked(bookmarkId);
            const isSelected = inspectedAyah?.verseNumber === verse.verseNumber;

            return (
              <span
                key={verse.id || verse.verseNumber}
                onClick={() => {
                  setInspectedAyah(verse);
                  setIsTafsirModalOpen(true);
                }}
                className={`inline transition-all cursor-pointer rounded-lg px-0.5 py-0.5 ${
                  isSelected
                    ? 'bg-emerald-500/30 text-emerald-200 shadow-sm'
                    : 'hover:text-emerald-300 hover:bg-emerald-500/15'
                }`}
              >
                {verse.textAr}{' '}
                <AyahEndMarker
                  verseNumber={verse.verseNumber}
                  isBookmarked={saved}
                  isSelected={isSelected}
                  onClick={() => {
                    setInspectedAyah(verse);
                    setIsTafsirModalOpen(true);
                  }}
                />{' '}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
