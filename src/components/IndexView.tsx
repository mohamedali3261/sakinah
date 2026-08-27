import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SURAHS_METADATA } from '../data/quranData';
import { SURAH_START_PAGES } from './QuranImagePageView';
import {
  BookOpen,
  Search,
  ArrowUpRight,
  Layers
} from 'lucide-react';
import { soundEngine, triggerHaptic } from '../utils/audio';

export const IndexView: React.FC = () => {
  const {
    language,
    theme,
    setActiveTab,
    soundEnabled,
    vibrationEnabled
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const navigateToQuranSurah = (surahNum: number) => {
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(10);
    const startPage = SURAH_START_PAGES[surahNum] || 1;
    localStorage.setItem('sakinah_last_quran_page', startPage.toString());
    localStorage.setItem('sakinah_trigger_standalone_mushaf', 'true');
    localStorage.setItem('sakinah_opened_from_index', 'true');
    setActiveTab('quran');
  };

  const query = searchQuery.trim().toLowerCase();

  const filteredSurahs = SURAHS_METADATA.filter(
    (s) =>
      s.nameAr.includes(query) ||
      s.nameEn.toLowerCase().includes(query) ||
      s.number.toString() === query
  );

  return (
    <div id="index-view" className="space-y-6 pb-20">
      {/* Header Banner - Focused on Quran Surahs Catalog */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border backdrop-blur-xl transition-all shadow-xl bg-gradient-to-br from-teal-950/40 via-slate-900/60 to-emerald-950/30 border-teal-500/30">
        <div className="absolute inset-0 bg-islamic-arabesque opacity-10 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30 mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'فهرس سور القرآن الكريم (١١٤ سورة)' : 'Quran Catalog (114 Surahs)'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-cairo text-slate-100 mb-2">
            {language === 'ar' ? 'فهرس سور المصحف الشريف' : 'Holy Quran Surahs Index'}
          </h1>
          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            {language === 'ar'
              ? 'دليلك الشامل للوصول السريع وقراءة سور القرآن الكريم في وضع ملء الشاشة المستقل بلمسة واحدة.'
              : 'Your comprehensive directory to quickly open any Surah in standalone, distraction-free full-screen mode.'}
          </p>

          {/* Catalog Statistics */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-slate-700/40">
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-xl sm:text-2xl font-bold font-cairo text-emerald-400 block">١١٤</span>
              <span className="text-[10px] sm:text-xs text-slate-400">{language === 'ar' ? 'سورة مباركة' : 'Total Surahs'}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-xl sm:text-2xl font-bold font-cairo text-teal-400 block">٦٠٤</span>
              <span className="text-[10px] sm:text-xs text-slate-400">{language === 'ar' ? 'صفحة مرقمة' : 'Pages'}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-xl sm:text-2xl font-bold font-cairo text-amber-400 block">٣٠</span>
              <span className="text-[10px] sm:text-xs text-slate-400">{language === 'ar' ? 'جزءاً شريفاً' : 'Ajza’'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-full">
        <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${language === 'ar' ? 'right-3.5' : 'left-3.5'}`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'ar' ? 'ابحث عن سورة بالاسم، بالرقم، أو بالترتيب...' : 'Search Surah by name, number, or order...'}
          className={`w-full py-3 rounded-2xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/40 ${
            language === 'ar' ? 'pr-10 pl-4 font-cairo' : 'pl-10 pr-4'
          } ${
            theme === 'light'
              ? 'bg-white border-slate-200 text-slate-800'
              : 'bg-slate-900/70 border-slate-800 text-slate-100 placeholder-slate-500'
          }`}
        />
      </div>

      {/* Surahs Catalog Grid with redone centered structure */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredSurahs.map((s) => (
            <div
              key={s.number}
              onClick={() => navigateToQuranSurah(s.number)}
              className={`p-5 rounded-2xl border backdrop-blur-xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center hover:scale-[1.03] hover:shadow-lg ${
                theme === 'light'
                  ? 'bg-white/80 border-slate-200 hover:border-teal-500/50 hover:shadow-teal-100/30'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-teal-500/40 hover:shadow-teal-950/40'
              }`}
            >
              {/* 1. Surah Number and Icon (🕋/🕌) at the top */}
              <div className="flex items-center justify-between w-full text-slate-400 text-xs mb-3 select-none">
                <span className="font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-400">
                  #{s.number}
                </span>
                <span className="text-3xl leading-none filter drop-shadow-sm" title={s.revelationType === 'Meccan' ? (language === 'ar' ? 'مكية' : 'Meccan') : (language === 'ar' ? 'مدنية' : 'Medinan')}>
                  {s.revelationType === 'Meccan' ? '🕋' : '🕌'}
                </span>
              </div>

              {/* 2. Surah Name - Enlarged and centered */}
              <span className="font-quran font-extrabold text-2xl sm:text-3xl text-slate-100 block my-1">
                {s.nameAr}
              </span>
              <span className="text-xs text-slate-400 font-sans block mb-3">
                {s.nameEn}
              </span>

              {/* 3. Number of Verses at the bottom */}
              <span className="text-[11px] font-bold font-cairo bg-slate-800 text-amber-300 px-3 py-1 rounded-full border border-slate-700/50">
                {s.versesCount} {language === 'ar' ? 'آية' : 'Ayahs'}
              </span>
            </div>
          ))}
        </div>

        {filteredSurahs.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-40 text-teal-400" />
            <p className="font-cairo text-sm">
              {language === 'ar' ? 'لم يتم العثور على أي سورة مطابقة لبحثك.' : 'No Surahs found matching your search.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
