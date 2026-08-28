import React, { useRef, useState } from 'react';
import { Video, Image, Upload, Link2, Check, X, Film, ExternalLink, Sparkles } from 'lucide-react';
import { Language, BackgroundMediaType, NatureVideo, NatureMediaItem } from '../types';
import { NATURE_VIDEOS, NATURE_IMAGES } from '../data/natureVideos';
import { TRANSLATIONS } from '../data/translations';

interface VideoPickerModalProps {
  isOpen: boolean;
  selectedMediaId?: string;
  selectedMediaType: BackgroundMediaType;
  customMediaUrl?: string;
  lang: Language;
  onSelectMedia: (item: {
    type: BackgroundMediaType;
    id: string;
    url: string;
    isCustom?: boolean;
    titleAr?: string;
    titleEn?: string;
  }) => void;
  onClose: () => void;
}

export const VideoPickerModal: React.FC<VideoPickerModalProps> = ({
  isOpen,
  selectedMediaId,
  selectedMediaType,
  customMediaUrl,
  lang,
  onSelectMedia,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'videos' | 'images' | 'url' | 'upload'>(
    selectedMediaType === 'image' ? 'images' : 'videos'
  );
  const [urlInput, setUrlInput] = useState(customMediaUrl || '');
  const [urlMediaType, setUrlMediaType] = useState<BackgroundMediaType>(selectedMediaType);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = TRANSLATIONS[lang];
  const isAr = lang === 'ar';

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      alert(
        isAr
          ? 'يرجى رفع ملف فيديو صالح (MP4, WebM) أو صورة صالحة (JPG, PNG)'
          : 'Please upload a valid video (MP4, WebM) or photo (JPG, PNG)'
      );
      return;
    }

    const type: BackgroundMediaType = isVideo ? 'video' : 'image';
    const blobUrl = URL.createObjectURL(file);
    onSelectMedia({
      type,
      id: `custom-file-${Date.now()}`,
      url: blobUrl,
      isCustom: true,
      titleAr: isVideo ? 'فيديو مخصص من جهازك' : 'صورة مخصصة من جهازك',
      titleEn: isVideo ? 'Custom Video from Device' : 'Custom Photo from Device'
    });
    onClose();
  };

  const handleApplyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    // Detect if url is likely an image or video if user didn't specify
    let detectedType = urlMediaType;
    if (/\.(jpeg|jpg|png|webp|avif)(\?.*)?$/i.test(trimmed)) {
      detectedType = 'image';
    } else if (/\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(trimmed)) {
      detectedType = 'video';
    }

    onSelectMedia({
      type: detectedType,
      id: `custom-url-${Date.now()}`,
      url: trimmed,
      isCustom: true,
      titleAr: detectedType === 'video' ? 'فيديو من Pexels / رابط مباشر' : 'صورة من Pexels / رابط مباشر',
      titleEn: detectedType === 'video' ? 'Pexels / Direct Video URL' : 'Pexels / Direct Image URL'
    });
    onClose();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 backdrop-blur-xl border border-emerald-500/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-emerald-500/20 flex items-center justify-between bg-gradient-to-br from-emerald-950/30 via-slate-900/40 to-emerald-950/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{t.backgroundLabel}</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-900/60 text-emerald-300 text-[10px] font-semibold tracking-wide border border-emerald-700/50">
                  Nature HD
                </span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                {isAr
                  ? 'اختر بين فيديوهات طبيعية حية أو صور عالية الدقة، أو ارفع من جهازك'
                  : 'Choose calm living nature videos, scenic HD photos, or upload your own'}
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

        {/* Tab Navigation Switcher */}
        <div className="px-5 pt-4 pb-3 border-b border-emerald-500/20 flex flex-wrap gap-2 bg-gradient-to-br from-slate-900/30 via-slate-800/20 to-slate-900/30">
          <button
            type="button"
            onClick={() => setActiveTab('videos')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'videos'
                ? 'bg-emerald-900/70 text-emerald-100 border border-emerald-600/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-gradient-to-br from-slate-800/40 to-slate-900/40'
            }`}
          >
            <Video className="w-4 h-4 text-amber-400" />
            <span>{t.tabVideos}</span>
            <span className="px-1.5 py-0.2 rounded bg-gradient-to-br from-slate-900 to-slate-950 text-[10px] text-amber-300 border border-emerald-500/20">
              {NATURE_VIDEOS.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('images')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'images'
                ? 'bg-emerald-900/70 text-emerald-100 border border-emerald-600/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-gradient-to-br from-slate-800/40 to-slate-900/40'
            }`}
          >
            <Image className="w-4 h-4 text-emerald-400" />
            <span>{t.tabImages}</span>
            <span className="px-1.5 py-0.2 rounded bg-gradient-to-br from-slate-900 to-slate-950 text-[10px] text-emerald-300 border border-emerald-500/20">
              {NATURE_IMAGES.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'url'
                ? 'bg-emerald-900/70 text-emerald-100 border border-emerald-600/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-gradient-to-br from-slate-800/40 to-slate-900/40'
            }`}
          >
            <Link2 className="w-4 h-4 text-amber-400" />
            <span>{t.tabUrl}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'upload'
                ? 'bg-emerald-900/70 text-emerald-100 border border-emerald-600/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-gradient-to-br from-slate-800/40 to-slate-900/40'
            }`}
          >
            <Upload className="w-4 h-4 text-amber-400" />
            <span>{t.tabUpload}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50">
          {/* TAB 1: PEXELS NATURE VIDEOS */}
          {activeTab === 'videos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-neutral-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAr ? 'مقاطع فيديو طبيعية حية هادئة بدقة فائقة' : 'Living nature clips with peaceful motion'}</span>
                </div>
                <a
                  href="https://www.pexels.com/search/videos/nature/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 font-medium transition-colors"
                >
                  <span>{t.openPexelsVideos}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {NATURE_VIDEOS.map((video) => {
                  const isSelected =
                    selectedMediaType === 'video' &&
                    selectedMediaId === video.id &&
                    !customMediaUrl;

                  return (
                    <button
                      key={video.id}
                      type="button"
                      onClick={() => {
                        onSelectMedia({
                          type: 'video',
                          id: video.id,
                          url: video.videoUrl,
                          titleAr: video.titleAr,
                          titleEn: video.titleEn
                        });
                        onClose();
                      }}
                      className={`relative rounded-xl overflow-hidden border text-left group transition-all flex flex-col ${
                        isSelected
                          ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-xl shadow-emerald-950/60 bg-emerald-950/40'
                          : 'bg-gradient-to-br from-slate-900 to-slate-950 border-emerald-500/20 hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950">
                        <img
                          src={video.thumbnailUrl}
                          alt={isAr ? video.titleAr : video.titleEn}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Badge for Video */}
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] text-amber-300 font-semibold flex items-center gap-1 border border-amber-400/30">
                          <Video className="w-2.5 h-2.5" />
                          <span>Pexels Video</span>
                        </div>

                        {isSelected && (
                          <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center font-bold shadow-md">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <div className="p-3 bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-sm flex-1 flex flex-col justify-between">
                        <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-amber-200 transition-colors">
                          {isAr ? video.titleAr : video.titleEn}
                        </h3>
                        <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1">
                          {video.authorCredit}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PEXELS NATURE IMAGES */}
          {activeTab === 'images' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-neutral-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isAr ? 'صور طبيعية ساحرة مع زووم سينمائي بطيء' : 'High resolution photos with subtle cinematic zoom'}</span>
                </div>
                <a
                  href="https://www.pexels.com/search/nature/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 font-medium transition-colors"
                >
                  <span>{t.openPexelsPhotos}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {NATURE_IMAGES.map((img) => {
                  const isSelected =
                    selectedMediaType === 'image' &&
                    selectedMediaId === img.id &&
                    !customMediaUrl;

                  return (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => {
                        onSelectMedia({
                          type: 'image',
                          id: img.id,
                          url: img.url,
                          titleAr: img.titleAr,
                          titleEn: img.titleEn
                        });
                        onClose();
                      }}
                      className={`relative rounded-xl overflow-hidden border text-left group transition-all flex flex-col ${
                        isSelected
                          ? 'border-emerald-400 ring-2 ring-emerald-400/40 shadow-xl shadow-emerald-950/60 bg-emerald-950/40'
                          : 'bg-gradient-to-br from-slate-900 to-slate-950 border-emerald-500/20 hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950">
                        <img
                          src={img.thumbnailUrl}
                          alt={isAr ? img.titleAr : img.titleEn}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Badge for Image */}
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] text-emerald-300 font-semibold flex items-center gap-1 border border-emerald-400/30">
                          <Image className="w-2.5 h-2.5" />
                          <span>Pexels Photo</span>
                        </div>

                        {isSelected && (
                          <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-emerald-400 text-neutral-950 flex items-center justify-center font-bold shadow-md">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <div className="p-3 bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-sm flex-1 flex flex-col justify-between">
                        <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-emerald-200 transition-colors">
                          {isAr ? img.titleAr : img.titleEn}
                        </h3>
                        <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1">
                          {img.authorCredit}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: DIRECT URL / PEXELS LINK */}
          {activeTab === 'url' && (
            <div className="max-w-xl mx-auto py-6 space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'استخدام رابط مباشر من Pexels أو أي موقع' : 'Use Direct URL from Pexels or Web'}</span>
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {t.pexelsNotice}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <a
                    href="https://www.pexels.com/search/videos/nature/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-br from-slate-900 to-slate-950 hover:from-slate-800 hover:to-slate-900 text-amber-300 hover:text-white border border-emerald-500/20 text-xs font-semibold inline-flex items-center gap-1.5 transition-all"
                  >
                    <span>{t.openPexelsVideos}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://www.pexels.com/search/nature/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-br from-slate-900 to-slate-950 hover:from-slate-800 hover:to-slate-900 text-emerald-300 hover:text-white border border-emerald-500/20 text-xs font-semibold inline-flex items-center gap-1.5 transition-all"
                  >
                    <span>{t.openPexelsPhotos}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Media Type Switcher */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  {t.bgTypeLabel}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUrlMediaType('video')}
                    className={`p-3 rounded-xl border text-center font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                      urlMediaType === 'video'
                        ? 'bg-amber-400 text-neutral-950 border-amber-400 shadow-md'
                        : 'bg-gradient-to-br from-slate-900 to-slate-950 text-slate-300 border-emerald-500/20 hover:border-emerald-500/40'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>{t.bgTypeVideo}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUrlMediaType('image')}
                    className={`p-3 rounded-xl border text-center font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                      urlMediaType === 'image'
                        ? 'bg-emerald-400 text-neutral-950 border-emerald-400 shadow-md'
                        : 'bg-gradient-to-br from-slate-900 to-slate-950 text-slate-300 border-emerald-500/20 hover:border-emerald-500/40'
                    }`}
                  >
                    <Image className="w-4 h-4" />
                    <span>{t.bgTypeImage}</span>
                  </button>
                </div>
              </div>

              {/* URL Input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  {t.enterVideoUrl}
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder={t.videoUrlPlaceholder}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/20 focus:border-emerald-500/40 text-white text-xs sm:text-sm placeholder:text-neutral-500 outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    disabled={!urlInput.trim()}
                    className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {t.applyVideoUrl}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FILE UPLOAD */}
          {activeTab === 'upload' && (
            <div className="py-8 flex flex-col items-center justify-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime,image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full max-w-lg p-8 sm:p-12 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-amber-400 bg-amber-400/10'
                    : 'border-emerald-500/20 hover:border-emerald-500/60 bg-gradient-to-br from-slate-900/40 to-slate-950/40 hover:from-slate-900/60 hover:to-slate-950/60'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-4 shadow-inner">
                  <Upload className="w-7 h-7" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">
                  {t.uploadCustom}
                </h3>
                <p className="text-xs text-neutral-400 max-w-sm mb-4 leading-relaxed">
                  {t.dropVideoHere}
                </p>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  {isAr ? 'استعراض من جهازك (فيديو أو صورة)' : 'Browse Files (Video or Photo)'}
                </button>
              </div>

              {customMediaUrl && (
                <div className="mt-4 text-center">
                  <span className="text-xs text-emerald-400 flex items-center justify-center gap-1.5 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    {t.customVideoSelected}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
