import React, { useState, useMemo, useRef, useEffect } from 'react';
import { User, Search, Check, X, Mic, Volume2, VolumeX, Square, Loader2 } from 'lucide-react';
import { Language, Reciter } from '../types';
import { RECITERS_LIST } from '../data/reciters';
import { TRANSLATIONS } from '../data/translations';
import { getEveryAyahAudioUrl, getAlQuranAudioUrl } from '../services/quranService';

interface ReciterModalProps {
  isOpen: boolean;
  selectedReciterId: string;
  lang: Language;
  onSelectReciter: (reciter: Reciter) => void;
  onClose: () => void;
}

export const ReciterModal: React.FC<ReciterModalProps> = ({
  isOpen,
  selectedReciterId,
  lang,
  onSelectReciter,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<'all' | 'haramain' | 'egypt' | 'mujawwad'>('all');

  // Audio testing state
  const [testingReciterId, setTestingReciterId] = useState<string | null>(null);
  const [audioLoadingId, setAudioLoadingId] = useState<string | null>(null);
  const [failedReciterIds, setFailedReciterIds] = useState<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const t = TRANSLATIONS[lang];
  const isAr = lang === 'ar';

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setTestingReciterId(null);
    setAudioLoadingId(null);
  };

  useEffect(() => {
    if (!isOpen) {
      stopAudio();
    }
  }, [isOpen]);

  const handleToggleTestAudio = (e: React.MouseEvent, reciter: Reciter) => {
    e.stopPropagation();

    if (testingReciterId === reciter.id || audioLoadingId === reciter.id) {
      stopAudio();
      return;
    }

    stopAudio();
    setAudioLoadingId(reciter.id);

    const audioSource = reciter.audioSourceType || (reciter.everyAyahSubfolder ? 'everyayah' : 'alquran');
    const audioUrl = audioSource === 'alquran'
      ? getAlQuranAudioUrl(1, 1, reciter.edition)
      : getEveryAyahAudioUrl(1, 1, reciter.everyAyahSubfolder || 'Alafasy_128kbps');

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onended = () => {
      stopAudio();
    };

    audio.onerror = () => {
      setFailedReciterIds((prev) => new Set(prev).add(reciter.id));
      stopAudio();
    };

    audio.play().then(() => {
      setAudioLoadingId(null);
      setTestingReciterId(reciter.id);
    }).catch((err) => {
      console.warn('Audio test play error:', err);
      setFailedReciterIds((prev) => new Set(prev).add(reciter.id));
      stopAudio();
    });
  };

  const filteredReciters = useMemo(() => {
    return RECITERS_LIST.filter((reciter) => {
      // Filter by tag
      if (filterTag === 'haramain') {
        const isHaram =
          reciter.subtextAr.includes('الحرم') ||
          reciter.subtextAr.includes('المسجد النبوي') ||
          reciter.subtextEn.includes('Haram') ||
          reciter.subtextEn.includes('Prophet');
        if (!isHaram) return false;
      } else if (filterTag === 'egypt') {
        const isEgypt =
          reciter.subtextAr.includes('مصر') ||
          reciter.subtextAr.includes('المصرية') ||
          reciter.subtextAr.includes('الذهبي') ||
          reciter.nameAr.includes('عبد الباسط') ||
          reciter.nameAr.includes('المنشاوي') ||
          reciter.nameAr.includes('الحصري') ||
          reciter.nameAr.includes('الطبلاوي') ||
          reciter.nameAr.includes('مصطفى إسماعيل') ||
          reciter.nameAr.includes('البنا');
        if (!isEgypt) return false;
      } else if (filterTag === 'mujawwad') {
        const isMujawwad =
          reciter.nameAr.includes('مجود') ||
          reciter.subtextAr.includes('مجود') ||
          reciter.subtextEn.includes('Mujawwad');
        if (!isMujawwad) return false;
      }

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        reciter.nameAr.toLowerCase().includes(q) ||
        reciter.nameEn.toLowerCase().includes(q) ||
        reciter.subtextAr.toLowerCase().includes(q) ||
        reciter.subtextEn.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, filterTag]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 backdrop-blur-xl border border-emerald-500/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-emerald-500/20 flex items-center justify-between bg-gradient-to-br from-emerald-950/30 via-slate-900/40 to-emerald-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/90 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-lg shadow-emerald-500/10">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{isAr ? 'اختيار القارئ الشريف' : 'Select Quran Reciter'}</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-extrabold border border-amber-400/30">
                  {RECITERS_LIST.length} {isAr ? 'شيخ وقارئ' : 'Reciters'}
                </span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                {isAr
                  ? 'اختر الصوت القرآني المفضل لديك لتوليد الفيديو بتلاوته الموثقة'
                  : 'Choose your preferred reciter for authentic audio synchronization'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-slate-300 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Category Tags */}
        <div className="p-4 border-b border-emerald-500/20 bg-gradient-to-br from-slate-900/30 via-slate-800/20 to-slate-900/30 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute top-1/2 -translate-y-1/2 left-3.5 rtl:left-auto rtl:right-3.5 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث باسم الشيخ أو القارئ (مثل: العفاسي، المنشاوي، المعيقلي...)' : 'Search reciter by name...'}
              className="w-full py-2.5 px-10 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/20 focus:border-emerald-500/40 text-white text-xs sm:text-sm placeholder:text-slate-500 outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute top-1/2 -translate-y-1/2 right-3 rtl:right-auto rtl:left-3 text-neutral-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterTag('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterTag === 'all'
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                  : 'bg-gradient-to-br from-slate-900 to-slate-950 text-slate-300 hover:from-slate-800 hover:to-slate-900 border border-emerald-500/20'
              }`}
            >
              {isAr ? 'جميع القراء (36)' : 'All Reciters (36)'}
            </button>

            <button
              type="button"
              onClick={() => setFilterTag('haramain')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterTag === 'haramain'
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                  : 'bg-gradient-to-br from-slate-900 to-slate-950 text-slate-300 hover:from-slate-800 hover:to-slate-900 border border-emerald-500/20'
              }`}
            >
              🕌 {isAr ? 'أئمة الحرمين الشريفين' : 'Imams of Haramain'}
            </button>

            <button
              type="button"
              onClick={() => setFilterTag('egypt')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterTag === 'egypt'
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                  : 'bg-gradient-to-br from-slate-900 to-slate-950 text-slate-300 hover:from-slate-800 hover:to-slate-900 border border-emerald-500/20'
              }`}
            >
              ⭐ {isAr ? 'عمالقة القراءات المصرية' : 'Egyptian Masters'}
            </button>

            <button
              type="button"
              onClick={() => setFilterTag('mujawwad')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterTag === 'mujawwad'
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                  : 'bg-gradient-to-br from-slate-900 to-slate-950 text-slate-300 hover:from-slate-800 hover:to-slate-900 border border-emerald-500/20'
              }`}
            >
              🎶 {isAr ? 'المصحف المجود' : 'Mujawwad Recitations'}
            </button>
          </div>
        </div>

        {/* Reciters Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 space-y-3">
          {/* Audio Testing Tip */}
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {isAr
                ? 'اضغط على أيقونة الصوت 🔊 بجانب اسم أي شيخ للاستماع المباشر لاختبار جودة وصحة الصوت.'
                : 'Click the speaker icon 🔊 next to any Sheikh to listen to a test sample.'}
            </span>
          </div>
          {filteredReciters.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 space-y-2">
              <Mic className="w-8 h-8 mx-auto text-neutral-600 mb-2" />
              <p className="text-sm font-semibold">{isAr ? 'لم يتم العثور على قارئ بهذا الاسم' : 'No reciter found matching search'}</p>
              <p className="text-xs text-neutral-500">{isAr ? 'جرب البحث بكلمة مختلفة مثل "عبد الباسط" أو "ماهر"' : 'Try searching for another name like "Alafasy" or "Minshawi"'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredReciters.map((reciter) => {
                const isSelected = selectedReciterId === reciter.id;

                return (
                  <div
                    key={reciter.id}
                    onClick={() => {
                      onSelectReciter(reciter);
                      onClose();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onSelectReciter(reciter);
                        onClose();
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className={`p-3 sm:p-3.5 rounded-2xl border text-right ltr:text-left transition-all flex items-center justify-between gap-2.5 cursor-pointer select-none group outline-none ${
                      isSelected
                        ? 'bg-emerald-950/80 border-amber-400 ring-2 ring-amber-400/40 shadow-xl shadow-emerald-950/60'
                        : 'bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 hover:from-slate-800/40 hover:via-slate-700/30 hover:to-slate-800/40 border-emerald-500/20 hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-colors shrink-0 ${
                          isSelected
                            ? 'bg-amber-400 text-neutral-950 font-extrabold shadow-md'
                            : 'bg-gradient-to-br from-slate-900 to-slate-950 text-slate-400 group-hover:text-amber-300 group-hover:from-slate-800 group-hover:to-slate-900 border border-emerald-500/20'
                        }`}
                      >
                        <User className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-200 transition-colors truncate">
                          {isAr ? reciter.nameAr : reciter.nameEn}
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-0.5 truncate">
                          {isAr ? reciter.subtextAr : reciter.subtextEn}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {/* Test Audio Button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleTestAudio(e, reciter)}
                        title={
                          failedReciterIds.has(reciter.id)
                            ? (isAr ? 'عذراً، هذا القارئ غير متاح حالياً' : 'Audio unavailable')
                            : testingReciterId === reciter.id
                            ? (isAr ? 'إيقاف الاختبار' : 'Stop Test')
                            : (isAr ? 'اختبار صوت القارئ' : 'Test Audio')
                        }
                        className={`p-1.5 sm:p-2 rounded-xl transition-all flex items-center justify-center ${
                          audioLoadingId === reciter.id
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse'
                            : testingReciterId === reciter.id
                            ? 'bg-emerald-500 text-neutral-950 font-bold shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400'
                            : failedReciterIds.has(reciter.id)
                            ? 'bg-rose-950/80 text-rose-400 border border-rose-800/80 hover:bg-rose-900/80'
                            : 'bg-gradient-to-br from-slate-900 to-slate-950 text-slate-300 hover:text-amber-300 hover:from-slate-800 hover:to-slate-900 border border-emerald-500/20'
                        }`}
                      >
                        {audioLoadingId === reciter.id ? (
                          <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-amber-400" />
                        ) : testingReciterId === reciter.id ? (
                          <Square className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                        ) : failedReciterIds.has(reciter.id) ? (
                          <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        )}
                      </button>

                      {isSelected ? (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center font-bold shadow-md shrink-0">
                          <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                      ) : failedReciterIds.has(reciter.id) ? (
                        <span className="text-[9px] sm:text-[10px] text-rose-400 font-bold bg-rose-950/60 px-1 py-0.5 rounded border border-rose-800/50">
                          {isAr ? 'مش شغال' : 'Failed'}
                        </span>
                      ) : (
                        <span className="text-[10px] text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity font-semibold hidden sm:inline">
                          {t.select}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
