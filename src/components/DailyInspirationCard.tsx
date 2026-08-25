import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DAILY_INSPIRATIONS } from '../data/prayerData';
import { Sparkles, Copy, Check, Share2, Bookmark } from 'lucide-react';
import { GlassButton } from './GlassButton';

export const DailyInspirationCard: React.FC = () => {
  const { language, theme, fontFamily, fontSize, addBookmark, isBookmarked, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const inspiration = DAILY_INSPIRATIONS[0];

  const handleCopy = () => {
    const textToCopy = `${inspiration.ayahAr}\n${inspiration.surahAr}\n\n${inspiration.reflectionAr}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    showToast(
      language === 'ar' ? 'تم نسخ الآية والتدبر' : 'Copied to Clipboard',
      language === 'ar' ? 'يمكنك مشاركتها الآن لنيل الأجر.' : 'You can share it to spread the wisdom.'
    );
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmark = () => {
    addBookmark({
      type: 'ayah',
      titleAr: inspiration.surahAr,
      titleEn: inspiration.surahEn,
      snippetAr: inspiration.ayahAr,
      snippetEn: inspiration.ayahEn,
      targetId: inspiration.id
    });
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 border backdrop-blur-xl shadow-xl transition-all ${
        theme === 'light'
          ? 'bg-gradient-to-br from-emerald-50/90 via-white/80 to-teal-50/90 border-emerald-200/70 text-slate-800'
          : theme === 'sepia'
          ? 'bg-gradient-to-br from-[#3b2b20]/90 via-[#2e2017]/80 to-[#221610]/90 border-amber-800/40 text-amber-50'
          : 'bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-emerald-950/40 border-emerald-500/20 text-slate-100'
      }`}
    >
      {/* Decorative ambient corner glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Tag */}
      <div className="relative z-10 flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold font-cairo text-emerald-400 tracking-wide uppercase">
            {language === 'ar' ? 'آية اليوم وتدبر الهداية' : 'Verse of the Day & Reflection'}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleBookmark}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-colors"
            title={language === 'ar' ? 'حفظ في المفضلة' : 'Bookmark'}
          >
            <Bookmark
              className={`w-4 h-4 ${isBookmarked(inspiration.id) ? 'fill-amber-400 text-amber-400' : ''}`}
            />
          </button>
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-emerald-400 transition-colors"
            title={language === 'ar' ? 'نسخ' : 'Copy'}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Quran Ayah */}
      <div className="relative z-10 my-3 text-center">
        <p
          className={`font-bold leading-relaxed text-emerald-300 font-${fontFamily} ${
            fontSize === 'sm' ? 'text-lg' : fontSize === 'md' ? 'text-xl' : fontSize === 'lg' ? 'text-2xl' : 'text-3xl'
          }`}
        >
          {inspiration.ayahAr}
        </p>
        <span className="inline-block mt-2 text-xs opacity-70 font-cairo px-3 py-1 rounded-full bg-white/5 border border-white/10">
          {language === 'ar' ? inspiration.surahAr : inspiration.surahEn}
        </span>
      </div>

      {/* Reflection Insight */}
      <div className="relative z-10 mt-4 p-3.5 rounded-2xl bg-white/5 border border-white/10">
        <p className="text-xs leading-relaxed font-cairo opacity-90">
          <strong className="text-amber-300 font-bold block mb-0.5">
            {language === 'ar' ? 'إضاءة إيمانية:' : 'Spiritual Reflection:'}
          </strong>
          {language === 'ar' ? inspiration.reflectionAr : inspiration.reflectionEn}
        </p>
      </div>
    </div>
  );
};
