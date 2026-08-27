import React, { useState, useEffect } from 'react';
import { TafsirData, QuranVerse } from '../types';
import { getAyahTafsir } from '../data/tafsirData';
import {
  X,
  BookOpen,
  Sparkles,
  Copy,
  Check,
  Share2,
  Bookmark,
  Languages,
  BookMarked,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine, triggerHaptic } from '../utils/audio';

interface TafsirModalProps {
  isOpen: boolean;
  onClose: () => void;
  verse: QuranVerse | null;
  surahNameAr: string;
  surahNumber: number;
  theme: string;
  language: 'ar' | 'en';
  onNavigatePrevAyah?: () => void;
  onNavigateNextAyah?: () => void;
  hasPrevAyah?: boolean;
  hasNextAyah?: boolean;
}

export const TafsirModal: React.FC<TafsirModalProps> = ({
  isOpen,
  onClose,
  verse,
  surahNameAr,
  surahNumber,
  theme,
  language,
  onNavigatePrevAyah,
  onNavigateNextAyah,
  hasPrevAyah = false,
  hasNextAyah = false
}) => {
  const [activeTab, setActiveTab] = useState<'muyassar' | 'saadi' | 'ibnkathir' | 'words'>('muyassar');
  const [tafsirData, setTafsirData] = useState<TafsirData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen || !verse) return;
    let isMounted = true;
    setLoading(true);

    getAyahTafsir(surahNumber, verse.verseNumber, verse.textAr).then((data) => {
      if (isMounted) {
        setTafsirData(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, verse, surahNumber]);

  if (!isOpen || !verse) return null;

  const handleCopyTafsir = () => {
    if (!tafsirData) return;
    soundEngine.playClick();
    triggerHaptic(15);
    const textToCopy = `﴿${verse.textAr}﴾ [سورة ${surahNameAr}: ${verse.verseNumber}]\n\nالتفسير:\n${
      activeTab === 'saadi' && tafsirData.tafsirSaadi
        ? tafsirData.tafsirSaadi
        : activeTab === 'ibnkathir' && tafsirData.tafsirIbnKathir
        ? tafsirData.tafsirIbnKathir
        : tafsirData.tafsirMuyassar
    }\n\n(عبر تطبيق يَقِين)`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className={`w-full max-w-2xl max-h-[88vh] sm:max-h-[82vh] rounded-t-3xl sm:rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${
            theme === 'light'
              ? 'bg-[#fcfaf5] border-amber-200/80 text-slate-800'
              : theme === 'sepia'
              ? 'bg-[#291b12] border-amber-800/60 text-amber-50'
              : 'bg-slate-900 border-slate-700/80 text-slate-100'
          }`}
        >
          {/* Top Header */}
          <div className="p-4 sm:p-5 border-b border-amber-500/20 flex items-center justify-between gap-3 bg-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold font-mono text-sm">
                {verse.verseNumber}
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg font-cairo text-slate-100 flex items-center gap-2">
                  <span>{language === 'ar' ? `تفسير سورة ${surahNameAr}` : `Tafsir: ${surahNameAr}`}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-normal">
                    {language === 'ar' ? `الآية ${verse.verseNumber}` : `Ayah ${verse.verseNumber}`}
                  </span>
                </h3>
                <span className="text-[11px] text-slate-400 font-cairo">
                  {language === 'ar' ? `الجزء ${verse.juz} • صفحة ${verse.page}` : `Juz ${verse.juz} • Page ${verse.page}`}
                </span>
              </div>
            </div>

            {/* Actions: Navigation & Close */}
            <div className="flex items-center gap-1.5">
              {hasPrevAyah && onNavigatePrevAyah && (
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onNavigatePrevAyah();
                  }}
                  title={language === 'ar' ? 'الآية السابقة' : 'Previous Ayah'}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {hasNextAyah && onNavigateNextAyah && (
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onNavigateNextAyah();
                  }}
                  title={language === 'ar' ? 'الآية التالية' : 'Next Ayah'}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={handleCopyTafsir}
                title={language === 'ar' ? 'نسخ التفسير' : 'Copy Tafsir'}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  onClose();
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Ayah Highlight Card */}
            <div
              dir="rtl"
              className={`p-4 sm:p-5 rounded-2xl border-2 text-center relative ${
                theme === 'light'
                  ? 'bg-amber-50/70 border-amber-300/80 text-amber-950'
                  : theme === 'sepia'
                  ? 'bg-[#1f140c] border-amber-700/50 text-amber-100'
                  : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-100'
              }`}
            >
              <span className="text-[9px] font-cairo text-amber-400 absolute top-2 right-3 uppercase tracking-widest font-bold">
                نص الآية الكريمة
              </span>
              <p className="font-quran font-bold text-lg sm:text-2xl leading-loose pt-3 text-slate-100">
                «{verse.textAr}»
              </p>
              {verse.textEn && (
                <p className="text-xs text-slate-400 font-sans mt-2 pt-2 border-t border-white/10 text-center">
                  "{verse.textEn}"
                </p>
              )}
            </div>

            {/* Tafsir Source Switcher Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 overflow-x-auto">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('muyassar');
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-cairo transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'muyassar'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                📖 التفسير الميسر (مجمع الملك فهد)
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('saadi');
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-cairo transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'saadi'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🌿 تفسير السعدي (تيسير الكريم الرحمن)
              </button>

              {tafsirData?.difficultWords && tafsirData.difficultWords.length > 0 && (
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveTab('words');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold font-cairo transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                    activeTab === 'words'
                      ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                      : 'text-amber-300/80 hover:text-amber-300'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>معاني الكلمات ({tafsirData.difficultWords.length})</span>
                </button>
              )}
            </div>

            {/* Tafsir Content Card */}
            {loading ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-10 h-10 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-400 font-cairo">جاري استحضار معاني وتفسير الآية الكريمة...</p>
              </div>
            ) : tafsirData ? (
              <div className="space-y-4">
                {activeTab === 'muyassar' && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3"
                  >
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-cairo">
                      <BookOpen className="w-4 h-4" />
                      <span>التفسير الميسر المعتمد</span>
                    </div>
                    <p
                      dir="rtl"
                      className="text-right text-sm sm:text-base text-slate-200 font-cairo leading-relaxed font-normal select-text"
                    >
                      {tafsirData.tafsirMuyassar}
                    </p>
                  </motion.div>
                )}

                {activeTab === 'saadi' && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3"
                  >
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-cairo">
                      <Sparkles className="w-4 h-4" />
                      <span>فوائد وهدايات من تفسير العلامة السعدي رحمه الله</span>
                    </div>
                    <p
                      dir="rtl"
                      className="text-right text-sm sm:text-base text-slate-200 font-cairo leading-relaxed font-normal select-text"
                    >
                      {tafsirData.tafsirSaadi || tafsirData.tafsirMuyassar}
                    </p>
                  </motion.div>
                )}

                {activeTab === 'words' && tafsirData.difficultWords && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2.5"
                  >
                    <div className="text-xs font-bold font-cairo text-amber-400 mb-2 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" />
                      <span>بيان غريب كلمات الآية ومفرداتها اللغوية:</span>
                    </div>
                    {tafsirData.difficultWords.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <span className="font-quran font-bold text-amber-300 text-base">
                          {item.word}
                        </span>
                        <span className="text-xs sm:text-sm text-slate-200 font-cairo text-right">
                          {item.meaning}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            ) : null}
          </div>

          {/* Bottom Footer Note */}
          <div className="p-3.5 border-t border-white/10 bg-black/20 flex items-center justify-between text-[11px] text-slate-400 font-cairo">
            <span>✨ تفاسير موثقة تعينك على تدبر كتاب الله وفهم أحكامه</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
