import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  User,
  ChevronDown,
  Subtitles,
  Type,
  Mic,
  Gauge,
  Video,
  Image as ImageIcon,
  Search,
  ArrowRight,
  ArrowLeft,
  Palette,
  Upload,
  Trash2
} from 'lucide-react';
import { Language, VideoConfig, FontSizeOption } from '../types';
import { SURAHS_LIST } from '../data/surahs';
import { RECITERS_LIST } from '../data/reciters';
import { TRANSLATIONS } from '../data/translations';
import { SurahModal } from './SurahModal';
import { ReciterModal } from './ReciterModal';

interface VideoSettingsFormProps {
  config: VideoConfig;
  lang: Language;
  isGenerating: boolean;
  onChange: (newConfig: VideoConfig) => void;
  onGenerate: () => void;
  onOpenPexelsModal?: () => void;
}

export const VideoSettingsForm: React.FC<VideoSettingsFormProps> = ({
  config,
  lang,
  isGenerating,
  onChange,
  onGenerate,
  onOpenPexelsModal
}) => {
  const [isSurahModalOpen, setIsSurahModalOpen] = useState(false);
  const [isReciterModalOpen, setIsReciterModalOpen] = useState(false);

  const t = TRANSLATIONS[lang];
  const isAr = lang === 'ar';

  const currentSurah = SURAHS_LIST.find((s) => s.number === config.surahNumber) || SURAHS_LIST[0];
  const currentReciter = RECITERS_LIST.find((r) => r.id === config.reciterId) || RECITERS_LIST[0];

  const maxAyahsInSurah = currentSurah.numberOfAyahs;
  const maxAllowedVerses = Math.min(12, maxAyahsInSurah - config.startingAyah + 1);
  const endAyah = Math.min(config.startingAyah + config.ayahCount - 1, maxAyahsInSurah);

  const handleQuickPick = (surahNum: number, start: number, count: number) => {
    onChange({
      ...config,
      surahNumber: surahNum,
      startingAyah: start,
      ayahCount: count
    });
  };

  const fontSizeOptions: { id: FontSizeOption; labelAr: string; labelEn: string; sizePx: string }[] = [
    { id: 'small', labelAr: 'صغير', labelEn: 'Compact', sizePx: '22px' },
    { id: 'medium', labelAr: 'متوسط', labelEn: 'Balanced', sizePx: '28px' },
    { id: 'large', labelAr: 'كبير', labelEn: 'Large', sizePx: '34px' },
    { id: 'extra-large', labelAr: 'كبير جداً', labelEn: 'Grand', sizePx: '42px' },
    { id: 'huge', labelAr: 'ضخم', labelEn: 'Max', sizePx: '52px' }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {/* Quick Picks Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-slate-900/40 to-emerald-950/20 backdrop-blur-xl border border-emerald-500/20">
        <div className="flex items-center gap-2 mb-2 text-xs text-amber-300 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.quickPicks}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => handleQuickPick(1, 1, 7)}
            className="px-2.5 py-1 rounded-lg bg-neutral-950/80 hover:bg-emerald-950/60 text-neutral-300 hover:text-white border border-neutral-800 hover:border-emerald-700/60 text-xs transition-all active:scale-95"
          >
            {t.quickPickFatihah}
          </button>
          <button
            type="button"
            onClick={() => handleQuickPick(2, 255, 1)}
            className="px-2.5 py-1 rounded-lg bg-neutral-950/80 hover:bg-emerald-950/60 text-neutral-300 hover:text-white border border-neutral-800 hover:border-emerald-700/60 text-xs transition-all active:scale-95"
          >
            {t.quickPickKursi}
          </button>
          <button
            type="button"
            onClick={() => handleQuickPick(67, 1, 5)}
            className="px-2.5 py-1 rounded-lg bg-neutral-950/80 hover:bg-emerald-950/60 text-neutral-300 hover:text-white border border-neutral-800 hover:border-emerald-700/60 text-xs transition-all active:scale-95"
          >
            {t.quickPickMulk}
          </button>
          <button
            type="button"
            onClick={() => handleQuickPick(55, 1, 13)}
            className="px-2.5 py-1 rounded-lg bg-neutral-950/80 hover:bg-emerald-950/60 text-neutral-300 hover:text-white border border-neutral-800 hover:border-emerald-700/60 text-xs transition-all active:scale-95"
          >
            {t.quickPickRahman}
          </button>
          <button
            type="button"
            onClick={() => handleQuickPick(112, 1, 4)}
            className="px-2.5 py-1 rounded-lg bg-neutral-950/80 hover:bg-emerald-950/60 text-neutral-300 hover:text-white border border-neutral-800 hover:border-emerald-700/60 text-xs transition-all active:scale-95"
          >
            {t.quickPickIkhlas}
          </button>
        </div>
      </div>

      {/* Main Compact Settings Container */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 backdrop-blur-xl border border-emerald-500/20 shadow-2xl space-y-5">
        
        {/* ROW 1 (SIDE BY SIDE): Surah & Verses Range (COL 1)  +  Reciter / Audio (COL 2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Column 1: Surah & Verses Selection */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 backdrop-blur-xl border border-emerald-500/20 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.surahLabel} & {t.versesRange}</span>
                </label>
                <span className="text-[10px] text-neutral-400 dir-rtl">
                  {t.versesRangeText(config.startingAyah, endAyah, maxAyahsInSurah)}
                </span>
              </div>

              {/* Surah Picker Card */}
              <button
                id="surah-picker-btn"
                type="button"
                onClick={() => setIsSurahModalOpen(true)}
                className="w-full p-3 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-950 border border-amber-400/30 flex items-center justify-center text-amber-400 font-mono font-bold text-xs shrink-0">
                    {currentSurah.number}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-arabic text-amber-300 group-hover:text-amber-200" dir="rtl">
                      {currentSurah.name}
                    </h3>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      {currentSurah.numberOfAyahs} {t.ayahsWord} • {currentSurah.revelationType === 'Meccan' ? t.meccan : t.medinan}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-amber-300 transition-colors" />
                </div>
              </button>
            </div>

            {/* Compact Sliders for Ayah Start & Count */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-sm border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400">{t.startAyahLabel}</span>
                  <span className="text-amber-300 font-bold font-mono">
                    {config.startingAyah}
                  </span>
                </div>
                <input
                  id="starting-ayah-input"
                  type="range"
                  min={1}
                  max={maxAyahsInSurah}
                  value={config.startingAyah}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    const newMaxCount = Math.min(config.ayahCount, maxAyahsInSurah - val + 1);
                    onChange({
                      ...config,
                      startingAyah: val,
                      ayahCount: Math.max(1, newMaxCount)
                    });
                  }}
                  className="w-full h-1.5 rounded bg-neutral-800 accent-amber-400 cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-sm border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400">{t.ayahCountLabel}</span>
                  <span className="text-amber-300 font-bold font-mono">
                    {config.ayahCount} {t.ayahsWord}
                  </span>
                </div>
                <input
                  id="ayah-count-input"
                  type="range"
                  min={1}
                  max={Math.max(1, maxAllowedVerses)}
                  value={config.ayahCount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    onChange({ ...config, ayahCount: val });
                  }}
                  className="w-full h-1.5 rounded bg-neutral-800 accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Column 2: Reciter Selection */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 backdrop-blur-xl border border-emerald-500/20 space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.reciterLabel}</span>
              </label>
              <button
                type="button"
                onClick={() => setIsReciterModalOpen(true)}
                className="text-[11px] text-amber-300 hover:text-amber-200 font-bold underline"
              >
                {isAr ? 'تصفح (36 قارئ) ↗' : 'Browse All ↗'}
              </button>
            </div>

            {/* Current Selected Reciter Card */}
            <div
              onClick={() => setIsReciterModalOpen(true)}
              className="p-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-950 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold text-xs shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-amber-200">
                    {isAr ? currentReciter.nameAr : currentReciter.nameEn}
                  </h3>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    {isAr ? currentReciter.subtextAr : currentReciter.subtextEn}
                  </p>
                </div>
              </div>

              <div className="px-3 py-2 rounded-2xl bg-gradient-to-br from-emerald-800/50 to-emerald-900/50 backdrop-blur-sm group-hover:from-emerald-700/50 group-hover:to-emerald-800/50 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition-all shrink-0">
                {isAr ? 'تغيير' : 'Change'}
              </div>
            </div>

            <div className="text-[11px] text-emerald-400 font-medium text-center">
              {isAr ? '✨ الصوت الشريف برواية حفص عن عاصم مدمج عالي الدقة' : '✨ HD Audio Quality Recitation'}
            </div>
          </div>

        </div>

        {/* ROW 2 (SIDE BY SIDE): Motion & Media Speed (COL 1)  +  Font Size & Verse Scaling (COL 2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Column 1: Background Media Mode, Slow-Mo Speed, & Pexels Button */}
          <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'خلفية الفيديو وسرعة الحركة' : 'Media & Motion Speed'}</span>
              </label>

              {/* Pexels Media Search & Select Trigger */}
              {onOpenPexelsModal && (
                <button
                  type="button"
                  onClick={onOpenPexelsModal}
                  className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-400/40 text-amber-300 hover:text-white text-[11px] font-bold transition-all flex items-center gap-1 active:scale-95"
                >
                  <Search className="w-3 h-3 text-amber-400" />
                  <span>{isAr ? 'مكتبة الصور والفيديو' : 'Media Library'}</span>
                </button>
              )}
            </div>

            {/* Media Type Buttons: Video vs Photo Slideshow */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  onChange({ ...config, bgMediaType: 'video' });
                  if (onOpenPexelsModal) onOpenPexelsModal();
                }}
                className={`p-2 rounded-xl border text-right transition-all flex items-center gap-2 ${
                  (config.bgMediaType || 'video') === 'video'
                    ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-500/40 text-emerald-300 shadow-lg shadow-emerald-500/10'
                    : 'bg-gradient-to-br from-slate-800 to-slate-900 border-emerald-500/20 hover:border-emerald-500/30 text-slate-400'
                }`}
              >
                <Video className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="truncate">
                  <span className="text-xs font-bold block leading-tight">{isAr ? 'خلفية فيديو' : 'Video'}</span>
                  <span className="text-[9px] text-neutral-400 block">{isAr ? 'مكتبة الفيديوهات' : 'Video Library'}</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onChange({ ...config, bgMediaType: 'image' });
                  if (onOpenPexelsModal) onOpenPexelsModal();
                }}
                className={`p-2 rounded-xl border text-right transition-all flex items-center gap-2 ${
                  config.bgMediaType === 'image'
                    ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-500/40 text-emerald-300 shadow-lg shadow-emerald-500/10'
                    : 'bg-gradient-to-br from-slate-800 to-slate-900 border-emerald-500/20 hover:border-emerald-500/30 text-slate-400'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="truncate">
                  <span className="text-xs font-bold block leading-tight">{isAr ? 'ألبوم صور' : 'Photos'}</span>
                  <span className="text-[9px] text-neutral-400 block">{isAr ? 'زوم In/Out وانتقالات' : 'Zoom In/Out'}</span>
                </div>
              </button>
            </div>

            {/* Local Upload Section (User explicitly wants local files from device) */}
            <div className="pt-2 border-t border-neutral-900/60 flex flex-col gap-2">
              <span className="text-[10px] text-neutral-400 block font-bold uppercase tracking-wide">
                {isAr ? '📂 استخدام ملف مخصص من جهازك (لوكل):' : '📂 Use local files from your device:'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center justify-center gap-1.5 p-2 bg-neutral-900 hover:bg-neutral-850 border border-dashed border-neutral-800 hover:border-amber-400/50 rounded-xl cursor-pointer text-center transition-all active:scale-95">
                  <Upload className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-xs font-extrabold text-neutral-200">
                    {isAr ? 'رفع فيديو من جهازك' : 'Upload Video'}
                  </span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const blobUrl = URL.createObjectURL(file);
                        onChange({
                          ...config,
                          bgMediaType: 'video',
                          customVideoUrl: blobUrl,
                          customMediaUrl: blobUrl,
                          selectedMediaId: 'local-video'
                        });
                      }
                    }}
                  />
                </label>

                <label className="flex items-center justify-center gap-1.5 p-2 bg-neutral-900 hover:bg-neutral-850 border border-dashed border-neutral-800 hover:border-amber-400/50 rounded-xl cursor-pointer text-center transition-all active:scale-95">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-xs font-extrabold text-neutral-200">
                    {isAr ? 'رفع صور من جهازك' : 'Upload Photos'}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []) as File[];
                      if (files.length > 0) {
                        const blobUrls = files.map((file: File) => URL.createObjectURL(file));
                        onChange({
                          ...config,
                          bgMediaType: 'image',
                          customImages: blobUrls,
                          customMediaUrl: blobUrls[0],
                          selectedMediaId: 'local-images'
                        });
                      }
                    }}
                  />
                </label>
              </div>

              {/* Status Indicator */}
              {config.customMediaUrl && config.customMediaUrl.startsWith('blob:') && (
                <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-900/40 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {isAr ? 'تم تفعيل الملف المحلي بنجاح' : 'Local file loaded successfully'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onChange({
                        ...config,
                        customMediaUrl: undefined,
                        customVideoUrl: undefined,
                        customImages: undefined,
                        selectedMediaId: ''
                      });
                    }}
                    className="text-rose-400 hover:text-rose-300 font-bold"
                  >
                    {isAr ? 'حذف' : 'Remove'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Quran Font Size & Verses Scaling */}
          <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'حجم الخط القرآني وتكبير/تصغير الآيات' : 'Quran Verses Font Size'}</span>
            </label>

            <div className="grid grid-cols-5 gap-1.5">
              {fontSizeOptions.map((opt) => {
                const isSelected = config.fontSize === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChange({ ...config, fontSize: opt.id })}
                    className={`py-2 px-1 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-emerald-950/90 border-amber-400 text-amber-300 ring-1 ring-amber-400/40'
                        : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
                    }`}
                  >
                    <span className="text-[11px] font-bold block">{isAr ? opt.labelAr : opt.labelEn}</span>
                    <span className="text-[9px] text-amber-400/80 font-mono">{opt.sizePx}</span>
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-neutral-400 leading-normal">
              {isAr
                ? 'يتم ضبط حجم خط المصاحف العثمانية وتوزيعه تلقائياً فوق خلفية الطبيعة حسب قياس الشاشة'
                : 'Auto-adjusts Uthmani Quranic font size according to format choice'}
            </p>
          </div>

        </div>

        {/* ROW 3: Video Format & Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Video Format (9:16, 16:9, 1:1) */}
          <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
              {t.formatLabel}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: '9:16', label: t.formatVertical, sub: 'Reels / TikTok' },
                { id: '16:9', label: t.formatLandscape, sub: 'YouTube / TV' },
                { id: '1:1', label: t.formatSquare, sub: 'Feed / Posts' }
              ].map((fmt) => {
                const isSelected = config.format === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => onChange({ ...config, format: fmt.id as any })}
                    className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-emerald-950 border-amber-400 text-amber-300 ring-1 ring-amber-400/40'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-bold">{fmt.label}</span>
                    <span className="text-[9px] text-neutral-400">{fmt.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Video Toggles */}
          <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
              {isAr ? 'عناصر الشاشة والتأثيرات' : 'Display Toggles'}
            </label>

            <div className="grid grid-cols-2 gap-2">
              <label className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between cursor-pointer text-xs">
                <span className="text-neutral-300 text-[11px]">{t.subtitlesLabel}</span>
                <input
                  type="checkbox"
                  checked={config.showTranslation}
                  onChange={(e) => onChange({ ...config, showTranslation: e.target.checked })}
                  className="w-3.5 h-3.5 rounded accent-amber-400 cursor-pointer"
                />
              </label>

              <label className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between cursor-pointer text-xs">
                <span className="text-neutral-300 text-[11px]">{isAr ? 'شريط السورة' : 'Header'}</span>
                <input
                  type="checkbox"
                  checked={config.showSurahHeader !== false}
                  onChange={(e) => onChange({ ...config, showSurahHeader: e.target.checked })}
                  className="w-3.5 h-3.5 rounded accent-amber-400 cursor-pointer"
                />
              </label>

              <label className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between cursor-pointer text-xs col-span-2">
                <span className="text-neutral-300 text-[11px]">{t.particlesLabel}</span>
                <input
                  type="checkbox"
                  checked={config.showParticles}
                  onChange={(e) => onChange({ ...config, showParticles: e.target.checked })}
                  className="w-3.5 h-3.5 rounded accent-amber-400 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Verse Display Style selection */}
          <div className="col-span-1 md:col-span-2 p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'تصميم وشكل عرض آيات القرآن الكريم في الفيديو' : 'Quran Verse Display Style'}</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'border', labelAr: 'بطاقة 1', labelEn: 'Card 1', descAr: 'إطار مذهب دافئ', descEn: 'Thin golden borders' },
                { id: 'card', labelAr: 'بطاقة 2', labelEn: 'Card 2', descAr: 'بطاقة سينمائية', descEn: 'Translucent dark card' },
                { id: 'minimal', labelAr: 'بطاقة 3', labelEn: 'Card 3', descAr: 'تصميم بسيط شفاف', descEn: 'Plain text overlay' },
                { id: 'badge', labelAr: 'بطاقة 4', labelEn: 'Card 4', descAr: 'كبسولة دائرية انسيابية', descEn: 'Pill-shaped background' },
                { id: 'glowing', labelAr: 'بطاقة 5', labelEn: 'Card 5', descAr: 'وهج مشع دافئ', descEn: 'Soft radiant warm glow' }
              ].map((styleOpt) => {
                const isSelected = (config.verseStyle || 'border') === styleOpt.id;
                return (
                  <button
                    key={styleOpt.id}
                    type="button"
                    onClick={() => onChange({ ...config, verseStyle: styleOpt.id as any })}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950 border-amber-400 text-amber-300 ring-1 ring-amber-400/40'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-850'
                    }`}
                  >
                    <span className="text-xs font-bold">{isAr ? styleOpt.labelAr : styleOpt.labelEn}</span>
                    <span className="text-[10px] text-neutral-400 font-semibold">{isAr ? styleOpt.descAr : styleOpt.descEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logo Overlay Customization */}
          <div className="col-span-1 md:col-span-2 p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'إضافة شعار (لوجو) مخصص أعلى الفيديو' : 'Add Custom Logo Overlay'}</span>
              </label>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!config.showLogo}
                  onChange={(e) => onChange({ ...config, showLogo: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-neutral-400 after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400 peer-checked:after:bg-neutral-950"></div>
              </label>
            </div>

            {config.showLogo && (
              <div className="space-y-3 pt-3 border-t border-neutral-900/80">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* File Upload Box */}
                  <div className="space-y-2">
                    <span className="text-[11px] text-neutral-400 block font-bold">
                      {isAr ? 'رفع ملف الشعار (PNG أو JPG مفضل)' : 'Upload Logo Image (PNG/JPG preferred)'}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <label className="flex-1 flex flex-col items-center justify-center h-20 px-3 py-1 bg-neutral-900 border border-dashed border-neutral-800 rounded-xl cursor-pointer hover:bg-neutral-850 hover:border-amber-400/40 transition-all text-center">
                        <Upload className="w-5 h-5 text-amber-400/80 mb-1" />
                        <span className="text-[10px] text-neutral-400 font-medium">
                          {isAr ? 'اضغط لرفع الشعار' : 'Click to Upload'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                onChange({
                                  ...config,
                                  logoUrl: reader.result as string
                                });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>

                      {config.logoUrl && (
                        <div className="w-20 h-20 bg-neutral-900 border border-neutral-850 rounded-xl p-1.5 flex flex-col items-center justify-between relative group shrink-0">
                          <img
                            src={config.logoUrl}
                            alt="Logo preview"
                            className="max-w-full max-h-[48px] object-contain rounded opacity-90"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            type="button"
                            onClick={() => onChange({ ...config, logoUrl: undefined })}
                            className="text-[9px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>{isAr ? 'حذف' : 'Remove'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Logo Opacity & Scale Specs */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] text-neutral-400 block font-bold">
                          {isAr ? 'درجة شفافية الشعار' : 'Logo Opacity'}
                        </span>
                        <span className="text-[10px] font-mono text-amber-400 font-semibold">
                          {Math.round((config.logoOpacity ?? 0.9) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.05"
                        value={config.logoOpacity ?? 0.9}
                        onChange={(e) => onChange({ ...config, logoOpacity: parseFloat(e.target.value) })}
                        className="w-full h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] text-neutral-400 block font-bold">
                          {isAr ? 'حجم الشعار المخصص' : 'Logo Size'}
                        </span>
                        <span className="text-[10px] font-mono text-amber-400 font-semibold">
                          {config.logoSize ?? 100}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="250"
                        step="5"
                        value={config.logoSize ?? 100}
                        onChange={(e) => onChange({ ...config, logoSize: parseInt(e.target.value) })}
                        className="w-full h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
                      />
                    </div>

                    <div className="p-2 rounded-xl bg-neutral-900/60 border border-neutral-900 text-[10px] text-neutral-400 leading-relaxed">
                      💡 {isAr 
                        ? 'سيتم ملاءمة حجم وموضع الشعار تلقائياً في أعلى اليمين ليناسب كل قياس فيديو (سواء كان رأسي ريلز، أفقي يوتيوب، أو مربع بوست).'
                        : 'Logo dimensions and positioning at the top-right auto-scale proportionally to match vertical, landscape, and square screen aspect ratios.'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Generate Button */}
        <div className="pt-1">
          <button
            id="generate-video-btn"
            type="button"
            disabled={isGenerating}
            onClick={onGenerate}
            className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-bold text-base shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 active:scale-[0.99]"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                <span>{t.generatingBtn}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t.generateBtn}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </>
            )}
          </button>
        </div>

      </div>

      {/* Surah Selection Modal */}
      <SurahModal
        isOpen={isSurahModalOpen}
        selectedSurahNumber={config.surahNumber}
        lang={lang}
        onSelect={(surah) => {
          onChange({
            ...config,
            surahNumber: surah.number,
            startingAyah: 1,
            ayahCount: Math.min(config.ayahCount, surah.numberOfAyahs)
          });
        }}
        onClose={() => setIsSurahModalOpen(false)}
      />

      {/* Reciter Modal Popup */}
      <ReciterModal
        isOpen={isReciterModalOpen}
        selectedReciterId={config.reciterId}
        lang={lang}
        onSelectReciter={(reciter) => {
          onChange({
            ...config,
            reciterId: reciter.id
          });
        }}
        onClose={() => setIsReciterModalOpen(false)}
      />
    </div>
  );
};
