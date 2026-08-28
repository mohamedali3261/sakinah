import React from 'react';
import { Download, CheckCircle2, X, Sparkles, Film, Clock, HardDrive, RefreshCw } from 'lucide-react';
import { Language, RenderedVideoOutput, VideoFormat } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface RenderProgressModalProps {
  isOpen: boolean;
  isRendering: boolean;
  progressPercent: number;
  output: RenderedVideoOutput | null;
  errorMessage?: string | null;
  format: VideoFormat;
  lang: Language;
  onClose: () => void;
  onDownload: () => void;
  onRetry?: () => void;
}

export const RenderProgressModal: React.FC<RenderProgressModalProps> = ({
  isOpen,
  isRendering,
  progressPercent,
  output,
  errorMessage,
  format,
  lang,
  onClose,
  onDownload,
  onRetry
}) => {
  const t = TRANSLATIONS[lang];
  const isAr = lang === 'ar';

  if (!isOpen) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-neutral-900 border border-emerald-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col items-center text-center space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button if completed */}
        {!isRendering && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {isRendering ? (
          /* Rendering State */
          <>
            {/* Animated Ring Indicator */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-neutral-800"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-amber-400 transition-all duration-300"
                  fill="transparent"
                  strokeDasharray={301.59}
                  strokeDashoffset={301.59 - (301.59 * progressPercent) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-2xl font-bold text-white">
                  {progressPercent}%
                </span>
                <span className="text-[10px] text-amber-400/90 font-medium uppercase tracking-wider">
                  {isAr ? 'جاري الرندرة' : 'Rendering'}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">
                {t.statusRendering}
              </h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                {isAr
                  ? 'يتم دمج الآيات العثمانية والصوت والخلفية تلقائياً بدقة وجودة عالية...'
                  : 'Synthesizing Uthmani calligraphy, recitation audio, and nature background...'}
              </p>
            </div>

            {/* Subtle indeterminate pulse bar */}
            <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </>
        ) : output ? (
          /* Completed Ready to Download State */
          <>
            <div className="w-16 h-16 rounded-2xl bg-emerald-950/90 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-xl shadow-emerald-950/60">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">
                {t.statusCompleted}
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                {isAr ? 'تم إنشاء ملف الفيديو بجودة عالية وجاهز للحفظ على جهازك' : 'Your video has been rendered in full resolution and is ready to save.'}
              </p>
            </div>

            {/* Video File Specs */}
            <div className="w-full grid grid-cols-3 gap-2 py-3 px-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-xs">
              <div className="flex flex-col items-center">
                <span className="text-neutral-500 text-[10px] flex items-center gap-1">
                  <Film className="w-3 h-3" />
                  {t.formatBadge}
                </span>
                <span className="font-semibold text-neutral-200 mt-0.5">
                  {format}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-neutral-500 text-[10px] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {t.totalDuration}
                </span>
                <span className="font-semibold text-neutral-200 mt-0.5">
                  {formatDuration(output.duration)}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-neutral-500 text-[10px] flex items-center gap-1">
                  <HardDrive className="w-3 h-3" />
                  {isAr ? 'الحجم' : 'Size'}
                </span>
                <span className="font-semibold text-neutral-200 mt-0.5">
                  {formatFileSize(output.fileSizeBytes)}
                </span>
              </div>
            </div>

            {/* Download Button */}
            <div className="w-full space-y-2 pt-2">
              <a
                id="download-video-btn"
                href={output.blobUrl}
                download={output.fileName}
                onClick={onDownload}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-base shadow-xl shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <Download className="w-5 h-5 text-amber-300" />
                <span>{t.downloadBtn}</span>
              </a>

              <button
                id="close-render-modal-btn"
                type="button"
                onClick={onClose}
                className="w-full py-2.5 text-xs text-neutral-400 hover:text-white transition-colors"
              >
                {isAr ? 'متابعة المعاينة أو تعديل السورة' : 'Continue preview or choose another Surah'}
              </button>
            </div>
          </>
        ) : errorMessage ? (
          /* Error State */
          <>
            <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400">
              <X className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {isAr ? 'تعذر إتمام الرندرة' : 'Render Failed'}
              </h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                {errorMessage}
              </p>
            </div>
            <div className="w-full space-y-2 pt-2">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="w-full py-3 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{isAr ? 'إعادة المحاولة' : 'Try Again'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 text-xs text-neutral-400 hover:text-white transition-colors"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
