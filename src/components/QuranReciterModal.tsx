import React, { useState } from 'react';
import { Reciter } from '../types';
import { RECITERS_LIST } from '../data/quranData';
import { Search, X, Check, Volume2, User, Mic2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine, triggerHaptic } from '../utils/audio';

interface QuranReciterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedReciter: Reciter;
  onSelectReciter: (reciter: Reciter) => void;
  language: 'ar' | 'en';
  theme: string;
}

export const QuranReciterModal: React.FC<QuranReciterModalProps> = ({
  isOpen,
  onClose,
  selectedReciter,
  onSelectReciter,
  language,
  theme
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'murattal' | 'mujawwad' | 'haramain' | 'popular'>('all');

  const getReciterCategory = (r: Reciter): string => {
    if (r.nameAr.includes('مجود')) return 'mujawwad';
    if (r.nameAr.includes('السديس') || r.nameAr.includes('الشريم') || r.nameAr.includes('الدوسري') || r.nameAr.includes('المعيقلي') || r.nameAr.includes('جابر')) return 'haramain';
    if (r.nameAr.includes('العفاسي') || r.nameAr.includes('عبد الصمد') || r.nameAr.includes('المنشاوي') || r.nameAr.includes('الحصري') || r.nameAr.includes('الغامدي')) return 'popular';
    return 'murattal';
  };

  const filteredReciters = RECITERS_LIST.filter((r) => {
    const matchesSearch =
      r.nameAr.includes(searchQuery) ||
      r.nameEn.toLowerCase().includes(searchQuery.toLowerCase());

    const cat = getReciterCategory(r);
    const matchesCategory =
      categoryFilter === 'all' ||
      (categoryFilter === 'mujawwad' && (cat === 'mujawwad' || r.nameAr.includes('مجود'))) ||
      (categoryFilter === 'haramain' && (cat === 'haramain' || r.nameAr.includes('السديس') || r.nameAr.includes('الشريم') || r.nameAr.includes('الدوسري') || r.nameAr.includes('المعيقلي') || r.nameAr.includes('جابر'))) ||
      (categoryFilter === 'popular' && (cat === 'popular' || r.id === 'mishary' || r.id === 'abdulbasit_murattal' || r.id === 'minshawi_murattal' || r.id === 'hussary_murattal' || r.id === 'ghamdi' || r.id === 'ajmi')) ||
      (categoryFilter === 'murattal' && !r.nameAr.includes('مجود'));

    return matchesSearch && matchesCategory;
  });

  const handleSelect = (r: Reciter) => {
    soundEngine.playClick();
    triggerHaptic(15);
    onSelectReciter(r);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative z-10 w-full max-w-xl max-h-[88vh] rounded-3xl border backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden transition-all ${
              theme === 'light'
                ? 'bg-white border-slate-200 text-slate-800'
                : theme === 'sepia'
                ? 'bg-[#291c14] border-amber-800/40 text-amber-50'
                : 'bg-slate-900 border-slate-800 text-slate-100'
            }`}
          >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Mic2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg font-cairo text-slate-100">
                {language === 'ar' ? 'اختيار القارئ المفضل' : 'Choose Quran Reciter'}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'ar' ? `${RECITERS_LIST.length} قارئاً وشيخاً من كبار القراء` : `${RECITERS_LIST.length} Renowned Qaris & Reciters`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Category Filter Tabs */}
        <div className="p-3 sm:p-4 border-b border-slate-800/60 space-y-2.5">
          <div className="relative w-full">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${language === 'ar' ? 'right-3.5' : 'left-3.5'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ar' ? 'ابحث باسم الشيخ أو القارئ...' : 'Search by reciter name...'}
              className={`w-full py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'
              } ${
                theme === 'light'
                  ? 'bg-slate-100 border-slate-200 text-slate-800'
                  : 'bg-slate-950/60 border-slate-800 text-slate-100 placeholder-slate-500'
              }`}
            />
          </div>

          {/* Quick Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', labelAr: 'الكل', labelEn: 'All' },
              { id: 'popular', labelAr: 'الأكثر استماعاً', labelEn: 'Popular' },
              { id: 'haramain', labelAr: 'أئمة الحرمين', labelEn: 'Haramain' },
              { id: 'murattal', labelAr: 'المصحف المرتل', labelEn: 'Murattal' },
              { id: 'mujawwad', labelAr: 'المصحف المجود', labelEn: 'Mujawwad' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  categoryFilter === tab.id
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-slate-100'
                }`}
              >
                {language === 'ar' ? tab.labelAr : tab.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Reciters List Grid */}
        <div className="p-3 sm:p-4 overflow-y-auto max-h-[50vh] space-y-2">
          {filteredReciters.map((r) => {
            const isSelected = selectedReciter.id === r.id;
            return (
              <button
                key={r.id}
                onClick={() => handleSelect(r)}
                className={`w-full p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer group text-right ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-500/50 shadow-md shadow-emerald-950/40 text-emerald-300'
                    : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80 hover:border-emerald-500/30 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 border border-slate-700 text-slate-400 group-hover:text-emerald-400 group-hover:border-emerald-500/40'
                    }`}
                  >
                    <User className="w-4.5 h-4.5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm font-cairo group-hover:text-emerald-300 transition-colors">
                        {language === 'ar' ? r.nameAr : r.nameEn}
                      </span>
                      {r.nameAr.includes('مجود') && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {language === 'ar' ? 'مجود' : 'Mujawwad'}
                        </span>
                      )}
                      {r.nameAr.includes('المعلم') && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                          {language === 'ar' ? 'معلم' : 'Teacher'}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-sans block mt-0.5">
                      {r.nameEn}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isSelected ? (
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full border border-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">
                      <Volume2 className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}

          {filteredReciters.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <User className="w-8 h-8 mx-auto mb-2 opacity-40 text-emerald-400" />
              <p className="text-xs">{language === 'ar' ? 'لم يتم العثور على قارئ بهذا الاسم.' : 'No reciter found.'}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
          <span>{language === 'ar' ? 'التلاوة متوفرة بجودة عالية MP3' : 'High quality MP3 audio'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer"
          >
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </motion.div>
    </div>
    )}
  </AnimatePresence>
  );
};
