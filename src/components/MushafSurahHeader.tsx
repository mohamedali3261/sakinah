import React from 'react';
import { QuranSurah } from '../types';

interface MushafSurahHeaderProps {
  surah: QuranSurah;
  showBismillah?: boolean;
  theme?: string;
  language?: 'ar' | 'en';
}

export const MushafSurahHeader: React.FC<MushafSurahHeaderProps> = ({
  surah,
  showBismillah = true,
  theme = 'dark',
  language = 'ar'
}) => {
  const isMeccan = surah.revelationType === 'Meccan';

  return (
    <div className="my-6 space-y-4 select-none">
      {/* Traditional Ornate Surah Header Plaque */}
      <div className="relative mx-auto max-w-xl">
        {/* Outer Golden/Emerald Arabesque Container */}
        <div
          className={`relative px-4 py-3 sm:py-4 rounded-2xl border-2 shadow-xl flex items-center justify-between overflow-hidden transition-all ${
            theme === 'light'
              ? 'bg-gradient-to-r from-amber-100 via-[#fffbf0] to-amber-100 border-amber-500/60 text-slate-900 shadow-amber-900/10'
              : theme === 'sepia'
              ? 'bg-gradient-to-r from-[#382619] via-[#4d3422] to-[#382619] border-amber-600/70 text-amber-50 shadow-black/60'
              : 'bg-gradient-to-r from-[#062c26] via-[#0d3f37] to-[#062c26] border-emerald-500/60 text-slate-100 shadow-emerald-950/60'
          }`}
        >
          {/* Subtle Arabesque Background Pattern */}
          <div className="absolute inset-0 bg-islamic-arabesque opacity-30 pointer-events-none" />

          {/* Left Ornate Rosette Finial */}
          <div className="flex items-center gap-1.5 shrink-0 z-10">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400" viewBox="0 0 40 40" fill="currentColor">
              <path d="M20 2L24 14L36 10L30 22L40 28L28 32L28 40L18 34L8 40L10 28L0 22L12 14L10 2L20 8Z" opacity="0.85" />
              <circle cx="20" cy="20" r="6" fill="#10b981" />
            </svg>
            <div className="hidden sm:block text-right">
              <span className="text-[10px] text-amber-400 font-bold block font-cairo">
                {isMeccan ? (language === 'ar' ? 'مَكِّيَّةٌ' : 'Meccan') : (language === 'ar' ? 'مَدَنِيَّةٌ' : 'Medinan')}
              </span>
              <span className="text-[9px] text-slate-400 font-mono">
                {language === 'ar' ? `ترتيبها ${surah.number}` : `Order #${surah.number}`}
              </span>
            </div>
          </div>

          {/* Center Title */}
          <div className="text-center z-10 px-2 flex-1">
            <div className="inline-flex items-center gap-2">
              <span className="text-xs text-amber-400 opacity-70">۞</span>
              <h2 className="font-quran text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                سُورَةُ {surah.nameAr}
              </h2>
              <span className="text-xs text-amber-400 opacity-70">۞</span>
            </div>
          </div>

          {/* Right Ornate Rosette Finial */}
          <div className="flex items-center gap-1.5 shrink-0 z-10">
            <div className="hidden sm:block text-left">
              <span className="text-[10px] text-amber-400 font-bold block font-cairo">
                {language === 'ar' ? `آيَاتُهَا ${surah.versesCount}` : `${surah.versesCount} Ayahs`}
              </span>
              <span className="text-[9px] text-slate-400 font-mono">
                {language === 'ar' ? `الجزء ${surah.juzStart}` : `Juz ${surah.juzStart}`}
              </span>
            </div>
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400" viewBox="0 0 40 40" fill="currentColor">
              <path d="M20 2L24 14L36 10L30 22L40 28L28 32L28 40L18 34L8 40L10 28L0 22L12 14L10 2L20 8Z" opacity="0.85" />
              <circle cx="20" cy="20" r="6" fill="#10b981" />
            </svg>
          </div>
        </div>

        {/* Mobile Sub-badge */}
        <div className="sm:hidden flex items-center justify-between px-3 mt-1.5 text-[10px] text-amber-400 font-cairo font-semibold">
          <span>{isMeccan ? 'مَكِّيَّةٌ 🕋' : 'مَدَنِيَّةٌ 🕌'}</span>
          <span>آيَاتُهَا {surah.versesCount} • الجزء {surah.juzStart}</span>
        </div>
      </div>

      {/* Ornate Bismillah Plaque (Surah At-Tawbah does not have Bismillah) */}
      {showBismillah && surah.bismillahPre && surah.number !== 9 && (
        <div className="text-center py-2">
          <div className="inline-block relative px-8 py-2 rounded-full border border-amber-500/30 bg-emerald-950/30 backdrop-blur-sm shadow-inner">
            <p className="font-quran text-2xl sm:text-3xl text-amber-300 font-semibold tracking-wide drop-shadow">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
