import React from 'react';
import { BookOpen, Bookmark, ChevronLeft, ChevronRight, Sliders } from 'lucide-react';
import { Reciter } from '../../types';
import { RECITERS_LIST } from '../../data/quranData';
import { KhatmahTracker } from '../KhatmahTracker';
import { soundEngine } from '../../utils/audio';

interface QuranGatewayProps {
  theme: string;
  language: string;
  currentPageNumber: number;
  lastReadSurah: { number: number; nameAr: string; nameEn: string } | null;
  selectedReciter: Reciter;
  setSelectedReciter: (reciter: Reciter) => void;
  handleSurahClick: (surahNum: number, initialPage?: number) => void;
  openStandaloneMushaf: (page?: number) => void;
  setActiveTab: (tab: any) => void;
  setIsRepeatPageOpen: (open: boolean) => void;
}

export const QuranGateway: React.FC<QuranGatewayProps> = ({
  theme,
  language,
  currentPageNumber,
  lastReadSurah,
  selectedReciter,
  setSelectedReciter,
  handleSurahClick,
  openStandaloneMushaf,
  setActiveTab,
  setIsRepeatPageOpen,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Hero Banner with Large Standalone Button */}
      <div
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-10 border backdrop-blur-2xl transition-all shadow-2xl ${
          theme === 'light'
            ? 'bg-gradient-to-br from-amber-50 via-white to-emerald-50 border-amber-300/80 text-slate-900 shadow-amber-900/5'
            : theme === 'sepia'
            ? 'bg-gradient-to-br from-[#332216] via-[#24170f] to-[#1c1109] border-amber-700/60 text-amber-50 shadow-black/60'
            : 'bg-gradient-to-br from-[#06241e] via-[#091e24] to-[#0d1624] border-emerald-500/30 text-slate-100 shadow-emerald-950/50'
        }`}
      >
        {/* Islamic Background Texture */}
        <div className="absolute inset-0 bg-islamic-arabesque opacity-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-cairo">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'ar' ? 'المصحف الشريف المصور (كامل ٦٠٤ صفحة)' : 'The Holy Qur’an (Full 604 Pages)'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-cairo text-slate-100 leading-tight">
            {language === 'ar' ? 'المصحف الشريف المصور' : 'The Holy Quran (Immersive Images)'}
          </h1>

          <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-cairo">
            {language === 'ar'
              ? 'قراءة هادئة خالية من المشتتات والرموز بنمط الصفحات المصورة عالية الجودة. انقر على أي مكان في الصفحة أثناء القراءة لإظهار أزرار التحكم وخيارات التنقل والتمكين الصوتي.'
              : 'Immersive, distraction-free Hafs Quran reading experience with high-quality pages. During reading, tap anywhere on the screen to show or hide navigation controls and audio playbacks.'}
          </p>

          {/* Two Action Buttons: المصحف الشريف & التكرار المخصص */}
          <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-3">
            {/* 1. المصحف الشريف */}
            <button
              id="btn-open-mushaf-main"
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('index');
              }}
              className={`group relative overflow-hidden p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-300 flex items-center justify-between gap-3 sm:gap-4 shadow-xl cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                theme === 'light'
                  ? 'bg-white/95 hover:bg-white border-emerald-300/60 hover:border-emerald-500 text-slate-900 hover:shadow-emerald-900/20'
                  : theme === 'sepia'
                  ? 'bg-[#2b1b11]/90 hover:bg-[#342217] border-amber-800/60 hover:border-amber-600 text-amber-50 hover:shadow-amber-950/40'
                  : 'bg-slate-900/80 hover:bg-slate-800/90 border-emerald-500/30 hover:border-emerald-400 text-white hover:shadow-emerald-950/50'
              }`}
            >
              <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform duration-300 group-hover:scale-105 ${
                    theme === 'light'
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-emerald-600/30'
                      : theme === 'sepia'
                      ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-amber-100 shadow-amber-900/40'
                      : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 shadow-emerald-500/30'
                  }`}
                >
                  <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
                </div>
                <div className="text-right min-w-0">
                  <span
                    className={`text-base sm:text-lg md:text-xl font-extrabold font-cairo block truncate transition-colors ${
                      theme === 'light'
                        ? 'text-slate-900 group-hover:text-emerald-700'
                        : theme === 'sepia'
                        ? 'text-amber-100 group-hover:text-amber-300'
                        : 'text-white group-hover:text-emerald-300'
                    }`}
                  >
                    {language === 'ar' ? 'المصحف الشريف' : 'The Holy Quran'}
                  </span>
                </div>
              </div>

              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                  theme === 'light'
                    ? 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white'
                    : theme === 'sepia'
                    ? 'bg-amber-900/40 text-amber-300 group-hover:bg-amber-700 group-hover:text-amber-50'
                    : 'bg-white/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950'
                }`}
              >
                {language === 'ar' ? (
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-0.5" />
                ) : (
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5" />
                )}
              </div>
            </button>

            {/* 2. التكرار المخصص */}
            <button
              id="btn-custom-repeat-main"
              onClick={() => {
                soundEngine.playClick();
                setIsRepeatPageOpen(true);
              }}
              className={`group relative overflow-hidden p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-300 flex items-center justify-between gap-3 sm:gap-4 shadow-xl cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                theme === 'light'
                  ? 'bg-white/95 hover:bg-white border-teal-300/60 hover:border-teal-500 text-slate-900 hover:shadow-teal-900/20'
                  : theme === 'sepia'
                  ? 'bg-[#2b1b11]/90 hover:bg-[#342217] border-amber-800/60 hover:border-teal-600 text-amber-50 hover:shadow-amber-950/40'
                  : 'bg-slate-900/80 hover:bg-slate-800/90 border-teal-500/30 hover:border-teal-400 text-white hover:shadow-teal-950/50'
              }`}
            >
              <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform duration-300 group-hover:scale-105 ${
                    theme === 'light'
                      ? 'bg-gradient-to-br from-teal-500 to-cyan-700 text-white shadow-teal-600/30'
                      : theme === 'sepia'
                      ? 'bg-gradient-to-br from-teal-700 to-amber-800 text-teal-100 shadow-teal-900/40'
                      : 'bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950 shadow-teal-500/30'
                  }`}
                >
                  <Sliders className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
                </div>
                <div className="text-right min-w-0">
                  <span
                    className={`text-base sm:text-lg md:text-xl font-extrabold font-cairo block truncate transition-colors ${
                      theme === 'light'
                        ? 'text-slate-900 group-hover:text-teal-700'
                        : theme === 'sepia'
                        ? 'text-amber-100 group-hover:text-teal-300'
                        : 'text-white group-hover:text-teal-300'
                    }`}
                  >
                    {language === 'ar' ? 'التكرار المخصص' : 'Custom Repeat'}
                  </span>
                </div>
              </div>

              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                  theme === 'light'
                    ? 'bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white'
                    : theme === 'sepia'
                    ? 'bg-amber-900/40 text-amber-300 group-hover:bg-teal-700 group-hover:text-teal-50'
                    : 'bg-white/10 text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950'
                }`}
              >
                {language === 'ar' ? (
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-0.5" />
                ) : (
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Info & Last Read Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Last Read Quick Jump Box */}
        {lastReadSurah ? (
          <div
            onClick={() => handleSurahClick(lastReadSurah.number)}
            className={`group p-5 rounded-3xl border backdrop-blur-xl transition-all cursor-pointer flex items-center justify-between shadow-lg ${
              theme === 'light'
                ? 'bg-white/80 border-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50/20'
                : 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                <Bookmark className="w-6 h-6 fill-amber-400 text-amber-300" />
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-bold font-cairo">
                  {language === 'ar' ? 'متابعة القراءة والورد الأخير' : 'Resume Your Last Read'}
                </span>
                <span className="text-base font-extrabold font-cairo text-slate-100">
                  {language === 'ar'
                    ? `سورة ${lastReadSurah.nameAr} (صفحة ${currentPageNumber})`
                    : `Surah ${lastReadSurah.nameEn} (Page ${currentPageNumber})`}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold font-cairo">
              <span>{language === 'ar' ? 'اقرأ الآن' : 'Read'}</span>
              <ChevronLeft
                className={`w-4 h-4 group-hover:-translate-x-1 transition-transform ${
                  language === 'en' ? 'rotate-180' : ''
                }`}
              />
            </div>
          </div>
        ) : (
          <div
            onClick={() => handleSurahClick(1)}
            className={`group p-5 rounded-3xl border backdrop-blur-xl transition-all cursor-pointer flex items-center justify-between shadow-lg ${
              theme === 'light'
                ? 'bg-white/80 border-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50/20'
                : 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-bold font-cairo">
                  {language === 'ar' ? 'ابدأ تلاوة جديدة' : 'Start Fresh Reading'}
                </span>
                <span className="text-base font-extrabold font-cairo text-slate-100">
                  {language === 'ar' ? 'سورة الفاتحة (صفحة ١)' : 'Surah Al-Fatihah (Page 1)'}
                </span>
              </div>
            </div>
            <ChevronLeft
              className={`w-4 h-4 text-emerald-400 group-hover:-translate-x-1 transition-transform ${
                language === 'en' ? 'rotate-180' : ''
              }`}
            />
          </div>
        )}

        {/* Quick Settings Configuration Box */}
        <div
          className={`p-5 rounded-3xl border backdrop-blur-xl flex items-center justify-between shadow-lg ${
            theme === 'light' ? 'bg-white/80 border-slate-200' : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-3.5 w-full">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Sliders className="w-5.5 h-5.5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs text-slate-400 block font-bold font-cairo mb-1">
                {language === 'ar' ? 'القارئ الصوتي الحالي للمصحف:' : 'Active Reciter for Audios:'}
              </span>
              <select
                value={selectedReciter.id}
                onChange={(e) => {
                  const r = RECITERS_LIST.find((item) => item.id === e.target.value);
                  if (r) setSelectedReciter(r);
                }}
                className="w-full p-1.5 rounded-xl text-xs font-bold font-cairo bg-slate-800 border border-slate-700 text-emerald-300 outline-none cursor-pointer truncate"
              >
                {RECITERS_LIST.map((rec) => (
                  <option key={rec.id} value={rec.id}>
                    {rec.nameAr}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Khatmah Tracker Segment directly inside the Quran page */}
      <KhatmahTracker
        theme={theme}
        language={language}
        onNavigateToQuranPage={(page) => {
          openStandaloneMushaf(page);
        }}
      />
    </div>
  );
};
