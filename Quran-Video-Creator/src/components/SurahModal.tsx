import React, { useState, useMemo } from 'react';
import { Search, X, Check, BookOpen } from 'lucide-react';
import { Language, SurahMeta } from '../types';
import { SURAHS_LIST } from '../data/surahs';
import { TRANSLATIONS } from '../data/translations';

interface SurahModalProps {
  isOpen: boolean;
  selectedSurahNumber: number;
  lang: Language;
  onSelect: (surah: SurahMeta) => void;
  onClose: () => void;
}

export const SurahModal: React.FC<SurahModalProps> = ({
  isOpen,
  selectedSurahNumber,
  lang,
  onSelect,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const t = TRANSLATIONS[lang];
  const isAr = lang === 'ar';

  const filteredSurahs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return SURAHS_LIST;

    return SURAHS_LIST.filter((s) => {
      const matchNumber = String(s.number).includes(q);
      const matchEnglish = s.englishName.toLowerCase().includes(q);
      const matchTrans = s.englishNameTranslation.toLowerCase().includes(q);
      const matchArabic = s.name.includes(q);
      return matchNumber || matchEnglish || matchTrans || matchArabic;
    });
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 backdrop-blur-xl border border-emerald-500/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-emerald-500/20 flex items-center justify-between bg-gradient-to-br from-emerald-950/30 via-slate-900/40 to-emerald-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/90 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-lg shadow-emerald-500/10">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isAr ? 'فهرس سور القرآن الكريم' : 'Choose a Surah'}
              </h2>
              <p className="text-xs text-slate-400">
                {isAr ? '114 سورة مباركة بالرسم العثماني' : '114 Holy Quran Surahs'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-gradient-to-br from-slate-800 to-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-5 border-b border-emerald-500/20 bg-gradient-to-br from-slate-900/30 via-slate-800/20 to-slate-900/30">
          <div className="relative">
            <Search className={`absolute top-3 w-4 h-4 text-slate-400 ${isAr ? 'right-3.5' : 'left-3.5'}`} />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchSurah}
              className={`w-full py-3 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-emerald-500/20 focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 text-sm text-white placeholder-slate-500 outline-none transition-all ${
                isAr ? 'pr-10 pl-4 text-right font-arabic' : 'pl-10 pr-4'
              }`}
            />
          </div>
        </div>

        {/* Surahs Scrollable List */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-3 flex-1">
          {filteredSurahs.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              {isAr ? 'لم يتم العثور على سورة مطابقة' : 'No Surah found matching your search'}
            </div>
          ) : (
            filteredSurahs.map((surah) => {
              const isSelected = surah.number === selectedSurahNumber;
              return (
                <button
                  key={surah.number}
                  onClick={() => {
                    onSelect(surah);
                    onClose();
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-emerald-950/70 border-amber-400/60 shadow-md shadow-emerald-950/40'
                      : 'bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 hover:from-slate-800/40 hover:via-slate-700/30 hover:to-slate-800/40 border-emerald-500/20 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Surah Number Badge */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-semibold shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                          : 'bg-gradient-to-br from-slate-900 to-slate-950 text-slate-400 border border-emerald-500/20 group-hover:border-emerald-500/40'
                      }`}
                    >
                      {surah.number}
                    </div>

                    {/* Surah Arabic Name & Meta */}
                    <div className="text-right rtl:text-right ltr:text-left">
                      <h3 className="text-base font-bold font-arabic text-amber-300/90 group-hover:text-amber-200 transition-colors" dir="rtl">
                        {surah.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                        <span>{surah.numberOfAyahs} {t.ayahsWord}</span>
                        <span>•</span>
                        <span className="text-emerald-400/90">
                          {surah.revelationType === 'Meccan' ? t.meccan : t.medinan}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
